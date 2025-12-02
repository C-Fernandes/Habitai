import type { Payment, PaymentStatus } from "../types";
import { apiClient } from "./apiClient";

const url = "/payments"

export interface PaymentPayload {
    dueDate: string;
    amountDue: number;
    paymentDate?: string | null;
    amountPaid?: number | null;
    status: PaymentStatus;
    idContract?: number | string
}

export async function getByContract(id: string|number): Promise<Payment[]>{
    return apiClient.get(`${url}/byContract/${id}`);
}

export async function create(payload: PaymentPayload): Promise<Payment> {
    return apiClient.post(url, payload);
}

export async function update(id: number|string, payload: PaymentPayload): Promise<Payment>{
    return apiClient.put(`${url}/${id}`,payload)
}

export async function deletePayment(id: string|number): Promise<void> {
    return apiClient.delete(`${url}/${id}`);
}