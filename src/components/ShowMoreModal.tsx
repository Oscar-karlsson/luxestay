import React, { useEffect, useRef, ReactNode } from 'react';
import Modal from 'react-modal';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

interface ShowMoreModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
  }
  
  const ShowMoreModal: React.FC<ShowMoreModalProps> = ({ isOpen, onClose, children }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const targetElement = modalRef.current;

    if (isOpen && targetElement) {
      disableBodyScroll(targetElement); // Lock body scroll when modal is open
    } else if (targetElement) {
      enableBodyScroll(targetElement); // Unlock body scroll when modal is closed
    }

    return () => {
      if (targetElement) enableBodyScroll(targetElement); // Clean up
    };
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Show More Modal"
      overlayClassName={`show-more-modal-overlay ${window.innerWidth < 768 ? 'modal-mobile' : ''}`}
      className="show-more-modal-content"
      closeTimeoutMS={300}
      shouldCloseOnOverlayClick={true}
    >
      <div ref={modalRef}>
        <div className="modal-header">
          <button onClick={onClose} className="close-btn">Close</button>
        </div>
        <div className="show-more-modal-body">{children}</div>
      </div>
    </Modal>
  );
};

export default ShowMoreModal;
