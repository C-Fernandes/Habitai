import React, { useState, useEffect, type FormEvent } from 'react';
import { BaseModal } from '../BaseModal';
import styles from './contractmodal.module.css'; 
import { toast } from 'sonner';
import { ensureError } from '../../../utils/errorUtils';
import { maskCPF } from '../../../utils/userUtils';
import type { Contract, Property } from '../../../types'; 
import { create, update } from '../../../services/contractService'; 
import { useNavigate } from 'react-router-dom';
import { userService } from '../../../services/userService';


interface ContractPayload {
    startDate: string; 
    endDate: string; 
    monthlyPrice: number;
    paymentDueDay: number; 
    propertyId: number; 
    tenantCpf: string; 
    ownerCpf: string; 
}

type FormState = Omit<ContractPayload, 'monthlyPrice' | 'paymentDueDay' | 'propertyId'> & {
    monthlyPrice: string;
    paymentDueDay: string;
    propertyId: string;
};
type ViewState = 'create' | 'update';

type ContractModalProps = {
    isOpen: boolean;
    onRequestClose: () => void;
    contract?: Contract; 
    propertyToPreFill?: Property;
    onContractUpdated?: () => void;
};

const emptyForm: FormState = {
    startDate: new Date().toISOString().split("T")[0],
    endDate: '',
    monthlyPrice: '',
    paymentDueDay: '10',
    propertyId: '',
    tenantCpf: '',
    ownerCpf: '',
};

export function ContractModal(
    { 
        isOpen, 
        onRequestClose, 
        contract, 
        propertyToPreFill,
        onContractUpdated
    }: ContractModalProps) {
    const [view, setView] = useState<ViewState>('create');
    const [formData, setFormData] = useState<FormState>(emptyForm);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            if (contract) {
                setView('update');
                setFormData({
                    startDate: contract.startDate || '',
                    endDate: contract.endDate || '',
                    monthlyPrice: String(contract.monthlyPrice) || '',
                    paymentDueDay: String(contract.paymentDueDay) || '',
                    propertyId: String(contract.property.id) || '',
                    tenantCpf: contract.tenant.cpf || '',
                    ownerCpf: contract.owner.cpf || '',
                });
            } else {
                setView('create');
                setFormData({
                    ...emptyForm,
                    propertyId: propertyToPreFill?.id ? String(propertyToPreFill.id) : '',
                    monthlyPrice: propertyToPreFill?.rentalPrice ? String(propertyToPreFill.rentalPrice) : ''
                });
                if (propertyToPreFill?.owner.id) {
                    fetchOwnerCpf(String(propertyToPreFill?.owner.id));
                }
            }
            setFieldErrors({});
        }
    }, [isOpen, contract, propertyToPreFill]);

    const fetchOwnerCpf = async (ownerId: string) => {
        try {
            const owner = await userService.getById(ownerId);
            if (owner.cpf) {
                const maskedCpf = maskCPF(owner.cpf);
                setFormData(prev => ({
                    ...prev,
                    ownerCpf: maskedCpf,
                }));
            }
        } catch (error) {
            console.error("Erro ao buscar CPF do proprietário:", ensureError(error));
            toast.warning("Não foi possível pré-preencher o CPF do Proprietário. Por favor, insira manualmente.");
        }
    };

    const handleClose = () => {
        onRequestClose();
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let maskedValue = value;

        if (name === 'tenantCpf' || name === 'ownerCpf') {
            maskedValue = maskCPF(value);
        } else if (['monthlyPrice', 'propertyId'].includes(name)) {
            maskedValue = value.replace(name === 'monthlyPrice' ? /[^\d.]/g : /[^\d]/g, '');
        }

        setFormData(prev => ({ ...prev, [name]: maskedValue }));

        if (fieldErrors[name]) {
            setFieldErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
        }
    };

    const getPayload = (): ContractPayload => ({
        startDate: formData.startDate,
        endDate: formData.endDate,
        monthlyPrice: parseFloat(formData.monthlyPrice) || 0,
        paymentDueDay: parseInt(formData.paymentDueDay, 10) || 0,
        propertyId: parseInt(formData.propertyId, 10) || 0,
        tenantCpf: formData.tenantCpf,
        ownerCpf: formData.ownerCpf,
    });

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setFieldErrors({});

        if (formData.startDate && formData.endDate) {
            const start = new Date(formData.startDate);
            const end = new Date(formData.endDate);

            if (start >= end) {
                setFieldErrors({
                    ...fieldErrors,
                    endDate: "A data de fim deve ser posterior à data de início.",
                });
                toast.error("A data de fim deve ser posterior à data de início.");
                return;
            }
        }

        const payload = getPayload();

        try {
            if (view === 'update' && contract) {
                await update(contract.id, payload);
                toast.success("Contrato atualizado com sucesso!");
                if (onContractUpdated) { 
                    onContractUpdated(); 
                }
            } else {
                const createdContract = await create(payload);
                toast.success("Contrato criado com sucesso!");
                navigate("/contracts/"+createdContract.id);
            }
                        
            handleClose();
        } catch (rawError) {
            const error = ensureError(rawError);
            if ('validationErrors' in error && error.validationErrors) {
                setFieldErrors(error.validationErrors as Record<string, string>);
            } else {
                toast.error(error.message);
            }
        }
    };

    const getTitle = () => view === 'update' ? 'Editar Contrato' : 'Criar Novo Contrato';
    const getButtonText = () => view === 'update' ? 'Salvar Alterações' : 'Criar Contrato';

    return (
        <BaseModal isOpen={isOpen} onRequestClose={handleClose}>
            <div className={styles.overlay}>
            <div className={styles.modal}>
            <h2 className={styles.header}>
                {getTitle()}
            </h2>

            <form onSubmit={handleSubmit} className={styles.form}>
                <fieldset>
                    <legend>Detalhes e Valores</legend>
                    <div className={styles.dateGroup}>
                        <div className={styles.formGroup}>
                            <label htmlFor="startDate">Data de Início (*):</label>
                            <input
                                type="date"
                                name="startDate"
                                className={styles.input}
                                value={formData.startDate}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="endDate">Data de Fim (*):</label>
                            <input
                                type="date"
                                name="endDate"
                                className={styles.input}
                                value={formData.endDate}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.numericGroup}>
                        <div className={styles.formGroup}>
                            <label htmlFor="monthlyPrice">Preço Mensal (R$ *):</label>
                            <input
                                type="number"
                                name="monthlyPrice"
                                step="0.01"
                                min="0.01"
                                placeholder="R$00,00"
                                className={styles.input}
                                value={formData.monthlyPrice}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                        <label htmlFor="paymentDueDay">Dia de Vencimento (*):</label>
                        <select 
                            id="paymentDueDay"
                            name="paymentDueDay"
                            className={styles.input}
                            value={formData.paymentDueDay}
                            onChange={handleInputChange} 
                            required
                        >
                            <option value="" disabled>Selecione o Dia</option>
                            {[...Array(31)].map((_, i) => (
                                <option key={i + 1} value={String(i + 1)}>
                                    Dia {i + 1}
                                </option>
                            ))}
                        </select>
                        {fieldErrors.paymentDueDay && (<p className={styles.fieldErrorText}>{fieldErrors.paymentDueDay}</p>)}
                        </div>
                    </div>
                </fieldset>

                {/* INFORMAÇÕES DE IDENTIFICAÇÃO (CPFs) */}
                <fieldset>
                    <legend>Identificação das Partes</legend>
                    <div className={styles.dateGroup}>
                        <div className={styles.formGroup}>
                            <label htmlFor="tenantCpf">CPF do Locatário (*):</label>
                            <input
                                type="text"
                                name="tenantCpf"
                                placeholder="000.000.000-00"
                                className={styles.input}
                                value={formData.tenantCpf}
                                onChange={handleInputChange}
                                required
                                maxLength={14}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="ownerCpf">CPF do Proprietário (*):</label>
                            <input
                                type="text"
                                name="ownerCpf"
                                placeholder="000.000.000-00"
                                className={styles.input}
                                value={formData.ownerCpf}
                                onChange={handleInputChange}
                                required
                                maxLength={14}
                                disabled={view === 'create' && !!propertyToPreFill?.owner.id}
                            />         
                        </div>        
                    </div>
                    <p className={styles.note}>
                        O CPF será validado pelo sistema e deve estar cadastrado.
                    </p>
                </fieldset>

                <div className={styles.modalButtons}>
                    <button
                        type="button"
                        onClick={handleClose}
                        className={styles.cancel}
                    >
                        Cancelar
                    </button>
                    <button type="submit">
                        {getButtonText()}
                    </button>
                </div>
            </form>
</div></div>
        </BaseModal>
    );
}