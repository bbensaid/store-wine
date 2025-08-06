import { fetchFavoriteIdWithUserId } from "@/utils/actions";
import FavoriteToggleForm from "./FavoriteToggleForm";

async function FavoriteToggleButtonOptimized({ 
  wineId, 
  userId 
}: { 
  wineId: number; 
  userId: string;
}) {
  try {
    const favoriteId = await fetchFavoriteIdWithUserId({ wineId, userId });
    return <FavoriteToggleForm favoriteId={favoriteId} wineId={wineId} />;
  } catch (error) {
    console.error("Error in FavoriteToggleButtonOptimized:", error);
    // Return a disabled button as fallback
    return (
      <div className="p-2 cursor-not-allowed opacity-50">
        <span>❤️</span>
      </div>
    );
  }
}

export default FavoriteToggleButtonOptimized;
