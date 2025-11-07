import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiClient } from "../../services/apiClient";
import type { Property } from "../../types";
import styles from "./propertydetails.module.css";
import NavBar from "../../components/NavBar";

export function PropertyDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const [property, setProperty] = useState<Property | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await apiClient.get<Property>(`/properties/${id}`);
                setProperty(data);
            } catch (err) {
                console.error("Erro ao carregar imóvel:", err);
                setError("Não foi possível carregar o imóvel.");
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchProperty();
    }, [id]);

    if (isLoading) return <div className={styles.container}>Carregando...</div>;
    if (error) return <div className={styles.container}>{error}</div>;
    if (!property) return <div className={styles.container}>Imóvel não encontrado.</div>;

    const firstImage = property.images?.[0]?.imagePath;
    const API_BASE_URL = "http://localhost:8080";
    const imageUrl = `${API_BASE_URL}/${firstImage}`;

    return (
        <>
            <NavBar />
            <div className={styles.container}>
                <img src={imageUrl} alt={property.title} className={styles.image} />
                <h1 className={styles.title}>{property.title}</h1>

                <p className={styles.price}>
                    R$ {property.rentalPrice?.toLocaleString("pt-BR")}/mês
                </p>

                <p className={styles.address}>
                    {property.address.street}, {property.address.number} –{" "}
                    {property.address.neighborhood}, {property.address.city} -{" "}
                    {property.address.state}
                </p>

                <p className={styles.details}>
                    {property.bedrooms} quartos • {property.bathrooms} banheiros •{" "}
                    {property.garageSpaces} vagas • {property.totalArea} m²
                </p>

                <p className={styles.description}>{property.description}</p>

                <div className={styles.ownerBox}>
                    <h3>Proprietário</h3>
                    <p><strong>{property.owner.name}</strong></p>
                    <p>{property.owner.phone}</p>
                    <p>{property.owner.email}</p>
                </div>

                <button
                    onClick={() => window.history.back()}
                    className={styles.backButton}
                >
                    ← Voltar
                </button>
            </div>
        </>
    );
}
