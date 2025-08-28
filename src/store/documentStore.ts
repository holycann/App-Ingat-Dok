import { create } from "zustand";
import type { Document } from "@/types/Document";
import { documentService } from "@/services/documentService";
import { toast } from "sonner";
import { isApiResponse } from "@/types/ApiResponse";

interface DocumentState {
  documents: Document[];
  uploadProgress: { [key: string]: number };
  isProcessing: boolean;
  filters: {
    type?: string;
    status?: string;
    search?: string;
  };
  error: string | null;
  uploadDocument: (file: File) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  updateDocument: (id: string, data: Partial<Document>) => Promise<void>;
  fetchDocuments: () => Promise<void>;
  setFilters: (filters: Partial<DocumentState["filters"]>) => void;
  resetError: () => void;
}

export const useDocumentStore = create<DocumentState>()((set) => ({
  documents: [],
  uploadProgress: {},
  isProcessing: false,
  filters: {},
  error: null,

  resetError: () => set({ error: null }),

  uploadDocument: async (file) => {
    const fileId = Math.random().toString(36).substr(2, 9);

    set({
      isProcessing: true,
      error: null,
    });

    try {
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        set((state) => ({
          uploadProgress: { ...state.uploadProgress, [fileId]: progress },
        }));
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      const response = await documentService.uploadDocument(
        file,
        (progress) => {
          set((state) => ({
            uploadProgress: { ...state.uploadProgress, [fileId]: progress },
          }));
        }
      );

      if (isApiResponse(response) && response.success) {
        const newDocument = response.data!;

        set((state) => ({
          documents: [newDocument, ...state.documents],
          isProcessing: false,
          uploadProgress: { ...state.uploadProgress, [fileId]: 100 },
        }));

        toast.success("Document uploaded successfully");
      } else {
        throw new Error(response.message || "Failed to upload document");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to upload document";

      set({
        isProcessing: false,
        error: errorMessage,
        uploadProgress: {},
      });

      toast.error(errorMessage);
    }
  },

  deleteDocument: async (id) => {
    set({
      isProcessing: true,
      error: null,
    });

    try {
      const response = await documentService.deleteDocument(id);

      if (isApiResponse(response) && response.success) {
        set((state) => ({
          documents: state.documents.filter((doc) => doc.id !== id),
          isProcessing: false,
        }));

        toast.success("Document deleted successfully");
      } else {
        throw new Error(response.message || "Failed to delete document");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete document";

      set({
        isProcessing: false,
        error: errorMessage,
      });

      toast.error(errorMessage);
    }
  },

  updateDocument: async (id, data) => {
    set({
      isProcessing: true,
      error: null,
    });

    try {
      const response = await documentService.updateDocument(id, data);

      if (isApiResponse(response) && response.success) {
        set((state) => ({
          documents: state.documents.map((doc) =>
            doc.id === id ? { ...doc, ...response.data } : doc
          ),
          isProcessing: false,
        }));

        toast.success("Document updated successfully");
      } else {
        throw new Error(response.message || "Failed to update document");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update document";

      set({
        isProcessing: false,
        error: errorMessage,
      });

      toast.error(errorMessage);
    }
  },

  fetchDocuments: async () => {
    set({
      isProcessing: true,
      error: null,
    });

    try {
      const response = await documentService.getDocuments();

      if (isApiResponse(response) && response.success) {
        set({
          documents: response.data || [],
          isProcessing: false,
        });
      } else {
        throw new Error(response.message || "Failed to fetch documents");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch documents";

      set({
        documents: [],
        isProcessing: false,
        error: errorMessage,
      });

      toast.error(errorMessage);
    }
  },

  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));
  },
}));
