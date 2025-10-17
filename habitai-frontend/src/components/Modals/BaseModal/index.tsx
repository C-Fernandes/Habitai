import React from 'react';
import Modal from 'react-modal';
import styles from './BaseModal.module.css';
import { FiX } from 'react-icons/fi';

type BaseModalProps = {
    isOpen: boolean;
    onRequestClose: () => void;
    children: React.ReactNode; 
};
export function BaseModal({ isOpen, onRequestClose, children }: BaseModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className={styles.modalContent}
            overlayClassName={{
                base: styles.overlay,
                afterOpen: styles.overlayAfterOpen,
                beforeClose: styles.overlayBeforeClose,
            }}
            closeTimeoutMS={200} >
            <button onClick={onRequestClose} className={styles.closeButton} aria-label="Fechar modal">
                <FiX />
            </button>

            {children}
        </Modal>
    );
}