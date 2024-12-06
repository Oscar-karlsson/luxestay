'use client';
import React, { useState, useEffect } from 'react';
import { SignedIn, SignedOut, SignIn } from '@clerk/nextjs';
import Profile from '@/components/Profile';
import ProfileSkeleton from '@/components/skeletons/ProfileSkeleton';




const ProfilePage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1500); // Adjust time as needed
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center pt-8">
      {/* Show skeleton or profile based on loading state */}
      <SignedIn>
        {loading ? <ProfileSkeleton /> : <Profile />}
      </SignedIn>

      {/* Show Clerk's sign-in modal if the user is signed out */}
      <SignedOut>
        <SignIn />
      </SignedOut>
    </div>
  );
};

export default ProfilePage;
