import React from "react";
import { Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface DocumentFile {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  url?: string;
}

export interface RecentDocumentsTableProps {
  documents: DocumentFile[];
  onView?: (document: DocumentFile) => void;
  onDownload?: (document: DocumentFile) => void;
}

export const RecentDocumentsTable: React.FC<RecentDocumentsTableProps> = ({
  documents,
  onView,
  onDownload,
}) => {
  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "image":
        return "/images/icons/file-image.svg";
      case "video":
        return "/images/icons/file-video.svg";
      case "pdf":
        return "/images/icons/file-pdf.svg";
      default:
        return "/images/icons/file-default.svg";
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>File Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Date Modified</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map((doc) => (
          <TableRow key={doc.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                <img
                  src={getFileIcon(doc.type)}
                  alt={`${doc.type} icon`}
                  className="w-5 h-5 dark:hidden"
                />
                <img
                  src={getFileIcon(doc.type).replace(".svg", "-dark.svg")}
                  alt={`${doc.type} icon`}
                  className="hidden dark:block w-5 h-5"
                />
                {doc.name}
              </div>
            </TableCell>
            <TableCell>{doc.type}</TableCell>
            <TableCell>{doc.size}</TableCell>
            <TableCell>{doc.uploadDate}</TableCell>
            <TableCell className="text-center">
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onView && onView(doc)}
                  className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDownload && onDownload(doc)}
                  className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
