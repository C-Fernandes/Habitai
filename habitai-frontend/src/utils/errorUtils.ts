export function ensureError(error: unknown): Error {
    if (error instanceof Error) {
        return error;
    }
    
    let errorMessage = "Erro inesperado";
    if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = String((error as { message: unknown }).message);
    } else if (typeof error === 'string') {
        errorMessage = error;
    }

    return new Error(errorMessage);
}