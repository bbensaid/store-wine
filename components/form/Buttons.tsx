/**
 * BUTTONS COMPONENT - This provides various reusable button components for forms and user interactions
 *
 * WHAT THIS COMPONENT DOES:
 * - Creates submit buttons with loading states for forms
 * - Provides sign-in buttons for authentication prompts
 * - Creates favorite toggle buttons for products
 * - Handles form submission states and pending operations
 * - Integrates with Clerk authentication system
 * - Provides consistent button styling across the application
 *
 * IMPORTANT FOR BEGINNERS:
 * - This is a client-side component (runs in the browser)
 * - It uses React's useFormStatus hook for form state management
 * - It demonstrates component composition and reusability
 * - It shows how to handle different button states (loading, disabled, active)
 * - It integrates authentication with user interactions
 *
 * TECHNOLOGIES USED:
 * - React (for component structure and state management)
 * - Next.js (for client-side rendering)
 * - TypeScript (for type safety with props and button sizes)
 * - React DOM (for form status management)
 * - Clerk (for authentication buttons)
 * - Radix UI (for loading icons)
 * - React Icons (for heart icons)
 * - Tailwind CSS (for styling and responsive design)
 */

// This directive tells Next.js this component runs on the client (browser) side
// We need this because we use React hooks and interactive features
"use client";

// Import statements - bringing in all the tools we need
import { ReloadIcon } from "@radix-ui/react-icons"; // Loading spinner icon from Radix UI
import { useFormStatus } from "react-dom"; // Hook to track form submission status
import { Button } from "@/components/ui/button"; // Reusable button component
import { cn } from "@/lib/utils"; // Utility function to combine CSS classes
import { FaRegHeart, FaHeart } from "react-icons/fa"; // Heart icons for favorites
import { SignInButton } from "@clerk/nextjs"; // Clerk component for sign-in prompts

/**
 * BUTTON SIZE TYPE DEFINITION
 *
 * This defines the available sizes for buttons in the application.
 * TypeScript uses this to ensure only valid sizes are passed as props.
 *
 * - "default": Standard button size
 * - "lg": Large button size
 * - "sm": Small button size
 */
type btnSize = "default" | "lg" | "sm";

/**
 * SUBMIT BUTTON PROPS INTERFACE
 *
 * This defines what data the SubmitButton component expects to receive.
 * All props are optional with default values.
 *
 * className?: Optional additional CSS classes
 * text?: Button text (defaults to "submit")
 * size?: Button size (defaults to "lg")
 */
type SubmitButtonProps = {
  className?: string; // Optional additional CSS classes
  text?: string; // Button text content
  size?: btnSize; // Button size variant
};

/**
 * SUBMIT BUTTON COMPONENT
 *
 * This component creates a submit button that:
 * - Shows loading state while form is being submitted
 * - Disables itself during submission to prevent double-clicks
 * - Displays a spinner and "Please wait..." text when pending
 * - Integrates with React's form status system
 *
 * BEGINNER TIP: Think of this as a "smart submit button" that knows
 * when a form is being processed and prevents users from clicking it multiple times.
 *
 * Props: Receives optional styling, text, and size customization
 * State: Automatically tracks form submission status
 */
export function SubmitButton({
  className = "", // Default to no additional classes
  text = "submit", // Default button text
  size = "lg", // Default to large size
}: SubmitButtonProps) {
  //
  // FORM STATUS HOOK
  //
  // This hook automatically tracks whether a form is currently being submitted
  // It's provided by React DOM and works with any form in the same component tree
  const { pending } = useFormStatus();

  //
  // COMPONENT RENDER
  //
  // This is what gets displayed - a submit button with loading state
  return (
    /* 
      SUBMIT BUTTON CONTAINER
      - Button: Reusable UI component for consistent styling
      - type="submit": Makes this button submit its parent form
      - disabled={pending}: Disables button while form is being submitted
      - className: Combines default styles with optional custom classes
      - size: Applies the specified button size
      
      The button automatically disables itself during form submission.
    */
    <Button
      type="submit"
      disabled={pending}
      className={cn(
        // Default button styling with hover and active states
        "flex items-center gap-1 sm:gap-2 hover:bg-gray-100 hover:text-primary hover:border-primary active:bg-gray-200 active:text-primary active:border-primary text-sm sm:text-base font-normal border border-primary/20 bg-white text-primary capitalize",
        className // Additional classes passed from parent component
      )}
      size={size}
    >
      {/* 
        CONDITIONAL BUTTON CONTENT
        - If pending: Show loading spinner and "Please wait..." text
        - If not pending: Show the normal button text
        
        This creates a dynamic button that changes based on form state.
      */}
      {pending ? (
        /* 
          LOADING STATE CONTENT
          - ReloadIcon: Spinning icon to indicate loading
          - mr-2: Right margin for spacing
          - h-4 w-4: Icon dimensions (16px x 16px)
          - animate-spin: CSS animation for spinning effect
          - text-primary: Icon color using primary brand color
          - "Please wait...": Text to inform user that action is in progress
        */
        <>
          <ReloadIcon className="mr-2 h-4 w-4 animate-spin text-primary" />
          Please wait...
        </>
      ) : (
        /* 
          NORMAL STATE CONTENT
          - text: The button text passed as a prop
          - This is what users see when the button is clickable
        */
        text
      )}
    </Button>
  );
}

/**
 * PRODUCT SIGN IN BUTTON COMPONENT
 *
 * This component creates a sign-in button specifically for product pages.
 * It wraps Clerk's SignInButton in a styled button that matches the app's design.
 *
 * BEGINNER TIP: This is a "gateway button" that encourages users to sign in
 * when they try to perform actions that require authentication (like adding favorites).
 *
 * Mode: Opens sign-in in a modal (doesn't navigate away from current page)
 * Styling: Uses default button styling with custom text
 */
export const ProductSignInButton = () => {
  return (
    /* 
      CLERK SIGN IN BUTTON WRAPPER
      - SignInButton: Clerk component that handles authentication flow
      - mode="modal": Opens sign-in in a popup modal instead of navigating away
      - This keeps users on the current page while they sign in
      
      The SignInButton automatically handles:
      - Sign-in form display
      - Authentication processing
      - Error handling
      - Success redirects
    */
    <SignInButton mode="modal">
      {/* 
        CUSTOM STYLED BUTTON
        - Button: Reusable UI component for consistent styling
        - type="button": Regular button (not a form submit)
        - size="default": Standard button size
        - className="mt-8": Top margin for spacing
        - "Please Sign In": Clear call-to-action text
        
        This button triggers the Clerk sign-in modal when clicked.
      */}
      <Button type="button" size="default" className="mt-8">
        Please Sign In
      </Button>
    </SignInButton>
  );
};

/**
 * CARD SIGN IN BUTTON COMPONENT
 *
 * This component creates a disabled sign-in button for product cards.
 * It shows a heart icon but is disabled to indicate users need to sign in first.
 *
 * BEGINNER TIP: This is a "teaser button" that shows users what they could do
 * if they were signed in, encouraging them to create an account.
 *
 * State: Always disabled (users cannot interact with it)
 * Purpose: Visual indicator that authentication is required
 */
export const CardSignInButton = () => {
  return (
    /* 
      DISABLED SIGN IN BUTTON
      - Button: Reusable UI component for consistent styling
      - type="button": Regular button (not a form submit)
      - size="icon": Makes button square-shaped for icon display
      - disabled: Prevents user interaction
      - opacity-50: Makes button appear faded to indicate it's disabled
      
      This button shows users they need to sign in to use the heart feature.
    */
    <Button
      type="button"
      size="icon"
      className="flex items-center gap-1 sm:gap-2 hover:bg-gray-100 hover:text-primary hover:border-primary active:bg-gray-200 active:text-primary active:border-primary text-sm sm:text-base font-normal border border-primary/20 bg-white text-primary p-2 cursor-pointer opacity-50"
      disabled
    >
      {/* 
        HEART ICON (DISABLED STATE)
        - FaRegHeart: Regular (outlined) heart icon from React Icons
        - text-primary: Icon color using primary brand color
        - This represents the "favorite" action that requires authentication
        
        The icon shows users what they could do if they were signed in.
      */}
      <FaRegHeart className="text-primary" />
    </Button>
  );
};

/**
 * CARD SUBMIT BUTTON COMPONENT
 *
 * This component creates a submit button for favorite toggles in product cards.
 * It shows different heart icons based on favorite status and form submission state.
 *
 * BEGINNER TIP: This is a "smart favorite button" that shows users the current
 * state of their favorite and prevents multiple clicks during submission.
 *
 * Props: Receives isFavorite boolean to determine icon display
 * State: Automatically tracks form submission status
 * Icons: Shows filled heart for favorites, outlined heart for non-favorites
 */
export const CardSubmitButton = ({ isFavorite }: { isFavorite: boolean }) => {
  //
  // FORM STATUS HOOK
  //
  // This hook tracks whether the favorite form is currently being submitted
  // It prevents users from clicking multiple times during the operation
  const { pending } = useFormStatus();

  //
  // COMPONENT RENDER
  //
  // This is what gets displayed - a favorite toggle button with dynamic content
  return (
    /* 
      FAVORITE TOGGLE BUTTON
      - Button: Reusable UI component for consistent styling
      - type="submit": Makes this button submit its parent form
      - size="icon": Makes button square-shaped for icon display
      - className: Consistent styling with other buttons in the app
      
      This button toggles the favorite status of a product.
    */
    <Button
      type="submit"
      size="icon"
      className="flex items-center gap-1 sm:gap-2 hover:bg-gray-100 hover:text-primary hover:border-primary active:bg-gray-200 active:text-primary active:border-primary text-sm sm:text-base font-normal border border-primary/20 bg-white text-primary p-2 cursor-pointer"
    >
      {/* 
        CONDITIONAL BUTTON CONTENT
        - If pending: Show loading spinner
        - If not pending and isFavorite: Show filled heart
        - If not pending and not isFavorite: Show outlined heart
        
        This creates a dynamic button that reflects the current state.
      */}
      {pending ? (
        /* 
          LOADING STATE
          - ReloadIcon: Spinning icon to indicate loading
          - animate-spin: CSS animation for spinning effect
          - text-primary: Icon color using primary brand color
          
          This shows users that their favorite action is being processed.
        */
        <ReloadIcon className="animate-spin text-primary" />
      ) : isFavorite ? (
        /* 
          FAVORITE STATE (FILLED HEART)
          - FaHeart: Filled heart icon to show item is favorited
          - text-primary: Icon color using primary brand color
          
          This indicates the product is currently in the user's favorites.
        */
        <FaHeart className="text-primary" />
      ) : (
        /* 
          NOT FAVORITE STATE (OUTLINED HEART)
          - FaRegHeart: Regular (outlined) heart icon
          - text-primary: Icon color using primary brand color
          
          This indicates the product is not currently in the user's favorites.
        */
        <FaRegHeart className="text-primary" />
      )}
    </Button>
  );
};
