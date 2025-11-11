import type { Contract } from "../types";
import { apiClient } from "./apiClient";

const url = "/contracts";

interface ContractPayload {
    startDate: string; 
    endDate: string; 
    monthlyPrice: number; 
    paymentDueDay: number; 
    propertyId: number; 
    tenantCpf: string; 
    ownerCpf: string; 
}

export async function getById(id: number|string): Promise<Contract> {
    return apiClient.get(url+id);
}

export async function getByOwner(id: string): Promise<Contract[]> {
    return apiClient.get(`${url}/byOwner/`+id);
}

export async function getByTenant(id: string): Promise<Contract[]> {
    return apiClient.get(`${url}/byTenant/`+id);
}

export async function create(payload: ContractPayload): Promise<Contract> {
    return apiClient.post(url, payload);
}

export async function update(id: string|number, payload: ContractPayload): Promise<Contract> {
    return apiClient.put(`${url}/${id}`, payload);
}

export async function deleteContract(id: string|number): Promise<void> {
    return apiClient.delete(`${url}/${id}`);
}