/**
 * TAILWIND CSS CONFIGURATION - This configures the Tailwind CSS framework for the wine store
 *
 * WHAT THIS FILE DOES:
 * - Configures Tailwind CSS framework settings and behavior
 * - Defines which files to scan for CSS class usage
 * - Sets up custom theme extensions and color schemes
 * - Configures plugins and additional functionality
 * - Controls how Tailwind generates the final CSS
 *
 * IMPORTANT FOR BEGINNERS:
 * - This is the "control center" for Tailwind CSS in your app
 * - Changes here affect how CSS classes are generated
 * - Content paths determine which files Tailwind scans for classes
 * - Theme extensions add custom colors, spacing, and other values
 * - This file is processed by the Tailwind build system
 *
 * TECHNOLOGIES USED:
 * - Tailwind CSS (for utility-first CSS framework)
 * - JavaScript modules (ES6 module syntax)
 * - PostCSS (for CSS processing and optimization)
 * - Content scanning (for purging unused CSS)
 * - Theme customization (for brand colors and design tokens)
 */

/**
 * TAILWIND CONFIGURATION OBJECT
 *
 * This is the main configuration object that Tailwind CSS uses
 * to understand how to build your CSS and what features to include.
 *
 * @type {import('tailwindcss').Config} - TypeScript type annotation for IDE support
 * export default - ES6 module export for modern JavaScript
 */
export default {
  //
  // CONTENT SCANNING CONFIGURATION
  //
  // This tells Tailwind which files to scan for CSS class usage.
  // Only classes found in these files will be included in the final CSS.
  // This is crucial for production builds to keep CSS file sizes small.
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // All files in the app directory (Next.js App Router)
    "./components/**/*.{js,ts,jsx,tsx}", // All component files
    "./pages/**/*.{js,ts,jsx,tsx}", // All page files (if using Pages Router)
    "./lib/**/*.{js,ts,jsx,tsx}", // All utility and library files
  ],

  //
  // THEME CONFIGURATION
  //
  // This section allows you to extend or override Tailwind's default theme.
  // You can add custom colors, spacing, fonts, breakpoints, and more.
  theme: {
    extend: {
      //
      // CUSTOM COLOR PALETTE
      //
      // You can add custom colors here that match your brand:
      // colors: {
      //   primary: {
      //     50: '#fef2f2',
      //     100: '#fee2e2',
      //     500: '#ef4444',
      //     900: '#7f1d1d',
      //   }
      // }
      //
      // CUSTOM SPACING
      //
      // You can add custom spacing values:
      // spacing: {
      //   '18': '4.5rem',
      //   '88': '22rem',
      // }
      //
      // CUSTOM FONTS
      //
      // You can add custom font families:
      // fontFamily: {
      //   'cinzel': ['Cinzel', 'serif'],
      //   'cormorant': ['Cormorant Garamond', 'serif'],
      // }
      //
      // CUSTOM BREAKPOINTS
      //
      // You can add custom responsive breakpoints:
      // screens: {
      //   'xs': '475px',
      //   '3xl': '1600px',
      // }
    },
  },

  //
  // PLUGINS CONFIGURATION
  //
  // This array allows you to add Tailwind plugins for additional functionality.
  // Plugins can add new utilities, components, or modify existing behavior.
  plugins: [
    //
    // AVAILABLE PLUGINS YOU COULD ADD:
    //
    // @tailwindcss/forms - Better form element styling
    // @tailwindcss/typography - Rich text content styling
    // @tailwindcss/aspect-ratio - Aspect ratio utilities
    // @tailwindcss/line-clamp - Text truncation utilities
    //
    // Example plugin usage:
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
  ],
};
