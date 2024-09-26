import lottie, { AnimationConfigWithPath, SVGRendererConfig } from "lottie-web";
import LottieAudio, { LottieAudioOptions } from "./LottieAudio";
import styleContent from "./index.scss?inline";

import {
  getElem,
  getElems,
  firstCap,
  random,
  isIOS,
  toPercent,
  fancyLog,
  convertShortHand,
  noFunc,
  ConsoleType,
} from "./utils";

import {
  playAnimation,
  seekAnimation,
  BMAudioEvent,
  AnimationValue,
  CompleteAnimationItem,
} from "./lottie-utils";

export type LottieControllerConfig = Omit<
  AnimationConfigWithPath,
  "container"
> & {
  debug?: boolean;
  injectCSS?: boolean;
  volumeVariation?: number;
  rateVariation?: number;
  howlerOptions?: LottieAudioOptions;
  container?: string | Element;
  filterSpread?: number | number[];
};

type Callback = (event: any) => void;
type AnimationKey = string | null;

enum MESSAGE {
  event, // log
  action, // log
  default, // log
  error, // error
}

const COLORS: Record<MESSAGE, string> = {
  [MESSAGE.event]: "lightblue",
  [MESSAGE.action]: "orange",
  [MESSAGE.default]: "lightgray",
  [MESSAGE.error]: "red",
};

const LOGTYPES: PartialRecord<MESSAGE, ConsoleType> = {
  [MESSAGE.error]: "error",
  [MESSAGE.default]: "log",
};
// logtype based on COLORS:

export default class LottieController {
  animation: AnimationKey = null;
  container: Element | null = null;
  player: CompleteAnimationItem;
  debug: boolean = false;
  volumeVariation: number;
  rateVariation: number;

  constructor(options: LottieControllerConfig = {}) {
    const {
      debug = false,
      injectCSS = true,
      volumeVariation = 0,
      rateVariation = 0,
      filterSpread = 0.5,
      howlerOptions = {},
      ...lottieOptions
    } = options;

    this.debug = debug;
    this.volumeVariation = volumeVariation;
    this.rateVariation = rateVariation;

    if (injectCSS) {
      let style = document.querySelector("style[data-type=lottie-controller]");
      if (!style) {
        style = document.createElement("style");
        style.setAttribute("data-type", "lottie-controller");
        style.innerHTML = styleContent;
        document.body.appendChild(style);
      }
    }

    this.container =
      typeof options.container === "string"
        ? (() => {
            const elem = getElem(options.container);
            if (!elem) {
              this.log(
                `Element not found`,
                MESSAGE.error
              )(options.container);
              throw new Error('Element not found:' + options.container);
            }
            return elem;
          })()
        : options.container || document.body;

    this.player = lottie.loadAnimation({
      renderer: "svg", // Render method ('svg', 'canvas', or 'html')
      loop: false, // Set looping to true
      autoplay: false, // Set to true for autoplaying the animation
      rendererSettings: {
        // viewBoxSize: 1,
        filterSize: LottieController.buildFilterSize(filterSpread),
      },
      audioFactory(assetPath) {
        const audio = new LottieAudio({
          src: assetPath,
          html5: isIOS() ? true : false,
          // preload: true,
          ...howlerOptions,
        });
        return audio;
      },
      ...lottieOptions,

      container: this.container,
    }) as unknown as CompleteAnimationItem;

    this.player.addEventListener("DOMLoaded", () => {
      const fileName = LottieController.getName(this.player);
      document.title = firstCap(fileName);

      this.log(
        "DOMLoaded",
        MESSAGE.event
      )(this.player.path + this.player.fileName + ".json");

      const container = this.getElem() as HTMLElement;
      if (!container) return;

      // Disable right click
      container.dataset.filename = fileName;
      container.classList.add("lottie-controller");
      container.addEventListener(
        "contextmenu",
        (event) => {
          event.preventDefault();
          event.stopPropagation();
          return false;
        },
        true
      );
    });

    this.player.addEventListener("complete", () => {
      this.log("complete", MESSAGE.event)(this.animation);
    });

    this.player.addEventListener("loopComplete", () => {
      this.log("loopComplete", MESSAGE.event)(this.animation);
    });

    let oldFrame = Infinity;

    this.player.addEventListener("enterFrame", (event) => {
      if (event.direction !== 1) return;
      if (this.player.isPaused) return;

      const { audios } = this.player.audioController || { audios: [] };
      const frame = this.player.firstFrame + this.player.currentFrame;

      audios.forEach(({ audio, data }) => {
        const { st } = data;

        if (st <= frame && st > oldFrame) {
          const rate = this.rateVariation * 0.5;
          audio.manualRate(random(1 - rate, 1 + rate));
          audio.manualVolume(random(1 - this.volumeVariation, 1));
          const event = { audios, audio, data, willPlay: true } as BMAudioEvent;
          this.player.triggerEvent("audio", event);
          if (event.willPlay) audio.manualPlay();
        }
      });

      oldFrame = frame;
    });
  }

  onComplete = (callback: Callback) => {
    return this.player.addEventListener("complete", callback);
  };
  onLoad = (callback: Callback) => {
    return this.player.addEventListener("DOMLoaded", callback);
  };
  onAudio = (callback: Callback) => {
    return this.player.addEventListener("audio", callback);
  };
  getElem = (selector?: string | null, parent?: Element | null) => {
    parent ||= this.player.renderer.svgElement;
    // parent ||= this.container;
    if (!selector) return parent;
    return getElem(selector, parent || undefined);
  };
  getElems = (selector: string, parent?: Element | null) => {
    parent ||= this.player.renderer.svgElement;
    return getElems(selector, parent || undefined);
  };
  isPlaying = (...possibleAnimations: AnimationValue[]) => {
    const keys = possibleAnimations.map(LottieController.getAnimationKey);
    return this.animation !== null && keys.includes(this.animation);
  };
  currentAnimation = () => {
    return this.animation;
  };
  seek = (animation: AnimationValue, { position = 0, isFrame = true } = {}) => {
    this.player.loop = false;

    this.setAnimation(animation);
    this.log("seek", MESSAGE.action)(this.animation, position);

    return seekAnimation(this.player, animation, position, isFrame);
  };
  getAnimation = () => {
    return this.animation;
  };

  setAnimation = (anim: AnimationValue = null) => {
    this.animation = LottieController.getAnimationKey(anim);

    const container = this.getElem() as HTMLElement;
    if (!container) return;

    if (this.animation === null) {
      container.removeAttribute("data-animation");
      return;
    }
    container.setAttribute("data-animation", this.animation);
  };

  log = (name?: string, messageType?: MESSAGE) => {
    if (!this.debug) return noFunc;

    const as = LOGTYPES[messageType || MESSAGE.default];
    const color = COLORS[messageType || MESSAGE.default];
    return (...value: any[]) => fancyLog.call({ name, color, as }, ...value);
  };

  play = (
    anim?: AnimationValue,
    { isFrame = true, loop = false, smooth = false } = {}
  ) => {
    const force = !smooth;

    this.player.loop = loop;

    if (typeof anim === "number") {
      this.setAnimation();
      this.player.goToAndPlay(anim, isFrame);
      return;
    }

    this.setAnimation(anim);

    this.log("play", MESSAGE.action)(this.animation);

    return playAnimation(this.player, anim, force);
  };

  destroy = () => {
    this.player.destroy();
  };

  static getName(player: CompleteAnimationItem) {
    let { fileName, path = "" } = player;
    // console.log(path, fileName);
    if (!fileName || fileName === "data") {
      return path.split("/").filter(Boolean).pop() || "untitled";
    }

    return fileName;
  }

  static getAnimationKey(anim: AnimationValue = null): AnimationKey {
    if (anim === null || anim === undefined) return null;
    return typeof anim === "string" ? anim : JSON.stringify(anim);
  }

  static buildFilterSize(spread: number | number[]) {
    const [top, right, bottom, left] = convertShortHand(spread);

    return {
      x: toPercent(-left),
      y: toPercent(-top),
      width: toPercent(1 + right + left),
      height: toPercent(1 + bottom + top),
    } as SVGRendererConfig["filterSize"];
  }
}
