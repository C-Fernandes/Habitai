import { FiLogOut } from "react-icons/fi";
import { Button } from "../../components/Button";
import NavBar from "../../components/NavBar";
import { useAuth } from "../../context/AuthContext";
import { userService } from "../../services/userService";
import { useEffect, useState } from "react";
import type { User } from "../../types";


import styles from './userpage.module.css';
export function UserPage() {
    const { logout, user } = useAuth();
    const [userProfile, setUserProfile] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!user?.email) {
                setError("Email do usuário não encontrado no contexto de autenticação.");
                setIsLoading(false);
                return;
            }
            try {
                setIsLoading(true);
                const profile = await userService.getProfile(user.email);
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
    }, [user?.email]);
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
                <h1 className={styles.heading}>Bem-vindo, {userProfile?.name}</h1>

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
        </>
    );
}

