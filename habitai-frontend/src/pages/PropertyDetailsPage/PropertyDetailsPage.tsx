import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiClient } from "../../services/apiClient";
import type { Contract, Property } from "../../types";
import styles from "./propertydetails.module.css";
import NavBar from "../../components/NavBar";
import { toast } from "sonner";
import {VisitModal} from "../../components/Modals/VisitModal/VisitModal.tsx";
import { ContractModal } from "../../components/Modals/ContractModal/ContractModal.tsx";
import { useAuth } from "../../context/AuthContext.tsx";

export function PropertyDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const [property, setProperty] = useState<Property | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showVisitModal, setshowVisitModal] = useState(false);
    const [showContractModal, setShowContractModal] = useState(false);
    const { user, isAuthenticated } = useAuth();

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
        setshowVisitModal(true);
    }

    function handleCreateContractClick() {
        if (user && property && user.id == property.owner.id.toString()) {
            setShowContractModal(true);
        } else {
            toast.error("Você não tem permissão para criar um contrato para este imóvel.");
        }
    }

    function handleContractModalClose(savedContract?: Contract) {
        setShowContractModal(false);
        if (savedContract) {
            toast.success("Contrato processado com sucesso!");
        }
    }

    return (
        <>
            <NavBar />
            <div className={styles.container}>
                <img src={imageUrl} alt={property.title} className={styles.image} />
                <div className={styles.topInfo}>
                    <h1 className={styles.title}>{property.title}</h1>
                </div>
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
                <div className={styles.amenities}>
                    <h3>Comodidades:</h3>
                    <ul className={styles.amenitiesList}>
                        {property.amenities.map((amenity)=> (
                            <li key={amenity.id} className={styles.amenityItem}>
                                {amenity.name}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className={styles.buttonsRow}>
                    <button
                        onClick={() => window.history.back()}
                        className={styles.backButton}
                    >
                        ← Voltar
                    </button>

                    {user && property.owner && user.id == property.owner.id.toString() ?
                        <button 
                            className={styles.contractButton}
                            onClick={handleCreateContractClick}
                            type="button"
                        >
                            Criar contrato
                        </button>
                    :
                        <button onClick={handleReservaClick} className={styles.reserveButton}>
                            Agendar visita
                        </button>
                    }
                </div>
            </div>

            {showVisitModal && (
                <VisitModal
                    propertyId={property.id}
                    onClose={() => setshowVisitModal(false)}
                />
            )}

            {showContractModal && (
                <ContractModal
                    isOpen={showContractModal}
                    onRequestClose={handleContractModalClose}
                    propertyToPreFill={property}
                />
            )}
        </>
    );
}
