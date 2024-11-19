'use client';
import React from 'react';
import { SignInModalProvider } from '@/components/SignInModalContext';

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  return (
    <SignInModalProvider>
      {children}
    </SignInModalProvider>
  );
}