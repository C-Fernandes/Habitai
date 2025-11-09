// src/components/Modal/AuthModal/index.tsx

import React, { useEffect, useState, type FormEvent } from 'react';
import { BaseModal } from '../BaseModal';
import { Button } from '../../Button';
import styles from './usermodal.module.css';
import { userService } from '../../../services/userService';
import { toast } from 'sonner';
import { useAuth } from '../../../context/AuthContext';
import type { User } from '../../../types';
import { ensureError } from '../../../utils/errorUtils';
import { maskCPF, maskPhone } from '../../../utils/userUtils';

type AuthModalProps = {
    isOpen: boolean;
    onRequestClose: () => void;
    user?: User;
};
type ViewState = 'login' | 'register' | 'update';

const emptyForm = {
    name: '',
    email: '',
    cpf: '',
    phone: '',
    password: '',
    confirmPassword: ''
};
export function UserModal({ isOpen, onRequestClose, user }: AuthModalProps) {
    const [view, setView] = useState<ViewState>('login');
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        cpf: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [genericError, setGenericError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isOpen) {
            if (user) {
                setView('update');
                setFormData({
                    name: user.name || '',
                    email: user.email || '',
                    cpf: user.cpf || '',
                    phone: user.phone || '',
                    password: '',
                    confirmPassword: ''
                });
            } else {
                setView('login');
                setFormData(emptyForm);
            }
            setGenericError(null);
            setFieldErrors({});
        }
    }, [isOpen, user]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let maskedValue = value;
        if (name === 'cpf') {
            maskedValue = maskCPF(value);
        } else if (name === 'phone') {
            maskedValue = maskPhone(value);
        }
        setFormData(prev => ({ ...prev, [name]: maskedValue }));

        if (fieldErrors[name]) {
            setFieldErrors(prevErrors => ({
                ...prevErrors,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setGenericError(null);
        setFieldErrors({});

        if (view === 'update' && user) {
            try {
                const updateData = {
                    id: user.id,
                    name: formData.name,
                    phone: formData.phone,
                    cpf: formData.cpf,
                    email: formData.email,
                    password: formData.password ? formData.password : "",
                    confirmPassword: formData.confirmPassword ? formData.confirmPassword : "",
                };
                await userService.update(user.id, updateData);

                toast.success("Perfil atualizado com sucesso!");
                onRequestClose();
            } catch (rawError) {
                if (
                    rawError &&
                    typeof rawError === 'object' &&
                    'validationErrors' in rawError &&
                    (rawError as any).validationErrors
                ) {
                    setFieldErrors((rawError as any).validationErrors);
                    if ('message' in rawError) {
                        setGenericError((rawError as any).message);
                    }

                } else {
                    if (rawError && typeof rawError === 'object' && 'message' in rawError) {
                        setGenericError((rawError as any).message);
                    } else {
                        setGenericError("Ocorreu um erro inesperado.");
                    }
                }
            }
        }
        else if (view === 'login') {
            try {
                const loggedInUser = await login(formData.email, formData.password);
                toast.success(`Bem vindo ${loggedInUser.name}!`);
                onRequestClose();
            } catch (error) {
                toast.error(ensureError(error).message);
            }
        }
        else if (view === 'register') {
            if (formData.password !== formData.confirmPassword) {
                setGenericError("As senhas não conferem.");
                return;
            }

            try {
                const newUser = await userService.register({
                    name: formData.name,
                    email: formData.email,
                    cpf: formData.cpf,
                    phone: formData.phone,
                    password: formData.password,
                    confirmPassword: formData.confirmPassword,
                });

                toast.success(`Bem-vindo, ${newUser.name}! O seu registo foi concluído com sucesso.`);
                onRequestClose();

            } catch (rawError) {
                if (
                    rawError &&
                    typeof rawError === 'object' &&
                    'validationErrors' in rawError &&
                    (rawError as any).validationErrors
                ) {
                    setFieldErrors((rawError as any).validationErrors);
                    if ('message' in rawError) {
                        setGenericError((rawError as any).message);
                    }

                } else {
                    toast.error(ensureError(rawError).message);

                }
            }
        }
    };

    const toggleView = () => {
        setView(prev => (prev === 'login' ? 'register' : 'login'));
        setFormData(emptyForm);
        setGenericError(null);
        setFieldErrors({});
    };

    const getTitle = () => {
        if (view === 'login') return 'Entrar na sua Conta';
        if (view === 'register') return 'Criar Conta';
        return 'Atualizar Perfil';
    };
    const getButtonText = () => {
        if (view === 'login') return 'Entrar';
        if (view === 'register') return 'Registar';
        return 'Atualizar';
    };
    const showFullForm = view === 'register' || view === 'update';

    return (
        <BaseModal isOpen={isOpen} onRequestClose={onRequestClose}>

            <h2 className={styles.header}>
                {getTitle()}
            </h2>

            <form onSubmit={handleSubmit} className={styles.form}>

                {showFullForm && (
                    <input
                        type="text"
                        name="name"
                        placeholder="Nome Completo"
                        className={styles.input}
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                )}

                {fieldErrors.name && (
                    <p className={styles.fieldErrorText}>{fieldErrors.name}</p>
                )}

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className={styles.input}
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                />
                {fieldErrors.email && (
                    <p className={styles.fieldErrorText}>{fieldErrors.email}</p>
                )}

                {showFullForm && (
                    <input
                        type="text"
                        name="cpf"
                        placeholder="CPF"
                        className={styles.input}
                        value={formData.cpf}
                        onChange={handleInputChange}
                        required
                    />
                )}
                {fieldErrors.cpf && (
                    <p className={styles.fieldErrorText}>{fieldErrors.cpf}</p>
                )}

                {showFullForm && (
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Telefone (Opcional)"
                        className={styles.input}
                        value={formData.phone}
                        onChange={handleInputChange}
                    />
                )}

                {fieldErrors.phone && (
                    <p className={styles.fieldErrorText}>{fieldErrors.phone}</p>
                )}
                <input
                    type="password"
                    name="password"
                    placeholder="Senha"
                    className={styles.input}
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                />

                {fieldErrors.password && (
                    <p className={styles.fieldErrorText}>{fieldErrors.password}</p>
                )}
                {(view === 'register' || view === 'update') && (
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirme sua senha"
                        className={styles.input}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required={view === 'register' || !!formData.password}
                    />
                )}
                {fieldErrors.confirmPassword && (
                    <p className={styles.fieldErrorText}>{fieldErrors.confirmPassword}</p>
                )}

                <Button type="submit" style={{ width: '90%', margin: '10px 0' }}>
                    {getButtonText()}
                </Button>
            </form>

            <p className={styles.toggleText}>
                {view === "login" ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                <button onClick={toggleView} className={styles.toggleLink}>
                    {view === "login" ? ' Registe-se' : ' Faça login'}
                </button>
            </p>
        </BaseModal>
    );
}

function maskCelular(value: string): any {
    throw new Error('Function not implemented.');
}

