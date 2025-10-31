import { useCallback, useEffect, useState } from "react";
import { apiClient } from "../../services/apiClient";
import { PropertyCard } from "../PropertyCard";
import { Button } from "../Button";
import styles from './propertylisting.module.css'; 
import type { PaginatedProperties, Property } from "../../types";

const PAGE_SIZE = 9;
interface FilterState {
    city: string;
    state: string;
    minPrice: string;
    maxPrice: string;
}

export function PropertyListing() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [currentPage, setCurrentPage] = useState(0); 
    const [hasNextPage, setHasNextPage] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filterInputs, setFilterInputs] = useState<FilterState>({
        city: '',
        state: '',
        minPrice: '',
        maxPrice: ''
    });
    const [activeFilters, setActiveFilters] = useState<FilterState>(filterInputs);

    const fetchPropertiesPage = useCallback(async (
        pageToLoad: number,
        filters: FilterState,
        isNewSearch: boolean 
    ) => {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams();
        params.append('page', String(pageToLoad));
        params.append('size', String(PAGE_SIZE));
        if (filters.city) params.append('city', filters.city);
        if (filters.state) params.append('state', filters.state);
        if (filters.minPrice) params.append('minPrice', filters.minPrice);
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

        try {
            const endpoint = `/properties?${params.toString()}`; 
            const data = await apiClient.get<PaginatedProperties>(endpoint);

            setProperties(isNewSearch ? data.content : prev => [...prev, ...data.content]);

            setHasNextPage(!data.last);
            setCurrentPage(pageToLoad);
            setActiveFilters(filters);

        } catch (err: any) {
            console.error("Falha ao buscar imóveis:", err);
            setError(err.message || "Não foi possível carregar os imóveis.");
            if (isNewSearch) {
                setProperties([]);
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        let ignore = false;
        
        const loadInitialPage = async () => {
            setIsLoading(true);
            setError(null);
            
            const initialFilters: FilterState = { city: '', state: '', minPrice: '', maxPrice: '' };

            const params = new URLSearchParams();
            params.append('page', '0');
            params.append('size', String(PAGE_SIZE));

            try {
                const endpoint = `/properties?${params.toString()}`;
                const data = await apiClient.get<PaginatedProperties>(endpoint);

                if (!ignore) {
                    setProperties(data.content);
                    setHasNextPage(!data.last);
                    setCurrentPage(0);
                    setActiveFilters(initialFilters);
                }
            } catch (err: any) {
                 if (!ignore) {
                    setError(err.message || "Não foi possível carregar os imóveis.");
                    setProperties([]);
                }
            } finally {
                 if (!ignore) setIsLoading(false);
            }
        };
        loadInitialPage();
        
        return () => { ignore = true; };
    }, []);

    const handleLoadMore = () => {
        if (!isLoading && hasNextPage) {
            fetchPropertiesPage(currentPage + 1, activeFilters, false);
        }
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilterInputs(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => {
        if (!isLoading) fetchPropertiesPage(0, filterInputs, true);
    };

    return (
        <> 
            {error && !isLoading && <div className={styles.errorText}>{error}</div>}
            <div className={styles.filterBar}>
                <input
                    type="text"
                    name="city"
                    placeholder="Cidade"
                    value={filterInputs.city}
                    onChange={handleFilterChange}
                    className={styles.filterInput}
                />
                <input
                    type="text"
                    name="state"
                    placeholder="Estado"
                    value={filterInputs.state}
                    onChange={handleFilterChange}
                    className={styles.filterInput}
                />
                <input
                    type="number"
                    name="minPrice"
                    placeholder="Preço Mín."
                    value={filterInputs.minPrice}
                    onChange={handleFilterChange}
                    className={styles.filterInput}
                />
                <input
                    type="number"
                    name="maxPrice"
                    placeholder="Preço Máx."
                    value={filterInputs.maxPrice}
                    onChange={handleFilterChange}
                    className={styles.filterInput}
                />
                <Button onClick={handleSearch} disabled={isLoading}>
                    Buscar
                </Button>
            </div>

            <div className={styles.grid}>
                {properties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                ))}
            </div>

            <div className={styles.footer}>
                {!isLoading && hasNextPage && (
                    <Button variant='fullWidth' onClick={handleLoadMore}>
                        Ver Mais
                    </Button>
                )}
            </div>
        </>
    );
}