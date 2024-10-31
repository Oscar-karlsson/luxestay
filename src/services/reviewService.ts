import { db } from "../utils/firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";

type ReviewParams = {
  userId: string;
  propertyId: string;
  rating: number;
  comment?: string;  // Optional comment field
};

export const addReview = async ({
  userId,
  propertyId,
  rating,
  comment = "",
}: ReviewParams): Promise<string | null> => {
  try {
    // Validate that the rating is between 1 and 5
    if (rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5.");
    }

    // Create the review data
    const reviewData = {
      userId,
      propertyId,
      rating,
      comment,
      timestamp: Timestamp.now(),
    };

    // Add the review to the 'reviews' collection
    const reviewRef = await addDoc(collection(db, "reviews"), reviewData);
    return reviewRef.id;  // Return the review ID if successful
  } catch (error) {
    console.error("Error adding review:", error);
    return null;
  }
};
