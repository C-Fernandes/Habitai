import { AlertTriangle } from 'lucide-react';
import { BaseModal } from '../BaseModal';
import { Button } from '../../Button';
import styles from './ConfirmModal.module.css';

type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
};

export function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  description, 
  confirmLabel = "Confirmar",
  isDestructive = false,
  isLoading = false
}: ConfirmModalProps) {
  
  return (
    <BaseModal isOpen={isOpen} onRequestClose={onClose}>
      <div className={styles.container}>
        <div className={styles.iconWrapper}>
          <AlertTriangle size={48} className={styles.icon} />
        </div>
        
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>

        <div className={styles.actions}>
          <button 
            className={styles.cancelButton} 
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </button>
          
          <Button 
            onClick={onConfirm} 
            disabled={isLoading}
            className={isDestructive ? styles.destructiveButton : ''}
          >
            {isLoading ? "Processando..." : confirmLabel}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}