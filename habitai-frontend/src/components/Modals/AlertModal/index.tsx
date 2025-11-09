// src/components/Modals/AlertModal.tsx

import { FiAlertTriangle, FiInfo, FiAlertOctagon } from 'react-icons/fi';
import styles from './alertmodal.module.css';
import React from 'react';
import { BaseModal } from '../BaseModal';
import { Button } from '../../Button';

type AlertModalProps = {
    isOpen: boolean;
    onRequestClose: () => void;
    onConfirm: () => void;
    title: string;
    children: React.ReactNode;
    confirmButtonText?: string;
    cancelButtonText?: string;
    variant?: 'danger' | 'warning' | 'info';
};

const variants = {
    danger: {
        icon: FiAlertTriangle,
        className: styles.danger,
        buttonVariant: 'danger',
    },
    warning: {
        icon: FiAlertOctagon,
        className: styles.warning,
        buttonVariant: 'secondary', // Ajuste conforme seu <Button />
    },
    info: {
        icon: FiInfo,
        className: styles.info,
        buttonVariant: 'primary', // Ajuste conforme seu <Button />
    }
};

export function AlertModal({
    isOpen,
    onRequestClose,
    onConfirm,
    title,
    children,
    confirmButtonText = "Confirmar",
    cancelButtonText = "Cancelar",
    variant = 'danger' // Padrão é 'danger'
}: AlertModalProps) {

    const {
        icon: Icon,
        className: variantClass,
        buttonVariant
    } = variants[variant];

    return (
        <BaseModal isOpen={isOpen} onRequestClose={onRequestClose}>
            <div className={styles.alertContainer}>

                <div className={`${styles.iconWrapper} ${variantClass}`}>
                    <Icon className={styles.alertIcon} />
                </div>
                <h2 className={styles.alertTitle}>{title}</h2>
                <div className={styles.alertMessage}>
                    {children}
                </div>
                <div className={styles.alertButtons}>
                    <Button variant="secondary" onClick={onRequestClose}>
                        {cancelButtonText}
                    </Button>
                    <Button
                        variant={buttonVariant}
                        onClick={onConfirm}
                    >
                        {confirmButtonText}
                    </Button>
                </div>
            </div>
        </BaseModal>
    );
}