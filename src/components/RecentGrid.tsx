"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  MoreVertical,
  Eye,
  Trash2,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDocumentStore } from "@/store/documentStore";
import type { Document } from "@/types/Document";
import Link from "next/link";

export default function RecentGrid() {
  const { documents, deleteDocument } = useDocumentStore();
  const [showMenu, setShowMenu] = useState<string | null>(null);

  const getStatusColor = (status: Document["status"]) => {
    switch (status) {
      case "completed":
        return "bg-status-success_green/20 text-status-success_green border-status-success_green/30";
      case "processing":
        return "bg-status-warning_yellow/20 text-status-warning_yellow border-status-warning_yellow/30";
      case "uploaded":
        return "bg-status-info_blue/20 text-status-info_blue border-status-info_blue/30";
      case "expired":
        return "bg-status-error_red/20 text-status-error_red border-status-error_red/30";
      default:
        return "bg-text-muted_gray/20 text-text-muted_gray border-text-muted_gray/30";
    }
  };

  const getTypeColor = (type: Document["type"]) => {
    switch (type) {
      case "SIM":
        return "bg-status-info_blue";
      case "STNK":
        return "bg-status-success_green";
      case "Passport":
        return "bg-primary-accent_lime";
      case "KTP":
        return "bg-navigation-button_yellow";
      default:
        return "bg-text-muted_gray";
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const formatExpiryTime = (expiryDate: Date) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return "Expired";
    
    const years = Math.floor(diffDays / 365);
    const remainingDays = diffDays % 365;
    const months = Math.floor(remainingDays / 30);
    const days = remainingDays % 30;
    
    let result = '';
    if (years > 0) result += `${years} tahun `;
    if (months > 0) result += `${months} bulan `;
    if (days > 0) result += `${days} hari`;
    
    return result.trim();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus dokumen ini?")) {
      await deleteDocument(id);
      setShowMenu(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-typography-heading_color">
          Recent
        </h2>
        <Button
          variant="ghost"
          size="sm"
          className="text-typography-link_color hover:text-typography-link_hover"
        >
          View All
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {documents.map((document) => (
          <div
            key={document.id}
            className="group bg-cards-card_background rounded-lg border border-cards-card_border  hover:shadow-xl transition-all duration-200 hover:-translate-y-1 shadow-lg"
          >
            {/* Document preview */}
            <div className="aspect-[4/3] bg-ui_elements-input_background relative ">
              <img
                src={document.thumbnailUrl || document.url}
                alt={document.title}
                className="w-full h-full object-cover"
              />

              {/* Status badge */}
              <div className="absolute top-2 left-2">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                    document.status
                  )}`}
                >
                  {document.status}
                </span>
              </div>

              {/* Type badge */}
              <div className="absolute top-2 right-2">
                <span
                  className={`px-2 py-1 text-xs font-medium text-navigation-nav_background rounded-full ${getTypeColor(
                    document.type
                  )}`}
                >
                  {document.type}
                </span>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <div className="flex space-x-2">
                  <Link href={`/documents/${document.id}`}>
                    <Button
                      size="sm"
                      className="bg-primary-brand_yellow hover:bg-navigation-button_hover text-navigation-nav_background"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    className="bg-primary-brand_green hover:bg-primary-brand_green/80 text-navigation-nav_background"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Document info */}
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <Link href={`/documents/${document.id}`}>
                    <h3 className="text-sm font-medium text-typography-heading_color truncate hover:text-primary-brand_yellow cursor-pointer transition-colors">
                      {document.title}
                    </h3>
                  </Link>

                  {document.expiryDate && (
                    <div className="flex items-center space-x-4 mt-2 text-xs text-text-muted_gray">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>Exp: {formatDate(document.expiryDate)}</span>
                      </div>

                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatExpiryTime(document.expiryDate)}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Menu button */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setShowMenu(showMenu === document.id ? null : document.id)
                    }
                    className="p-1 h-auto text-text-muted_gray hover:text-typography-heading_color hover:bg-ui_elements-input_background"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>

                  {showMenu === document.id && (
                    <div className="absolute right-0 mt-1 w-32 bg-cards-card_background rounded-lg shadow-lg border border-cards-card_border py-1 z-10">
                      <Link href={`/documents/${document.id}`}>
                        <button className="w-full px-3 py-2 text-left text-sm hover:bg-ui_elements-input_background flex items-center space-x-2 text-typography-heading_color">
                          <Eye className="h-3 w-3" />
                          <span>View</span>
                        </button>
                      </Link>
                      <button className="w-full px-3 py-2 text-left text-sm hover:bg-ui_elements-input_background flex items-center space-x-2 text-typography-heading_color">
                        <Download className="h-3 w-3" />
                        <span>Download</span>
                      </button>
                      <button
                        onClick={() => handleDelete(document.id)}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-ui_elements-input_background flex items-center space-x-2 text-status-error_red"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
