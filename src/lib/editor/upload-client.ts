export async function uploadFile(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/uploads", { method: "POST", body: fd });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "আপলোড ব্যর্থ");
  return data.url as string;
}

export async function uploadFiles(files: File[]): Promise<string[]> {
  const out: string[] = [];
  for (const file of files) {
    out.push(await uploadFile(file));
  }
  return out;
}

export async function uploadBlob(blob: Blob, filename: string): Promise<string> {
  const file = new File([blob], filename, { type: blob.type || "application/octet-stream" });
  return uploadFile(file);
}
