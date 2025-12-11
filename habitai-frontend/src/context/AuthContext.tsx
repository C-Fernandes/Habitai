import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { userService } from "../services/userService";
import { toast } from "sonner";
import { ensureError } from "../utils/errorUtils";

export type AuthUser = {
    id: string;
    name: string;
    email: string;
};

export type AuthContextType = {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, senha: string) => Promise<void>;
    logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const logout = () => {
        localStorage.removeItem("accessToken");
        setUser(null);
    };

    useEffect(() => {
        const validateSession = async () => {
            const token = localStorage.getItem("accessToken");

            if (token) {
                try {
                    const userData = await userService.getProfile();
                    setUser(userData);
                } catch (error) {
                    console.error("Token inválido ou expirado:", error);
                    logout();
                }
            }
            setIsLoading(false);
        };

        validateSession();
    }, []);

    const login = async (email: string, senha: string): Promise<void> => {
        try {
            const token = await userService.login(email, senha);

            localStorage.setItem('accessToken', token);

            const userData = await userService.getProfile();

            setUser(userData);

            console.log("Login realizado com sucesso:", userData);
        } catch (error) {
            const err = ensureError(error);
            toast.error(err.message);
            throw err;
        }
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