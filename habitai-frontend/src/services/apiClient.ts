const BASE_URL = 'http://localhost:8080';

type HeadersType = {
    [key: string]: string;
};
const handleResponse = async (response: Response) => {
    if (response.status === 204) {
        return;
    }

    if (!response.ok) {
        const errorBody = await response.text();
        let errorJson;

        try {
            errorJson = JSON.parse(errorBody);
        } catch (e) {
            throw {
                message: errorBody || `Erro: ${response.statusText}`,
                status: response.status
            };
        }
        throw errorJson;
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return response.json();
    }

    return response.text();
};
const getAuthHeaders = (customHeaders: HeadersType = {}) => {
    const headers = { ...customHeaders };
    const token = localStorage.getItem('authToken');

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
};

export const apiClient = {
    get: async <T>(endpoint: string): Promise<T> => {
        const response = await fetch(`${BASE_URL}${endpoint}`, {

            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    },

    post: async <T>(endpoint: string, body: any): Promise<T> => {
        let headers = getAuthHeaders();
        let requestBody = body;

        if (!(body instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
            requestBody = JSON.stringify(body);
        }
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: headers,
            body: requestBody,
        });

        return handleResponse(response);
    },
    put: async <T>(endpoint: string, body: any): Promise<T> => {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(body),
        });
        return handleResponse(response);
    },

    delete: async (endpoint: string): Promise<void> => {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    },

    upload: async <T>(endpoint: string, file: File): Promise<T> => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `Erro HTTP: ${response.status}`);
        }
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return response.json();
        }
        return response.text() as unknown as T;
    }, patch: async <T>(endpoint: string, body?: any): Promise<T> => {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'PATCH',
            headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
            body: body ? JSON.stringify(body) : undefined,
        });
        return handleResponse(response);
    },
};