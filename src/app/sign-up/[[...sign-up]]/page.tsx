'use client';
import { useEffect, useState } from 'react';
import { SignUp } from '@clerk/nextjs';

const SignUpPage = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Prevent rendering on the server side
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
    </div>
  );
};

export default SignUpPage;
