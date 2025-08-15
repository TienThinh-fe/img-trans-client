const API_BASE_URL = 'http://127.0.0.1:8000'

export interface Language {
  code: string
  name: string
}

export interface TranslationResult {
  original_text: string
  translated_text: string
  source_language: string
  message?: string
}

export interface TranslationResponse {
  success: boolean
  data: TranslationResult
  target_language: string
  target_language_name: string
}

export class ApiService {
  static async getLanguages(): Promise<Record<string, string>> {
    try {
      const response = await fetch(`${API_BASE_URL}/languages`)
      if (!response.ok) {
        throw new Error('Failed to fetch languages')
      }
      const data = await response.json()
      return data.languages
    } catch (error) {
      console.error('Error fetching languages:', error)
      throw error
    }
  }

  static async translateImage(
    file: File,
    targetLanguage: string,
    onProgress?: (progress: number) => void,
  ): Promise<TranslationResponse> {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('target_language', targetLanguage)

      const xhr = new XMLHttpRequest()

      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable && onProgress) {
            const progress = Math.round((event.loaded / event.total) * 100)
            onProgress(progress)
          }
        })

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText)
              resolve(response)
            } catch (error) {
              reject(new Error('Invalid response format: ' + error))
            }
          } else {
            try {
              const errorResponse = JSON.parse(xhr.responseText)
              reject(new Error(errorResponse.detail || 'Upload failed'))
            } catch {
              reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`))
            }
          }
        })

        xhr.addEventListener('error', () => {
          reject(new Error('Network error occurred'))
        })

        xhr.addEventListener('timeout', () => {
          reject(new Error('Request timeout'))
        })

        xhr.open('POST', `${API_BASE_URL}/translate-image`)
        xhr.timeout = 60000 // 60 second timeout
        xhr.send(formData)
      })
    } catch (error) {
      console.error('Error translating image:', error)
      throw error
    }
  }

  static async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'POST',
      })
      return response.ok
    } catch (error) {
      console.error('Health check failed:', error)
      return false
    }
  }
}
