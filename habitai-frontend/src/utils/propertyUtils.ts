export const unFormatPriceInput = (value: string): string => {
    if (typeof value !== 'string') return '';
    return value.replace(/\./g, '');
};

export const formatAsCurrency = (value: string): string => {
    if (typeof value !== 'string') return '';
    const cleanValue = value.replace(/\D/g, '');
    if (!cleanValue) return ''; 
    return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const formatCep = (value: string): string => {
    if (typeof value !== 'string') return '';
    const cleanValue = value.replace(/\D/g, '');
    const limitedValue = cleanValue.slice(0, 8);
    return limitedValue.replace(/^(\d{5})(\d)/, '$1-$2');
};