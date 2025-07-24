"use client";

import { SignIn } from "@clerk/nextjs";
import { useState } from "react";
import { SignUpButton } from "@clerk/nextjs";
import { Cinzel } from "next/font/google";

const cinzel = Cinzel({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export default function CustomSignIn() {
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <div className="w-full max-w-md">
      {!showSignUp ? (
        <div>
                     <SignIn 
             appearance={{
               elements: {
                 formButtonPrimary: "bg-primary hover:bg-primary/90 text-white",
                 card: "bg-white border border-primary/20",
                 headerTitle: `text-primary ${cinzel.className}`,
                 headerSubtitle: `text-gray-600 ${cinzel.className}`,
                 formFieldInput: "border border-primary/20 focus:border-primary",
                 formFieldLabel: `text-gray-700 ${cinzel.className}`,
                 footerActionLink: `text-primary hover:text-primary/80 ${cinzel.className}`,
                 formFieldError: "text-red-500",
                 identityPreviewEditButton: "text-primary",
                 formResendCodeLink: "text-primary",
                 alert: "bg-red-50 border border-red-200 text-red-700",
                 alertText: "text-red-700",
                 alertTextContainer: "text-red-700",
               }
             }}
            afterSignInUrl="/"
            signUpUrl="/sign-up"
            redirectUrl="/"
          />
          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Don&apos;t have an account?{" "}
              <button
                onClick={() => setShowSignUp(true)}
                className="text-primary hover:text-primary/80 underline font-medium"
              >
                Sign up here
              </button>
            </p>
          </div>
          <div className="mt-2 text-center">
            <p className="text-sm text-gray-500">
              If you get an error saying &quot;Couldn&apos;t find your account&quot;, 
              you may need to{" "}
              <button
                onClick={() => setShowSignUp(true)}
                className="text-primary hover:text-primary/80 underline font-medium"
              >
                create a new account
              </button>
            </p>
          </div>
        </div>
      ) : (
        <div>
          <SignUpButton mode="modal">
            <button className="w-full bg-primary hover:bg-primary/90 text-white py-3 px-4 rounded-md font-medium">
              Create Account
            </button>
          </SignUpButton>
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowSignUp(false)}
              className="text-primary hover:text-primary/80 underline font-medium"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 