"use client"; 

import React from 'react';
import PaymentWrapper from '@/components/PaymentWrapper';

const PaymentLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <PaymentWrapper>
      {children}
    </PaymentWrapper>
  );
};

export default PaymentLayout;