"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, FileText, ImageIcon, AlertCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDocumentStore } from "@/store/documentStore"
import { useNotificationStore } from "@/store/notificationStore"
import { motion, AnimatePresence } from "framer-motion"

export default function UploadCard({ 
  onFilesUploaded,
  onContinue
}: { 
  onFilesUploaded?: (files: File[]) => void;
  onContinue?: () => void;
}) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const { uploadDocument } = useDocumentStore()
  const { addNotification } = useNotificationStore()

  const MAX_FILES = 5
  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    handleFilesSelection(files)
  }, [])

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFilesSelection(Array.from(files))
    }
  }, [])

  const handleFilesSelection = (files: File[]) => {
    if (selectedFiles.length + files.length > MAX_FILES) {
      addNotification({
        type: "error",
        title: "Terlalu banyak file",
        message: `Maksimal ${MAX_FILES} file yang diizinkan`,
        isRead: false,
      })
      return
    }

    const validFiles: File[] = []
    const invalidFiles: string[] = []

    files.forEach(file => {
      if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
        invalidFiles.push(`${file.name} (format tidak didukung)`)
      } else if (file.size > MAX_FILE_SIZE) {
        invalidFiles.push(`${file.name} (melebihi 5MB)`)
      } else {
        validFiles.push(file)
      }
    })

    if (invalidFiles.length > 0) {
      addNotification({
        type: "error",
        title: "Beberapa file tidak dapat diunggah",
        message: invalidFiles.join(", "),
        isRead: false,
      })
    }

    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles])
      
      // Notify parent component about file upload
      if (onFilesUploaded) {
        onFilesUploaded([...selectedFiles, ...validFiles])
      }
    }
  }

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(files => {
      const newFiles = [...files]
      newFiles.splice(index, 1)
      
      // Notify parent component about file update
      if (onFilesUploaded) {
        onFilesUploaded(newFiles)
      }
      
      return newFiles
    })
  }

  const handleContinue = async () => {
    if (selectedFiles.length === 0) {
      addNotification({
        type: "error",
        title: "Tidak ada file",
        message: "Silakan pilih minimal satu file untuk diunggah",
        isRead: false,
      })
      return
    }

    setIsUploading(true)
    try {
      // Upload all selected files
      const uploadPromises = selectedFiles.map(file => uploadDocument(file))
      await Promise.all(uploadPromises)
      
      addNotification({
        type: "success",
        title: "Upload berhasil",
        message: `${selectedFiles.length} file berhasil diunggah`,
        isRead: false,
      })
      
      // Notify parent component about successful upload
      if (onFilesUploaded) {
        onFilesUploaded(selectedFiles)
      }
      
      // Proceed to next step
      if (onContinue) {
        onContinue();
      }
    } catch (error) {
      addNotification({
        type: "error",
        title: "Upload gagal",
        message: "Terjadi kesalahan saat mengupload file",
        isRead: false,
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleClearFiles = () => {
    setSelectedFiles([])
    
    // Notify parent component about cleared files
    if (onFilesUploaded) {
      onFilesUploaded([])
    }
  }

  return (
    <div className="bg-cards-card_background rounded-xl p-6 shadow-lg border border-cards-card_border h-full">
      <h3 className="text-lg font-semibold mb-4 text-typography-heading_color">Upload File</h3>

      {selectedFiles.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
            ${
              isDragOver
                ? "border-primary-brand_yellow bg-primary-brand_yellow/10"
                : "border-cards-card_border hover:border-primary-brand_green"
            }
            ${isUploading ? "opacity-50 pointer-events-none" : ""}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="w-20 h-20 bg-ui_elements-input_background rounded-lg flex items-center justify-center">
              {isUploading ? (
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-brand_yellow"></div>
              ) : (
                <Upload className="h-10 w-10 text-text-muted_gray" />
              )}
            </div>

            <div className="space-y-2">
              <p className="text-lg font-medium text-typography-heading_color">
                {isUploading ? "Mengupload..." : "Silahkan Upload File"}
              </p>
              <p className="text-sm text-text-muted_gray">
                Drag & drop file atau klik untuk memilih
              </p>
              <p className="text-sm text-text-muted_gray">
                Mendukung JPG, PNG, PDF (max 5MB per file, max 5 file)
              </p>
            </div>

            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
              disabled={isUploading}
              multiple
            />

            <Button
              asChild
              variant="outline"
              size="lg"
              disabled={isUploading}
              className="mt-4 bg-navigation-button_yellow hover:bg-navigation-button_hover text-navigation-nav_background border-navigation-button_yellow"
            >
              <label htmlFor="file-upload" className="cursor-pointer">
                <FileText className="h-5 w-5 mr-2" />
                Pilih File
              </label>
            </Button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="bg-ui_elements-input_background p-4 rounded-lg">
            <p className="font-medium text-typography-heading_color mb-2">
              File Terpilih ({selectedFiles.length}/{MAX_FILES})
            </p>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              <AnimatePresence>
                {selectedFiles.map((file, index) => (
                  <motion.div
                    key={`${file.name}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                        {file.type.startsWith("image/") ? (
                          <ImageIcon className="h-5 w-5 text-gray-500" />
                        ) : (
                          <FileText className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="text-gray-400 hover:text-red-500"
                      aria-label="Hapus file"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3">
            <Button
              variant="outline"
              onClick={handleClearFiles}
              disabled={isUploading}
              className="border-gray-300 hover:bg-gray-100"
            >
              Clear All Files
            </Button>
            
            <div className="flex items-center space-x-3">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileSelect}
                className="hidden"
                id="add-more-files"
                disabled={isUploading || selectedFiles.length >= MAX_FILES}
                multiple
              />
              
              {selectedFiles.length < MAX_FILES && (
                <Button
                  asChild
                  variant="outline"
                  disabled={isUploading}
                  className="border-primary-brand_green hover:bg-primary-brand_green/10"
                >
                  <label htmlFor="add-more-files" className="cursor-pointer">
                    Add More
                  </label>
                </Button>
              )}
              
              <Button
                onClick={handleContinue}
                disabled={isUploading}
                className="bg-primary-brand_yellow hover:bg-navigation-button_hover text-navigation-nav_background"
              >
                {isUploading ? "Uploading..." : "Continue"}
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="mt-4 space-y-2">
        <div className="flex items-center space-x-2 text-xs text-text-muted_gray">
          <ImageIcon className="h-3 w-3" />
          <span>SIM, STNK, Passport, KTP</span>
        </div>
        <div className="flex items-center space-x-2 text-xs text-text-muted_gray">
          <AlertCircle className="h-3 w-3" />
          <span>AI akan mengekstrak data secara otomatis</span>
        </div>
      </div>
    </div>
  )
}
