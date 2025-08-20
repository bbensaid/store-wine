/**
 * PROVIDERS COMPONENT - This provides context providers for theming, notifications, and global state
 *
 * WHAT THIS FILE DOES:
 * - Wraps the application with necessary context providers
 * - Manages theme switching (light/dark/system preference)
 * - Provides toast notification system for user feedback
 * - Ensures consistent theming across all components
 * - Sets up global state management for the application
 *
 * IMPORTANT FOR BEGINNERS:
 * - This is a client-side component that wraps the entire app
 * - It must be placed in the layout to affect all child components
 * - Theme provider manages light/dark mode switching
 * - Toaster provides notification system for user feedback
 * - Changes here affect the entire application's behavior
 *
 * TECHNOLOGIES USED:
 * - React (for component structure and context providers)
 * - Next.js (for client-side rendering and app structure)
 * - TypeScript (for type safety with children prop)
 * - Theme provider (for light/dark mode management)
 * - Sonner (for toast notifications and user feedback)
 * - Context API (for global state management)
 */

// Mark this as a client-side component
// This is required because it uses browser-specific features like theme detection
"use client";

// Import the theme provider for light/dark mode switching
import { ThemeProvider } from "./theme-provider";

// Import the toast notification system
import { Toaster } from "@/components/ui/sonner";

/**
 * PROVIDERS COMPONENT FUNCTION
 *
 * This component wraps the entire application with necessary context providers.
 * It ensures that all child components have access to theme switching,
 * notifications, and other global functionality.
 *
 * BEGINNER TIP: Think of this as a "wrapper" that gives all your
 * components access to shared features like themes and notifications.
 *
 * Props: children - React components to be wrapped with providers
 * Returns: JSX with providers wrapping the children
 * Usage: Wraps the entire app in layout.tsx
 *
 * Structure:
 * 1. Toaster - Provides notification system
 * 2. ThemeProvider - Manages light/dark mode
 * 3. Children - Your actual application components
 */
function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* 
        TOAST NOTIFICATION SYSTEM
        This component provides the toast notification infrastructure.
        It handles displaying success, error, and info messages to users.
        No props needed - it works automatically throughout the app.
      */}
      <Toaster />

      {/* 
        THEME PROVIDER
        This component manages the application's theme system.
        It handles light mode, dark mode, and system preference detection.
        All child components can access and change the current theme.
        
        Props breakdown:
        - attribute="class" - Apply theme as CSS class on <html> element
        - defaultTheme="system" - Start with user's system preference
        - enableSystem - Allow automatic theme switching based on system
        - disableTransitionOnChange - Prevent animation during theme switches
      */}
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {/* 
          CHILDREN COMPONENTS
          This is where your actual application components are rendered.
          They all inherit the theme context and can access notifications.
          The entire app structure goes here.
        */}
        {children}
      </ThemeProvider>
    </>
  );
}

// Export the Providers component as the default export
// This allows it to be imported and used in layout.tsx
export default Providers;
