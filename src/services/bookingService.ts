import { db } from "../utils/firebase";
import { Timestamp, addDoc, collection, updateDoc, doc, getDoc, getDocs, query, where } from "firebase/firestore";

type BookingParams = {
    userId: string;
    propertyId: string;
    startDate: Date;
    endDate: Date;
    location: string;
    pricePerNight: number;
    imageUrl: string;
    cleaningFee: number;
    serviceFee: number;
    propertyTitle: string; 
  };

interface BookingData {
    userId: string;
    propertyId: string;
    startDate: Date;
    endDate: Date;
    status: "pending" | "confirmed" | "cancelled";
    createdAt: Date;
    location: string;
    pricePerNight: number;
    imageUrl: string;
    cleaningFee: number;
    serviceFee: number;
    propertyTitle: string; 
  }

// Check Date Availability
const checkDateAvailability = async (propertyId: string, startDate: Date, endDate: Date): Promise<boolean> => {
    if (!propertyId) throw new Error("Invalid property ID"); // Validate propertyId
  
    console.log("Creating document reference for property:", propertyId);
    const propertyRef = doc(db, "properties", propertyId);
    const propertySnap = await getDoc(propertyRef);
  
    if (!propertySnap.exists()) throw new Error("Property not found");
  
    const { blockedDates = [] } = propertySnap.data();

    // Check against blocked dates
    const isBlocked = blockedDates.some((date: string) => {
        const blockedDate = new Date(date);
        return blockedDate >= startDate && blockedDate <= endDate;
    });

    if (isBlocked) return false;

  // Check against confirmed bookings in the bookings collection
  const bookingsQuery = query(
    collection(db, "bookings"),
    where("propertyId", "==", propertyId),
    where("status", "in", ["pending", "confirmed"])  // Only exclude "canceled" bookings
  );

  const bookingSnapshots = await getDocs(bookingsQuery);
  const isConflict = bookingSnapshots.docs.some((doc) => {
    const { startDate: bookedStart, endDate: bookedEnd } = doc.data();
    const bookingStart = (bookedStart as Timestamp).toDate();
    const bookingEnd = (bookedEnd as Timestamp).toDate();
    return endDate > bookingStart && startDate < bookingEnd;
  });

  return !isConflict;
};

// Create Booking
export const createBooking = async ({
    userId,
    propertyId,
    startDate,
    endDate,
    imageUrl,  
    cleaningFee,
    serviceFee,
    propertyTitle,
  }: BookingParams): Promise<string | null> => {
    try {
      console.log("Checking date availability...");
      const isAvailable = await checkDateAvailability(propertyId, startDate, endDate);
      if (!isAvailable) throw new Error("Selected dates are not available.");
  
      // Fetch property details to get location, price, image, cleaning fee, and service fee
      const propertyRef = doc(db, "properties", propertyId);
      const propertySnapshot = await getDoc(propertyRef);
  
      if (!propertySnapshot.exists()) throw new Error("Property not found");
  
      const propertyData = propertySnapshot.data();
      const location = `${propertyData.city}, ${propertyData.country}`;
      const pricePerNight = propertyData.price;

  
      const bookingData: BookingData = {
        userId,
        propertyId,
        startDate,
        endDate,
        status: "confirmed",
        createdAt: new Date(),
        location,        
        pricePerNight,   
        imageUrl,        
        cleaningFee,     
        serviceFee,      
        propertyTitle,
      };
  
            const bookingRef = await addDoc(collection(db, "bookings"), bookingData);
            return bookingRef.id;
          } catch (error) {
            console.error("Error creating booking:", error);
            return null;
          }
      };

// Confirm Booking
export const confirmBooking = async (bookingId: string): Promise<void> => {
  const bookingRef = doc(db, "bookings", bookingId);
  await updateDoc(bookingRef, { status: "confirmed" });
};

// Cancel Booking
export const cancelBooking = async (bookingId: string): Promise<void> => {
  const bookingRef = doc(db, "bookings", bookingId);
  await updateDoc(bookingRef, { status: "cancelled" });
};

export { checkDateAvailability };