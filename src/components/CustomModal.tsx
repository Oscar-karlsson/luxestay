import React, { useEffect } from 'react';
import Modal from 'react-modal';

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode; 
}

const CustomModal: React.FC<CustomModalProps> = ({ isOpen, onClose, children }) => {

  useEffect(() => {
    if (typeof window !== "undefined") {
      const nextElement = document.getElementById('__next');
      if (nextElement) {
        Modal.setAppElement(nextElement); // Set app element only on the client side
      }
    }
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Example Modal"
      overlayClassName="modal-overlay"
      className="modal-content"
      closeTimeoutMS={300}
    >
      <div className="modal-header">
       
      </div>
      <div className="modal-body">
        {children}
      </div>
    </Modal>
  );
};

export default CustomModal;
