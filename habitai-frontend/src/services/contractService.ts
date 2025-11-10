import type { Contract } from "../types";

const API_BASE_URL = 'http://localhost:8080';


export async function getById(id: number): Promise<Contract> {
    const response = await fetch(`${API_BASE_URL}/contracts/`+id);
    if (!response.ok) throw new Error('Failed to fetch contracts');
    return await response.json();
}

export async function getByOwner(id: string): Promise<Contract[]> {
    const response = await fetch(`${API_BASE_URL}/contracts/byOwner/`+id);
    if (!response.ok) throw new Error('Failed to fetch contracts');
    return await response.json();
}

export async function getByTenant(id: string): Promise<Contract[]> {
    const response = await fetch(`${API_BASE_URL}/contracts/byTenant/`+id);
    if (!response.ok) throw new Error('Failed to fetch contracts');
    return await response.json();
}