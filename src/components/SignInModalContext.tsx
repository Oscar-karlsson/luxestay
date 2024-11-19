import React, { createContext, useContext, useState } from 'react';

const SignInModalContext = createContext({
  showSignInModal: false,
  setShowSignInModal: (value: boolean) => {},
});

export const SignInModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showSignInModal, setShowSignInModal] = useState(false);

  return (
    <SignInModalContext.Provider value={{ showSignInModal, setShowSignInModal }}>
      {children}
    </SignInModalContext.Provider>
  );
};

export const useSignInModal = () => useContext(SignInModalContext);