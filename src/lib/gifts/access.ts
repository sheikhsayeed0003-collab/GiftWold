import { UserRole } from "@prisma/client";

export type GiftViewerRole = "recipient" | "sender" | "admin" | "public" | "denied";

export type GiftAccess = {
  canView: boolean;
  canOpen: boolean;
  role: GiftViewerRole;
  messageBn?: string;
};

export type GiftAccessRow = {
  userId: string | null;
  published: boolean;
  isPublic: boolean;
  recipientEmail: string | null;
};

export type GiftViewer = {
  id: string;
  email: string | null;
  role: UserRole;
};

function normEmail(v: string | null | undefined): string {
  return (v ?? "").trim().toLowerCase();
}

export function resolveGiftAccess(row: GiftAccessRow, viewer: GiftViewer | null): GiftAccess {
  const recipient = normEmail(row.recipientEmail);
  const hasRecipientGate = recipient.length > 0;

  if (viewer && (viewer.role === UserRole.OWNER || viewer.role === UserRole.ADMIN)) {
    return { canView: true, canOpen: true, role: "admin" };
  }

  if (!row.published) {
    if (viewer && row.userId && viewer.id === row.userId) {
      return {
        canView: true,
        canOpen: false,
        role: "sender",
        messageBn: "ড্রাফট — শুধু আপনি দেখতে পারছেন",
      };
    }
    return {
      canView: false,
      canOpen: false,
      role: "denied",
      messageBn: "এই গিফট এখনো পাবলিশ হয়নি",
    };
  }

  if (viewer && row.userId && viewer.id === row.userId) {
    return {
      canView: true,
      canOpen: false,
      role: "sender",
      messageBn: "আপনি পাঠক — প্রাপকই বক্স খুলতে পারবে",
    };
  }

  if (viewer && hasRecipientGate && normEmail(viewer.email) === recipient) {
    return { canView: true, canOpen: true, role: "recipient" };
  }

  if (!hasRecipientGate) {
    return {
      canView: true,
      canOpen: true,
      role: viewer ? "public" : "public",
    };
  }

  if (!viewer) {
    return {
      canView: false,
      canOpen: false,
      role: "denied",
      messageBn: "প্রাপকের অ্যাকাউন্টে লগইন করে গিফট খুলুন",
    };
  }

  return {
    canView: false,
    canOpen: false,
    role: "denied",
    messageBn: "আপনি এই গিফটের প্রাপক নন — দেখা যাবে না",
  };
}

