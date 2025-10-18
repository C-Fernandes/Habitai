// src/components/Modal/AuthModal/index.tsx

import React, { useState, type FormEvent } from 'react';
import { BaseModal } from '../BaseModal';
import { Button } from '../../Button';
import styles from './AuthModal.module.css';
import { userService } from '../../../services/userService';
import { toast } from 'sonner';

type AuthModalProps = {
    isOpen: boolean;
    onRequestClose: () => void;
};

export function AuthModal({ isOpen, onRequestClose }: AuthModalProps) {
    const [isLoginView, setIsLoginView] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        cpf: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null); 

        if (isLoginView) {
            try {
                await userService.login(formData.email, formData.password);
                onRequestClose(); 
            } catch (error: any) {
                console.error("Erro de login:", error);
                setError(error.message || "Email ou senha inválidos.");
            }
        } else {
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

                toast.success("Bem-vindo, ${newUser.name}! O seu registo foi concluído com sucesso.");
                onRequestClose(); 

            } catch (error: any) {
                console.error("Erro no registo:", error);
                setError(error.message || "Ocorreu um erro ao tentar registar.");
            }
        }
    };

    const toggleView = () => {
        setIsLoginView(prev => !prev);
        setFormData({ name: '', email: '', cpf: '', phone: '', password: '', confirmPassword: '' });
        setError(null);
    };

    return (
        <BaseModal isOpen={isOpen} onRequestClose={onRequestClose}>

            <h2 className={styles.header}>
                {isLoginView ? 'Entrar na sua Conta' : 'Criar Conta'}
            </h2>

            <form onSubmit={handleSubmit} className={styles.form}>

                {!isLoginView && (
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

                {!isLoginView && (
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

                {!isLoginView && (
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
                {!isLoginView && (
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirme sua senha"
                        className={styles.input}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                    />
                )}

                {error && <p className={styles.errorText}>{error}</p>}

                <Button type="submit" style={{ width: '90%', margin: '10px 0' }}>
                    {isLoginView ? 'Entrar' : 'Registar'}
                </Button>
            </form>

            <p className={styles.toggleText}>
                {isLoginView ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                <button onClick={toggleView} className={styles.toggleLink}>
                    {isLoginView ? ' Registe-se' : ' Faça login'}
                </button>
            </p>
        </BaseModal>
    );
}