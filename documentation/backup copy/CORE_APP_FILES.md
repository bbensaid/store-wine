# Core App Files - Complete Source Code & Documentation

## Table of Contents

1. [Root Layout](#root-layout)
2. [Home Page](#home-page)
3. [Providers](#providers)
4. [Theme Provider](#theme-provider)
5. [Global Styles](#global-styles)
6. [Middleware](#middleware)

## Root Layout

### app/layout.tsx

**Purpose**: Main application wrapper and metadata configuration
**Location**: `/app/layout.tsx`

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "./theme-provider";
import { Providers } from "./providers";
import Navbar from "@/components/navbar/Navbar";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wine Store",
  description: "Premium wines from around the world",
  keywords: ["wine", "premium", "store", "ecommerce"],
  authors: [{ name: "Wine Store Team" }],
  creator: "Wine Store",
  publisher: "Wine Store",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://wine-store.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Wine Store",
    description: "Premium wines from around the world",
    url: "https://wine-store.com",
    siteName: "Wine Store",
    images: [
      {
        url: "https://wine-store.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Wine Store",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wine Store",
    description: "Premium wines from around the world",
    images: ["https://wine-store.com/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Providers>
              <div className="min-h-screen bg-background">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Toaster />
              </div>
            </Providers>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
```

**Layout Structure Explained**:

- **ClerkProvider**: Wraps the entire app for authentication
- **ThemeProvider**: Enables dark/light mode switching
- **Providers**: Context providers for state management
- **Navbar**: Global navigation component
- **Toaster**: Notification system for user feedback
- **Metadata**: Comprehensive SEO and social media optimization

**Key Features**:

- **SEO Optimized**: Rich metadata for search engines
- **Social Media Ready**: OpenGraph and Twitter card support
- **Accessibility**: Proper lang attribute and semantic structure
- **Responsive**: Mobile-first design approach

## Home Page

### app/page.tsx

**Purpose**: Main landing page of the application
**Location**: `/app/page.tsx`

```tsx
import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import HeroCarousel from "@/components/home/HeroCarousel";

export default function HomePage() {
  return (
    <div className="space-y-16">
      <Hero />
      <HeroCarousel />
      <FeaturedProducts />
    </div>
  );
}
```

**Page Structure Explained**:

- **Hero**: Main banner section with call-to-action
- **HeroCarousel**: Rotating featured content
- **FeaturedProducts**: Showcase of premium wines
- **Spacing**: Consistent vertical rhythm with `space-y-16`

## Providers

### app/providers.tsx

**Purpose**: Context providers for global state management
**Location**: `/app/providers.tsx`

```tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

**Providers Explained**:

- **QueryClient**: React Query for server state management
- **Stale Time**: Data considered fresh for 1 minute
- **DevTools**: Development-only query inspector
- **Client-Side**: Marked as client component for browser APIs

## Theme Provider

### app/theme-provider.tsx

**Purpose**: Dark/light mode theme switching
**Location**: `/app/theme-provider.tsx`

```tsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

**Theme Provider Explained**:

- **next-themes**: Popular theme switching library
- **Client Component**: Requires browser APIs for theme detection
- **System Default**: Automatically detects user's system preference
- **Persistent**: Remembers user's theme choice

## Global Styles

### app/globals.css

**Purpose**: Global CSS styles and Tailwind directives
**Location**: `/app/globals.css`

```css
@import "tailwindcss";

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-muted;
}

::-webkit-scrollbar-thumb {
  @apply bg-muted-foreground/50 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-muted-foreground;
}

/* Custom focus styles */
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2;
}

/* Custom animations */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fade-in 0.3s ease-out;
}

/* Wine-specific styles */
.wine-gradient {
  background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
}

.wine-text {
  @apply text-wine-600 dark:text-wine-400;
}

.wine-border {
  @apply border-wine-200 dark:border-wine-700;
}

/* Responsive utilities */
.container-responsive {
  @apply mx-auto max-w-7xl px-4 sm:px-6 lg:px-8;
}

/* Loading states */
.skeleton {
  @apply animate-pulse bg-muted rounded;
}

.skeleton-text {
  @apply skeleton h-4 w-full;
}

.skeleton-image {
  @apply skeleton aspect-square w-full;
}

/* Button variants */
.btn-primary {
  @apply bg-primary text-primary-foreground hover:bg-primary/90 focus-ring px-4 py-2 rounded-md font-medium transition-colors;
}

.btn-secondary {
  @apply bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-ring px-4 py-2 rounded-md font-medium transition-colors;
}

.btn-outline {
  @apply border border-input bg-background hover:bg-accent hover:text-accent-foreground focus-ring px-4 py-2 rounded-md font-medium transition-colors;
}

/* Form styles */
.form-input {
  @apply flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50;
}

.form-label {
  @apply text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70;
}

.form-error {
  @apply text-sm text-destructive;
}

/* Card styles */
.card-hover {
  @apply transition-all duration-200 hover:shadow-lg hover:-translate-y-1;
}

.card-border {
  @apply border border-border bg-card text-card-foreground shadow-sm;
}

/* Grid layouts */
.grid-responsive {
  @apply grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4;
}

.grid-featured {
  @apply grid grid-cols-1 gap-8 lg:grid-cols-2;
}

/* Typography */
.heading-1 {
  @apply scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl;
}

.heading-2 {
  @apply scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0;
}

.heading-3 {
  @apply scroll-m-20 text-2xl font-semibold tracking-tight;
}

.heading-4 {
  @apply scroll-m-20 text-xl font-semibold tracking-tight;
}

.paragraph {
  @apply leading-7 [&:not(:first-child)]:mt-6;
}

.lead {
  @apply text-xl text-muted-foreground;
}

.large {
  @apply text-lg font-semibold;
}

.small {
  @apply text-sm font-medium leading-none;
}

.muted {
  @apply text-sm text-muted-foreground;
}

/* Interactive elements */
.interactive {
  @apply cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95;
}

.interactive-text {
  @apply transition-colors hover:text-primary;
}

/* Status indicators */
.status-success {
  @apply text-green-600 dark:text-green-400;
}

.status-warning {
  @apply text-yellow-600 dark:text-yellow-400;
}

.status-error {
  @apply text-red-600 dark:text-red-400;
}

.status-info {
  @apply text-blue-600 dark:text-blue-400;
}

/* Loading spinners */
.spinner {
  @apply animate-spin rounded-full border-2 border-current border-t-transparent;
}

.spinner-sm {
  @apply spinner h-4 w-4;
}

.spinner-md {
  @apply spinner h-6 w-6;
}

.spinner-lg {
  @apply spinner h-8 w-8;
}
```

**Global Styles Explained**:

- **CSS Variables**: Light/dark theme color schemes
- **Tailwind Directives**: Base, components, and utilities layers
- **Custom Utilities**: Wine-specific styling classes
- **Responsive Design**: Mobile-first approach
- **Accessibility**: Focus states and keyboard navigation
- **Performance**: Optimized animations and transitions

## Middleware

### middleware.ts

**Purpose**: Request/response processing and authentication
**Location**: `/middleware.ts`

```typescript
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/products",
    "/products/(.*)",
    "/about",
    "/api/products",
    "/api/carousel",
  ],
  ignoredRoutes: ["/api/webhook", "/_next", "/favicon.ico"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

**Middleware Explained**:

- **Public Routes**: Pages accessible without authentication
- **Ignored Routes**: Routes that bypass middleware completely
- **Matcher Pattern**: Regex pattern for route matching
- **Authentication**: Clerk handles user verification

### middleware0.ts (Alternative)

**Purpose**: Alternative middleware configuration
**Location**: `/middleware0.ts`

```typescript
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/products",
    "/products/(.*)",
    "/about",
    "/api/products",
    "/api/carousel",
    "/api/webhook",
  ],
  ignoredRoutes: ["/_next", "/favicon.ico", "/api/webhook"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

**Alternative Configuration**:

- **Webhook Public**: Allows Stripe webhook access
- **Flexible Routing**: More permissive public access
- **Development Friendly**: Easier testing and development

---

These core app files provide the foundation for the Wine Store application. They handle:

- **Application Structure**: Layout and routing
- **Global State**: Context providers and state management
- **Styling**: CSS variables and utility classes
- **Authentication**: Route protection and user management
- **SEO**: Metadata and social media optimization
