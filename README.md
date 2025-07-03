# Algorithm Samurai 🥷

<div align="center">
  
  
  <h2>React frontend for code learning platform</h2>
  
  [![React](https://img.shields.io/badge/React-19.0.0-58C4DC.svg)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-3077C6.svg)](https://typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-6.3.1-906CFE.svg)](https://vitejs.dev/)
  [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.10-00BCFF.svg)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
</div>

## 📋 Table of Contents

- [🌟 Overview](#-overview)
- [✨ Key Features](#-key-features)
- [🚀 Getting Started](#-getting-started)
- [🏗️ Project Structure](#️-project-structure)
- [🛠️ Technology Stack](#️-technology-stack)
- [📝 License](#-license)

## 🌟 Overview

Algorithm Samurai is the frontend for a learning platform that helps you improve your coding skills through interactive exercises and challenges. This project was built as my first full-stack application to practice React and TypeScript development. It works together with the [Algorithm Sensei Backend](https://github.com/philippspitzley/algorithm-sensei.git) to provide a complete learning experience with AI-powered hints, real-time code execution, and structured courses.

## ✨ Key Features

- **Live Code Editor**: Monaco Editor with syntax highlighting, auto-completion, and real-time feedback
- **Instant Code Execution**: Run JavaScript code with immediate results using Piston API
- **Type-Safe API**: Full TypeScript integration with auto-generated types from backend OpenAPI schemas
- **Structured Learning**: Progressive courses with chapter-based organization and hands-on exercises
- **Progress Tracking**: Visual indicators to monitor your learning journey
- **Dual Theme Support**: Light and dark modes with Catppuccin color palette for a pleasant coding experience

### 🤖 AI Integration

- **Intelligent Hints**: Context-aware suggestions based on your current code
- **Error Analysis**: Detailed explanations of runtime errors and compilation issues
- **Personalized Learning**: Adaptive difficulty based on your progress

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en)
- npm or yarn package manager
- **Backend API**: This frontend requires the [Algorithm Sensei Backend](https://github.com/philippspitzley/algorithm-sensei.git) to be running

### Installation

1. **Set up the backend first**

   ```bash
   git clone https://github.com/philippspitzley/algorithm-sensei.git
   cd algorithm-sensei
   # Follow the backend setup instructions in its README
   ```

2. **Clone the frontend repository**

   ```bash
   git clone https://github.com/philippspitzley/algorithm-samurai.git
   cd algorithm-samurai
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Fill in your backend url:

   - Backend API URL (default: `http://localhost:8000`)

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

> **Note**: Make sure the [Algorithm Sensei Backend](https://github.com/philippspitzley/algorithm-sensei.git) is running.

> **💡 Tip**: After backend changes (new routes, schemas, or data models), run `npm run generate:openapi` to update TypeScript types for full type safety. See more on [OpenAPI Integration](#openapi-integration)

### Development Scripts

| Command                    | Description                                |
| -------------------------- | ------------------------------------------ |
| `npm run dev`              | Start development server                   |
| `npm run build`            | Build for production (TypeScript + Vite)   |
| `npm run preview`          | Preview production build                   |
| `npm run lint`             | Run ESLint                                 |
| `npm run format`           | Format code with Prettier                  |
| `npm run check`            | Run formatting and linting (with auto-fix) |
| `npm run generate:openapi` | Generate TypeScript types from backend API |

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Admin/          # Admin-specific components
│   ├── Chapter/        # Chapter navigation and content
│   ├── CodeElements/   # Code editor and execution
│   ├── Courses/        # Course management
│   ├── Markdown/       # Markdown rendering
│   └── ui/             # Base UI components (shadcn/ui)
├── context/            # React context providers
│   ├── auth/          # Authentication context
│   ├── theme/         # Theme management
│   └── userCourses/   # User progress tracking
├── hooks/             # Custom React hooks
├── lib/               # Utility functions
├── pages/             # Page components
├── api/               # API client and types
└── types/             # TypeScript type definitions
```

## 🛠️ Technology Stack

### Frontend

- **React 19** - Modern UI library with latest features
- **TypeScript** - Type-safe JavaScript for better development experience
- **Vite** - Fast build tool and development server
- **TailwindCSS** - Utility-first CSS framework
- **Shadcn** - Component library with pre-styled Radix UI primitives

### Code Execution & AI

- **Monaco Editor** - VS Code-powered code editor
- **Piston API** - Secure code execution environment
- **Shiki** - Syntax highlighting for code blocks
- **Gemini AI Tutor** - Integration of AI-powered learning assistant from [Algorithm Sensei Backend](https://github.com/philippspitzley/algorithm-sensei.git)

### State Management & Data

- **TanStack Query** - Powerful data fetching and caching
- **React Hook Form** - Efficient form handling
- **Zod** - Runtime type validation
- **OpenAPI** - Type-safe API client generation from algorithm-sensei backend

### Development Tools

- **ESLint** - Code linting and quality checks
- **Prettier** - Code formatting
- **Husky** - Git hooks for quality assurance
- **OpenAPI TypeScript Generator** - Auto-generates type-safe API client from backend schemas

### OpenAPI Integration

This project uses **type-safe API communication** with the Algorithm Sensei backend through automatically generated TypeScript types.

#### How it works:

- The backend exposes an OpenAPI specification at `/api/v1/openapi.json`
- TypeScript types are automatically generated from backend schemas
- All API calls are fully type-safe with autocompletion and error checking

#### Generating API Types:

```bash
# Generate TypeScript types from backend OpenAPI schemas
npm run generate:openapi
```

#### When to regenerate types:

- **After backend API changes** - When new endpoints or data models are added

> **💡 Tip**: The generated types are located in `./src/api/openapi-schemas.d.ts` and should not be edited manually. If you run the backend without any changes there is no need to generate new types.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Built with ❤️</p>
</div>
