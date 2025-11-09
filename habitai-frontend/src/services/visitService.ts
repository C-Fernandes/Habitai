import { apiClient } from "./apiClient";

export interface VisitRequestDTO {
    propertyId: number;
    dateTime: string;
    message: string;
}

export const visitService = {
    createVisit: async (data: { propertyId: number; dateTime: string; message?: string; userId: number }) => {
        const response = await apiClient.post("/visits", data);
        return response;
    },
};
