"use client";

import React, { useCallback, useEffect, useState } from "react";
import UploadCard from "@/components/UploadCard";
import InfoSection from "@/components/InfoSection";
import { motion, AnimatePresence } from "framer-motion";
import RecentGrid from "@/components/RecentGrid";
import { useDocumentStore } from "@/store/documentStore";

export default function Home() {
  const { fetchDocuments } = useDocumentStore();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showInfoSection, setShowInfoSection] = useState(false);

  const getDocuments = useCallback(async () => {
    await fetchDocuments();
  }, [fetchDocuments]);

  useEffect(() => {
    getDocuments();
  }, []);

  const handleFilesUploaded = (files: File[]) => {
    setUploadedFiles(files);
    // Only show InfoSection when Continue button is pressed
    // We'll handle this in UploadCard component
  };

  const handleContinue = () => {
    if (uploadedFiles.length > 0) {
      setShowInfoSection(true);
    }
  };

  const handleBackToUpload = () => {
    setShowInfoSection(false);
  };

  return (
    <div className="relative">
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-typography-heading_color mb-4">
            Kelola Dokumen Legal Anda
          </h1>
          <p className="text-lg text-typography-body_color max-w-2xl mx-auto">
            Upload dokumen penting seperti SIM, STNK, Passport, dan KTP.
            Dapatkan reminder otomatis dengan teknologi AI.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 mb-12">
          <AnimatePresence mode="wait">
            {!showInfoSection ? (
              <motion.div
                key="upload-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <UploadCard
                  onFilesUploaded={handleFilesUploaded}
                  onContinue={handleContinue}
                />
              </motion.div>
            ) : (
              <motion.div
                key="info-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <InfoSection
                  files={uploadedFiles}
                  onBack={handleBackToUpload}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Recent Documents */}
        <RecentGrid />
      </main>
    </div>
  );
}
