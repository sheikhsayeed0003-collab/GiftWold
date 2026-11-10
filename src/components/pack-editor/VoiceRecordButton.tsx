"use client";

import { useCallback, useRef, useState } from "react";
import { uploadBlob } from "@/lib/editor/upload-client";

export function VoiceRecordButton({ onRecorded }: { onRecorded: (url: string) => void }) {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    mediaRef.current?.stop();
    mediaRef.current = null;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setRecording(false);
  }, []);

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data.size) chunksRef.current.push(e.data);
      };
      rec.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" });
        const url = await uploadBlob(blob, `voice-${Date.now()}.webm`);
        onRecorded(url);
        setSeconds(0);
      };
      rec.start();
      mediaRef.current = rec;
      setRecording(true);
      setSeconds(0);
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch {
      alert("মাইক্রোফোন অনুমতি প্রয়োজন");
    }
  }, [onRecorded]);

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => (recording ? stop() : void start())}
        className={
          recording
            ? "rounded-lg bg-rose-600 px-2 py-1 text-[10px] text-white"
            : "rounded-lg bg-white/10 px-2 py-1 text-[10px] text-white"
        }
      >
        {recording ? `থামান (${seconds}s)` : "🎤 ভয়েস রেকর্ড"}
      </button>
    </div>
  );
}
