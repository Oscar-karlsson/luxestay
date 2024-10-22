'use client';
import { SignedIn, SignedOut, SignIn } from '@clerk/nextjs';
import Profile from '@/components/Profile';

const ProfilePage = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center pt-8">
      {/* Show the profile if the user is signed in */}
      <SignedIn>
        <Profile />
      </SignedIn>

      {/* Show Clerk's sign-in modal if the user is signed out */}
      <SignedOut>
        <SignIn />
      </SignedOut>
    </div>
  );
};

export default ProfilePage;
