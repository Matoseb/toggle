import {
  AnimationItem,
  AnimationSegment,
  AnimationEventName,
  BMEnterFrameEvent,
  BMCompleteLoopEvent,
  BMCompleteEvent,
  BMSegmentStartEvent,
  BMDestroyEvent,
} from "lottie-web";

import LottieAudio from "./LottieAudio";

type Marker = {
  payload: {
    name: string;
  };
  time: number;
};

export type AnimationValue =
  | string
  | number
  | AnimationSegment
  | AnimationSegment[]
  | null;

type AudioControl = {
  audio: LottieAudio;
  data: any;
};

export type BMAudioEvent = {
  audios: AudioControl[];
  audio: LottieAudio;
  data: any;
  prevent: boolean;
};

type CompleteAnimationEventName = "audio" | AnimationEventName;

export type CompleteAnimationItem = AnimationItem & {
  markers: Marker[];
  fileName: string;
  path: string;
  adjustSegment: (segment: AnimationSegment, offset: number) => void;
  audioController?: {
    audios: AudioControl[];
  };
  addEventListener: (
    name: CompleteAnimationEventName,
    callback: (event: any) => void
  ) => () => void;
  removeEventListener: (
    name: CompleteAnimationEventName,
    callback: (event: any) => void
  ) => void;
  triggerEvent: (
    name: CompleteAnimationEventName,
    event:
      | BMAudioEvent
      | BMEnterFrameEvent
      | BMCompleteLoopEvent
      | BMCompleteEvent
      | BMSegmentStartEvent
      | BMDestroyEvent
      | undefined
  ) => void;
};

// lottie
export function getMarker(player: CompleteAnimationItem, name: string) {
  return (
    player.markers.find((marker: Marker) => marker.payload.name === name) ||
    null
  );
}

export function convertSegment(
  player: CompleteAnimationItem,
  animation: AnimationValue = null
): AnimationSegment {
  const { totalFrames, currentFrame } = player;
  const lastFrame = totalFrames - 1;

  if (animation === null) {
    const firstFrame = currentFrame >= lastFrame ? 0 : currentFrame;
    return [firstFrame, lastFrame];
  } else if (typeof animation === "number") {
    return [animation, lastFrame];
  } else if (typeof animation !== "string") {
    return animation as AnimationSegment;
  }

  let addFrame = player.loop ? false : true;

  const frames: number[] = [];

  animation
    .split(",")
    .filter(Boolean)
    .slice(0, 2)
    .forEach((name, index) => {
      name = name.trim();
      const marker = getMarker(player, name);
      if (marker === null) return;
      frames.push(markerToFrame(marker, addFrame ? index : 0));
    });

  return frames as AnimationSegment;
}

export function markerToFrame(marker: Marker, index = 0) {
  return marker.time + (index > 0 ? 1 : 0);
}

export function playAnimation(
  player: CompleteAnimationItem,
  animation?: AnimationValue | AnimationValue[],
  force = true
) {
  let segments;
  if (Array.isArray(animation)) {
    segments = animation.map((segment) => {
      return convertSegment(player, segment);
    });
  } else {
    segments = convertSegment(player, animation);
  }
  player.playSegments(segments, force);
}

function lerpRange(arr: number[], range = 0) {
  const [start, end] = arr;
  return start + (end - start) * range;
}

export function seekAnimation(
  player: CompleteAnimationItem,
  animation?: AnimationValue | AnimationValue[],
  position = 1,
  isFrame = true
) {
  if (Array.isArray(animation) && Array.isArray(animation[0])) {
    // clamp
    const pos = Math.min(1, Math.max(0, position));
    const index = Math.round(pos * (animation.length - 1));
    animation = animation[index];
  } else if (animation === null) {
    animation = 0;
  }

  const segments = convertSegment(player, animation as AnimationValue);

  player.goToAndStop(lerpRange(segments, position), isFrame);
}
