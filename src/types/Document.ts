import { DocumentType, DocumentTypeFields } from "./DocumentType";

export interface Document {
  id: string;
  title: string;
  type: DocumentType;
  uploadedAt: Date;
  expiryDate?: Date;
  status: "uploaded" | "processing" | "completed" | "expired";
  url: string;
  thumbnailUrl?: string;
  extractedData?: DocumentTypeFields;
  fileSize: number;
  mimeType: string;
  userId?: string;
}

export interface ProcessingJob {
  id: string;
  documentId: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  result?: any;
  error?: string;
  createdAt: Date;
}

export interface ExtractionResult {
  jobId: string;
  documentId: string;
  extractedData: DocumentTypeFields;
  confidence: number;
  processingTime: number;
}
