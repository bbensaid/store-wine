import { currentUser } from "@clerk/nextjs/server";
import { fetchFavoriteId } from "@/utils/actions";
import FavoriteToggleForm from "./FavoriteToggleForm";
import { CardSignInButton } from "../form/Buttons";

async function FavoriteToggleButton({ wineId }: { wineId: number }) {
  const user = await currentUser();
  if (!user) return <CardSignInButton />;
  
  const favoriteId = await fetchFavoriteId({ wineId });

  return <FavoriteToggleForm favoriteId={favoriteId} wineId={wineId} />;
}

export default FavoriteToggleButton;
