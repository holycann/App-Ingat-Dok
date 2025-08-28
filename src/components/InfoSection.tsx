"use client";

import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Calendar,
  X,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useDocumentStore } from "@/store/documentStore";
import type { Document } from "@/types/Document";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { id } from "date-fns/locale";

type ReminderOption = {
  label: string;
  value: string;
  days: number | null; // null means custom
};

type ProcessingStep = {
  name: string;
  status: "pending" | "processing" | "completed";
  message?: string;
};

type ExtractedDocument = {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  documentType: "KTP" | "SIM" | "STNK" | "Passport" | "Unknown";
  extractedData: Record<string, string>;
  expiryDate?: Date;
  reminderType: string;
  reminderDate?: Date;
  thumbnailUrl?: string;
};

const reminderOptions: ReminderOption[] = [
  { label: "Auto (AI Recommendation)", value: "auto", days: 0 },
  { label: "30 hari sebelum kadaluarsa", value: "30d", days: 30 },
  { label: "7 hari sebelum kadaluarsa", value: "7d", days: 7 },
  { label: "1 hari sebelum kadaluarsa", value: "1d", days: 1 },
  { label: "Custom...", value: "custom", days: null },
];

const processingSteps: ProcessingStep[] = [
  { name: "Mengidentifikasi Jenis Dokumen", status: "pending" },
  { name: "Ekstraksi Data", status: "pending" },
  { name: "Klasifikasi Dokumen", status: "pending" },
  { name: "Validasi Data", status: "pending" },
];

// Function to get dummy document data (for simulation)
const getDummyDocuments = (files: File[]): ExtractedDocument[] => {
  const documentTypes: ("KTP" | "SIM" | "STNK" | "Passport" | "Unknown")[] = [
    "KTP",
    "SIM",
    "STNK",
    "Passport",
    "Unknown",
  ];

  return files.map((file, index) => {
    const documentType =
      documentTypes[Math.floor(Math.random() * documentTypes.length)];
    const today = new Date();
    const expiryDate = new Date();
    expiryDate.setFullYear(today.getFullYear() + 2); // 2 years in the future

    let extractedData: Record<string, string> = {};

    switch (documentType) {
      case "KTP":
        extractedData = {
          NIK: "3201012345678901",
          Nama: "JOHN DOE",
          "Tempat/Tgl Lahir": "JAKARTA, 01-01-1990",
          Alamat: "JL. CONTOH NO. 123",
          "RT/RW": "001/002",
          Kelurahan: "CONTOH",
          Kecamatan: "TELADAN",
        };
        break;
      case "SIM":
        extractedData = {
          "No. SIM": "900123456789",
          Nama: "JOHN DOE",
          "Tempat/Tgl Lahir": "JAKARTA, 01-01-1990",
          Alamat: "JL. CONTOH NO. 123",
          "Berlaku Hingga": format(expiryDate, "dd-MM-yyyy"),
        };
        break;
      case "STNK":
        extractedData = {
          "No. Polisi": "B 1234 ABC",
          "Nama Pemilik": "JOHN DOE",
          Alamat: "JL. CONTOH NO. 123",
          Merk: "TOYOTA",
          Type: "AVANZA",
          "Berlaku Hingga": format(expiryDate, "dd-MM-yyyy"),
        };
        break;
      case "Passport":
        extractedData = {
          "No. Paspor": "A12345678",
          "Nama Lengkap": "JOHN DOE",
          "Tempat/Tgl Lahir": "JAKARTA, 01-01-1990",
          "Tanggal Dikeluarkan": format(today, "dd-MM-yyyy"),
          "Berlaku Hingga": format(expiryDate, "dd-MM-yyyy"),
        };
        break;
      default:
        extractedData = {
          Info: "Dokumen tidak dikenal",
        };
    }

    return {
      id: `doc-${index}`,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      documentType,
      extractedData,
      expiryDate,
      reminderType: "auto",
      thumbnailUrl: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : undefined,
    };
  });
};

// Format remaining time function
const formatRemainingTime = (expiryDate?: Date): string => {
  if (!expiryDate) return "Tidak tersedia";

  const now = new Date();
  const diffTime = expiryDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return "Sudah kadaluarsa";
  }

  const years = Math.floor(diffDays / 365);
  const months = Math.floor((diffDays % 365) / 30);
  const days = diffDays % 30;

  if (years > 0) {
    return `${days} hari ${months} bulan ${years} tahun`;
  } else if (months > 0) {
    return `${days} hari ${months} bulan`;
  } else {
    return `${days} hari`;
  }
};

export default function InfoSection({
  files = [],
  onBack,
}: {
  files?: File[];
  onBack?: () => void;
}) {
  const { documents } = useDocumentStore();
  const [selectedReminder, setSelectedReminder] = useState<string>("auto");
  const [customDate, setCustomDate] = useState<Date | undefined>(undefined);
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [latestDocument, setLatestDocument] = useState<Document | null>(null);
  const [extractedDocuments, setExtractedDocuments] = useState<
    ExtractedDocument[]
  >([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Effect to get the most recently uploaded document from store
  useEffect(() => {
    if (documents.length > 0) {
      // Sort documents by upload date and get the most recent one
      const mostRecentDocument = documents.reduce((latest, current) =>
        new Date(current.uploadedAt) > new Date(latest.uploadedAt)
          ? current
          : latest
      );
      setLatestDocument(mostRecentDocument);
    }
  }, [documents]);

  // Effect to process uploaded files
  useEffect(() => {
    if (files.length > 0 && !processing && !completed) {
      handleProcessFiles();
    }
  }, [files]);

  const handleProcessFiles = async () => {
    if (files.length === 0) return;

    setProcessing(true);
    setCompleted(false);
    setCurrentStep(0);

    // Simulate processing steps
    for (let i = 0; i < processingSteps.length; i++) {
      setCurrentStep(i);
      processingSteps[i].status = "processing";

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 1500));

      processingSteps[i].status = "completed";
    }

    // Generate dummy extracted documents
    const dummyDocs = getDummyDocuments(files);
    setExtractedDocuments(dummyDocs);

    setProcessing(false);
    setCompleted(true);
  };

  const handleUpdateReminder = (docId: string, reminderType: string) => {
    setExtractedDocuments((docs) =>
      docs.map((doc) => {
        if (doc.id === docId) {
          const selectedOption = reminderOptions.find(
            (opt) => opt.value === reminderType
          );
          let reminderDate: Date | undefined = undefined;

          if (
            doc.expiryDate &&
            selectedOption &&
            selectedOption.days !== null
          ) {
            reminderDate = new Date(doc.expiryDate);
            reminderDate.setDate(reminderDate.getDate() - selectedOption.days);
          }

          return {
            ...doc,
            reminderType,
            reminderDate,
          };
        }
        return doc;
      })
    );

    if (reminderType === "custom") {
      setShowCustomDatePicker(true);
    }
  };

  const handleSetCustomDate = (docId: string, date: Date | undefined) => {
    if (!date) return;

    setExtractedDocuments((docs) =>
      docs.map((doc) => {
        if (doc.id === docId) {
          return {
            ...doc,
            reminderDate: date,
          };
        }
        return doc;
      })
    );

    setCustomDate(date);
    setShowCustomDatePicker(false);
  };

  const handleAutoAllReminders = () => {
    setExtractedDocuments((docs) =>
      docs.map((doc) => {
        let reminderDate: Date | undefined = undefined;

        if (doc.expiryDate) {
          reminderDate = new Date(doc.expiryDate);
          // Auto logic: 30 days for KTP/SIM/Passport, 7 days for STNK, 1 day for Unknown
          const days =
            doc.documentType === "STNK"
              ? 7
              : doc.documentType === "Unknown"
              ? 1
              : 30;
          reminderDate.setDate(reminderDate.getDate() - days);
        }

        return {
          ...doc,
          reminderType: "auto",
          reminderDate,
        };
      })
    );
  };

  // If no documents are uploaded and no files are being processed, show upload guidance
  if (extractedDocuments.length === 0 && !processing) {
    return (
      <div className="bg-overlay-gradient rounded-xl p-6 h-full border border-cards-card_border shadow-lg flex flex-col justify-center items-center text-center">
        <AlertCircle className="h-16 w-16 text-primary-accent_lime mb-4 animate-pulse" />
        <h3 className="text-xl font-semibold text-typography-heading_color mb-2">
          Silahkan Upload Dokumen
        </h3>
        <p className="text-sm text-typography-body_color mb-6">
          Unggah dokumen penting seperti SIM, STNK, Passport, atau KTP untuk
          mendapatkan reminder otomatis sebelum masa berlaku habis.
        </p>
        {onBack && (
          <Button
            className="bg-primary-brand_yellow hover:bg-navigation-button_hover text-navigation-nav_background"
            onClick={onBack}
          >
            Unggah Dokumen Sekarang
          </Button>
        )}
      </div>
    );
  }

  // Processing view
  if (processing) {
    return (
      <div className="bg-overlay-gradient rounded-xl p-6 h-full border border-cards-card_border shadow-lg">
        <h3 className="text-lg font-semibold text-typography-heading_color mb-4">
          Memproses Dokumen
        </h3>

        <div className="space-y-6">
          {processingSteps.map((step, index) => (
            <motion.div
              key={step.name}
              className="bg-cards-card_background/50 rounded-lg p-4 border border-cards-card_border"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: index <= currentStep ? 1 : 0.5,
                y: 0,
              }}
              transition={{ delay: index * 0.2 }}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  {step.status === "completed" ? (
                    <CheckCircle className="text-green-500 h-5 w-5" />
                  ) : step.status === "processing" ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Clock className="text-primary-brand_yellow h-5 w-5" />
                    </motion.div>
                  ) : (
                    <AlertCircle className="text-gray-400 h-5 w-5" />
                  )}
                  <span className="text-sm font-medium">{step.name}</span>
                </div>

                {step.status === "completed" && (
                  <Badge variant="default" className="bg-green-500">
                    Selesai
                  </Badge>
                )}

                {step.status === "processing" && (
                  <Badge
                    variant="outline"
                    className="border-primary-brand_yellow text-primary-brand_yellow"
                  >
                    Memproses...
                  </Badge>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <motion.div
              className="bg-primary-brand_yellow h-2.5 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${(currentStep + 1) * 25}%` }}
              transition={{ duration: 0.5 }}
            ></motion.div>
          </div>
          <p className="text-sm text-center mt-2 text-text-muted_gray">
            {Math.round(((currentStep + 1) / processingSteps.length) * 100)}%
            Selesai
          </p>
        </div>
      </div>
    );
  }

  // Results view (extraction completed)
  return (
    <div className="bg-overlay-gradient rounded-xl p-6 h-full border border-cards-card_border shadow-lg overflow-y-auto">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-typography-heading_color">
            Hasil Ekstraksi Dokumen
          </h3>

          {onBack && (
            <Button variant="outline" size="sm" onClick={onBack}>
              Kembali
            </Button>
          )}
        </div>

        <AnimatePresence>
          {extractedDocuments.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: index * 0.1 }}
              className="bg-cards-card_background/80 rounded-lg border border-cards-card_border overflow-hidden"
            >
              <div className="flex items-start p-4">
                <div className="w-20 h-20 bg-gray-100 rounded-md shrink-0 overflow-hidden mr-4 flex items-center justify-center">
                  {doc.thumbnailUrl ? (
                    <img
                      src={doc.thumbnailUrl}
                      alt={doc.fileName}
                      className="w-full h-full object-cover"
                    />
                  ) : doc.documentType === "KTP" ? (
                    <img
                      src="/indonesian-id-card.png"
                      alt="KTP"
                      className="w-full h-full object-cover"
                    />
                  ) : doc.documentType === "STNK" ? (
                    <img
                      src="/vehicle-registration-documents.png"
                      alt="STNK"
                      className="w-full h-full object-cover"
                    />
                  ) : doc.documentType === "SIM" ? (
                    <img
                      src="/driving-license-documents.png"
                      alt="SIM"
                      className="w-full h-full object-cover"
                    />
                  ) : doc.documentType === "Passport" ? (
                    <img
                      src="/indonesian-passport.png"
                      alt="Passport"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src="/generic-identification-thumbnail.png"
                      alt="Document"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-medium text-typography-heading_color mb-1">
                        {doc.fileName}
                      </h4>
                      <p className="text-xs text-text-muted_gray">
                        {(doc.fileSize / 1024).toFixed(1)} KB
                      </p>
                    </div>

                    <Badge
                      variant={
                        doc.documentType === "Unknown" ? "outline" : "default"
                      }
                      className={
                        doc.documentType === "KTP"
                          ? "bg-blue-500"
                          : doc.documentType === "SIM"
                          ? "bg-green-500"
                          : doc.documentType === "STNK"
                          ? "bg-orange-500"
                          : doc.documentType === "Passport"
                          ? "bg-purple-500"
                          : ""
                      }
                    >
                      {doc.documentType}
                    </Badge>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
                    {Object.entries(doc.extractedData)
                      .slice(0, 4)
                      .map(([key, value]) => (
                        <div key={key}>
                          <p className="text-xs text-text-muted_gray">{key}</p>
                          <p className="text-sm font-medium">{value}</p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-t border-cards-card_border">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div>
                    <p className="text-xs text-text-muted_gray">Masa Berlaku</p>
                    <div className="flex items-center mt-1">
                      {doc.expiryDate &&
                      new Date(doc.expiryDate) < new Date() ? (
                        <Badge
                          variant="destructive"
                          className="flex items-center"
                        >
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Sudah Kadaluarsa
                        </Badge>
                      ) : doc.expiryDate &&
                        (new Date(doc.expiryDate).getTime() -
                          new Date().getTime()) /
                          (1000 * 3600 * 24) <
                          30 ? (
                        <Badge
                          variant="outline"
                          className="border-orange-500 text-orange-500 flex items-center"
                        >
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {formatRemainingTime(doc.expiryDate)}
                        </Badge>
                      ) : (
                        <Badge
                          variant="default"
                          className="bg-green-500 flex items-center"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {formatRemainingTime(doc.expiryDate)}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                    <div>
                      <p className="text-xs text-text-muted_gray mb-1">
                        Atur Pengingat
                      </p>
                      <Select
                        value={doc.reminderType}
                        onValueChange={(value) =>
                          handleUpdateReminder(doc.id, value)
                        }
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Pilih waktu pengingat" />
                        </SelectTrigger>
                        <SelectContent>
                          {reminderOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {doc.reminderType === "custom" && (
                        <Popover
                          open={showCustomDatePicker}
                          onOpenChange={setShowCustomDatePicker}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2 w-full flex items-center justify-between"
                            >
                              {doc.reminderDate
                                ? format(doc.reminderDate, "PPP", {
                                    locale: id,
                                  })
                                : "Pilih tanggal"}
                              <Calendar className="h-4 w-4 ml-2" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <CalendarComponent
                              mode="single"
                              selected={customDate}
                              onSelect={(date) =>
                                handleSetCustomDate(doc.id, date)
                              }
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handleAutoAllReminders}>
            Auto All Reminder
          </Button>

          <Button className="bg-primary-brand_yellow hover:bg-navigation-button_hover text-navigation-nav_background">
            Save Reminder
          </Button>
        </div>
      </div>
    </div>
  );
}