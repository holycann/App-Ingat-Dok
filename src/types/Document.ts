import { DocumentType, DocumentTypeFields } from "./DocumentType";

export interface Document {
  id: string;
  name: string;
  doc_type_id: string;
  file_path: string;
  user_id: string;
  status: string;
  expired_date: string;

  type: DocumentType;
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
