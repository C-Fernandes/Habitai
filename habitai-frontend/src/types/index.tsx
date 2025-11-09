export type User = {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    cpf: string;
    password: string;
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

export type Image = {
  id: number;
  imagePath: string;
  contentType: string;
  propertyId: number;
};

export type Address = {
  id: number;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
};

export type Property = {
  id: number;
  title: string;
  description: string;
  rentalPrice: number;
  bedrooms: number;
  bathrooms: number;
  garageSpaces: number;
  totalArea: number;
  images: Image[];
  address: Address;
  owner: Owner;
  amenities: Amenity[];
  contracts: Contract[];
};

export type PaginatedProperties = {
  content: Property[];
  last: boolean;
  totalPages: number;
  totalElements: number;
};

export type Amenity = {
  id: number;
  name: string;
}

export type Owner = {
  id: number;
  name: string;
  phone: string;
  email: string;
}



export type ContractUser = {
  name: string;
  phone: string;
  email: string;
  cpf: string;
}
export type ContractProperty = {
  id: number;
  title: string;
  rentalPrice: number;
  neighborhood: string;
  city: string;
  state: string;
};

export type Contract = {
  id: number;
  startDate: string;
  endDate: string;
  monthlyPrice: number;
  paymentDueDay: number;
  property: ContractProperty;
  tenant: ContractUser;
  owner: ContractUser;
  payments: Payment[];
}

export type PaymentStatus = 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELED';

export type Payment = {
  id: number;
  dueDate: string;
  paymentDate?: string; 
  amountDue: number;
  amountPaid?: number;
  status: PaymentStatus;
}