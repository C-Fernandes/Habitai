import { useState } from 'react';
import styles from './navbar.module.css';

import { FaHome } from 'react-icons/fa';
import { FiLogIn } from 'react-icons/fi';
import { Button } from '../Button';
import { UserModal } from '../Modals/UserModal';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function NavBar() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const isLoggedIn = !!user;
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

                {isLoggedIn && (
                    <div className={styles.tabs_container}>
                        <div className={styles.tab}>
                            <a href='/my-properties'>Meus imóveis</a>
                        </div>

                        <div className={styles.tab}>
                            <a href='/contracts'>Meus contratos</a>
                        </div>
                        <div className={styles.tab}>
                            <a href='/visits'>Minhas visitas</a>
                        </div>
                    </div>
                )}

                <div className={styles.actionsContainer}>

                    {isLoggedIn ? (
                        <>
                            <span onClick={() => navigate('/me')}
                                className={styles.userNameContainer}>
                                <div className={styles.userIcon} >{user.name.charAt(0)}</div>
                                <div className={styles.userName}>Olá, {user.name.split(' ').slice(0, 2).join(' ')}</div>
                            </span>
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

            <UserModal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
            />
        </>
    );
}

export default NavBar;