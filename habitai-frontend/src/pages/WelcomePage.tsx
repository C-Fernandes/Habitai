import { useEffect, useState } from "react";
import { apiClient } from "../services/apiClient";
import type { Property } from "../types";
import styles from './welcomepage.module.css';
import { PropertyCard } from "../components/PropertyCard";
import NavBar from "../components/NavBar";

export function WelcomePage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                const data = await apiClient.get<Property[]>('/properties');
                setProperties(data);

            } catch (err: any) {
                console.error("Falha ao buscar imóveis:", err);
                setError("Não foi possível carregar os imóveis. Tente novamente mais tarde.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProperties();
    }, []);

    if (isLoading) {
        return <div className={styles.container}>Carregando imóveis...</div>;
    }

    if (error) {
        return <div className={styles.container}>{error}</div>;
    }

    return (
        <>
            <NavBar/>
            <div className={styles.container}>
                <h1 className={styles.pageTitle}>Imóveis Disponíveis</h1>
                <div className={styles.grid}>
                    {properties.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>
            </div>
        </>
    );
};