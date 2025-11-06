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
    const [error, setError] = useState<string | null>(null);

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
            setError(null);
        }
    }, [isOpen, user]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

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
            } catch (error) {
                toast.error(ensureError(error).message);
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
                setError("As senhas não conferem.");
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

            } catch (error) {
                setError(ensureError(error).message);
            }
        }
    };

    const toggleView = () => {
        setView(prev => (prev === 'login' ? 'register' : 'login'));
        setFormData(emptyForm);
        setError(null);
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

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className={styles.input}
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                />

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

                {/* 7. CORRIGIDO: Usa 'showFullForm' */}
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
                <input
                    type="password"
                    name="password"
                    placeholder="Senha"
                    className={styles.input}
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                />
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

                {error && <p className={styles.errorText}>{error}</p>}

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