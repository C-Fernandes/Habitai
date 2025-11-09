import React, { useEffect, useState } from 'react';
import { getAllContracts} from '../../services/contractService'; 
import { Contract } from '../../types';
import { ContractCard } from '../ContractCard';
import { useAuth } from '../../context/AuthContext';


export const ContractList: React.FC = () => {
    const { user } = useAuth();
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllContracts()
            .then(setContracts)
            .catch((err: any) => {
                console.error("Erro ao carregar contratos:", err);
                setContracts([])
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <p className="loading">Carregando contratos...</p>;
    }

    if (!contracts.length) {
        return <p className="noResults">Nenhum contrato encontrado.</p>;
    }

    return (
        <div className="grid">
            {contracts.map((c) => (
                <ContractCard 
                    key={c.id}
                    contract={c} 
                    isOwner={user?.email == c.owner.email} 
                />
            ))}
        </div>
    );
};