export type User = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    cpf: string;
};

export type UserRegisterData = {
    name: string;
    email: string;
    cpf: string;
    phone?: string;
    password: string;
    confirmPassword: string;
};

export type LoginCredentials = {
  email: string;
  password: string; 
};