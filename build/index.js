"use strict";var P=Object.create;var y=Object.defineProperty;var D=Object.getOwnPropertyDescriptor;var H=Object.getOwnPropertyNames;var Q=Object.getPrototypeOf,T=Object.prototype.hasOwnProperty;var U=(e,t)=>{for(var n in t)y(e,n,{get:t[n],enumerable:!0})},x=(e,t,n,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of H(t))!T.call(e,r)&&r!==n&&y(e,r,{get:()=>t[r],enumerable:!(o=D(t,r))||o.enumerable});return e};var I=(e,t,n)=>(n=e!=null?P(Q(e)):{},x(t||!e||!e.__esModule?y(n,"default",{value:e,enumerable:!0}):n,e)),Z=e=>x(y({},"__esModule",{value:!0}),e);var q={};U(q,{default:()=>C});module.exports=Z(q);var W=I(require("lottie-web"),1);var G=require("howler"),p=class extends G.Howl{constructor(t){super(t)}manualSeek(t){return super.seek(t)}manualPlay(){return super.play()}manualRate(t){return super.rate(t)}manualVolume(t){return super.volume(t)}playing(){return!1}setVolume(){}seek(){return super.seek()}rate(){return super.rate()}pause(){return this}play(){return-1}};var M=`/* prevent zoom */
svg.lottie-controller {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  overflow: visible;
}
svg.lottie-controller > g[clip-path] {
  clip-path: unset;
}
svg.lottie-controller * {
  touch-action: none;
  box-sizing: border-box;
  user-select: none;
  -webkit-user-select: none;
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiL2hvbWUvcnVubmVyL3dvcmsvdXNlbG90dGllL3VzZWxvdHRpZS9zcmMvdXNlbG90dGllIiwic291cmNlcyI6WyJpbmRleC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBRUE7RUFDRTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFOztBQUdGO0VBQ0U7RUFDQTtFQUNBO0VBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBwcmV2ZW50IHpvb20gKi9cblxuc3ZnLmxvdHRpZS1jb250cm9sbGVyIHtcbiAgLXdlYmtpdC10YXAtaGlnaGxpZ2h0LWNvbG9yOiByZ2JhKDAsIDAsIDAsIDApO1xuICAtd2Via2l0LXRhcC1oaWdobGlnaHQtY29sb3I6IHRyYW5zcGFyZW50O1xuICAtd2Via2l0LXRvdWNoLWNhbGxvdXQ6IG5vbmU7XG4gIG92ZXJmbG93OiB2aXNpYmxlO1xuXG4gID4gZ1tjbGlwLXBhdGhdIHtcbiAgICBjbGlwLXBhdGg6IHVuc2V0O1xuICB9XG5cbiAgKiB7XG4gICAgdG91Y2gtYWN0aW9uOiBub25lO1xuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtcbiAgfVxufVxuIl19 */`;var B=I(require("tinycolor2"),1);function F(){return/iPad|iPhone|iPod/.test(navigator.userAgent)}var O=()=>{};function A(e,t=document){return t.querySelector(e)}function k(e,t=document){return Array.from(t.querySelectorAll(e))}function b(e,t){return Math.random()*(t-e)+e}function d(e,t=1){return`${e/t*100}%`}function w(e){return e.charAt(0).toUpperCase()+e.slice(1)}function N(e){return typeof e=="number"?[e,e,e,e]:e.length===2?[e[0],e[1],e[0],e[1]]:e.length===3?[e[0],e[1],e[2],e[1]]:e.slice(0,4)}function X(...e){let{name:t,color:n="lightgray",as:o="log"}=this;if(!t)return console[o](...e);let r=(0,B.default)(n).getLuminance()>=.5?"black":"white";console[o](`%c${t}`,`color: ${r}; padding: 3px 5px; border-radius: 3px; background-color: ${n};`,...e)}function Y(e,t){return e.markers.find(n=>n.payload.name===t)||null}function E(e,t=null){let{totalFrames:n,currentFrame:o}=e,r=n-1;if(t===null)return[o>=r?0:o,r];if(typeof t=="number")return[t,r];if(typeof t!="string")return t;let a=!e.loop,s=[];return t.split(",").filter(Boolean).slice(0,2).forEach((m,h)=>{m=m.trim();let u=Y(e,m);u!==null&&s.push(j(u,a?h:0))}),s}function j(e,t=0){return e.time+(t>0?1:0)}function R(e,t,n=!0){let o;Array.isArray(t)?o=t.map(r=>E(e,r)):o=E(e,t),e.playSegments(o,n)}function J(e,t=0){let[n,o]=e;return n+(o-n)*t}function z(e,t,n=1,o=!0){if(Array.isArray(t)&&Array.isArray(t[0])){let a=Math.min(1,Math.max(0,n)),s=Math.round(a*(t.length-1));t=t[s]}let r=E(e,t);e.goToAndStop(J(r,n),o)}var K={0:"lightblue",1:"orange",2:"lightgray",3:"red"},$={3:"error",2:"log"},g=class e{animation=null;container=null;player;debug=!1;volumeVariation;rateVariation;constructor(t={}){let{debug:n=!1,injectCSS:o=!0,volumeVariation:r=0,rateVariation:a=0,filterSpread:s=.5,howlerOptions:m={},...h}=t;if(this.debug=n,this.volumeVariation=r,this.rateVariation=a,o){let i=document.querySelector("style[data-type=lottie-controller]");i||(i=document.createElement("style"),i.setAttribute("data-type","lottie-controller"),i.innerHTML=M,document.body.appendChild(i))}this.container=typeof t.container=="string"?(()=>{let i=A(t.container);if(!i)throw this.log("Element not found",3)(t.container),new Error("Element not found:"+t.container);return i})():t.container||document.body,this.player=W.default.loadAnimation({renderer:"svg",loop:!1,autoplay:!1,rendererSettings:{filterSize:e.buildFilterSize(s)},audioFactory(i){return new p({src:i,html5:!!F(),...m})},...h,container:this.container}),this.player.addEventListener("DOMLoaded",()=>{let i=e.getName(this.player);document.title=w(i),this.log("DOMLoaded",0)(this.player.path+this.player.fileName+".json");let l=this.getElem();l&&(l.dataset.filename=i,l.classList.add("lottie-controller"),l.addEventListener("contextmenu",c=>(c.preventDefault(),c.stopPropagation(),!1),!0))}),this.player.addEventListener("complete",()=>{this.log("complete",0)(this.animation)}),this.player.addEventListener("loopComplete",()=>{this.log("loopComplete",0)(this.animation)});let u=1/0;this.player.addEventListener("enterFrame",i=>{if(i.direction!==1||this.player.isPaused)return;let{audios:l}=this.player.audioController||{audios:[]},c=this.player.firstFrame+this.player.currentFrame;l.forEach(({audio:f,data:v})=>{let{st:L}=v;if(L<=c&&L>u){let S=this.rateVariation*.5;f.manualRate(b(1-S,1+S)),f.manualVolume(b(1-this.volumeVariation,1));let V={audios:l,audio:f,data:v,willPlay:!0};this.player.triggerEvent("audio",V),V.willPlay&&f.manualPlay()}}),u=c})}onComplete=t=>this.player.addEventListener("complete",t);onLoad=t=>this.player.addEventListener("DOMLoaded",t);onAudio=t=>this.player.addEventListener("audio",t);getElem=(t,n)=>(n||(n=this.player.renderer.svgElement),t?A(t,n||void 0):n);getElems=(t,n)=>(n||(n=this.player.renderer.svgElement),k(t,n||void 0));isPlaying=(...t)=>{let n=t.map(e.getAnimationKey);return this.animation!==null&&n.includes(this.animation)};currentAnimation=()=>this.animation;seek=(t,{position:n=0,isFrame:o=!0}={})=>(this.player.loop=!1,this.setAnimation(t),this.log("seek",1)(this.animation,n),z(this.player,t,n,o));getAnimation=()=>this.animation;setAnimation=(t=null)=>{this.animation=e.getAnimationKey(t);let n=this.getElem();if(n){if(this.animation===null){n.removeAttribute("data-animation");return}n.setAttribute("data-animation",this.animation)}};log=(t,n)=>{if(!this.debug)return O;let o=$[n||2],r=K[n||2];return(...a)=>X.call({name:t,color:r,as:o},...a)};play=(t,{isFrame:n=!0,loop:o=!1,smooth:r=!1}={})=>{let a=!r;if(this.player.loop=o,typeof t=="number"){this.setAnimation(),this.player.goToAndPlay(t,n);return}return this.setAnimation(t),this.log("play",1)(this.animation),R(this.player,t,a)};destroy=()=>{this.player.destroy()};static getName(t){let{fileName:n,path:o=""}=t;return!n||n==="data"?o.split("/").filter(Boolean).pop()||"untitled":n}static getAnimationKey(t=null){return t==null?null:typeof t=="string"?t:JSON.stringify(t)}static buildFilterSize(t){let[n,o,r,a]=N(t);return{x:d(-a),y:d(-n),width:d(1+o+a),height:d(1+r+n)}}};function C(e){return new g(e)}globalThis.useLottie=C;
//# sourceMappingURL=index.js.map
