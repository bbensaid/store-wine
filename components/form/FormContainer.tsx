/**
 * FORM CONTAINER COMPONENT - This wraps forms with action state management and toast notifications
 *
 * WHAT THIS COMPONENT DOES:
 * - Wraps form elements with React's useActionState hook
 * - Manages form submission state and server action responses
 * - Automatically displays toast notifications for form messages
 * - Provides a consistent way to handle form submissions across the app
 * - Integrates with server actions for form processing
 *
 * IMPORTANT FOR BEGINNERS:
 * - This is a client-side component (runs in the browser)
 * - It uses React's experimental useActionState hook for form management
 * - It demonstrates server action integration with client-side forms
 * - It shows how to handle form responses and user feedback
 * - It's a crucial part of the form handling system
 *
 * TECHNOLOGIES USED:
 * - React (for component structure and state management)
 * - Next.js (for client-side rendering and server actions)
 * - TypeScript (for type safety with action functions)
 * - React experimental features (useActionState hook)
 * - Sonner (for toast notifications)
 * - Server Actions (for form processing on the server)
 */

// This directive tells Next.js this component runs on the client (browser) side
// We need this because we use React hooks and interactive features
"use client";

// Import statements - bringing in all the tools we need
import { useActionState } from "react"; // Experimental hook for managing action state
import { useEffect } from "react"; // Hook for side effects (like showing toasts)
import { toast } from "sonner"; // Toast notification library for user feedback
import { actionFunction } from "@/utils/types"; // TypeScript type for server actions

/**
 * INITIAL STATE OBJECT
 *
 * This defines the starting state for the form container.
 * It provides a clean slate before any form actions are performed.
 *
 * message: Empty string for form messages (success, error, etc.)
 * This state gets updated when server actions return responses.
 */
const initialState = {
  message: "", // Will contain messages from server actions
};

/**
 * FORM CONTAINER COMPONENT FUNCTION
 *
 * This component creates a wrapper that:
 * - Manages form submission state using React's useActionState
 * - Automatically shows toast notifications for form responses
 * - Provides a consistent form handling experience
 * - Integrates server actions with client-side forms
 *
 * BEGINNER TIP: Think of this as a "smart form wrapper" that automatically
 * handles the communication between your form and the server, and shows
 * users what happened after they submit.
 *
 * Props: Receives a server action function and form children
 * State: Manages form submission state and messages
 * Effects: Automatically shows toasts when messages arrive
 */
function FormContainer({
  action, // Server action function that processes the form
  children, // Form elements (inputs, buttons, etc.) that go inside
}: {
  action: actionFunction; // TypeScript type for server actions
  children: React.ReactNode; // Form content (inputs, buttons, etc.)
}) {
  //
  // ACTION STATE MANAGEMENT
  //
  // This hook manages the state of server actions and provides a form action handler
  // It's an experimental React feature that simplifies form handling with server actions
  const [state, formAction] = useActionState(action, initialState);

  /**
   * TOAST NOTIFICATION EFFECT
   *
   * This effect automatically shows toast notifications when the form state changes.
   * It runs whenever the state.message value changes, providing immediate user feedback.
   *
   * The dependency array [state] means this runs whenever the state object changes.
   * This ensures users see notifications for all form responses.
   */
  useEffect(() => {
    // Only show toast if there's a message to display
    if (state.message) {
      // Display the message as a toast notification
      // This provides immediate feedback to users about their form submission
      toast(state.message);
    }
  }, [state]); // Re-run when state changes

  //
  // COMPONENT RENDER
  //
  // This is what gets displayed - a form with integrated action handling
  return (
    /* 
      FORM ELEMENT WITH ACTION INTEGRATION
      - form: HTML form element for collecting user input
      - action={formAction}: Uses the action handler from useActionState
      - This automatically handles form submission and state management
      
      The form will:
      - Collect user input from child elements
      - Submit data to the server action when submitted
      - Update the state based on server response
      - Trigger toast notifications for user feedback
      
      WHAT YOU CAN CHANGE:
      - Form styling and layout
      - Form validation and behavior
      - Child form elements
      
      WHAT NOT TO CHANGE:
      - The action={formAction} attribute
      - The useActionState hook usage
      - The toast notification logic
    */
    <form action={formAction}>
      {/* 
        FORM CHILDREN
        - children: The form elements passed from the parent component
        - This includes inputs, buttons, labels, and other form controls
        - The form container automatically handles their submission
        
        Examples of what might go here:
        - Input fields for user data
        - Submit buttons
        - Form validation messages
        - Loading states
      */}
      {children}
    </form>
  );
}

/**
 * EXPORT STATEMENT
 *
 * This makes the FormContainer component available to other parts of your app.
 * Other components can import and use this for consistent form handling.
 *
 * DON'T CHANGE THIS unless you want to break all forms that use this container!
 */
export default FormContainer;
