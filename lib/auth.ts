import { currentUser } from "@clerk/nextjs/server";

export async function getCurrentUser() {
  const clerkUser = await currentUser();
  return clerkUser;
}

export async function getCurrentUserId() {
  const clerkUser = await currentUser();
  return clerkUser?.id;
}

export async function ensureAuthenticated() {
  const clerkUser = await currentUser();
  
  if (!clerkUser) {
    throw new Error("Unauthorized");
  }

  return clerkUser;
} 