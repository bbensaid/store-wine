import { currentUser } from "@clerk/nextjs/server";
import { fetchFavoriteId } from "@/utils/actions";
import FavoriteToggleForm from "./FavoriteToggleForm";
import { CardSignInButton } from "../form/Buttons";

async function FavoriteToggleButton({ wineId }: { wineId: number }) {
  try {
    const user = await currentUser();
    if (!user) return <CardSignInButton />;
    
    const favoriteId = await fetchFavoriteId({ wineId });

    return <FavoriteToggleForm favoriteId={favoriteId} wineId={wineId} />;
  } catch (error) {
    console.error("Error in FavoriteToggleButton:", error);
    // Return sign in button as fallback
    return <CardSignInButton />;
  }
}

export default FavoriteToggleButton;
