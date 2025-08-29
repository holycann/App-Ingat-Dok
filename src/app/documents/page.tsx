"use client";

import React, { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DocumentMediaCard,
  DocumentMediaCardProps,
} from "./components/DocumentMediaCard";
import {
  RecentDocumentsTable,
  DocumentFile,
} from "./components/RecentDocumentsTable";
import { useDocumentStore } from "@/store/documentStore";
import { DocumentType } from "@/types/DocumentType";
import Link from "next/link";

export default function DocumentsPage() {
  const { documents } = useDocumentStore();
  const [searchQuery, setSearchQuery] = useState("");

  const mediaCardData: DocumentMediaCardProps[] = [
    {
      type: "KTP",
      title: "KTP",
      fileCount: 345,
      usedPercentage: 17,
      size: "26.40 GB",
    },
    {
      type: "SIM",
      title: "SIM",
      fileCount: 245,
      usedPercentage: 22,
      size: "26.40 GB",
    },
    {
      type: "STNK",
      title: "STNK",
      fileCount: 830,
      usedPercentage: 23,
      size: "18.90 GB",
    },
    {
      type: "Passport",
      title: "Passport",
      fileCount: 78,
      usedPercentage: 10,
      size: "5.40 GB",
    },
  ];

  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDocument = (doc: DocumentFile) => {
    // Navigate to document detail page
    window.location.href = `/documents/${doc.id}`;
  };

  const handleDownloadDocument = (doc: DocumentFile) => {
    // Implement download logic
    if (doc.url) {
      const link = document.createElement("a");
      link.href = doc.url;
      link.download = doc.name;
      link.click();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-12 gap-6">
        {/* Media Cards Section */}
        <div className="col-span-12">
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="px-4 py-4 sm:pl-6 sm:pr-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                  All Media
                </h3>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search documents..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 pr-3.5 h-11 w-full sm:w-[300px]"
                    />
                  </div>
                  <Link href="/" className="inline-flex items-center gap-2">
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Upload Document
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
                {mediaCardData.map((card, index) => (
                  <DocumentMediaCard key={index} {...card} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Documents Section */}
        <div className="col-span-12">
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="px-4 py-4 sm:pl-6 sm:pr-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                  Recent Documents
                </h3>
                <Button variant="link">View All</Button>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
              <RecentDocumentsTable
                documents={filteredDocuments.map((doc) => ({
                  id: doc.id,
                  name: doc.title,
                  type: doc.type,
                  size: `${(doc.fileSize / 1024 / 1024).toFixed(2)} MB`,
                  uploadDate: doc.uploadedAt.toLocaleDateString(),
                  url: doc.url,
                }))}
                onView={handleViewDocument}
                onDownload={handleDownloadDocument}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}