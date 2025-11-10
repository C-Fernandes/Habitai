import { apiClient } from "./apiClient";

export interface VisitRequestDTO {
    propertyId: number;
    dateTime: string;
    message?: string;
    userId: number;
}

export const visitService = {
    createVisit: async (data: VisitRequestDTO) => {
        const response = await apiClient.post("/visits", data);
        return response;
    },

    updateVisit: async (id: number, data: Partial<VisitRequestDTO>) => {
        const response = await apiClient.put(`/visits/${id}`, data);
        return response;
    },

    deleteVisit: async (id: number) => {
        await apiClient.delete(`/visits/${id}`);
    },

    getVisitsByUser: async (userId: number) => {
        const response = await apiClient.get(`/visits/user/${userId}`);
        return response;
    },

    getVisitsByPropertyOwner: async (ownerId: number) => {
        const response = await apiClient.get(`/visits/property/${ownerId}`);
        return response;
    },


    confirmVisit: async (visitId: number) => {
        // @ts-ignore
        const response = await apiClient.put(`/visits/${visitId}/confirm`);
        return response;
    },

    rejectVisit: async (visitId: number) => {
        // @ts-ignore
        const response = await apiClient.put(`/visits/${visitId}/reject`);
        return response;
    },

};
