import {
  IconActivity,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconCopy,
  IconDotsVertical,
  IconExternalLink,
  IconLink,
  IconPlus,
  IconSearch,
  IconSortAscending,
  IconWorld,
} from "@tabler/icons-react";

import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { LinkSection } from "@/components/link-section";

const links = [
  {
    id: 1,
    icon: IconLink,
    original: "github.com/saifalikhan9/repo",
    url: "https://github.com/saifalikhan9/repo",
    shortUrl: "linklite.dev/abc123",
    created: "Today, 9:30 AM",
  },
  {
    id: 2,
    icon: IconWorld,
    original: "google.com/search?q=linklite",
    url: "https://google.com/search?q=linklite",
    shortUrl: "linklite.dev/xyz789",
    created: "Yesterday, 4:15 PM",
  },
  {
    id: 3,
    icon: IconWorld,
    original: "youtube.com/watch?v=abcdef",
    url: "https://youtube.com/watch?v=abcdef",
    shortUrl: "linklite.dev/yt456",
    created: "Aug 18, 2025",
  },
];

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-neutral-300 bg-background">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white shadow-sm">
              <IconLink size={24} stroke={2} />
            </div>

            <span className="text-2xl font-semibold tracking-tight">
              LinkLite
            </span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-5">
            {/* Search */}
            <div className="w-72">
              <Input
                className="min-w-0"
                startAdornment={
                  <IconSearch size={20} className="ml-1 text-neutral-500" />
                }
                placeholder="Search..."
              />
            </div>

            {/* User */}
            <button
              type="button"
              className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-neutral-300/50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-800 text-white">
                <span className="text-sm font-medium">S</span>
              </div>

              <span className="text-sm font-medium">Saif Ali</span>

              <IconChevronDown size={18} className="text-neutral-500" />
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Welcome section */}
        <section className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">
              Good morning 👋
            </h1>

            <p className="mt-2 text-base text-neutral-600">
              Manage and organize your shortened links.
            </p>
          </div>

          <Button className="w-auto gap-2 px-5 py-3" variant="primary">
            <IconPlus size={20} />
            Shorten URL
          </Button>
        </section>

        {/* Statistics */}
        <section className="mb-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          <StatCard
            icon={<IconLink size={25} />}
            title="Total URLs"
            value="24"
            description="All time"
            iconClassName="bg-blue-100 text-blue-600"
          />

          <StatCard
            icon={<IconActivity size={25} />}
            title="This week"
            value="8"
            description="+2 from last week"
            iconClassName="bg-green-100 text-green-600"
            descriptionClassName="text-green-600"
          />

          <StatCard
            icon={<IconActivity size={25} />}
            title="Active"
            value="24"
            description="100% of your links"
            iconClassName="bg-purple-100 text-purple-600"
          />
        </section>

        {/* Links section */}
        <LinkSection />
      </main>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Stat Card                                                                  */
/* -------------------------------------------------------------------------- */

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
  iconClassName?: string;
  descriptionClassName?: string;
}

function StatCard({
  icon,
  title,
  value,
  description,
  iconClassName,
  descriptionClassName,
}: StatCardProps) {
  return (
    <div className="flex items-center gap-5 rounded-xl border border-neutral-300 bg-background p-6 shadow-sm">
      <div
        className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full ${iconClassName}`}
      >
        {icon}
      </div>

      <div>
        <p className="text-base text-neutral-600">{title}</p>

        <p className="mt-1 text-3xl font-semibold tracking-tight">{value}</p>

        <p
          className={`mt-1 text-sm ${
            descriptionClassName ?? "text-neutral-500"
          }`}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
