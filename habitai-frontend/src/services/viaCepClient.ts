export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  estado: string;
  uf: string;
  complemento: string;
  erro?: boolean;
}

export const viaCepClient = {
  get: async (cep: string): Promise<ViaCepResponse> => {
    const cleanCep = cep.replace(/\D/g, ''); 

    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);

    if (!response.ok) {
      throw new Error('Erro ao buscar o CEP. Tente novamente.');
    }

    const data: ViaCepResponse = await response.json();

    if (data.erro) {
      throw new Error('CEP não encontrado ou inválido.');
    }
    return data;
  },
};