import React from 'react';
import Modal from 'react-modal';

// Set the root element for the modal, required for accessibility.
Modal.setAppElement('#__next'); // If you are using Next.js, '#__next' is the app root.

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode; // Content to be displayed inside the modal
}

const CustomModal: React.FC<CustomModalProps> = ({ isOpen, onClose, children }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Example Modal"
      overlayClassName="modal-overlay"
      className="modal-content"
      closeTimeoutMS={300} // Optional, controls the animation time
    >
      <div className="modal-header">
        <button onClick={onClose} className="close-btn">X</button>
      </div>
      <div className="modal-body">
        {children}
      </div>
    </Modal>
  );
};

export default CustomModal;
