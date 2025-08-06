import { currentUser } from "@clerk/nextjs/server";

export async function getCurrentUser() {
  const clerkUser = await currentUser();
  return clerkUser;
}

export async function getCurrentUserId() {
  try {
    const clerkUser = await currentUser();
    return clerkUser?.id;
  } catch (error) {
    console.error("Error getting current user ID:", error);
    return null;
  }
}

export async function ensureAuthenticated() {
  const clerkUser = await currentUser();
  
  if (!clerkUser) {
    throw new Error("Unauthorized");
  }

  return clerkUser;
} 