# VINEFOX Component Architecture & Implementation Guide

## 🏗️ Component Architecture Overview

**Current Version:** vinefox (5f3b53c)  
**Framework:** React/Next.js 15.3.1 with App Router  
**Component Library:** Radix UI + Custom Tailwind Components

---

## 📁 Component Directory Structure

```
components/
├── auth/                   # Authentication components
│   ├── CustomSignIn.tsx   # Custom sign-in form
│   └── UserButtonWrapper.tsx # User menu wrapper
├── cart/                   # Shopping cart components
│   ├── CartItemColumns.tsx # Cart item display columns
│   ├── CartItemsList.tsx   # Cart items list component
│   ├── CartTotals.tsx      # Cart totals and calculations
│   └── ThirdColumn.tsx     # Cart third column layout
├── form/                   # Form components
│   ├── Buttons.tsx         # Form button components
│   └── FormContainer.tsx   # Form container wrapper
├── global/                 # Global utility components
│   ├── Container.tsx       # Page container component
│   ├── EmptyList.tsx       # Empty state component
│   ├── LoadingContainer.tsx # Loading state wrapper
│   ├── LoadingTable.tsx    # Table loading component
│   └── SectionTitle.tsx    # Section title component
├── home/                   # Homepage components
│   ├── FeaturedProducts.tsx # Featured products section
│   ├── Hero.tsx            # Hero section with carousel
│   ├── HeroCarousel.tsx    # Hero carousel component
│   └── HeroTransition.tsx  # Hero transition effects
├── navbar/                 # Navigation components
│   ├── CartButton.tsx      # Cart button with count
│   ├── DarkMode.tsx        # Dark mode toggle
│   ├── LinksDropdown.tsx   # Links dropdown menu
│   ├── Logo.tsx            # Logo component
│   ├── MenuDropdown.tsx    # Mobile menu dropdown
│   ├── MobileMenu.tsx      # Mobile navigation menu
│   ├── Navbar.tsx          # Main navigation bar
│   ├── NavSearch.tsx       # Navigation search component
│   ├── SignOutLink.tsx     # Sign out link
│   ├── UserIcon.tsx        # User icon component
│   └── UserMenu.tsx        # User menu dropdown
├── products/               # Product display components
│   ├── FavoredToggleForm.tsx # Favorite toggle form
│   ├── FavoriteToggleButton.tsx # Favorite toggle button
│   ├── FavoriteToggleButtonOptimized.tsx # Optimized favorite toggle
│   ├── FilterSidebar.tsx   # Product filter sidebar
│   ├── ProductsContainer.tsx # Products container wrapper
│   ├── ProductsGrid.tsx    # Products grid display
│   ├── ProductsGridWithAuth.tsx # Auth-aware products grid
│   ├── ProductsLayoutClient.tsx # Client-side products layout
│   └── ProductsList.tsx    # Products list display
├── single-product/         # Single product components
│   ├── AddToCart.tsx       # Add to cart component
│   ├── BreadCrumbs.tsx     # Breadcrumb navigation
│   ├── ProductRating.tsx   # Product rating display
│   ├── ReviewForm.tsx      # Review submission form
│   ├── ReviewsList.tsx     # Reviews list display
│   └── SelectProductAmount.tsx # Product quantity selector
└── ui/                     # Base UI components
    ├── alert.tsx           # Alert component
    ├── breadcrumb.tsx      # Breadcrumb component
    ├── button.tsx          # Button component
    ├── card.tsx            # Card component
    ├── carousel.tsx        # Carousel component
    ├── checkbox.tsx        # Checkbox component
    ├── drawer.tsx          # Drawer component
    ├── dropdown-menu.tsx   # Dropdown menu component
    ├── input.tsx           # Input component
    ├── label.tsx           # Label component
    ├── popover.tsx         # Popover component
    ├── select.tsx          # Select component
    ├── separator.tsx       # Separator component
    ├── skeleton.tsx        # Skeleton loading component
    ├── sonner.tsx          # Toast notification component
    ├── table.tsx           # Table component
    └── textarea.tsx        # Textarea component
```

---

## 🔑 Core Component Implementation Details

### 1. Navigation System (`components/navbar/`)

#### Main Navbar Component (`Navbar.tsx`)

**Key Features:**

- **Sticky Positioning:** `sticky top-0 z-50` for persistent navigation
- **Responsive Design:** Mobile-first with desktop optimization
- **Logo Management:** Separate desktop/mobile logo handling to prevent double logo issues
- **Search Integration:** Full-width search bar with responsive sizing
- **User Authentication:** Clerk integration with user menu and cart access

**Critical Implementation Details:**

```tsx
// Desktop Logo - hidden on mobile to prevent double logo issue
<div className="hidden md:flex items-center">
  <div className="border border-primary/60 shadow-lg bg-white px-3 md:px-4 py-2 flex items-center rounded-xl transition-all duration-200 hover:shadow-xl hover:border-primary/80">
    <Link href="/" className="flex items-center">
      <Image
        src="/images/logo.png"
        alt="Wine Store Logo"
        width={32}
        height={32}
        className="h-6 md:h-8 w-auto flex-shrink-0"
      />
      <span
        className={`${cinzel.className} text-sm md:text-lg font-bold tracking-widest text-primary ml-2 whitespace-nowrap`}
      >
        VINEFOX
      </span>
    </Link>
  </div>
</div>
```

**Mobile Menu Implementation:**

- **Drawer Component:** Uses Vaul drawer for mobile navigation
- **Touch Optimization:** Touch-friendly button sizes and interactions
- **Responsive Breakpoints:** Proper mobile/desktop transitions

#### Cart Button Component (`CartButton.tsx`)

**Key Features:**

- **Real-time Count:** Displays current cart item count
- **Authentication Check:** Only shows for authenticated users
- **Optimized Rendering:** Prevents unnecessary re-renders
- **Accessibility:** Proper ARIA labels and keyboard navigation

**Implementation Highlights:**

```tsx
// Optimized cart count display with authentication check
const { data: cart } = useQuery({
  queryKey: ["cart"],
  queryFn: () => getCart(),
  enabled: !!userId, // Only fetch when user is authenticated
});
```

### 2. Product Management System (`components/products/`)

#### Products Grid Component (`ProductsGrid.tsx`)

**Key Features:**

- **Responsive Grid:** CSS Grid with responsive breakpoints
- **Image Optimization:** Next.js Image component with WebP format
- **Lazy Loading:** Intersection Observer for performance
- **Filter Integration:** Real-time filtering and sorting

**Performance Optimizations:**

```tsx
// Lazy loading with Intersection Observer
const [isVisible, setIsVisible] = useState(false);
const ref = useRef<HTMLDivElement>(null);

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    },
    { threshold: 0.1 }
  );

  if (ref.current) {
    observer.observe(ref.current);
  }

  return () => observer.disconnect();
}, []);
```

#### Filter Sidebar Component (`FilterSidebar.tsx`)

**Key Features:**

- **Dynamic Filtering:** Real-time filter updates
- **Price Range:** Slider-based price filtering
- **Region Selection:** Multi-select region filtering
- **Wine Type Filtering:** Comprehensive wine type categorization

**Filter Implementation:**

```tsx
// Real-time filter updates with debouncing
const debouncedFilters = useDebounce(filters, 300);

useEffect(() => {
  if (debouncedFilters !== filters) {
    setFilters(debouncedFilters);
  }
}, [debouncedFilters, filters]);
```

### 3. Shopping Cart System (`components/cart/`)

#### Cart Items List (`CartItemsList.tsx`)

**Key Features:**

- **Real-time Updates:** Optimistic updates with server validation
- **Quantity Management:** Input fields with +/- buttons for better UX
- **Price Calculations:** Automatic tax and shipping calculations
- **Responsive Design:** Mobile-optimized cart interface

**UX Improvements:**

```tsx
// Quantity input with +/- buttons for better mobile experience
<div className="flex items-center gap-2">
  <Button
    variant="outline"
    size="sm"
    onClick={() => handleQuantityChange(item.id, item.amount - 1)}
    disabled={item.amount <= 1}
    className="h-8 w-8 p-0"
  >
    <Minus className="h-4 w-4" />
  </Button>

  <Input
    type="number"
    value={item.amount}
    onChange={(e) =>
      handleQuantityChange(item.id, parseInt(e.target.value) || 1)
    }
    className="w-16 text-center h-8"
    min="1"
  />

  <Button
    variant="outline"
    size="sm"
    onClick={() => handleQuantityChange(item.id, item.amount + 1)}
    className="h-8 w-8 p-0"
  >
    <Plus className="h-4 w-4" />
  </Button>
</div>
```

#### Cart Totals Component (`CartTotals.tsx`)

**Key Features:**

- **Real-time Calculations:** Automatic tax, shipping, and total updates
- **Currency Formatting:** Proper price display and formatting
- **Responsive Layout:** Mobile-optimized totals display
- **Checkout Integration:** Seamless checkout flow

**Calculation Logic:**

```tsx
// Tax and shipping calculations
const taxRate = 0.1; // 10% tax rate
const shippingCost = 5; // $5 shipping

const subtotal = cartItems.reduce(
  (sum, item) => sum + item.wine.price * item.amount,
  0
);
const tax = Math.round(subtotal * taxRate);
const total = subtotal + tax + shippingCost;
```

### 4. Single Product Components (`components/single-product/`)

#### Add to Cart Component (`AddToCart.tsx`)

**Key Features:**

- **Quantity Selection:** User-friendly quantity input
- **Stock Validation:** Real-time inventory checking
- **Optimistic Updates:** Immediate UI feedback
- **Error Handling:** Comprehensive error management

**Implementation Details:**

```tsx
// Optimistic cart update with error handling
const handleAddToCart = async () => {
  try {
    // Optimistic update
    setCartCount((prev) => prev + quantity);

    // Server update
    await addToCart(wineId, quantity);

    // Success feedback
    toast.success("Added to cart successfully!");
  } catch (error) {
    // Revert optimistic update on error
    setCartCount((prev) => prev - quantity);
    toast.error("Failed to add to cart. Please try again.");
  }
};
```

#### Review System Components

**Review Form (`ReviewForm.tsx`):**

- **Authenticated Users Only:** Clerk integration for user verification
- **Rating System:** 1-5 star rating with visual feedback
- **Form Validation:** Comprehensive input validation
- **Vintage Tracking:** Optional vintage year specification

**Reviews List (`ReviewsList.tsx`):**

- **Pagination:** Efficient review loading and display
- **User Information:** Author details and profile images
- **Rating Display:** Visual star rating representation
- **Moderation System:** Admin approval workflow

### 5. Homepage Components (`components/home/`)

#### Hero Section (`Hero.tsx`)

**Key Features:**

- **Carousel Integration:** Embla carousel for image rotation
- **Responsive Design:** Mobile-optimized hero layout
- **Call-to-Action:** Strategic button placement and sizing
- **Performance Optimization:** Lazy loading and image optimization

**Carousel Implementation:**

```tsx
// Embla carousel with responsive breakpoints
const [emblaRef] = useEmblaCarousel({
  loop: true,
  align: "start",
  skipSnaps: false,
  dragFree: true,
  containScroll: "trimSnaps",
  breakpoints: {
    "(min-width: 768px)": { slidesToScroll: 1, slidesToShow: 1 },
    "(min-width: 1024px)": { slidesToScroll: 1, slidesToShow: 1 },
  },
});
```

#### Featured Products (`FeaturedProducts.tsx`)

**Key Features:**

- **Dynamic Loading:** Server-side featured product selection
- **Performance Optimization:** Efficient data fetching
- **Responsive Grid:** CSS Grid with responsive breakpoints
- **Image Optimization:** WebP format with proper sizing

---

## 🎨 UI Component System (`components/ui/`)

### Design System Foundation

**Radix UI Integration:**

- **Accessibility First:** Built-in accessibility features
- **Unstyled Components:** Clean slate for custom styling
- **Composition Pattern:** Flexible component composition
- **TypeScript Support:** Full type safety and IntelliSense

**Custom Styling with Tailwind:**

- **Design Tokens:** Consistent color, spacing, and typography
- **Component Variants:** Flexible component styling options
- **Responsive Design:** Mobile-first responsive utilities
- **Dark Mode Support:** Theme-aware component styling

### Key UI Components

#### Button Component (`button.tsx`)

**Variants:**

- **Default:** Primary button styling
- **Secondary:** Secondary button appearance
- **Outline:** Outlined button style
- **Ghost:** Minimal button styling
- **Destructive:** Error/danger button styling

**Implementation:**

```tsx
// Variant-based styling with class variance authority
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

#### Card Component (`card.tsx`)

**Features:**

- **Flexible Layout:** Header, content, and footer sections
- **Responsive Design:** Mobile-optimized card layouts
- **Theme Support:** Light/dark mode compatibility
- **Accessibility:** Proper semantic structure

#### Form Components

**Input (`input.tsx`):**

- **Validation States:** Error, success, and disabled states
- **Accessibility:** Proper ARIA labels and descriptions
- **Responsive Design:** Mobile-optimized input sizing
- **Theme Integration:** Consistent with design system

**Select (`select.tsx`):**

- **Keyboard Navigation:** Full keyboard accessibility
- **Search Functionality:** Filterable option lists
- **Custom Styling:** Consistent with design system
- **Mobile Optimization:** Touch-friendly interface

---

## 🔄 Component State Management

### Authentication State

**Clerk Integration:**

- **Global User Context:** User state available throughout app
- **Protected Routes:** Middleware-based route protection
- **Session Management:** Automatic session handling
- **User Profile:** Complete user information access

**Implementation Pattern:**

```tsx
// User authentication state management
const { userId, user } = useUser();

// Conditional rendering based on auth state
{
  userId ? (
    <UserMenu user={user} />
  ) : (
    <SignInButton mode="modal">
      <Button variant="outline">Sign In</Button>
    </SignInButton>
  );
}
```

### Cart State Management

**Real-time Updates:**

- **Optimistic Updates:** Immediate UI feedback
- **Server Validation:** Backend data consistency
- **Error Handling:** Graceful error recovery
- **Performance Optimization:** Efficient state updates

**State Synchronization:**

```tsx
// Cart state synchronization
const { data: cart, refetch } = useQuery({
  queryKey: ["cart"],
  queryFn: () => getCart(),
  enabled: !!userId,
});

// Optimistic updates with rollback
const updateCartItem = async (itemId: string, quantity: number) => {
  const previousCart = cart;

  try {
    // Optimistic update
    setCart((prev) => updateCartItemOptimistically(prev, itemId, quantity));

    // Server update
    await updateCartItemOnServer(itemId, quantity);

    // Refresh data
    refetch();
  } catch (error) {
    // Rollback on error
    setCart(previousCart);
    toast.error("Failed to update cart");
  }
};
```

---

## 📱 Responsive Design Implementation

### Breakpoint Strategy

**Tailwind CSS Breakpoints:**

- **Mobile:** `< 640px` (sm)
- **Tablet:** `640px - 1024px` (md)
- **Desktop:** `> 1024px` (lg)
- **Large Desktop:** `> 1280px` (xl)

**Responsive Component Patterns:**

```tsx
// Responsive class application
<div className="
  grid grid-cols-1
  sm:grid-cols-2
  md:grid-cols-3
  lg:grid-cols-4
  xl:grid-cols-5
  gap-4 md:gap-6 lg:gap-8
">
  {/* Responsive grid layout */}
</div>

// Responsive text sizing
<h1 className="
  text-2xl sm:text-3xl
  md:text-4xl lg:text-5xl
  font-bold text-primary
">
  Responsive Title
</h1>
```

### Mobile-First Design

**Touch Optimization:**

- **Button Sizes:** Minimum 44px touch targets
- **Spacing:** Adequate spacing between interactive elements
- **Gestures:** Swipe gestures for carousel and navigation
- **Performance:** Optimized for mobile network conditions

**Mobile-Specific Components:**

- **Drawer Navigation:** Mobile-optimized navigation drawer
- **Touch-Friendly Forms:** Mobile-optimized form inputs
- **Responsive Images:** Proper image sizing for mobile devices
- **Performance Optimization:** Reduced bundle sizes for mobile

---

## 🚀 Performance Optimization

### Component-Level Optimizations

**React.memo Usage:**

```tsx
// Prevent unnecessary re-renders
const ProductCard = React.memo(({ product }: ProductCardProps) => {
  // Component implementation
});

export default ProductCard;
```

**useCallback and useMemo:**

```tsx
// Optimize callback functions
const handleAddToCart = useCallback(
  async (productId: string, quantity: number) => {
    // Add to cart logic
  },
  [userId, refetch]
);

// Memoize expensive calculations
const filteredProducts = useMemo(() => {
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      product.price >= priceRange[0] &&
      product.price <= priceRange[1]
  );
}, [products, searchTerm, priceRange]);
```

### Image Optimization

**Next.js Image Component:**

```tsx
// Optimized image loading
<Image
  src={product.image}
  alt={product.name}
  width={300}
  height={400}
  className="w-full h-auto object-cover"
  priority={isPriority}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>
```

**WebP Format Support:**

- **Modern Format:** WebP images for better compression
- **Fallback Support:** JPEG fallback for older browsers
- **Responsive Sizing:** Multiple image sizes for different devices
- **Lazy Loading:** Intersection Observer for performance

---

## 🔒 Security & Accessibility

### Security Implementation

**Input Validation:**

- **Server-Side Validation:** All user inputs validated on server
- **Type Safety:** TypeScript for compile-time error prevention
- **SQL Injection Prevention:** Prisma ORM with parameterized queries
- **XSS Protection:** Next.js built-in XSS protection

**Authentication Security:**

- **Clerk Integration:** Enterprise-grade authentication
- **Route Protection:** Middleware-based security
- **Session Management:** Secure session handling
- **User Permissions:** Role-based access control

### Accessibility Features

**WCAG Compliance:**

- **Keyboard Navigation:** Full keyboard accessibility
- **Screen Reader Support:** Proper ARIA labels and descriptions
- **Color Contrast:** WCAG AA contrast compliance
- **Focus Management:** Proper focus indicators and management

**Implementation Examples:**

```tsx
// Proper ARIA labels
<button
  aria-label="Add to cart"
  aria-describedby="cart-description"
  onClick={handleAddToCart}
>
  <ShoppingCart className="w-4 h-4" />
</button>

// Screen reader description
<div id="cart-description" className="sr-only">
  Add this wine to your shopping cart
</div>
```

---

## 🧪 Testing & Quality Assurance

### Component Testing Strategy

**Unit Testing:**

- **Component Isolation:** Individual component testing
- **Props Validation:** Comprehensive props testing
- **Event Handling:** User interaction testing
- **State Management:** Component state testing

**Integration Testing:**

- **Component Interaction:** Multi-component testing
- **API Integration:** Backend integration testing
- **User Flows:** Complete user journey testing
- **Performance Testing:** Load and stress testing

### Code Quality Standards

**TypeScript Configuration:**

- **Strict Mode:** Comprehensive type checking
- **No Implicit Any:** Explicit type definitions required
- **Strict Null Checks:** Proper null/undefined handling
- **Exact Optional Property Types:** Precise optional property handling

**ESLint Configuration:**

- **Next.js Rules:** Framework-specific linting rules
- **React Rules:** React-specific best practices
- **Accessibility Rules:** Accessibility linting rules
- **Performance Rules:** Performance optimization rules

---

## 📚 Component Documentation Best Practices

### Code Comments

**Implementation Comments:**

- **Why, Not What:** Explain the reasoning behind implementation choices
- **Performance Notes:** Document performance considerations
- **Security Considerations:** Highlight security implications
- **Accessibility Notes:** Document accessibility features

**Example Comments:**

```tsx
// Use Intersection Observer for lazy loading to improve performance
// This prevents loading images that are not visible to the user
const [isVisible, setIsVisible] = useState(false);

// Batch authentication calls at parent level to prevent rate limiting
// Individual components should not make separate auth calls
const { userId } = useUser();

// Optimistic updates provide immediate user feedback
// Server validation ensures data consistency
const handleQuantityChange = async (itemId: string, quantity: number) => {
  // Optimistic update
  setCart((prev) => updateCartItemOptimistically(prev, itemId, quantity));

  try {
    // Server validation
    await updateCartItemOnServer(itemId, quantity);
  } catch (error) {
    // Rollback on error
    setCart(previousCart);
  }
};
```

### Documentation Standards

**Component Documentation:**

- **Purpose:** Clear description of component purpose
- **Props Interface:** Complete props documentation
- **Usage Examples:** Practical usage examples
- **Performance Notes:** Performance considerations
- **Accessibility Features:** Accessibility implementation details

**Implementation Notes:**

- **Design Decisions:** Explanation of design choices
- **Performance Optimizations:** Performance improvement details
- **Security Considerations:** Security implementation details
- **Maintenance Notes:** Ongoing maintenance requirements

---

_This component architecture document reflects the current implementation state and should be updated whenever significant changes are made to the component system. For the most current information, refer to the source code and recent commit history._
