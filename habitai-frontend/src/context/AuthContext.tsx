import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { apiClient } from "../services/apiClient";
import type { User } from "../types";
import { userService } from "../services/userService";

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
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
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
                localStorage.removeItem("loggedInUser");
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, senha: string): Promise<AuthUser> => {
        const response = await userService.login(email, senha);
        const user: AuthUser = response;
        console.log("Usuario logado");
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        setUser(user);
        return user;
    };
    const logout = () => {
        localStorage.removeItem("loggedInUser");
        setUser(null);
    };
    const value: AuthContextType = {
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
    };

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center">Carregando...</div>;
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth deve ser usado dentro de um AuthProvider");
    }
    return context;
};