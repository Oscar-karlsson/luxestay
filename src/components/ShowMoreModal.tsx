'use client';

import React, { useEffect, useRef } from 'react';
import Modal from 'react-modal';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'; // Using body-scroll-lock for larger screens

interface ShowMoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const ShowMoreModal: React.FC<ShowMoreModalProps> = ({ isOpen, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 768;

  useEffect(() => {
    const targetElement = modalRef.current;

    if (isOpen && !isSmallScreen && targetElement) {
      // For larger screens, lock the body scroll when modal is open
      disableBodyScroll(targetElement);
    } else if (targetElement) {
      // Enable body scroll when modal is closed
      enableBodyScroll(targetElement);
    }

    return () => {
      if (targetElement) enableBodyScroll(targetElement);
    };
  }, [isOpen, isSmallScreen]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Show More Modal"
      overlayClassName={`show-more-modal-overlay ${isSmallScreen ? 'modal-mobile' : ''}`}
      className="show-more-modal-content"
      closeTimeoutMS={300}
      shouldCloseOnOverlayClick={true}
    >
      <div ref={modalRef}>
        <div className="modal-header">
          <button onClick={onClose} className="close-btn">Close</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </Modal>
  );
};

export default ShowMoreModal;
