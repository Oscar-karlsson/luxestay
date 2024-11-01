import { db } from "../utils/firebase";
import { addDoc, collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { clerkClient } from "@clerk/clerk-sdk-node";

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



// Function to fetch user details from Clerk
const fetchUserProfile = async (userId: string) => {
  try {
    const user = await clerkClient.users.getUser(userId);
    return {
      name: `${user.firstName} ${user.lastName}`,
      profileImageUrl: user.imageUrl || "/default-profile.png",
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { name: "Unknown User", profileImageUrl: "/default-profile.png" };
  }
};

// Function to fetch reviews for a specific property with user details
export const getReviewsForProperty = async (propertyId: string) => {
  try {
    const reviewsQuery = query(
      collection(db, "reviews"),
      where("propertyId", "==", propertyId)
    );
    const querySnapshot = await getDocs(reviewsQuery);

    const reviews = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const reviewData = doc.data();

        // Fetch user info via the custom API endpoint
        const userResponse = await fetch(`/api/fetchHost?userId=${reviewData.userId}`);
        const userData = await userResponse.json();

        return {
          ...reviewData,
          name: `${userData.firstName} ${userData.lastName}`,
          profileImageUrl: userData.profileImageUrl,
          id: doc.id, // Add the review document ID if needed
        };
      })
    );

    return reviews;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
};