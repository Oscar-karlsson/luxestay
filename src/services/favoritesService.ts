import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { firestore } from "../utils/firebase"; // Ensure this path is correct

// Type for the function parameters
type FavoriteParams = {
  userId: string;
  propertyId: string;
};

// Function to add a property to favorites
export const addFavorite = async ({ userId, propertyId }: FavoriteParams): Promise<void> => {
  try {
    console.log("addFavorite called with:", { userId, propertyId }); // Debugging statement
    const favoriteDocRef = doc(firestore, "favorites", `${userId}_${propertyId}`);
    const docSnapshot = await getDoc(favoriteDocRef);
    if (!docSnapshot.exists()) {
      await setDoc(favoriteDocRef, {
        userId,
        propertyId,
        createdAt: new Date(),
      });
      console.log("Property added to favorites.");
    } else {
      console.log("Property is already favorited.");
    }
  } catch (error) {
    console.error("Error adding favorite:", error);
  }
};

// Function to remove a property from favorites
export const removeFavorite = async ({ userId, propertyId }: FavoriteParams): Promise<void> => {
  try {
    console.log("removeFavorite called with:", { userId, propertyId }); // Debugging statement
    const favoriteDocRef = doc(firestore, "favorites", `${userId}_${propertyId}`);
    const docSnapshot = await getDoc(favoriteDocRef);
    if (docSnapshot.exists()) {
      await deleteDoc(favoriteDocRef);
      console.log("Property removed from favorites.");
    } else {
      console.log("Property is not currently favorited.");
    }
  } catch (error) {
    console.error("Error removing favorite:", error);
  }
};