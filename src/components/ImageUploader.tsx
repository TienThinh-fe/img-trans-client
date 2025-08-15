import React, { useState, useCallback, useRef, useEffect } from 'react'
import {
  Upload,
  FileImage,
  Loader2,
  Copy,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ApiService, type TranslationResponse } from '@/services/api'

interface ImageUploaderProps {
  className?: string
}

export function ImageUploader({ className }: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [languages, setLanguages] = useState<Record<string, string>>({})
  const [result, setResult] = useState<TranslationResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  // Load languages on component mount
  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const langs = await ApiService.getLanguages()
        setLanguages(langs)
      } catch (err) {
        console.error('Failed to load languages:', err)
        // Fallback languages
        setLanguages({
          en: 'English',
          es: 'Spanish',
          fr: 'French',
          de: 'German',
          zh: 'Chinese',
          ja: 'Japanese',
        })
      }
    }
    loadLanguages()
  }, [])

  const handleFileUpload = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file')
        return
      }

      setUploading(true)
      setUploadProgress(0)
      setError(null)
      setResult(null)

      try {
        const response = await ApiService.translateImage(
          file,
          selectedLanguage,
          (progress) => {
            setUploadProgress(progress)
          },
        )
        setResult(response)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed')
      } finally {
        setUploading(false)
        setUploadProgress(0)
      }
    },
    [selectedLanguage],
  )

  // Handle paste from clipboard
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return

      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (item.type.indexOf('image') !== -1) {
          e.preventDefault()
          const file = item.getAsFile()
          if (file) {
            await handleFileUpload(file)
          }
          break
        }
      }
    }

    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [handleFileUpload])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0]
        if (file.type.startsWith('image/')) {
          await handleFileUpload(file)
        } else {
          setError('Please upload an image file')
        }
      }
    },
    [handleFileUpload],
  )

  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      await handleFileUpload(file)
    }
  }

  const handleCopyText = async () => {
    if (result?.data?.translated_text) {
      try {
        await navigator.clipboard.writeText(result.data.translated_text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy text:', err)
      }
    }
  }

  return (
    <div className={`w-full max-w-2xl mx-auto space-y-6 ${className}`}>
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Image Text Translator</CardTitle>
          <CardDescription className="text-center">
            Upload, paste (Ctrl+V), or drag an image to extract and translate
            text
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            ref={dropZoneRef}
            className={`
              relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
              ${dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}
              ${
                uploading
                  ? 'pointer-events-none opacity-60'
                  : 'hover:border-primary hover:bg-primary/5'
              }
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploading}
            />

            <div className="space-y-4">
              {uploading ? (
                <Loader2 className="h-12 w-12 mx-auto text-primary animate-spin" />
              ) : (
                <FileImage className="h-12 w-12 mx-auto text-gray-400" />
              )}

              <div>
                <p className="text-lg font-medium">
                  {uploading ? 'Processing image...' : 'Drop your image here'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  or{' '}
                  <span className="text-primary font-medium">
                    click to browse
                  </span>{' '}
                  • Paste with Ctrl+V
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Supports JPG, PNG, GIF, WebP
                </p>
              </div>

              {!uploading && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Image
                </Button>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          {uploading && (
            <div className="mt-4 space-y-2">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-center text-gray-600">
                {uploadProgress}% uploaded
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Language Selection */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Target Language</label>
            <Select
              value={selectedLanguage}
              onValueChange={setSelectedLanguage}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select target language" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(languages).map(([code, name]) => (
                  <SelectItem key={code} value={code}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-2 text-destructive">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p className="font-medium break-words whitespace-pre-wrap overflow-wrap-anywhere">
                {error}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Translation Result
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyText}
                disabled={!result.data?.translated_text}
              >
                {copied ? (
                  <CheckCircle className="h-4 w-4 mr-2" />
                ) : (
                  <Copy className="h-4 w-4 mr-2" />
                )}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.data?.original_text && (
              <div>
                <h4 className="font-medium text-sm text-gray-600 mb-2">
                  Original Text ({result.data.source_language || 'Unknown'}):
                </h4>
                <div className="p-3 bg-gray-50 rounded-md text-sm whitespace-pre-wrap break-words">
                  {result.data.original_text}
                </div>
              </div>
            )}

            {result.data?.translated_text && (
              <div>
                <h4 className="font-medium text-sm text-gray-600 mb-2">
                  Translated Text ({result.target_language_name}):
                </h4>
                <div className="p-3 bg-primary/5 rounded-md text-sm font-medium whitespace-pre-wrap break-words">
                  {result.data.translated_text}
                </div>
              </div>
            )}

            {result.data?.message && (
              <div className="text-center text-gray-500 text-sm italic">
                {result.data.message}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
