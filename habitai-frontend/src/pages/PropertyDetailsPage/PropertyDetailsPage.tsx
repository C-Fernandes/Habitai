import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { apiClient } from "../../services/apiClient";
import type { Contract, Property, Review, PaginatedReviews} from "../../types";
import styles from "./propertydetails.module.css";
import NavBar from "../../components/NavBar";
import { toast } from "sonner";
import {VisitModal} from "../../components/Modals/VisitModal/VisitModal.tsx";
import { ContractModal } from "../../components/Modals/ContractModal/ContractModal.tsx";
import { ReviewModal } from "../../components/Modals/ReviewModal";
import { useAuth } from "../../context/AuthContext.tsx";
import { Star, User as UserIcon } from "lucide-react";


export function PropertyDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const [property, setProperty] = useState<Property | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { user, isAuthenticated } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);

    const [showVisitModal, setshowVisitModal] = useState(false);
    const [showContractModal, setShowContractModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);

    const fetchReviews = useCallback(async () => {
        if (!id) return;
        try {
            const data = await apiClient.get<PaginatedReviews>(`/reviews/property/${id}?size=5`);
            setReviews(data.content);
        } catch (error) {
            console.error("Erro ao buscar avaliações", error);
        }
    }, [id]);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                setIsLoading(true);
                const data = await apiClient.get<Property>(`/properties/${id}`);
                setProperty(data);
                await fetchReviews();
            } catch {
                setError("Não foi possível carregar o imóvel.");
            } finally {
                setIsLoading(false);
            }
        };
        if (id) fetchProperty();
    }, [id, fetchReviews]);

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

    function handleReviewClick() {
        if (!loggedInUser) {
            toast.error("Faça login para avaliar.");
            return;
        }
        setShowReviewModal(true);
    }

    const handleReviewSuccess = () => {
        fetchReviews();
        apiClient.get<Property>(`/properties/${id}`).then(setProperty);
    };

    return (
        <>
            <NavBar />
            <div className={styles.container}>
                <img src={imageUrl} alt={property.title} className={styles.image} />
                <div className={styles.topInfo}>
                    <h1 className={styles.title}>{property.title}</h1>
                    <div className={styles.ratingBadge}>
                        <Star fill="#FFD700" color="#FFD700" size={20} />
                        <span className={styles.ratingValue}>
                            {property.averageRating ? property.averageRating.toFixed(1) : "Novo"}
                        </span>
                        {property.reviewCount > 0 && (
                            <span className={styles.reviewCount}>({property.reviewCount})</span>
                        )}
                    </div>
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
                <div className={styles.reviewsSection}>
                    <div className={styles.reviewsHeader}>
                        <h3>Avaliações</h3>
                        {user && user.id !== property.owner.id.toString() && (
                            <button className={styles.writeReviewButton} onClick={handleReviewClick}>
                                Escrever Avaliação
                            </button>
                        )}
                    </div>

                    <div className={styles.reviewsList}>
                        {reviews.length === 0 ? (
                            <p className={styles.noReviews}>Este imóvel ainda não tem avaliações.</p>
                        ) : (
                            reviews.map((review) => (
                                <div key={review.id} className={styles.reviewCard}>
                                    <div className={styles.reviewAuthor}>
                                        <div className={styles.avatarPlaceholder}>
                                            <UserIcon size={20} />
                                        </div>
                                        <div>
                                            <span className={styles.authorName}>{review.author.name}</span>
                                            <div className={styles.reviewDate}>
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.reviewStars}>
                                        {[...Array(5)].map((_, i) => (
                                            <Star 
                                                key={i} 
                                                size={14} 
                                                fill={i < review.rating ? "#FFD700" : "none"} 
                                                color={i < review.rating ? "#FFD700" : "#E5E7EB"}
                                            />
                                        ))}
                                    </div>
                                    <p className={styles.reviewComment}>{review.comment}</p>
                                </div>
                            ))
                        )}
                    </div>
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

            {showReviewModal && property && (
                <ReviewModal
                    userId={user ? parseInt(user.id) : 0}
                    isOpen={showReviewModal}
                    onRequestClose={() => setShowReviewModal(false)}
                    propertyId={property.id}
                    onSuccess={handleReviewSuccess}
                />
            )}
        </>
    );
}
