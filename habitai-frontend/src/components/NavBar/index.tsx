import React, { useState } from 'react';
import styles from './navbar.module.css';

import { FaHome, FaRegHeart, FaUser } from 'react-icons/fa';
import { FiLogIn, FiLogOut } from 'react-icons/fi';
import { Button } from '../Button';
import { AuthModal } from '../Modals/AuthModal';
import { useAuth } from '../../context/AuthContext';

function NavBar() {
    const { user, logout } = useAuth(); const isLoggedIn = !!user;
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <>
            <header className={styles.navbar}>
                <a href="/" className={styles.logoContainer}>
                    <FaHome className={styles.logoIcon} />
                    <div className={styles.logoText}>
                        <div className={styles.title}>Habitaí</div>
                        <div className={styles.subtitle}>Encontre seu lar ideal</div>
                    </div>
                </a>

                <div className={styles.actionsContainer}>
                    <Button variant="secondary" icon={<FaRegHeart />} >
                        Favoritos</Button>
                    {isLoggedIn ? (
                        <>
                            <span className={styles.userNameDisplay}>
                                <FaUser className={styles.userIcon} />
                                Olá, {user.name.split(' ')[1]}
                            </span>

                            <Button
                                variant="secondary"
                                icon={<FiLogOut />}
                                onClick={logout}
                            >
                                Sair
                            </Button>
                        </>
                    ) : (
                        <Button
                            variant="primary"
                            icon={<FiLogIn />}
                            onClick={() => setIsModalOpen(true)}
                        >
                            Entrar
                        </Button>
                    )}
                </div>
            </header>

            <AuthModal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
            />
        </>
    );
}

export default NavBar;