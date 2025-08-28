"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Clock, Download, MessageCircle, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDocumentStore } from "@/store/documentStore"
import type { Document } from "@/types/Document"

interface ChatMessage {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

export default function DocumentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { documents } = useDocumentStore()
  const [document, setDocument] = useState<Document | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isAiTyping, setIsAiTyping] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const doc = documents.find((d) => d.id === params.id)
    if (doc) {
      setDocument(doc)
      setChatMessages([
        {
          id: "welcome",
          content: `Halo! Saya AI assistant untuk dokumen ${doc.title}. Ada yang bisa saya bantu terkait dokumen ini?`,
          sender: "ai",
          timestamp: new Date(),
        },
      ])
    }
  }, [params.id, documents])

  const getStatusColor = (status: Document["status"]) => {
    switch (status) {
      case "completed":
        return "bg-status-success_green/20 text-status-success_green border-status-success_green/30 dark:bg-status-success_green/20 dark:text-status-success_green dark:border-status-success_green/30"
      case "processing":
        return "bg-status-warning_yellow/20 text-status-warning_yellow border-status-warning_yellow/30 dark:bg-status-warning_yellow/20 dark:text-status-warning_yellow dark:border-status-warning_yellow/30"
      case "uploaded":
        return "bg-status-info_blue/20 text-status-info_blue border-status-info_blue/30 dark:bg-status-info_blue/20 dark:text-status-info_blue dark:border-status-info_blue/30"
      case "expired":
        return "bg-status-error_red/20 text-status-error_red border-status-error_red/30 dark:bg-status-error_red/20 dark:text-status-error_red dark:border-status-error_red/30"
      default:
        return "bg-text-muted_gray/20 text-text-muted_gray border-text-muted_gray/30 dark:bg-text-muted_gray/20 dark:text-text-muted_gray dark:border-text-muted_gray/30"
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: newMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setChatMessages((prev) => [...prev, userMessage])
    setNewMessage("")
    setIsAiTyping(true)

    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: `Berdasarkan dokumen ${document?.title}, saya dapat membantu Anda dengan informasi berikut: ${document?.extractedData ? `Nomor dokumen: ${document.extractedData.documentNumber}, ` : ""}Tanggal upload: ${document ? formatDate(document.uploadedAt) : ""}, Status: ${document?.status}. Ada pertanyaan lain?`,
        sender: "ai",
        timestamp: new Date(),
      }
      setChatMessages((prev) => [...prev, aiResponse])
      setIsAiTyping(false)
    }, 1500)
  }

  if (!mounted) {
    return (
      <div className="bg-background dark:bg-background flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    )
  }

  if (!document) {
    return (
      <div className="bg-background dark:bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground dark:text-foreground mb-4">Dokumen tidak ditemukan</h1>
          <Button
            onClick={() => router.push("/")}
            className="bg-primary-brand_yellow hover:bg-navigation-button_hover text-navigation-nav_background"
          >
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background dark:bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="text-foreground dark:text-foreground hover:bg-muted dark:hover:bg-muted"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Kembali
            </Button>
            <h1 className="text-2xl font-bold text-foreground dark:text-foreground">{document.title}</h1>
          </div>

          <Button
            onClick={() => setIsChatOpen(true)}
            className="bg-primary-brand_green hover:bg-primary-brand_green/80 text-navigation-nav_background"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Chat dengan AI
          </Button>
        </div>

        {/* Document Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Document Preview */}
          <div className="lg:col-span-2">
            <div className="bg-card dark:bg-card rounded-lg border border-border dark:border-border  shadow-lg">
              <div className="aspect-[4/3] bg-muted dark:bg-muted">
                <img
                  src={document.url || "/placeholder.svg"}
                  alt={document.title}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>

          {/* Document Info */}
          <div className="space-y-6">
            <div className="bg-card dark:bg-card rounded-lg border border-border dark:border-border p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-foreground dark:text-foreground mb-4">Informasi Dokumen</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(document.status)}`}
                    >
                      {document.status}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">
                    Tipe Dokumen
                  </label>
                  <p className="mt-1 text-foreground dark:text-foreground">{document.type}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">
                    Tanggal Upload
                  </label>
                  <div className="mt-1 flex items-center space-x-2 text-foreground dark:text-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(document.uploadedAt)}</span>
                  </div>
                </div>

                {document.expiryDate && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">
                      Tanggal Kadaluarsa
                    </label>
                    <div className="mt-1 flex items-center space-x-2 text-foreground dark:text-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{formatDate(document.expiryDate)}</span>
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">
                    Ukuran File
                  </label>
                  <p className="mt-1 text-foreground dark:text-foreground">
                    {(document.fileSize / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>

                {document.extractedData && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">
                      Data Terekstrak
                    </label>
                    <div className="mt-1 space-y-2">
                      {document.extractedData.documentNumber && (
                        <p className="text-sm text-foreground dark:text-foreground">
                          <span className="font-medium">Nomor:</span> {document.extractedData.documentNumber}
                        </p>
                      )}
                      {document.extractedData.holderName && (
                        <p className="text-sm text-foreground dark:text-foreground">
                          <span className="font-medium">Nama:</span> {document.extractedData.holderName}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Button className="w-full mt-6 bg-primary-brand_yellow hover:bg-navigation-button_hover text-navigation-nav_background">
                <Download className="h-4 w-4 mr-2" />
                Download Dokumen
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat Sidebar */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={() => setIsChatOpen(false)} />

          {/* Chat Sidebar */}
          <div className="w-96 bg-card dark:bg-card border-l border-border dark:border-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-border dark:border-border">
              <div>
                <h3 className="font-semibold text-foreground dark:text-foreground">AI Assistant</h3>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                  Chat tentang {document.title}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsChatOpen(false)}
                className="text-muted-foreground dark:text-muted-foreground hover:text-foreground dark:hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-primary-brand_yellow text-navigation-nav_background"
                        : "bg-muted dark:bg-muted text-foreground dark:text-foreground"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === "user"
                          ? "text-navigation-nav_background/70"
                          : "text-muted-foreground dark:text-muted-foreground"
                      }`}
                    >
                      {formatDate(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}

              {isAiTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted dark:bg-muted text-foreground dark:text-foreground rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground dark:bg-muted-foreground rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-muted-foreground dark:bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-muted-foreground dark:bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-border dark:border-border">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Tanyakan sesuatu tentang dokumen ini..."
                  className="flex-1 px-3 py-2 bg-background dark:bg-background border border-border dark:border-border rounded-lg text-foreground dark:text-foreground placeholder-muted-foreground dark:placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-brand_yellow"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isAiTyping}
                  className="bg-primary-brand_yellow hover:bg-navigation-button_hover text-navigation-nav_background"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
