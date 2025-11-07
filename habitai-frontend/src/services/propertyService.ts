export interface PropertyResponseDTO {
    id: number;
    title: string;
    location: string;
    price: number;
    description: string;
    imageUrl?: string;
}

const API_BASE_URL = 'http://localhost:8080';

export async function getAllProperties(): Promise<PropertyResponseDTO[]> {
    const response = await fetch(`${API_BASE_URL}/properties`);
    if (!response.ok) throw new Error('Failed to fetch properties');
    return await response.json();
}
