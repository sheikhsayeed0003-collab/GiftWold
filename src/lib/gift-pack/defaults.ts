import { nanoid } from "nanoid";
import type {
  AudioLayerData,
  GiftPackLayer,
  GiftPackNode,
  GiftPackProject,
  TextLayerData,
} from "@/types/gift-pack";
import { BOX_LIBRARY } from "./box-library";
import { defaultTvScreen } from "./tv-screen";

export function defaultTextLayer(): GiftPackLayer {
  const data: TextLayerData = {
    content: "তোমার বার্তা এখানে…",
    fontFamily: "noto-bengali",
    fontSize: 28,
    color: "#ffffff",
    align: "center",
    bgColor: "rgba(0,0,0,0.35)",
    shadow: true,
    outline: false,
    rotation: 0,
    animation: "fade_in",
    animDurationMs: 1200,
    animDelayMs: 0,
    x: 0,
    y: 0,
  };
  return {
    id: nanoid(8),
    type: "text",
    track: "text",
    name: "টেক্সট",
    startMs: 0,
    durationMs: 4000,
    visible: true,
    zIndex: 10,
    data,
  };
}

export function createPackNode(templateId: GiftPackNode["templateId"], index: number): GiftPackNode {
  const lib = BOX_LIBRARY.find((b) => b.id === templateId) ?? BOX_LIBRARY[0];
  return {
    id: nanoid(8),
    name: `গিফট ${index + 1}`,
    sequenceNumber: index + 1,
    templateId: lib.id,
    boxColor: lib.defaultBoxColor,
    ribbonColor: lib.defaultRibbonColor,
    lidStyle: "bow",
    scale: 1,
    rotationY: 0,
    opening: lib.defaultOpening,
    openEffect: "confetti",
    childOrder: "sequential",
    layers: [defaultTextLayer()],
    children: [],
    tvScreen: defaultTvScreen(),
  };
}

export function defaultPackProject(): GiftPackProject {
  return {
    schemaVersion: 2,
    title: "তোমার গিফট প্যাক",
    recipientName: "",
    senderName: "",
    backgroundColor: "#0f172a",
    backgroundKind: "solid",
    backgroundOpacity: 1,
    backgroundBlur: 0,
    roots: [createPackNode("classic", 0)],
    sequenceReady: true,
    timelineDurationMs: 12000,
  };
}

export const STOCK_AUDIO: { id: string; nameBn: string; src: string }[] = [
  { id: "romantic", nameBn: "রোমান্টিক", src: "" },
  { id: "birthday", nameBn: "জন্মদিন", src: "" },
  { id: "funny", nameBn: "ফানি", src: "" },
  { id: "celebration", nameBn: "উদযাপন", src: "" },
];

export function defaultGlobalAudio(): AudioLayerData {
  return {
    src: "",
    volume: 0.8,
    startMs: 0,
    endMs: 60000,
    fadeInMs: 400,
    fadeOutMs: 800,
    loop: true,
    playbackRate: 1,
    trigger: "manual",
  };
}
