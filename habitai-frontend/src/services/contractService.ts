import type { export Contract } from "../types";

const API_BASE_URL = 'http://localhost:8080';

export async function getByOwner(): Promise<Contract[]> {
    const response = await fetch(`${API_BASE_URL}/contracts/byOwner/`);
    if (!response.ok) throw new Error('Failed to fetch properties');
    return await response.json();
}