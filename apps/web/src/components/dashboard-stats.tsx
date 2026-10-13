import React from "react";
import {
  IconLink,
  IconMouse,
  IconFlame,
  IconActivity,
} from "@tabler/icons-react";
import { LinkItem } from "@/types/link";

interface DashboardStatsProps {
  links: LinkItem[];
  isLoading?: boolean;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  links,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 rounded-2xl bg-white border border-neutral-200/80 p-5 animate-pulse flex flex-col justify-between"
          >
            <div className="h-4 w-24 bg-neutral-200 rounded" />
            <div className="h-8 w-20 bg-neutral-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const totalLinks = links.length;
  const totalClicks = links.reduce((acc, curr) => acc + (curr.clicks || 0), 0);

  // Most active link
  const sortedByClicks = [...links].sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
  const topLink = sortedByClicks[0];
  const mostActiveText =
    topLink && topLink.clicks > 0
      ? `short.en/${topLink.shortCode}`
      : "No clicks yet";
  const mostActiveSub =
    topLink && topLink.clicks > 0
      ? `${topLink.clicks.toLocaleString()} clicks`
      : "Share links to track";

  // Active vs Expired ratio
  const activeCount = links.filter((l) => l.status === "active").length;
  const expiredCount = links.filter((l) => l.status === "expired").length;
  const activeRatio =
    totalLinks > 0
      ? `${Math.round((activeCount / totalLinks) * 100)}% Active`
      : "100% Active";

  const cards = [
    {
      title: "Total Links Created",
      value: totalLinks.toLocaleString(),
      subtext: "All-time shortened links",
      icon: IconLink,
      iconColor: "bg-orange-50 text-orange-600",
    },
    {
      title: "Total Clicks Accumulated",
      value: totalClicks.toLocaleString(),
      subtext: "Across all active redirects",
      icon: IconMouse,
      iconColor: "bg-amber-50 text-amber-600",
    },
    {
      title: "Most Active Link",
      value: mostActiveText,
      subtext: mostActiveSub,
      icon: IconFlame,
      iconColor: "bg-rose-50 text-rose-600",
      isMono: topLink && topLink.clicks > 0,
    },
    {
      title: "Active vs Expired",
      value: `${activeCount} / ${expiredCount}`,
      subtext: activeRatio,
      icon: IconActivity,
      iconColor: "bg-emerald-50 text-emerald-600",
    },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="flex flex-col justify-between rounded-2xl bg-white p-5 border border-neutral-200/90 shadow-2xs hover:shadow-xs transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-neutral-500">
                {card.title}
              </span>
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.iconColor}`}
              >
                <Icon size={17} stroke={2} />
              </div>
            </div>

            <div>
              <p
                className={`text-2xl font-extrabold tracking-tight text-neutral-950 ${
                  card.isMono ? "font-mono text-lg sm:text-xl truncate" : "font-sans"
                }`}
                title={card.value}
              >
                {card.value}
              </p>
              <p className="text-xs text-neutral-400 mt-0.5 truncate">
                {card.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
};
