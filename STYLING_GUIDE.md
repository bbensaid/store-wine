# Styling Guide - Store Wine Application

## Overview
This document outlines the consistent styling system implemented across the Store Wine application. All UI components follow a unified design language based on the "Wine Type" pulldown menu reference styling and the "Wines" button reference styling.

## Reference Styling

### Dropdown/Select Reference
The "Wine Type" pulldown menu in `components/products/FilterSidebar.tsx` serves as the reference for all dropdown/select components:

```tsx
<SelectTrigger className="text-primary border border-primary/20">
  <SelectValue placeholder="Select type" className="text-primary" />
</SelectTrigger>
<SelectContent>
  <SelectItem value="all" className="text-primary">All Types</SelectItem>
</SelectContent>
```

### Button Reference
The "Wines" button in `components/navbar/Navbar.tsx` serves as the reference for all button components:

```tsx
<Button
  className={
    "flex items-center gap-1 sm:gap-2 hover:bg-gray-100 hover:text-primary hover:border-primary active:bg-gray-200 active:text-primary active:border-primary text-sm sm:text-base font-normal border border-primary/20 bg-white text-primary " +
    (active ? "bg-gray-200 text-primary border-gray-400" : "")
  }
>
  <LuWine className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
  <span className="hidden sm:inline">Wines</span>
</Button>
```

### Card Reference
The "Home" button in `components/navbar/Navbar.tsx` serves as the reference for all card border styling:

```tsx
<Button className="border border-primary/20 bg-white text-primary">
  Home
</Button>
```

## Consistent Styling Classes

### Text Color Consistency - CRITICAL RULE
- **All text** throughout the application uses `text-primary` color
- **All placeholders** use `placeholder:text-primary`
- **All headings, titles, descriptions, prices, and content text** use `text-primary`
- **NEVER use hardcoded colors** like `text-[#8B0015]` or `text-[#2D2D2D]`
- **NEVER use semantic colors** like `text-muted-foreground` or `text-foreground` for content

### Card Border Consistency - CRITICAL RULE
- **All cards** throughout the application use `border border-primary/20` (same as "Home" button)
- **All Card components** must include `border border-primary/20` in their className
- **NEVER use hardcoded border colors** like `border-gray-300`
- **NEVER use semantic border colors** like `border-border` for cards
- **Exception**: Only use different border colors for special UI elements (not content cards)

### Dropdown/Select Components
- **Trigger**: `text-primary border border-primary/20`
- **Content**: `text-primary border border-primary/20`
- **Items**: `text-primary`
- **Icons**: `text-primary`

### Button Components
- **Primary Button**: `flex items-center gap-1 sm:gap-2 hover:bg-gray-100 hover:text-primary hover:border-primary active:bg-gray-200 active:text-primary active:border-primary text-sm sm:text-base font-normal border border-primary/20 bg-white text-primary`
- **Active State**: `bg-gray-200 text-primary border-gray-400`
- **Disabled State**: `disabled:opacity-50 disabled:cursor-not-allowed`
- **Icons**: `text-primary` (always primary color, even when active)

### Card Components
- **Base Card**: `border border-primary/20` (same as "Home" button)
- **Product Cards**: `border border-primary/20` with additional styling
- **Loading Cards**: `border border-primary/20`
- **Hero Cards**: `border border-primary/20`

### Input Components
- **Base Input**: `text-primary placeholder:text-primary border border-primary/20`

### Label Components
- **Base Label**: `text-primary`

### Text Components
- **All Headings**: `text-primary` (h1, h2, h3, h4, h5, h6)
- **All Paragraphs**: `text-primary`
- **All Descriptions**: `text-primary`
- **All Prices**: `text-primary`
- **All Product Names**: `text-primary`
- **All Product Types**: `text-primary`
- **All Product Details**: `text-primary`

## Utility Classes
All consistent styling classes are available in `lib/utils.ts` under the `uiStyles` object:

```tsx
import { uiStyles } from "@/lib/utils"

// Usage examples:
className={uiStyles.dropdown.trigger}
className={uiStyles.button.primary}
className={uiStyles.input.base}
```

## Components Updated

### Card Border Updates
1. **ProductsGrid.tsx** - Product grid cards
2. **ProductsList.tsx** - Product list cards
3. **app/products/[id]/page.tsx** - Single product page card
4. **HeroCarousel.tsx** - Hero carousel card
5. **LoadingContainer.tsx** - Loading skeleton cards

### Text Color Updates
1. **NavSearch.tsx** - Search input text and placeholder
2. **ProductsGrid.tsx** - Product titles, types, and prices
3. **ProductsList.tsx** - Product titles, descriptions, and details
4. **app/products/[id]/page.tsx** - Single product page text
5. **SectionTitle.tsx** - Section headings
6. **Hero.tsx** - Brand name, slogan, and body text
7. **HeroCarousel.tsx** - Carousel button text and icons
8. **app/about/page.tsx** - About page text
9. **app/products/page.tsx** - "Showing wines" and "Page" text
10. **app/not-found.tsx** - Not found page text
11. **BreadCrumbs.tsx** - Breadcrumb navigation text
12. **ProductRating.tsx** - Rating text and star icon
13. **EmptyList.tsx** - Empty state heading text

### Dropdown/Select Components
1. **FilterSidebar.tsx** - All Select components (reference)
2. **UserMenu.tsx** - User dropdown menu
3. **Navbar.tsx** - Wines and Customer Service dropdowns
4. **Navbar0.tsx** - Wines, Customer Service, and Mode dropdowns
5. **LinksDropdown.tsx** - Menu dropdown
6. **DarkMode.tsx** - Theme toggle dropdown

### Button Components
1. **Navbar.tsx** - All navigation buttons (reference)
2. **Navbar0.tsx** - All navigation and mobile drawer buttons
3. **AddToCart.tsx** - Add to cart button
4. **FavoriteToggleButton.tsx** - Favorite toggle button
5. **Buttons.tsx** - Form submit buttons and card buttons
6. **ProductsLayoutClient.tsx** - Mobile drawer buttons
7. **app/products/page.tsx** - Previous/Next and Grid/List buttons (already had correct styling)

## Color Scheme
- **Primary Color**: `text-primary` (wine red theme)
- **Border Color**: `border-primary/20` (20% opacity of primary)
- **Card Border**: `border-primary/20` (same as button borders)
- **Background**: `bg-white` for light theme
- **Hover States**: `hover:bg-gray-100` for subtle interaction
- **Active States**: `bg-gray-200 text-primary border-gray-400`

## Key Styling Rules

### Text Color Consistency - CRITICAL RULE
- **All text** throughout the application uses `text-primary` color
- **All placeholders** use `placeholder:text-primary`
- **All headings, titles, descriptions, prices, and content text** use `text-primary`
- **NEVER use hardcoded colors** like `text-[#8B0015]` or `text-[#2D2D2D]`
- **NEVER use semantic colors** like `text-muted-foreground` or `text-foreground` for content
- **Exception**: Only use `text-white` for text on primary backgrounds (buttons, badges)

### Card Border Consistency - CRITICAL RULE
- **All cards** throughout the application use `border border-primary/20` (same as "Home" button)
- **All Card components** must include `border border-primary/20` in their className
- **NEVER use hardcoded border colors** like `border-gray-300`
- **NEVER use semantic border colors** like `border-border` for cards
- **Exception**: Only use different border colors for special UI elements (not content cards)

### Button Styling Rules
1. **All buttons** use the same base styling as the "Wines" button
2. **All icons** are always `text-primary` color (never change on active state)
3. **Active states** use `bg-gray-200 text-primary border-gray-400` (not white text)
4. **Hover states** use `hover:bg-gray-100 hover:text-primary hover:border-primary`
5. **Active states** use `active:bg-gray-200 active:text-primary active:border-primary`

### Icon Color Consistency - CRITICAL RULE
- **All icons** in buttons, dropdowns, and other components use `text-primary`
- **Icons NEVER change color** when buttons are active or hovered
- **NEVER use conditional icon colors** like `${active ? "text-white" : "text-primary"}`
- **Exception**: Only use `text-white` for icons when absolutely necessary for contrast (e.g., badges, notifications)

### Common Mistakes to Avoid
- ❌ `className={active ? "text-white" : "text-primary"}` - Icons should never change color
- ❌ `bg-primary text-white` for active button states - Use `bg-gray-200 text-primary` instead
- ❌ Conditional icon styling based on button state
- ❌ `text-[#8B0015]` or `text-[#2D2D2D]` - Use `text-primary` instead
- ❌ `text-muted-foreground` for content text - Use `text-primary` instead
- ❌ `border-gray-300` for cards - Use `border-primary/20` instead
- ❌ `border-border` for cards - Use `border-primary/20` instead
- ✅ Always use `text-primary` for icons regardless of button state
- ✅ Always use `text-primary` for all content text
- ✅ Always use `border-primary/20` for all card borders

## Maintenance Guidelines

### Adding New Card Components
1. Use `border border-primary/20` for all card borders (same as "Home" button)
2. Import `uiStyles` from `@/lib/utils` for consistency
3. **NEVER** use hardcoded border colors like `border-gray-300`
4. **NEVER** use semantic border colors like `border-border` for cards

### Adding New Text Components
1. Use `text-primary` for all text content
2. Use `placeholder:text-primary` for all placeholders
3. Import `uiStyles` from `@/lib/utils` for consistency
4. **NEVER** use hardcoded colors or semantic colors for content

### Adding New Button Components
1. Use the "Wines" button styling as reference
2. Import `uiStyles` from `@/lib/utils` for consistency
3. Apply `text-primary` to all icons
4. Use the established hover and active states
5. **NEVER** make icons change color on button state changes

### Adding New Dropdown Components
1. Use the "Wine Type" dropdown styling as reference
2. Import `uiStyles` from `@/lib/utils` for consistency
3. Apply `text-primary` to all text elements
4. Apply `border-primary/20` to borders

### Updating Existing Components
1. Replace hardcoded colors with `text-primary`
2. Replace hardcoded borders with `border-primary/20`
3. Use the utility classes from `uiStyles` when possible
4. Ensure all icons use `text-primary`
5. **Check for and remove any conditional icon color changes**
6. **Check for and remove any hardcoded text colors**
7. **Check for and remove any hardcoded card border colors**

### Theme Consistency
- All interactive elements should use the primary color scheme
- All text content should use `text-primary`
- All card borders should use `border-primary/20`
- Maintain consistent spacing and typography
- Use the established hover and active states
- Keep icon colors consistent across all states
- **Icons must remain `text-primary` in all button states**
- **Text must remain `text-primary` throughout the application**
- **Card borders must remain `border-primary/20` throughout the application**

## Future Improvements
- Consider creating reusable styled components
- Implement CSS custom properties for easier theme switching
- Add dark mode variants for all components
- Create component-specific styling variants if needed 