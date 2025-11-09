import { apiClient } from "./apiClient";

export interface VisitRequestDTO {
    propertyId: number;
    date: string;
    message: string;
}

export const visitService = {
    async createVisit(data: VisitRequestDTO) {
        const response = await apiClient.post("/visits", data);
        return response;
    },
};
