// src/components/Modal/AuthModal/index.tsx

import React, { useState, type FormEvent } from 'react';
import { BaseModal } from '../BaseModal';
import { Button } from '../../Button';
import styles from './AuthModal.module.css';

// 1. Define os tipos para as props que este componente recebe
type AuthModalProps = {
    isOpen: boolean;
    onRequestClose: () => void;
};

export function AuthModal({ isOpen, onRequestClose }: AuthModalProps) {
    const [isLoginView, setIsLoginView] = useState(true);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (isLoginView) {
            console.log('Tentativa de Login:', { email: formData.email, password: formData.password });
        } else {
            console.log('Tentativa de Registo:', formData);
        }
        onRequestClose();
    };

    const toggleView = () => {
        setIsLoginView(prev => !prev);
        setFormData({ name: '', email: '', password: '' });
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

                <input
                    type="password"
                    name="password"
                    placeholder="Senha"
                    className={styles.input}
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                />

                <Button type="submit" fullWidth size="large">
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