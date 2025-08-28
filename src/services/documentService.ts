import { BaseApiService } from "./apiService";
import type { Document } from "@/types/Document";
import { ApiResponse } from "@/types/ApiResponse";

export class DocumentService extends BaseApiService {
  /**
   * Fetch all documents with optional pagination and sorting
   */
  static async getDocuments(
    pagination?: { page?: number; per_page?: number },
    sorting?: { sort_by?: string; sort_order?: "asc" | "desc" }
  ): Promise<ApiResponse<Document[]>> {
    return this.get<Document[]>({
      endpoint: "/documents",
      pagination,
      sorting,
    });
  }

  /**
   * Upload a document with progress tracking
   */
  static async uploadDocument(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<Document>> {
    const formData = new FormData();
    formData.append("file", file);

    return this.post<FormData, Document>(
      {
        endpoint: "/documents/upload",
        config: {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent: {
            total?: number;
            loaded: number;
          }) => {
            if (progressEvent.total && onProgress) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              onProgress(progress);
            }
          },
        },
      },
      formData
    );
  }

  /**
   * Delete a specific document by ID
   */
  static async deleteDocument(id: string): Promise<ApiResponse<void>> {
    return this.delete({
      endpoint: `/documents/${id}`,
    });
  }

  /**
   * Update a document's details
   */
  static async updateDocument(
    id: string,
    data: Partial<Document>
  ): Promise<ApiResponse<Document>> {
    return this.put<Partial<Document>, Document>(
      {
        endpoint: `/documents/${id}`,
      },
      data
    );
  }

  /**
   * Extract data from a specific document
   */
  static async extractDocumentData(id: string): Promise<ApiResponse<any>> {
    return this.post({
      endpoint: `/documents/${id}/extract`,
    });
  }
}

export const documentService = DocumentService;
