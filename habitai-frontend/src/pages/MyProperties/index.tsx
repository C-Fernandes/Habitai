import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { PaginatedProperties, Property } from '../../types';
import { apiClient } from '../../services/apiClient';
import { PropertyCard } from '../../components/PropertyCard';
import { Button } from '../../components/Button';
import NavBar from '../../components/NavBar';
import styles from './MyProperties.module.css';
import { useAuth } from '../../context/AuthContext';

export function MyPropertiesPage() {
    const user = useAuth().user;
    const [properties, setProperties] = useState<Property[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchMyProperties = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await apiClient.get<PaginatedProperties>(`/properties/my-properties/${user?.id}`);
                setProperties(data.content);
            } catch (err: any) {
                setError(err.message || "Falha ao buscar seus imóveis.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchMyProperties();
    }, []);

    return (
        <>
        <NavBar />
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Meus Imóveis</h1>
                <Link to="/my-properties/register">
                    <Button>+ Anunciar Novo Imóvel</Button>
                </Link>
            </header>

            {error && <div className={styles.errorText}>{error}</div>}
            {isLoading && <div>Carregando...</div>}

            {!isLoading && !error && (
            <div className={styles.grid}>
                {properties.map((property) => (
                    <Link 
                        to={`/my-properties/edit/${property.id}`} 
                        key={property.id} 
                        className={styles.cardLink}
                    >
                        <PropertyCard property={property} showStatus={true} />
                    </Link>
                ))}
            </div>
            )}
            {!isLoading && properties.length === 0 && !error && (
                <p>Você ainda não cadastrou nenhum imóvel.</p>
            )}
        </div>
        </>
    );
}