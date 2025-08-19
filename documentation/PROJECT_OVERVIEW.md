# VINEFOX - Wine Store Project Overview

## Project Status: Expl

**Key Features:**

- Limited scope exploration of BabyFox's App Platform
- Still no good sense of the Shopify backend APIs but confident about the headless option & GraphQL Queries
- Modular best-of-breed modules/components/libraries around the REACT/NEXTJS framework - All open source& free so far
- Vercel hosting option is best. Multiple licensing/subscription/fees. . . . will be needed.

**Current Version:** vinefox (5f3b53c)  
**Framework:** Next.js 15.3.1 with App Router  
**Database:** PostgreSQL with Prisma ORM  
**Authentication:** Clerk  
**Payment Processing:** Stripe  
**Styling:** Tailwind CSS v4 with custom design system

---

## 🏗️ Architecture Overview

### Tech Stack

- **Frontend:** Next.js 15.3.1, React 19, TypeScript 5.8.3
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** PostgreSQL (production)
- **Authentication:** Clerk (OAuth, user management, session handling)
- **Payment:** Stripe (checkout, payment processing)
- **Styling:** Tailwind CSS v4, Radix UI components, custom design system
- **State Management:** React hooks, server actions, optimistic updates
- **Deployment:** Vercel (production), local development

### Project Structure

```
store-wine/
├── app/                   # Next.js App Router
│   ├── api/               # API routes (products, cart, orders, payment)
│   ├── auth/              # Authentication pages
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout process
│   ├── products/          # Product catalog
│   ├── orders/            # Order management
│   └── layout.tsx         # Root layout with providers
├── components/            # Reusable UI components
│   ├── navbar/            # Navigation components
│   ├── products/          # Product display components
│   ├── cart/              # Cart management components
│   ├── auth/              # Authentication components
│   ├── ui/                # Base UI components (Radix + custom)
│   └── home/              # Homepage components
├── lib/                   # Utility libraries
├── prisma/                # Database schema and migrations
├── utils/                 # Helper functions and actions
└── public/                # Static assets
```

---

## 🔑 Key Features & Implementation

### 1. Authentication System (Clerk)

- **OAuth Integration:** Google, GitHub, email/password
- **User Management:** Profile management, session handling
- **Protected Routes:** Middleware-based route protection
- **User Context:** Global user state management

**Critical Implementation Details:**

- Middleware configured to protect all routes except static assets
- User authentication state cached at parent component level to prevent rate limiting
- Optimized auth checks using batch operations instead of individual component calls

### 2. Product Management

- **Wine Catalog:** Comprehensive wine database with detailed attributes
- **Image Management:** Multiple images per wine, optimized loading
- **Search & Filtering:** Advanced search with region, type, price filtering
- **Favorites System:** User-specific wine favorites with real-time updates

**Database Schema Highlights:**

```prisma
model Wine {
  name       String
  type       String
  elaborate  String?      # Detailed description
  grapes     String       # Grape varieties
  harmonize  String       # Food pairing suggestions
  abv        Float        # Alcohol by volume
  body       String       # Wine body (light, medium, full)
  acidity    String       # Acidity level
  code       String       # Unique product code
  price      Int          # Price in cents
  regionId   Int          # Geographic region
  featured   Boolean      # Featured wine flag
  // Relations
  region     Region       # Geographic region
  images     Image[]      # Multiple product images
  reviews    Review[]     # User reviews
  favorites  Favorite[]   # User favorites
}
```

### 3. Shopping Cart System

- **Persistent Cart:** Database-stored cart with real-time updates
- **Quantity Management:** Input fields with +/- buttons for better UX
- **Price Calculations:** Automatic tax, shipping, and total calculations
- **Optimistic Updates:** Immediate UI feedback with server validation

**Key Implementation Features:**

- Cart items stored per user in database
- Real-time price calculations (tax rate: 10%, shipping: $5)
- Optimistic updates for immediate user feedback
- Server-side validation to prevent manipulation

### 4. Order Processing & Payment

- **Stripe Integration:** Secure payment processing
- **Order Management:** Complete order lifecycle tracking
- **Email Notifications:** Order confirmation and status updates
- **Inventory Management:** Stock tracking and validation

**Payment Flow:**

1. Cart validation and inventory check
2. Stripe checkout session creation
3. Payment processing with webhook handling
4. Order confirmation and inventory update
5. Email notification to customer

### 5. Review System

- **User Reviews:** Authenticated user reviews with ratings
- **Moderation:** Admin review approval system
- **Rich Content:** Review text, ratings, author information
- **Vintage Tracking:** Optional vintage year specification

---

## 🎨 Design System & UI/UX

### Design Philosophy

- **Wine Industry Focus:** Elegant, sophisticated design appropriate for wine retail
- **Responsive Design:** Mobile-first approach with desktop optimization
- **Accessibility:** WCAG compliant with proper contrast and navigation
- **Performance:** Optimized images, lazy loading, efficient rendering

### Component Architecture

- **Radix UI Base:** Accessible, unstyled components as foundation
- **Custom Styling:** Tailwind CSS with consistent design tokens
- **Component Composition:** Modular, reusable component system
- **Theme Support:** Light/dark mode with system preference detection

### Key UI Components

- **Navigation:** Sticky navbar with search, cart, and user menu
- **Product Grid:** Responsive grid with filtering and sorting
- **Cart Interface:** Intuitive cart management with real-time updates
- **Checkout Flow:** Streamlined, secure checkout process
- **Responsive Design:** Mobile-optimized with touch-friendly interactions

---

## 🚀 Performance & Optimization

### Frontend Optimizations

- **Next.js 15 Features:** App Router, server components, streaming
- **Image Optimization:** Next.js Image component with WebP format
- **Code Splitting:** Automatic route-based code splitting
- **Bundle Optimization:** Tree shaking, dead code elimination

### Backend Optimizations

- **Database Queries:** Optimized Prisma queries with proper indexing
- **API Caching:** Strategic caching for frequently accessed data
- **Rate Limiting:** Authentication call batching to prevent rate limits
- **Error Handling:** Comprehensive error handling with user feedback

### Database Performance

- **Indexing Strategy:** Optimized indexes on frequently queried fields
- **Query Optimization:** Efficient joins and relationship handling
- **Connection Pooling:** Optimized database connection management
- **Migration Strategy:** Safe, incremental database schema updates

---

## 🔒 Security & Data Protection

### Authentication Security

- **Clerk Integration:** Enterprise-grade authentication security
- **Session Management:** Secure session handling with automatic expiration
- **Route Protection:** Middleware-based route security
- **User Permissions:** Role-based access control

### Data Security

- **Input Validation:** Server-side validation for all user inputs
- **SQL Injection Prevention:** Prisma ORM with parameterized queries
- **XSS Protection:** Next.js built-in XSS protection
- **CSRF Protection:** Built-in CSRF protection mechanisms

### Payment Security

- **Stripe Security:** PCI DSS compliant payment processing
- **Webhook Validation:** Secure webhook signature verification
- **Data Encryption:** End-to-end encryption for sensitive data
- **Audit Logging:** Comprehensive transaction logging

---

## 📱 Responsive Design & Mobile Experience

### Mobile-First Approach

- **Touch Optimization:** Touch-friendly button sizes and interactions
- **Responsive Layout:** Fluid layouts that adapt to all screen sizes
- **Performance:** Optimized for mobile network conditions
- **Accessibility:** Mobile-accessible navigation and interactions

### Breakpoint Strategy

- **Mobile:** < 640px (sm)
- **Tablet:** 640px - 1024px (md)
- **Desktop:** > 1024px (lg)
- **Large Desktop:** > 1280px (xl)

### Mobile-Specific Features

- **Drawer Navigation:** Mobile-optimized navigation drawer
- **Touch Gestures:** Swipe gestures for carousel and navigation
- **Optimized Forms:** Mobile-friendly form inputs and validation
- **Performance:** Reduced bundle sizes for mobile devices

---

## 🧪 Testing & Quality Assurance

### Testing Strategy

- **Component Testing:** Individual component functionality testing
- **Integration Testing:** API endpoint and data flow testing
- **User Testing:** Real user experience testing and feedback
- **Performance Testing:** Load testing and performance optimization

### Code Quality

- **TypeScript:** Strict type checking and error prevention
- **ESLint:** Code quality and consistency enforcement
- **Prettier:** Code formatting and style consistency
- **Git Hooks:** Pre-commit code quality checks

### Deployment Quality

- **Vercel Integration:** Automatic deployment and preview generation
- **Environment Management:** Secure environment variable handling
- **Build Optimization:** Optimized production builds
- **Error Monitoring:** Production error tracking and alerting

---

## 🔄 Maintenance & Updates

### Regular Maintenance Tasks

- **Dependency Updates:** Monthly security and feature updates
- **Database Maintenance:** Regular database optimization and cleanup
- **Performance Monitoring:** Continuous performance tracking
- **Security Audits:** Regular security review and updates

### Update Process

1. **Development Branch:** Create feature branch for changes
2. **Testing:** Comprehensive testing in development environment
3. **Code Review:** Peer review and approval process
4. **Staging Deployment:** Test in staging environment
5. **Production Deployment:** Deploy to production with rollback plan

### Monitoring & Alerting

- **Performance Monitoring:** Core Web Vitals tracking
- **Error Tracking:** Production error monitoring and alerting
- **Uptime Monitoring:** Service availability tracking
- **User Analytics:** User behavior and conversion tracking

---

## 🚨 Critical Issues & Risk Mitigation

### Known Issues & Solutions

1. **Rate Limiting:** Authentication calls batched at parent level
2. **Double Logo Issue:** Fixed by hiding desktop logo on mobile
3. **Hero Layout Issues:** Responsive design improvements implemented
4. **Vercel Build Errors:** Unused imports removed and optimized

### Risk Mitigation Strategies

- **Database Backups:** Regular automated database backups
- **Rollback Procedures:** Quick rollback to previous stable versions
- **Monitoring:** Comprehensive monitoring and alerting systems
- **Documentation:** Detailed documentation for troubleshooting

### Performance Considerations

- **Image Optimization:** WebP format with proper sizing
- **Bundle Size:** Regular bundle analysis and optimization
- **Database Queries:** Query optimization and indexing strategy
- **Caching Strategy:** Strategic caching for performance improvement

---

## 📚 Additional Resources

### Development Resources

- **Next.js Documentation:** https://nextjs.org/docs
- **Prisma Documentation:** https://www.prisma.io/docs
- **Clerk Documentation:** https://clerk.com/docs
- **Stripe Documentation:** https://stripe.com/docs

### Project-Specific Resources

- **Component Library:** `/components/ui/` - Base UI components
- **Utility Functions:** `/utils/` - Helper functions and actions
- **Database Schema:** `/prisma/schema.prisma` - Complete database structure
- **API Routes:** `/app/api/` - Backend API implementation

### Support & Maintenance

- **Issue Tracking:** GitHub Issues for bug reports and feature requests
- **Documentation Updates:** Regular documentation maintenance and updates
- **Code Reviews:** Peer review process for all changes
- **Performance Monitoring:** Continuous performance tracking and optimization

---
