import React, { useState } from 'react';
import styles from './navbar.module.css';

import { FaHome, FaRegHeart } from 'react-icons/fa';
import { FiLogIn } from 'react-icons/fi';
import { Button } from '../Button';
import { AuthModal } from '../Modals/AuthModal';

function NavBar() {
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
                <Button variant="primary" icon={<FiLogIn />} onClick={() => setIsModalOpen(true)}>
                    Entrar</Button>
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