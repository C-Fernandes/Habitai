import { useEffect, useState, type ReactNode } from "react";
import { apiClient } from "../services/apiClient";
import type { User } from "../types";

export type AuthUser = {
    id: string;
    name: string;
    email: string;
};

export type AuthContextType = {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, senha: string) => Promise<AuthUser>;
    logout: () => void;
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const storedUser = localStorage.getItem("loggedInUser");

        if (storedUser) {
            try {
                const userData: AuthUser = JSON.parse(storedUser);
                setUser(userData);
            } catch (error) {
                console.error("Erro ao analisar dados do usuário no localStorage", error);
                localStorage.removeItem("loggedInUser"); // Limpa dados corrompidos
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, senha: string): Promise<AuthUser> => {
        const response = await apiClient.post<AuthUser>('/users/login', { email, senha });
        const user: AuthUser = response;

        localStorage.setItem('loggedInUser', JSON.stringify(user));
        setUser(user);

        return user;
    };
    const logout = () => {
        localStorage.removeItem("loggedInUser");
        setUser(null);
    };
}