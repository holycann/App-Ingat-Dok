"use client";

import React, { useState } from "react";
import UploadCard from "@/components/UploadCard";
import InfoSection from "@/components/InfoSection";
import { motion, AnimatePresence } from "framer-motion";
import RecentGrid from "@/components/RecentGrid";

export default function Home() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showInfoSection, setShowInfoSection] = useState(false);

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
      <div className="absolute inset-0 pointer-events-none ">
        <div className="absolute top-0 left-0 w-[300px] h-[200px] bg-gradient-to-r from-background-gradient_blue_start/50 to-transparent rounded-full blur-3xl origin-top-left"></div>
        <div className="absolute top-0 right-0 w-[300px] h-[200px] bg-gradient-to-l from-background-gradient_blue_mid/50 to-transparent rounded-full blur-3xl origin-top-right"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[200px] bg-gradient-to-r from-background-gradient_teal/50 to-transparent rounded-full blur-3xl origin-bottom-left"></div>
        <div className="absolute bottom-0 right-0 w-[300px] h-[200px] bg-gradient-to-l from-background-gradient_green_end/50 to-transparent rounded-full blur-3xl origin-bottom-right"></div>
      </div>
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
