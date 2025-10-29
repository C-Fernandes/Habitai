import { useCallback, useEffect, useState } from "react";
import { apiClient } from "../services/apiClient";
import type { PaginatedProperties, Property } from "../types"; 
import styles from './welcomepage.module.css';
import { PropertyCard } from "../components/PropertyCard";
import { Button } from "../components/Button";

const PAGE_SIZE = 9;

export function WelcomePage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [currentPage, setCurrentPage] = useState(0); 
    const [hasNextPage, setHasNextPage] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPropertiesPage = useCallback(async (pageToLoad: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const endpoint = `/properties?page=${pageToLoad}&size=${PAGE_SIZE}`; // Ensure endpoint matches your backend
            const data = await apiClient.get<PaginatedProperties>(endpoint);

            setProperties(prevProperties =>
                pageToLoad === 0 ? data.content : [...prevProperties, ...data.content]
            );

            setHasNextPage(!data.last);
            setCurrentPage(pageToLoad);

        } catch (err: any) {
            console.error("Falha ao buscar imóveis:", err);
            setError(err.message || "Não foi possível carregar os imóveis.");
            if (pageToLoad === 0) {
                setProperties([]);
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        let ignore = false;

        const loadInitialPage = async () => {
            setProperties([]);
            setCurrentPage(-1);
            setHasNextPage(true);
            setIsLoading(true);
            setError(null);

            try {
                const endpoint = `/properties?page=0&size=${PAGE_SIZE}`;
                const data = await apiClient.get<PaginatedProperties>(endpoint);

                if (!ignore) {
                    setProperties(data.content);
                    setHasNextPage(!data.last);
                    setCurrentPage(0);
                }
            } catch (err: any) {
                 if (!ignore) {
                    console.error("Falha ao buscar imóveis iniciais:", err);
                    setError(err.message || "Não foi possível carregar os imóveis.");
                    setProperties([]);
                 }
            } finally {
                 if (!ignore) {
                    setIsLoading(false);
                 }
            }
        };
        loadInitialPage();

        return () => { ignore = true; };
    }, []);

    const handleLoadMore = () => {
        if (!isLoading && hasNextPage) {
            fetchPropertiesPage(currentPage + 1);
        }
    };

    console.log("Current properties:", properties); // Good for debugging, remove for production

    return (
        <div className={styles.container}>
            <h1 className={styles.pageTitle}>Imóveis Disponíveis</h1>

            {error && !isLoading && <div className={styles.errorText}>{error}</div>}

            <div className={styles.grid}>
                {properties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                ))}
            </div>

            <div className={styles.footer}>
                {isLoading && <div>Carregando...</div>}

                {!isLoading && hasNextPage && (
                    <Button onClick={handleLoadMore}>
                        Ver Mais Imóveis
                    </Button>
                )}
            </div>
        </div>
    );
}