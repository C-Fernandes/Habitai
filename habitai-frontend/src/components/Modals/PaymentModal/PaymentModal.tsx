import React, { useState, useEffect, type FormEvent } from "react";
import { BaseModal } from "../BaseModal";
import styles from './paymentmodal.module.css'
import { toast } from 'sonner';
import type { Payment, PaymentStatus } from "../../../types";
import { create, update, type PaymentPayload } from '../../../services/paymentService'; // Serviço real

const STATUS_DISPLAY_MAP: Record<PaymentStatus, string> = {
    PENDING: 'Pendente',
    PAID: 'Pago',
    OVERDUE: 'Atrasado',
    CANCELED: 'Cancelado',
};

type FormState = Omit<PaymentPayload, 'amountDue' | 'amountPaid'> & {
    amountDue: string;
    amountPaid: string;
};

type ViewState = 'create' | 'update';

type PaymentModalProps = {
    isOpen: boolean;
    onRequestClose: () => void;
    payment: Payment | null;
    contractValue: number;
    idContract?: number|string
    onPaymentUpdated?: () => void;
};

const emptyForm: FormState = {
    dueDate: new Date().toISOString().split("T")[0],
    amountDue: '',
    paymentDate: '',
    amountPaid: '',
    status: 'PENDING',
    idContract: '',
};

export function PaymentModal({
    isOpen,
    onRequestClose,
    payment,
    contractValue,
    idContract,
    onPaymentUpdated
}:PaymentModalProps) {
    
    const [view, setView] = useState<ViewState>('create');
    const [formData, setFormData] = useState<FormState>(emptyForm);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (payment) {
                setView('update');
                setFormData({
                    dueDate: payment.dueDate || '',
                    amountDue: String(payment.amountDue) || '',
                    paymentDate: payment.paymentDate || '',
                    amountPaid: String(payment.amountPaid || '') || '',
                    status: payment.status,
                    idContract: ''
                });
            } else {
                setView('create');
                setFormData({
                    ...emptyForm,
                    amountDue: String(contractValue),
                    idContract: Number(idContract),
                });
            }
        }
    }, [isOpen, payment, contractValue]);

    const handleClose = () => {
        onRequestClose();
    }
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let processedValue: Partial<FormState> = { [name]: value };

        if (name === 'amountDue' || name === 'amountPaid') {
            processedValue[name] = value.replace(/[^\d.]/g, '');
        }

        if (name === 'status' && value === 'PAID') {
            const today = new Date().toISOString().split("T")[0]; 

            processedValue = {
                ...processedValue,
                amountPaid: formData.amountDue,
                paymentDate: today, 
            };
        }

        setFormData(prev => ({ ...prev, ...processedValue }));
    };

    const getPayload = (): PaymentPayload => ({
        dueDate: formData.dueDate,
        amountDue: parseFloat(formData.amountDue) || 0,
        paymentDate: formData.paymentDate || null,
        amountPaid: parseFloat(formData.amountPaid) || null,
        status: formData.status as PaymentStatus,
        ...(view === 'create' && formData.idContract && { idContract: Number(formData.idContract) }),
    });

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const payload = getPayload();

        const amountDue = payload.amountDue;
        const amountPaid = payload.amountPaid || 0;

        if (amountPaid > amountDue) {
            toast.error("O Valor Pago não pode ser maior que o Valor Devido.");
            setIsLoading(false);
            return;
        }

        try {
            if (view === 'update' && payment) {
                await update(payment.id, payload);
                toast.success("Pagamento atualizado com sucesso!");
                if (onPaymentUpdated) { 
                    onPaymentUpdated(); 
                }
            } else {
                await create(payload);
                toast.success("Pagamento criado com sucesso!");
                if (onPaymentUpdated) { 
                    onPaymentUpdated(); 
                }
            }
            handleClose();
        } catch (rawError) {
            toast.error("Erro ao salvar pagamento. Verifique os dados.");
            console.error(rawError);
        } finally {
            setIsLoading(false);
        }
    };
    
    const getTitle = () => view === 'update' ? 'Editar Pagamento' : 'Criar Novo Pagamento';
    const getButtonText = () => view === 'update' ? 'Salvar Alterações' : 'Criar Pagamento';

    return(
        <BaseModal isOpen={isOpen} onRequestClose={handleClose}>
            <div className={styles.overlay}>
                <div className={styles.modal}>
                    <h2>{getTitle()}</h2>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        
                        <fieldset>
                            <legend>Detalhes</legend>
                            <div className={styles.dateGroup}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="dueDate">Data Vencimento (*):</label>
                                    <input
                                        type="date"
                                        name="dueDate"
                                        className={styles.input}
                                        value={formData.dueDate}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="amountDue">Valor Devido (R$ *):</label>
                                    <input
                                        type="number"
                                        name="amountDue"
                                        step="0.01"
                                        min="0.01"
                                        placeholder="R$00,00"
                                        className={styles.input}
                                        value={formData.amountDue}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.dateGroup}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="paymentDate">Data Pagamento:</label>
                                    <input
                                        type="date"
                                        name="paymentDate"
                                        className={styles.input}
                                        value={formData.paymentDate || ''}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="amountPaid">Valor Pago (R$):</label>
                                    <input
                                        type="number"
                                        name="amountPaid"
                                        step="0.01"
                                        min="0"
                                        placeholder="R$00,00"
                                        className={styles.input}
                                        value={formData.amountPaid || ''}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </fieldset>

                        <fieldset>
                            <legend>Status do Pagamento (*)</legend>
                            <div className={styles.formGroup}>
                                <select 
                                    id="status"
                                    name="status"
                                    className={styles.input}
                                    value={formData.status} 
                                    onChange={handleInputChange} 
                                    required
                                >
                                    {(Object.keys(STATUS_DISPLAY_MAP) as PaymentStatus[]).map((backendKey) => (
                                        <option 
                                            key={backendKey} 
                                            value={backendKey}
                                        >
                                            {STATUS_DISPLAY_MAP[backendKey]}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </fieldset>


                        <div className={styles.modalButtons}>
                            <button
                                type="button"
                                onClick={handleClose}
                                className={styles.cancel}
                                disabled={isLoading}
                            >
                                Cancelar
                            </button>
                            <button type="submit" disabled={isLoading}>
                                {isLoading ? 'Salvando...' : getButtonText()}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </BaseModal>
    )
}