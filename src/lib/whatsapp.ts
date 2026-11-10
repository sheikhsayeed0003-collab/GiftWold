export function whatsappOrderUrl(
  number: string,
  message: string
) {
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function buildPremiumOrderMessage(params: {
  packageName: string;
  packageNameBn?: string | null;
  priceUsd: number;
  featuresBn: string[];
  userName: string;
  userEmail?: string | null;
  userPhone?: string | null;
}) {
  const lines = [
    "আমি Gift World প্রিমিয়াম প্যাকেজ নিতে চাই।",
    "",
    `প্যাকেজের নাম: ${params.packageNameBn ?? params.packageName}`,
    `প্যাকেজের দাম: $${params.priceUsd}`,
    "প্যাকেজের সুবিধা:",
    ...params.featuresBn.map((f) => `• ${f}`),
    "",
    `আমার নাম: ${params.userName}`,
  ];
  if (params.userEmail) lines.push(`ইমেইল: ${params.userEmail}`);
  if (params.userPhone) lines.push(`ফোন: ${params.userPhone}`);
  lines.push("", "আমার প্রিমিয়াম অ্যাকাউন্ট চালু করে দিন।");
  return lines.join("\n");
}
