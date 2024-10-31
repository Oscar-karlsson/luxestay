"use client";
import { useEffect } from "react";
import Modal from "react-modal";

const ModalInitializer = () => {
    useEffect(() => {
      Modal.setAppElement("body");  // Use "body" instead of "#__next"
    }, []);
  
    return null;
  };

export default ModalInitializer;