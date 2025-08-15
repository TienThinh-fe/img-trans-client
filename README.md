# Image Translation App - Frontend

A modern React TypeScript frontend for the Image Translation application, built with Vite, Tailwind CSS, and shadcn/ui components.

## 🚀 Features

- **Multiple Upload Methods**: Click to browse, drag & drop, or paste (Ctrl+V) images
- **Real-time Progress**: Visual upload progress with progress bars
- **Language Selection**: Support for 12+ languages with dynamic loading
- **Responsive Design**: Modern UI with Tailwind CSS and shadcn/ui components
- **Type Safety**: Full TypeScript implementation
- **Error Handling**: User-friendly error messages with proper text wrapping
- **Copy Functionality**: Easy copy-to-clipboard for translated text
- **Multi-text Support**: Handles images with multiple text blocks

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for modern UI components
- **Radix UI** for accessible component primitives
- **Lucide React** for icons
- **class-variance-authority** & **clsx** for conditional styling

## 📋 Prerequisites

- **Node.js** 16+ and npm
- **Backend server** running on port 8000

## 🔧 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎯 Development

### Available Scripts

```bash
npm run dev      # Start development server (http://localhost:5173)
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

### Project Structure

```
src/
├── components/
│   ├── ui/                 # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── progress.tsx
│   │   └── select.tsx
│   └── ImageUploader.tsx   # Main upload component
├── services/
│   └── api.ts             # API service layer
├── lib/
│   └── utils.ts           # Utility functions
├── App.tsx                # Main app component
├── index.css              # Tailwind CSS setup
└── main.tsx               # React entry point
```

## 🔌 API Integration

The frontend communicates with the FastAPI backend through the API service layer:

### Base Configuration

- **Backend URL**: `http://localhost:8000`
- **CORS**: Configured for development ports

### API Endpoints Used

- `GET /languages` - Fetch available languages
- `POST /translate-image` - Upload and translate images
- `POST /health` - Health check

### Type Definitions

```typescript
interface TranslationResult {
  original_text: string
  translated_text: string
  source_language: string
  message?: string
}

interface TranslationResponse {
  success: boolean
  data: TranslationResult
  target_language: string
  target_language_name: string
}
```

## 🎨 UI Components

### ImageUploader Component

The main component handles:

- File upload via multiple methods
- Progress tracking
- Language selection
- Results display
- Error handling

#### Props

```typescript
interface ImageUploaderProps {
  className?: string
}
```

#### Features

- **Drag & Drop**: Visual feedback and file validation
- **Clipboard Support**: Automatic paste detection for images
- **Progress Tracking**: Real-time upload progress
- **Error Display**: User-friendly error messages
- **Results Display**: Formatted original and translated text

## 🔧 Configuration

### Tailwind CSS

The project uses Tailwind CSS v3 with custom configuration:

```javascript
// tailwind.config.js
export default {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // shadcn/ui color system
      },
    },
  },
}
```

### Vite Configuration

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
})
```

## 🎯 Usage

1. **Start the application**: `npm run dev`
2. **Open browser**: Navigate to `http://localhost:5173`
3. **Upload an image**:
   - Click the upload area to browse files
   - Drag and drop an image onto the upload area
   - Copy an image and paste with Ctrl+V
4. **Select target language** from the dropdown
5. **View results** with original and translated text
6. **Copy translated text** using the copy button

## 🔍 Supported File Types

- **Images**: JPG, PNG, GIF, WebP
- **File size**: Limited by backend configuration
- **Validation**: Client-side file type checking

## 🎨 Styling

### Theme System

The application uses a consistent theme system based on CSS variables:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  /* ... more variables */
}
```

### Responsive Design

- **Mobile-first** approach with Tailwind CSS
- **Responsive breakpoints** for different screen sizes
- **Touch-friendly** interface elements

## 🛡️ Error Handling

### Client-side Validation

- File type validation
- File size checking
- Network error handling

### User Feedback

- Loading states with progress indicators
- Error messages with proper text wrapping
- Success states with visual feedback

## 🔧 Development Tips

### Adding New Components

1. Create component in `src/components/`
2. Use TypeScript for type safety
3. Follow shadcn/ui patterns for consistency
4. Add proper error handling

### Styling Guidelines

1. Use Tailwind CSS utility classes
2. Leverage shadcn/ui component variants
3. Follow responsive design principles
4. Use CSS variables for theming

## 📦 Build & Deployment

### Production Build

```bash
npm run build
```

Outputs to `dist/` directory with:

- Optimized JavaScript bundles
- Minified CSS
- Static assets

### Deployment Options

- **Static hosting**: Vercel, Netlify, GitHub Pages
- **CDN**: CloudFront, CloudFlare
- **Traditional hosting**: Apache, Nginx

### Environment Variables

No environment variables required for the frontend. Backend URL is hardcoded for development but can be made configurable for production.

## 🤝 Contributing

1. Follow TypeScript best practices
2. Use existing component patterns
3. Add proper error handling
4. Test with different image types
5. Ensure responsive design

## 📄 License

This project is part of the Image Translation App and follows the same license terms.
