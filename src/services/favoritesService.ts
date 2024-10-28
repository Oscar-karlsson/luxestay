import { doc, setDoc, deleteDoc, getDoc, query, where, getDocs, collection } from "firebase/firestore";
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



// Function to fetch all favorite properties for a given user
export const fetchFavoriteProperties = async (userId: string): Promise<Property[]> => {
  try {
    const favoritesQuery = query(collection(firestore, 'favorites'), where('userId', '==', userId));
    const favoriteDocs = await getDocs(favoritesQuery);

    // Retrieve full property data for each favorite
    const propertyPromises = favoriteDocs.docs.map(async (docSnapshot) => {
      const { propertyId } = docSnapshot.data();
      const propertyDoc = await getDoc(doc(firestore, 'properties', propertyId));
      return { id: propertyId, ...propertyDoc.data() } as Property;
    });

    return await Promise.all(propertyPromises);
  } catch (error) {
    console.error("Error fetching favorite properties:", error);
    throw error;
  }
};