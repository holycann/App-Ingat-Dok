import React from "react";
import { FolderIcon } from "lucide-react";
import { DocumentType } from "@/types/DocumentType";

export interface DocumentMediaCardProps {
  type: DocumentType;
  title: string;
  fileCount: number;
  usedPercentage: number;
  size: string;
}

export const DocumentMediaCard: React.FC<DocumentMediaCardProps> = ({
  type,
  title,
  fileCount,
  usedPercentage,
  size,
}) => {
  const getIconAndColors = () => {
    switch (type) {
      case "KTP":
        return {
          icon: <FolderIcon className="text-status-success_green" />,
          bgClass: "bg-status-success_green/[0.08]",
        };
      case "SIM":
        return {
          icon: <FolderIcon className="text-cards-attention_tag" />,
          bgClass: "bg-cards-attention_tag/[0.08]",
        };
      case "STNK":
        return {
          icon: <FolderIcon className="text-status-info_blue" />,
          bgClass: "bg-status-info_blue/[0.08]",
        };
      case "Passport":
        return {
          icon: <FolderIcon className="text-status-warning_yellow" />,
          bgClass: "bg-status-warning_yellow/[0.08]",
        };
      case "Other":
        return {
          icon: <FolderIcon className="text-text-muted_gray" />,
          bgClass: "bg-text-muted_gray/[0.08]",
        };
      default:
        return {
          icon: <FolderIcon className="text-text-muted_gray" />,
          bgClass: "bg-text-muted_gray/[0.08]",
        };
    }
  };

  const { icon, bgClass } = getIconAndColors();

  return (
    <div
      className={`flex items-center justify-between rounded-2xl border border-gray-100 bg-white py-4 pl-4 pr-4 dark:border-gray-800 dark:bg-white/[0.03] xl:pr-5`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex h-[52px] w-[52px] items-center justify-center rounded-xl ${bgClass} text-current`}
        >
          {icon}
        </div>
        <div>
          <h4 className="mb-1 text-sm font-medium text-typography-heading_color">
            {title}
          </h4>
          <span className="block text-sm text-typography-body_color">
            {usedPercentage}% Used
          </span>
        </div>
      </div>
      <div>
        <span className="block mb-1 text-sm text-right text-typography-body_color">
          {fileCount} files
        </span>
        <span className="block text-sm text-right text-typography-body_color">
          {size}
        </span>
      </div>
    </div>
  );
};
