import { FiLogOut, FiUser } from "react-icons/fi";
import { Button } from "../../components/Button";
import NavBar from "../../components/NavBar";
import { useAuth } from "../../context/AuthContext";
import { userService } from "../../services/userService";
import { useEffect, useState } from "react";
import type { User } from "../../types";


import styles from './userpage.module.css';
import { FaRegEdit } from "react-icons/fa";
import { UserModal } from "../../components/Modals/UserModal";
export function UserPage() {
    const { logout, user } = useAuth();
    const [userProfile, setUserProfile] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);

    const handleOpenEditModal = async () => {
        if (!user?.id) {
            setError("Usuário não logado.");
            return;
        }
        try {
            setIsUserModalOpen(true);

        } catch (err) {
            console.error("Erro ao carregar dados para edição:", err);
            setError("Não foi possível carregar os dados atualizados.");
        }
    };

    const handleCloseEditModal = () => {
        setIsUserModalOpen(false);
    };
    useEffect(() => {


        const fetchUserProfile = async () => {
            if (user?.id) {
                try {
                    const freshProfile = await userService.getById(user.id);
                    setUserProfile(freshProfile);
                } catch (error) {
                    console.error("Falha ao buscar perfil do usuário:", error);
                }
            }
            if (!user?.id) {
                setError("Usuário não encontrado no contexto de autenticação.");
                setIsLoading(false);
                return;
            }
            try {
                setIsLoading(true);
                const profile = await userService.getProfile(user.id);
                setUserProfile(profile);
                setError(null);
            } catch (err: any) {
                console.error("Erro ao carregar perfil:", err);
                setError("Não foi possível carregar as informações do usuário.");

            } finally {
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, [user]);
    if (error || !userProfile) {
        const displayError = error || "Não foi possível carregar os dados do perfil. Tente novamente.";
        return (
            <>
                <NavBar />
                <div className={styles.errorContainer}>
                    <p className={styles.errorMessage}>{displayError}</p>
                </div>
            </>
        );
    }
    return (
        <>
            <NavBar />
            <div className={styles.container}>
                <div className={styles.headingContainer}>
                    <div className={styles.heading}>
                        <FiUser className={styles.profileIcon} />
                        <h2>Bem-vindo, {userProfile?.name}</h2>
                    </div>
                    <FaRegEdit className={styles.editIcon} onClick={() => handleOpenEditModal()} />
                </div>
                <div className={styles.infoGroup}>
                    <p className={styles.infoLabel}>Email:</p>
                    <p className={styles.infoValue}>{userProfile?.email}</p>
                </div>

                <div className={styles.infoGroup}>
                    <p className={styles.infoLabel}>Telefone:</p>
                    <p className={styles.infoValue}>{userProfile?.phone || 'N/A'}</p>
                </div>

                <div className={styles.logoutContainer}>
                    <Button
                        variant="secondary"
                        icon={<FiLogOut />}
                        onClick={logout}
                    >
                        Logout
                    </Button>
                </div>
            </div>
            <UserModal isOpen={isUserModalOpen} onRequestClose={handleCloseEditModal} user={userProfile} />
        </>
    );

}

