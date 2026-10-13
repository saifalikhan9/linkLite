"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  IconSearch,
  IconCopy,
  IconCheck,
  IconQrcode,
  IconChartBar,
  IconEdit,
  IconTrash,
  IconExternalLink,
  IconPlus,
  IconClock,
  IconLinkOff,
  IconSortAscending,
  IconFilter,
  IconX,
} from "@tabler/icons-react";
import { LinkItem } from "@/types/link";
import { useToast } from "@repo/ui/index";

interface LinksTableProps {
  links: LinkItem[];
  isLoading?: boolean;
  onOpenCreate: () => void;
  onEdit: (link: LinkItem) => void;
  onDelete: (link: LinkItem) => void;
  onShowQr: (link: LinkItem) => void;
}

export const LinksTable: React.FC<LinksTableProps> = ({
  links,
  isLoading = false,
  onOpenCreate,
  onEdit,
  onDelete,
  onShowQr,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "expired">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "clicks-desc" | "clicks-asc">("newest");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toast = useToast();

  const handleCopy = async (link: LinkItem) => {
    try {
      const fullUrl = `https://short.en/${link.shortCode}`;
      await navigator.clipboard.writeText(fullUrl);
      setCopiedId(link.id);
      toast.success("Short link copied to clipboard!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  // Filtered and sorted links
  const filteredLinks = useMemo(() => {
    return links
      .filter((link) => {
        // Status filter
        if (statusFilter !== "all" && link.status !== statusFilter) {
          return false;
        }

        // Search query filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          const matchTitle = (link.title || "").toLowerCase().includes(query);
          const matchCode = (link.shortCode || "").toLowerCase().includes(query);
          const matchUrl = (link.originalUrl || "").toLowerCase().includes(query);
          return matchTitle || matchCode || matchUrl;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === "oldest") {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === "clicks-desc") {
          return (b.clicks || 0) - (a.clicks || 0);
        }
        if (sortBy === "clicks-asc") {
          return (a.clicks || 0) - (b.clicks || 0);
        }
        return 0;
      });
  }, [links, searchQuery, statusFilter, sortBy]);

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Recent";
    }
  };

  return (
    <section className="rounded-2xl bg-white border border-neutral-200/90 shadow-2xs overflow-hidden">
      {/* Table Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 sm:p-5 border-b border-neutral-200/80 bg-neutral-50/40">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <IconSearch
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by title, alias, or URL..."
            className="w-full h-10 pl-10 pr-9 rounded-xl border border-neutral-200 bg-white text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 rounded-md"
            >
              <IconX size={14} />
            </button>
          )}
        </div>

        {/* Filter / Sort Controls */}
        <div className="flex items-center gap-2.5">
          {/* Status Tabs */}
          <div className="inline-flex rounded-xl p-1 bg-neutral-200/70 border border-neutral-200 text-xs font-semibold">
            {(["all", "active", "expired"] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded-lg capitalize transition-all ${
                  statusFilter === status
                    ? "bg-white text-neutral-900 shadow-2xs"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-9 px-3 pr-8 rounded-xl border border-neutral-200 bg-white text-xs font-semibold text-neutral-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 appearance-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="clicks-desc">Most Clicked</option>
              <option value="clicks-asc">Least Clicked</option>
            </select>
            <IconSortAscending
              size={15}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Loading Skeleton State */}
      {isLoading ? (
        <div className="p-6 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-16 rounded-xl bg-neutral-100 animate-pulse"
            />
          ))}
        </div>
      ) : links.length === 0 ? (
        /* Empty State: Zero links created */
        <div className="p-12 sm:p-16 text-center flex flex-col items-center">
          <div className="h-16 w-16 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-4 border border-orange-200/60 shadow-xs">
            <IconLinkOff size={32} stroke={1.8} />
          </div>
          <h3 className="text-lg font-bold text-neutral-900 tracking-tight">
            No shortened links yet
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500 max-w-sm leading-relaxed">
            Create your very first clean link to start branding, sharing, and
            collecting real-time click metrics.
          </p>
          <button
            type="button"
            onClick={onOpenCreate}
            className="mt-6 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs sm:text-sm shadow-xs hover:shadow transition-all inline-flex items-center gap-1.5 cursor-pointer"
          >
            <IconPlus size={16} stroke={2.5} />
            <span>Create Your First Link</span>
          </button>
        </div>
      ) : filteredLinks.length === 0 ? (
        /* Filtered Empty State: Zero search/filter matches */
        <div className="p-12 text-center flex flex-col items-center">
          <div className="h-12 w-12 rounded-xl bg-neutral-100 text-neutral-500 flex items-center justify-center mb-3">
            <IconSearch size={22} />
          </div>
          <h3 className="text-base font-bold text-neutral-900">
            No links match your search
          </h3>
          <p className="mt-1 text-xs text-neutral-500 max-w-xs">
            Try adjusting your search keywords or clearing your status filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("all");
            }}
            className="mt-4 px-4 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 text-[11px] font-bold text-neutral-500 uppercase tracking-wider bg-neutral-50/50">
                  <th className="py-3.5 px-6">Link Details</th>
                  <th className="py-3.5 px-4">Original Destination</th>
                  <th className="py-3.5 px-4">Clicks</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Created</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200/70 text-xs">
                {filteredLinks.map((link) => {
                  const isCopied = copiedId === link.id;
                  const isActive = link.status === "active";

                  return (
                    <tr
                      key={link.id}
                      className="hover:bg-neutral-50/70 transition-colors group"
                    >
                      {/* Link Details: Title & Short URL */}
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-semibold text-neutral-900 text-sm tracking-tight truncate max-w-[220px]">
                            {link.title || link.shortCode}
                          </span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="font-mono text-xs font-bold text-orange-600">
                              short.en/{link.shortCode}
                            </span>
                            <a
                              href={link.originalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-neutral-400 hover:text-neutral-700 transition-colors"
                              title="Visit destination"
                            >
                              <IconExternalLink size={13} />
                            </a>
                          </div>
                        </div>
                      </td>

                      {/* Original URL (Truncated) */}
                      <td className="py-4 px-4 max-w-[240px]">
                        <span
                          className="text-neutral-500 font-mono text-[11px] truncate block"
                          title={link.originalUrl}
                        >
                          {link.originalUrl}
                        </span>
                      </td>

                      {/* Total Click Metric Badge */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-50 text-orange-800 text-xs font-bold font-mono">
                          <IconChartBar size={13} />
                          <span>{(link.clicks || 0).toLocaleString()}</span>
                        </span>
                      </td>

                      {/* Status Indicator Badge */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            isActive
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                              : "bg-neutral-100 text-neutral-600 border border-neutral-200"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isActive ? "bg-emerald-500 animate-pulse" : "bg-neutral-400"
                            }`}
                          />
                          <span className="capitalize">{link.status}</span>
                        </span>
                      </td>

                      {/* Creation Date */}
                      <td className="py-4 px-4 text-neutral-500 text-xs">
                        {formatDate(link.createdAt)}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-1">
                          {/* Quick Copy Button */}
                          <button
                            type="button"
                            onClick={() => handleCopy(link)}
                            className={`p-1.5 rounded-lg border transition-all ${
                              isCopied
                                ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                                : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 border-transparent hover:border-neutral-200"
                            }`}
                            title="Copy short link"
                          >
                            {isCopied ? (
                              <IconCheck size={16} stroke={2.5} />
                            ) : (
                              <IconCopy size={16} />
                            )}
                          </button>

                          {/* QR Code Button */}
                          <button
                            type="button"
                            onClick={() => onShowQr(link)}
                            className="p-1.5 rounded-lg text-neutral-600 hover:text-orange-600 hover:bg-orange-50 border border-transparent hover:border-orange-200 transition-colors"
                            title="Show QR Code"
                          >
                            <IconQrcode size={16} />
                          </button>

                          {/* View Analytics Button */}
                          <Link
                            href={`/analytics/${link.id}`}
                            className="p-1.5 rounded-lg text-neutral-600 hover:text-orange-600 hover:bg-orange-50 border border-transparent hover:border-orange-200 transition-colors"
                            title="View Click Analytics"
                          >
                            <IconChartBar size={16} />
                          </Link>

                          {/* Edit Link Button */}
                          <button
                            type="button"
                            onClick={() => onEdit(link)}
                            className="p-1.5 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 border border-transparent hover:border-neutral-200 transition-colors"
                            title="Edit Link"
                          >
                            <IconEdit size={16} />
                          </button>

                          {/* Delete Link Button */}
                          <button
                            type="button"
                            onClick={() => onDelete(link)}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
                            title="Delete Link"
                          >
                            <IconTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards List View */}
          <div className="md:hidden divide-y divide-neutral-200">
            {filteredLinks.map((link) => {
              const isCopied = copiedId === link.id;
              const isActive = link.status === "active";

              return (
                <div key={link.id} className="p-4 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-neutral-900 text-sm">
                        {link.title || link.shortCode}
                      </h4>
                      <p className="font-mono text-xs font-bold text-orange-600 mt-0.5">
                        short.en/{link.shortCode}
                      </p>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        isActive
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isActive ? "bg-emerald-500" : "bg-neutral-400"
                        }`}
                      />
                      <span className="capitalize">{link.status}</span>
                    </span>
                  </div>

                  <p className="text-xs text-neutral-500 font-mono truncate">
                    {link.originalUrl}
                  </p>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="inline-flex items-center gap-1 font-mono font-semibold text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded-md">
                      <IconChartBar size={13} />
                      <span>{link.clicks} clicks</span>
                    </span>
                    <span className="text-neutral-400 text-[11px]">
                      {formatDate(link.createdAt)}
                    </span>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-end gap-1 pt-2 border-t border-neutral-100">
                    <button
                      type="button"
                      onClick={() => handleCopy(link)}
                      className="px-2.5 py-1.5 rounded-lg border border-neutral-200 text-xs font-semibold text-neutral-700 flex items-center gap-1"
                    >
                      {isCopied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                      <span>{isCopied ? "Copied" : "Copy"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onShowQr(link)}
                      className="p-1.5 rounded-lg border border-neutral-200 text-neutral-700"
                      title="Show QR"
                    >
                      <IconQrcode size={15} />
                    </button>

                    <Link
                      href={`/analytics/${link.id}`}
                      className="p-1.5 rounded-lg border border-neutral-200 text-neutral-700"
                      title="Analytics"
                    >
                      <IconChartBar size={15} />
                    </Link>

                    <button
                      type="button"
                      onClick={() => onEdit(link)}
                      className="p-1.5 rounded-lg border border-neutral-200 text-neutral-700"
                      title="Edit"
                    >
                      <IconEdit size={15} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(link)}
                      className="p-1.5 rounded-lg text-rose-600 border border-rose-200"
                      title="Delete"
                    >
                      <IconTrash size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
};
