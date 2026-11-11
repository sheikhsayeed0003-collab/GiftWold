/** Gift Pack Editor schema v2 — stored inside Gift.config JSON */

export type GiftBoxTemplateId =
  | "classic"
  | "heart"
  | "romantic"
  | "birthday"
  | "funny"
  | "surprise"
  | "luxury"
  | "nested"
  | "animated";

export type OpeningAnimationId =
  | "click"
  | "touch"
  | "ribbon_pull"
  | "lid_open"
  | "slow_open"
  | "fast_open"
  | "shake"
  | "confetti"
  | "hearts"
  | "particles";

export type BackgroundKind = "solid" | "gradient" | "image" | "video";

export type LayerTransition = "none" | "fade" | "slide" | "zoom";

export type TextAnimationId =
  | "typewriter"
  | "fade_in"
  | "fade_out"
  | "zoom_in"
  | "zoom_out"
  | "bounce"
  | "shake"
  | "slide_up"
  | "slide_down"
  | "rotate"
  | "float"
  | "glitch"
  | "heart_text"
  | "text_3d";

export type LayerTrack =
  | "gift"
  | "text"
  | "image"
  | "video"
  | "audio"
  | "animation"
  | "background";

export type LayerType = "text" | "image" | "video" | "audio" | "sticker" | "effect";

export interface TextLayerData {
  content: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  align: "left" | "center" | "right";
  bgColor: string;
  shadow: boolean;
  outline: boolean;
  bold?: boolean;
  italic?: boolean;
  opacity?: number;
  borderWidth?: number;
  borderColor?: string;
  letterSpacing?: number;
  lineHeight?: number;
  rotation: number;
  animation: TextAnimationId;
  animDurationMs: number;
  animDelayMs: number;
  x: number;
  y: number;
}

export interface ImageLayerData {
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scale?: number;
  flipX?: boolean;
  flipY?: boolean;
  opacity?: number;
  borderWidth?: number;
  borderColor?: string;
  borderRadius?: number;
  shadow?: boolean;
  objectFit?: "cover" | "contain";
  transition?: LayerTransition;
  /** normalized crop rect inside source image */
  crop?: { x: number; y: number; w: number; h: number };
}

export interface VideoLayerData {
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  scale?: number;
  opacity?: number;
  muted: boolean;
  playbackRate?: number;
  trimStartMs?: number;
  trimEndMs?: number;
  transition?: LayerTransition;
}

export interface AudioLayerData {
  src: string;
  volume: number;
  startMs: number;
  endMs: number;
  fadeInMs: number;
  fadeOutMs: number;
  loop: boolean;
  playbackRate: number;
  trigger: "on_open" | "timeline" | "manual";
}

export type TvScreenStyle = "modern" | "crt" | "slim";

export type WishVisualTemplate = "night" | "tree" | "matrix" | "poem";

export type GiftExperienceMode = "pack3d" | "wish" | "both";

/** ভিডিও রেফারেন্সের মতো Wish / Tap-to-open অভিজ্ঞতা */
export interface WishExperienceConfig {
  enabled: boolean;
  template: WishVisualTemplate;
  tapHint: string;
  headline: string;
  greeting: string;
  message: string;
  signOff: string;
  counterLabel: string;
  /** ISO তারিখ — “Together for” কাউন্টার */
  counterStart?: string;
  musicSrc?: string;
  linkPassword?: string;
  showSoundToggle: boolean;
}

export interface GiftTvScreenConfig {
  enabled: boolean;
  width: number;
  height: number;
  /** কন্টেইনারে অবস্থান (%) */
  posXPercent: number;
  posYPercent: number;
  rotation: number;
  scale: number;
  frameColor: string;
  bezelColor: string;
  screenBg: string;
  borderWidth: number;
  borderColor: string;
  glow: boolean;
  glowColor: string;
  shadow: boolean;
  emergeDurationMs: number;
  /** বক্স খোলার আগে টিভিতে টিজার প্রিভিউ */
  showBeforeOpen: boolean;
  style: TvScreenStyle;
  /** CSS perspective depth */
  depth3d: number;
}

export interface GiftPackLayer {
  id: string;
  type: LayerType;
  track: LayerTrack;
  name: string;
  startMs: number;
  durationMs: number;
  visible: boolean;
  zIndex: number;
  data: TextLayerData | ImageLayerData | VideoLayerData | AudioLayerData;
}

export interface GiftPackNode {
  id: string;
  name: string;
  /** ক্রমিক নম্বর (Finish-এর পর ১..n) */
  sequenceNumber?: number;
  templateId: GiftBoxTemplateId;
  boxColor: string;
  ribbonColor: string;
  lidStyle: "flat" | "curved" | "bow";
  scale: number;
  rotationY: number;
  opening: OpeningAnimationId;
  openEffect: "none" | "confetti" | "hearts" | "both";
  childOrder: "sequential" | "parallel";
  layers: GiftPackLayer[];
  children: GiftPackNode[];
  /** বক্সের বাইরের ইন্টারঅ্যাক্টিভ টিভি ডিসপ্লে */
  tvScreen?: GiftTvScreenConfig;
  /** খোলার পর পপ-আপ গ্লো মেসেজ (খালি হলে টেক্সট লেয়ার) */
  revealMessage?: string;
  /** রিসিভার প্রতি ডিভাইসে সর্বোচ্চ খোলা; ০ = অসীম */
  maxOpenLimit?: number;
}

export interface GiftPackProject {
  schemaVersion: 2;
  id?: string;
  title: string;
  recipientName: string;
  /** প্রাপকের অ্যাকাউন্ট ইমেইল (প্রাইভেট গিফট খোলার জন্য) */
  recipientEmail?: string;
  senderName: string;
  backgroundColor: string;
  backgroundKind?: BackgroundKind;
  backgroundGradient?: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  backgroundOpacity?: number;
  backgroundBlur?: number;
  roots: GiftPackNode[];
  /** Finish চাপলে true — ক্রমিক নম্বর লক */
  sequenceReady?: boolean;
  globalAudio?: AudioLayerData;
  timelineDurationMs: number;
  /** pack3d = ৩ডি+টিভি; wish = ভিডিও-স্টাইল ট্যাপ টু ওপেন; both = প্রথম wish তারপর প্যাক */
  experienceMode?: GiftExperienceMode;
  wishExperience?: WishExperienceConfig;
  createdAt?: string;
}

export function isGiftPackProject(v: unknown): v is GiftPackProject {
  return (
    typeof v === "object" &&
    v !== null &&
    (v as GiftPackProject).schemaVersion === 2 &&
    Array.isArray((v as GiftPackProject).roots)
  );
}

export function countPackNodes(roots: GiftPackNode[]): number {
  let n = 0;
  const walk = (nodes: GiftPackNode[]) => {
    for (const node of nodes) {
      n++;
      walk(node.children);
    }
  };
  walk(roots);
  return n;
}
