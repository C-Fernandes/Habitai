import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiClient } from "../../services/apiClient";
import type { Property } from "../../types";
import styles from "./propertydetails.module.css";
import NavBar from "../../components/NavBar";
import { toast } from "sonner";
import {VisitModal} from "../../components/Modals/VisitModal/VisitModal.tsx";

export function PropertyDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const [property, setProperty] = useState<Property | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                setIsLoading(true);
                const data = await apiClient.get<Property>(`/properties/${id}`);
                setProperty(data);
            } catch {
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
    const loggedInUser = localStorage.getItem("loggedInUser");

    function handleReservaClick() {
        if (!loggedInUser) {
            toast.error("Você precisa estar logado para realizar uma reserva.");
            return;
        }
        setShowModal(true);
    }

    return (
        <>
            <NavBar />
            <div className={styles.container}>
                <img src={imageUrl} alt={property.title} className={styles.image} />
                <h1>{property.title}</h1>
                <p>
                    {property.address.street}, {property.address.city}
                </p>
                <p>
                    {property.bedrooms} quartos • {property.bathrooms} banheiros •{" "}
                    {property.garageSpaces} vagas
                </p>
                <p className={styles.price}>
                    R$ {property.rentalPrice?.toLocaleString("pt-BR")}/mês
                </p>
                <p>{property.description}</p>

                <div className={styles.buttonsRow}>
                    <button
                        onClick={() => window.history.back()}
                        className={styles.backButton}
                    >
                        ← Voltar
                    </button>
                    <button onClick={handleReservaClick} className={styles.reserveButton}>
                        Realizar Reserva
                    </button>
                </div>
            </div>

            {showModal && (
                <VisitModal
                    propertyId={property.id}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    );
}
