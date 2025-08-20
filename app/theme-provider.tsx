/**
 * THEME PROVIDER COMPONENT - This provides theme switching functionality using next-themes
 *
 * WHAT THIS FILE DOES:
 * - Wraps the next-themes ThemeProvider with custom configuration
 * - Enables light/dark mode switching throughout the application
 * - Integrates with system theme preferences automatically
 * - Provides theme context to all child components
 * - Manages theme persistence and transitions
 *
 * IMPORTANT FOR BEGINNERS:
 * - This is a client-side component that requires browser features
 * - It's a thin wrapper around the next-themes library
 * - All theme functionality comes from the next-themes package
 * - Changes here affect the entire application's theming
 * - This file enables the theme switching feature in your app
 *
 * TECHNOLOGIES USED:
 * - React (for component structure and context)
 * - Next.js (for client-side rendering)
 * - next-themes (for theme management and persistence)
 * - TypeScript (for type safety with ThemeProviderProps)
 * - Context API (for theme state distribution)
 * - CSS variables (for theme-based styling)
 */

// Mark this as a client-side component
// This is required because theme switching uses browser APIs and localStorage
"use client";

// Import React for component creation
import * as React from "react";

// Import the ThemeProvider from next-themes library
// This provides all the theme switching functionality
import { ThemeProvider as NextThemesProvider } from "next-themes";

// Import the type definition for theme provider props
// This ensures proper TypeScript type checking
import type { ThemeProviderProps } from "next-themes";

/**
 * THEME PROVIDER FUNCTION
 *
 * This component is a thin wrapper around the next-themes ThemeProvider.
 * It passes through all props and children to enable theme switching
 * throughout the application.
 *
 * BEGINNER TIP: Think of this as a "theme bridge" that connects
 * the next-themes library to your application components.
 *
 * Props: children, ...props - All props from ThemeProviderProps interface
 * Returns: JSX with next-themes provider wrapping children
 * Usage: Wrapped around your app in the Providers component
 *
 * Functionality provided by next-themes:
 * - Light/dark mode switching
 * - System theme preference detection
 * - Theme persistence in localStorage
 * - Smooth theme transitions
 * - CSS variable management
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  //
  // COMPONENT RENDERING
  //
  // Return the next-themes ThemeProvider with all props spread
  // This enables all theme functionality while maintaining type safety

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
