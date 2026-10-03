"use client";

import { useFetch } from "@/hooks/useFetch";
import { getUrls } from "@/services/url.service";

import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";

import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconCopy,
  IconDotsVertical,
  IconLink,
  IconSearch,
  IconSortAscending,
} from "@tabler/icons-react";

type Url = {
  id: string;
  originalUrl: string;
  shortCode: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

type GetUrlsResponse = {
  success: boolean;
  data: Url[];
};

export const LinkSection = () => {
  const { data, loading, error } =
    useFetch<GetUrlsResponse>(getUrls);

  if (loading) {
    return (
      <section className="rounded-xl border border-neutral-300 bg-background p-7 shadow-sm">
        Loading links...
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-xl border border-neutral-300 bg-background p-7 shadow-sm">
        Failed to load links.
      </section>
    );
  }

  const links = data?.data ?? [];

  return (
    <section className="rounded-xl border border-neutral-300 bg-background shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-300 px-7 py-6">
        <h2 className="text-2xl font-semibold">Your Links</h2>
      </div>

      {/* Search / Sort */}
      <div className="flex items-center justify-between gap-4 px-7 py-5">
        <div className="w-96">
          <Input
            className="min-w-0"
            startAdornment={
              <IconSearch
                size={20}
                className="ml-1 text-neutral-500"
              />
            }
            placeholder="Search links..."
          />
        </div>

        <Button variant="outline" className="w-auto gap-2 px-4">
          <IconSortAscending size={18} />
          Sort
          <IconChevronDown size={16} />
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto px-7">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-y border-neutral-300">
              <th className="py-4 text-left text-sm font-medium text-neutral-600">
                Original URL
              </th>

              <th className="py-4 text-left text-sm font-medium text-neutral-600">
                Short URL
              </th>

              <th className="py-4 text-left text-sm font-medium text-neutral-600">
                Created
              </th>

              <th className="w-20 py-4 text-right text-sm font-medium text-neutral-600">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {links.map((link) => {
              const shortUrl = `http://localhost:4000/r/${link.shortCode}`;

              return (
                <tr
                  key={link.id}
                  className="border-b border-neutral-200 last:border-b-0"
                >
                  {/* Original URL */}
                  <td className="py-5 pr-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-neutral-300 bg-neutral-100">
                        <IconLink
                          size={21}
                          className="text-blue-600"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="max-w-md truncate font-medium">
                          {link.originalUrl}
                        </p>

                        <p className="mt-1 max-w-md truncate text-sm text-neutral-500">
                          {link.originalUrl}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Short URL */}
                  <td className="py-5 pr-6">
                    <div className="flex items-center gap-2">
                      <a
                        href={`${shortUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-blue-600 hover:underline"
                      >
                        {shortUrl}
                      </a>

                      <button
                        type="button"
                        className="cursor-pointer text-neutral-500 transition-colors hover:text-neutral-800"
                        title="Copy URL"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            `http://${shortUrl}`,
                          )
                        }
                      >
                        <IconCopy size={17} />
                      </button>
                    </div>
                  </td>

                  {/* Created */}
                  <td className="py-5 text-sm text-neutral-500">
                    {new Date(link.createdAt).toLocaleDateString()}
                  </td>

                  {/* Actions */}
                  <td className="py-5 text-right">
                    <button
                      type="button"
                      className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-neutral-300 transition-colors hover:bg-neutral-200"
                    >
                      <IconDotsVertical size={19} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {links.length === 0 && (
          <div className="py-10 text-center text-sm text-neutral-500">
            You don't have any links yet.
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 px-7 py-6">
        <button
          type="button"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-neutral-300 transition-colors hover:bg-neutral-200"
        >
          <IconChevronLeft size={18} />
        </button>

        <button
          type="button"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-primary text-white"
        >
          1
        </button>

        <button
          type="button"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-neutral-200"
        >
          2
        </button>

        <button
          type="button"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-neutral-200"
        >
          3
        </button>

        <button
          type="button"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-neutral-300 transition-colors hover:bg-neutral-200"
        >
          <IconChevronRight size={18} />
        </button>
      </div>
    </section>
  );
};