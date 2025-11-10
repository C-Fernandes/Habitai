import React, { useEffect, useState } from 'react';
import { getByOwner, getByTenant } from '../../services/contractService'; 
import type { Contract } from '../../types';
import { ContractCard } from '../ContractCard';
import { useAuth } from '../../context/AuthContext';
import styles from './index.module.css';
import Slider from 'react-slick'; 

const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    arrows: true,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
            }
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
            }
        }
    ]
};

export const ContractListByOwner: React.FC = () => {
    const { user } = useAuth();
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getByOwner(user!.id)
            .then(setContracts)
            .catch((err: any) => {
                console.error("Erro ao carregar contratos:", err);
                setContracts([])
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <p className={styles.loading}>Carregando contratos...</p>;
    }

    if (!contracts.length) {
        return <p className={styles.noResults}>Nenhum contrato encontrado.</p>;
    }

    return (
        <Slider {...settings}>
            {contracts.map((c) => (
                <div key={c.id} className={styles.cardWrapper}> 
                    <ContractCard 
                        contract={c} 
                        isOwner={true} 
                    />
                </div>
            ))}
        </Slider>
    );
};

export const ContractListByTenant: React.FC = () => {
    const { user } = useAuth();
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getByTenant(user!.id)
            .then(setContracts)
            .catch((err: any) => {
                console.error("Erro ao carregar contratos:", err);
                setContracts([])
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <p className={styles.loading}>Carregando contratos...</p>;
    }

    if (!contracts.length) {
        return <p className={styles.noResults}>Nenhum contrato encontrado.</p>;
    }

    return (
        <Slider {...settings}>
            {contracts.map((c) => (
                <div key={c.id} className={styles.cardWrapper}> 
                    <ContractCard 
                        contract={c} 
                        isOwner={false} 
                    />
                </div>
            ))}
        </Slider>
    );
};
