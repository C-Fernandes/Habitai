export const maskCPF = (value: string): string => {
  return value
    .replace(/[^\d]/g, '') 
    .slice(0, 11)          
    .replace(/(\d{3})(\d)/, '$1.$2') 
    .replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3') 
    .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})/, '$1.$2.$3-$4'); 
};

export const maskPhone = (value: string): string => {
  return value
    .replace(/[^\d]/g, '')
    .slice(0, 11)          
    .replace(/(\d{2})(\d)/, '($1) $2') 
    .replace(/(\(\d{2}\)) (\d{5})(\d)/, '$1 $2-$3'); 
};