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