export type LinkItem = {
  id: string;
  originalUrl: string;
  shortCode: string;
  title: string;
  clicks: number;
  status: "active" | "expired";
  createdAt: string;
  expiresAt?: string | null;
  hasPassword?: boolean;
};
