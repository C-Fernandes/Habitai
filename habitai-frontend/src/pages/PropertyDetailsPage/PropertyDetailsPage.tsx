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
import { Star, User as UserIcon, PenLine, Pencil, Trash2 } from "lucide-react";

const REVIEWS_PAGE_SIZE = 3;

export function PropertyDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const [property, setProperty] = useState<Property | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();
    const [error, setError] = useState<string | null>(null);

    const [reviews, setReviews] = useState<Review[]>([]);
    const [reviewToEdit, setReviewToEdit] = useState<Review | null>(null);

    const [showVisitModal, setshowVisitModal] = useState(false);
    const [showContractModal, setShowContractModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);

    const [reviewsPage, setReviewsPage] = useState(0);
    const [hasMoreReviews, setHasMoreReviews] = useState(false);
    const [isReviewsLoading, setIsReviewsLoading] = useState(false);

    const userId = user ? parseInt(user.id) : null;

    const fetchReviews = useCallback(async (page: number, shouldAppend: boolean) => {
        if (!id) return;
        
        setIsReviewsLoading(true);
        try {
            const endpoint = `/reviews/property/${id}?page=${page}&size=${REVIEWS_PAGE_SIZE}`;
            const data = await apiClient.get<PaginatedReviews>(endpoint);
            
            setReviews(prev => {
                return shouldAppend ? [...prev, ...data.content] : data.content;
            });

            setHasMoreReviews(!data.last);
            setReviewsPage(page);

        } catch (error) {
            console.error("Erro ao buscar avaliações", error);
            toast.error("Erro ao carregar comentários.");
        } finally {
            setIsReviewsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                setIsLoading(true);
                const data = await apiClient.get<Property>(`/properties/${id}`);
                setProperty(data);
                await fetchReviews(0, false);
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

    const handleLoadMoreReviews = () => {
        if (!isReviewsLoading && hasMoreReviews) {
            fetchReviews(reviewsPage + 1, true);
        }
    };

    const handleReviewSuccess = () => {
        fetchReviews(0, false);
        apiClient.get<Property>(`/properties/${id}`).then(setProperty);
    };

    function handleCreateReviewClick() {
        if (!loggedInUser) { 
            toast.error("Faça login para avaliar.");
            return; 
        }
        setReviewToEdit(null);
        setShowReviewModal(true);
    }

    function handleEditReview(review: Review) {
        setReviewToEdit(review);
        setShowReviewModal(true);
    }

    async function handleDeleteReview(reviewId: number) {
        if (!window.confirm("Tem certeza que deseja excluir sua avaliação?")) return;
        
        try {
            await apiClient.delete(`/reviews/${userId}/${reviewId}`);
            toast.success("Avaliação removida.");
            handleReviewSuccess();
        } catch (err: any) {
            toast.error("Erro ao excluir avaliação." + (err.message ? `(${err.message})` : "") );
        }
    }

    return (
        <>
            <NavBar />
            <div className={styles.container}>
                <img src={imageUrl} alt={property.title} className={styles.image} />
                <div className={styles.topInfo}>
                    <h1 className={styles.title}>{property.title}</h1>
                    <div className={styles.titleRow}>                        
                        <div className={styles.ratingWrapper}>
                            {property.reviewCount > 0 ? (
                                <>
                                    <div className={styles.ratingScore}>
                                        <Star fill="#1F2937" color="#1F2937" size={18} />
                                        <span>{property.averageRating?.toFixed(1)}</span>
                                    </div>
                                    <span className={styles.separator}>•</span>
                                    <a href="#reviews" className={styles.reviewLink} onClick={(e) => {
                                        e.preventDefault();
                                        document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' });
                                    }}>
                                        {property.reviewCount} {property.reviewCount === 1 ? 'avaliação' : 'avaliações'}
                                    </a>
                                </>
                            ) : (
                                <span className={styles.newBadge}>
                                    Seja o primeiro a avaliar este imóvel!                    
                                </span>
                            )}
                        </div>
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
                <div className={styles.reviewsSection} id="reviews-section">
                    <div className={styles.reviewsHeader}>
                        <h3>Avaliações</h3>
                        {user && user.id !== property.owner.id.toString() && (
                            <button className={styles.writeReviewButton} onClick={handleCreateReviewClick}>
                                <PenLine size={18} strokeWidth={2} />
                                <span>Escrever Avaliação</span>
                            </button>
                        )}
                    </div>

                    <div className={styles.reviewsList}>
                        {reviews.length === 0 ? (
                            <p className={styles.noReviews}>
                                Este imóvel ainda não tem avaliações.
                            </p>
                        ) : (
                            reviews.map((review) => (
                                <div key={review.id} className={styles.reviewCard}>
                                    <div className={styles.reviewHeaderRow}>
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
                                        {user && user.id === review.author.id.toString() && (
                                            <div className={styles.reviewActions}>
                                                <button 
                                                    onClick={() => handleEditReview(review)} 
                                                    className={styles.iconButton} 
                                                    title="Editar"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteReview(review.id)} 
                                                    className={`${styles.iconButton} ${styles.deleteIcon}`} 
                                                    title="Excluir"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        )}
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
                        <div className={styles.reviewsFooter}>
                            {isReviewsLoading && <span className={styles.loadingText}>Carregando comentários...</span>}
                            {!isReviewsLoading && hasMoreReviews && (
                                <button 
                                    className={styles.loadMoreReviewsButton} 
                                    onClick={handleLoadMoreReviews}
                                >
                                    Carregar mais avaliações
                                </button>
                            )}
                        </div>
                    </div>
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

            {showReviewModal && property && (
                <ReviewModal
                    userId={userId!}
                    isOpen={showReviewModal}
                    onRequestClose={() => setShowReviewModal(false)}
                    propertyId={property.id}
                    onSuccess={handleReviewSuccess}
                    reviewToEdit={reviewToEdit}
                />
            )}
        </>
    );
}
