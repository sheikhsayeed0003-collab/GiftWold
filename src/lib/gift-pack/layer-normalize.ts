import type {
  AudioLayerData,
  ImageLayerData,
  TextLayerData,
  VideoLayerData,
  GiftPackLayer,
} from "@/types/gift-pack";

export function normalizeTextData(d: TextLayerData): TextLayerData {
  return {
    ...d,
    bold: d.bold ?? false,
    italic: d.italic ?? false,
    opacity: d.opacity ?? 1,
    borderWidth: d.borderWidth ?? 0,
    borderColor: d.borderColor ?? "#ffffff",
    letterSpacing: d.letterSpacing ?? 0,
    lineHeight: d.lineHeight ?? 1.35,
  };
}

export function normalizeImageData(d: ImageLayerData): ImageLayerData {
  return {
    ...d,
    scale: d.scale ?? 1,
    flipX: d.flipX ?? false,
    flipY: d.flipY ?? false,
    opacity: d.opacity ?? 1,
    borderWidth: d.borderWidth ?? 0,
    borderColor: d.borderColor ?? "#ffffff",
    borderRadius: d.borderRadius ?? 12,
    shadow: d.shadow ?? true,
    objectFit: d.objectFit ?? "cover",
    transition: d.transition ?? "fade",
    crop: d.crop ?? { x: 0, y: 0, w: 1, h: 1 },
  };
}

export function normalizeVideoData(d: VideoLayerData): VideoLayerData {
  return {
    ...d,
    scale: d.scale ?? 1,
    rotation: d.rotation ?? 0,
    opacity: d.opacity ?? 1,
    playbackRate: d.playbackRate ?? 1,
    trimStartMs: d.trimStartMs ?? 0,
    trimEndMs: d.trimEndMs ?? 0,
    transition: d.transition ?? "fade",
  };
}

export function normalizeAudioData(d: AudioLayerData): AudioLayerData {
  return {
    ...d,
    playbackRate: d.playbackRate ?? 1,
    fadeInMs: d.fadeInMs ?? 300,
    fadeOutMs: d.fadeOutMs ?? 500,
    loop: d.loop ?? false,
    trigger: d.trigger ?? "on_open",
  };
}

export function normalizeLayer(layer: GiftPackLayer): GiftPackLayer {
  if (layer.type === "text") {
    return { ...layer, data: normalizeTextData(layer.data as TextLayerData) };
  }
  if (layer.type === "image") {
    return { ...layer, data: normalizeImageData(layer.data as ImageLayerData) };
  }
  if (layer.type === "video") {
    return { ...layer, data: normalizeVideoData(layer.data as VideoLayerData) };
  }
  if (layer.type === "audio") {
    return { ...layer, data: normalizeAudioData(layer.data as AudioLayerData) };
  }
  return layer;
}
