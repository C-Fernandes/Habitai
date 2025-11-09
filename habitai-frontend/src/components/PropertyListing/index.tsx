import { useCallback, useEffect, useState, useRef } from "react";
import { apiClient } from "../../services/apiClient";
import { PropertyCard } from "../PropertyCard";
import { Button } from "../Button";
import { SlArrowDown } from "react-icons/sl";
import styles from './propertylisting.module.css'; 
import type { PaginatedProperties, Property } from "../../types";

const PAGE_SIZE = 9;
interface FilterState {
    city: string;
    state: string;
    minPrice: string;
    maxPrice: string;
}

const unFormatPriceInput = (value: string): string => {
    return value.replace(/\./g, '');
};

const formatPriceInput = (value: string): string => {
    const rawValue = value.replace(/\D/g, '');
    if (!rawValue) return '';
    return rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

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
    const [tempPriceInputs, setTempPriceInputs] = useState({
        minPrice: '',
        maxPrice: ''
    });
    const [activeFilters, setActiveFilters] = useState<FilterState>(filterInputs);
    const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false);
    const priceDropdownRef = useRef<HTMLDivElement>(null);

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
        if (filters.minPrice) params.append('minPrice', unFormatPriceInput(filters.minPrice));
        if (filters.maxPrice) params.append('maxPrice', unFormatPriceInput(filters.maxPrice));

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
        function handleClickOutside(event: MouseEvent) {
            if (priceDropdownRef.current && !priceDropdownRef.current.contains(event.target as Node)) {
                setIsPriceDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
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
        if (name === "minPrice" || name === "maxPrice") {
            const formattedValue = formatPriceInput(value);
            setTempPriceInputs(prev => ({ ...prev, [name]: formattedValue }));
        } else {
            setFilterInputs(prev => ({ ...prev, [name]: value }));
        }
    };

const handleApplyPriceFilter = () => {
        const minStr = unFormatPriceInput(tempPriceInputs.minPrice);
        const maxStr = unFormatPriceInput(tempPriceInputs.maxPrice);

        let min = parseFloat(minStr) || 0;
        let max = parseFloat(maxStr) || 0;

        if (min >= 50000) min = 49999;
        if (max >= 50000) max = 49999;
        if (max > 0 && min > max) {
            max = 49999;
        }

        const finalMinStr = min === 0 ? '' : formatPriceInput(String(min));
        const finalMaxStr = max === 0 ? '' : formatPriceInput(String(max));
        
        setFilterInputs(prev => ({
            ...prev,
            minPrice: finalMinStr,
            maxPrice: finalMaxStr
        }));
        
        setTempPriceInputs({
            minPrice: finalMinStr,
            maxPrice: finalMaxStr
        });
        setIsPriceDropdownOpen(false);
    };

    const handleSearch = () => {
        if (!isLoading) fetchPropertiesPage(0, filterInputs, true);
    };

    const getPriceButtonText = () => {
        const { minPrice, maxPrice } = filterInputs;
        if (minPrice && maxPrice) return `R$ ${minPrice} - R$ ${maxPrice}`;
        if (minPrice) return `A partir de R$ ${minPrice}`;
        if (maxPrice) return `Até R$ ${maxPrice}`;
        return "Preço";
    };

    const togglePriceDropdown = () => {
        if (!isPriceDropdownOpen) {
            setTempPriceInputs({
                minPrice: filterInputs.minPrice,
                maxPrice: filterInputs.maxPrice
            });
        }
        setIsPriceDropdownOpen(prev => !prev);
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

                <div className={styles.filterPriceWrapper} ref={priceDropdownRef}>
                    <button
                        type="button"
                        className={styles.filterButton}
                        onClick={togglePriceDropdown}
                    >
                        {getPriceButtonText()}
                        <span className={styles.arrowIcon}><SlArrowDown/></span>
                    </button>
                    
                    {isPriceDropdownOpen && (
                        <div className={styles.priceDropdown}>
                            <p className={styles.dropdownLabel}>Faixa de Preço</p>
                            
                            <div className={styles.priceDropdownInputs}>
                                <div>
                                    <label htmlFor="minPrice" className={styles.inputLabel}>
                                        Mínimo
                                    </label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        id="minPrice"
                                        name="minPrice"
                                        placeholder="R$"
                                        value={tempPriceInputs.minPrice}
                                        onChange={handleFilterChange}
                                        className={styles.filterInput}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="maxPrice" className={styles.inputLabel}>
                                        Máximo
                                    </label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        id="maxPrice"
                                        name="maxPrice"
                                        placeholder="R$"
                                        value={tempPriceInputs.maxPrice}
                                        onChange={handleFilterChange}
                                        className={styles.filterInput}
                                    />
                                </div>
                            </div>
                            
                            <Button 
                                onClick={handleApplyPriceFilter} 
                                className={styles.applyPriceButton}
                            >
                                Aplicar
                            </Button>
                        </div>
                    )}
                </div>
                <Button onClick={handleSearch} disabled={isLoading} className={styles.filterSearchButton}>
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
                    <Button onClick={handleLoadMore}>
                        Ver Mais Imóveis
                    </Button>
                )}
            </div>
        </>
    );
}