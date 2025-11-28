import { useNavigate } from "react-router-dom";
import type { Property } from "../../types";
import styles from "./propertycard.module.css";

const priceFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
});

const API_BASE_URL = "http://localhost:8080";

type PropertyCardProps = {
    property: Property;
    showStatus?: boolean;
};

export function PropertyCard({ property, showStatus = false }: PropertyCardProps) {
    const navigate = useNavigate();

    const firstImageObj = property.images && property.images.length > 0 ? property.images[0] : null;

    let imageUrl = "";
    if (firstImageObj?.imagePath) {
        const cleanPath = firstImageObj.imagePath.replace(/\\/g, '/');
        imageUrl = `${API_BASE_URL}/${cleanPath}`;
    }
    
    const statusText = property.status === 'AVAILABLE' ? 'Em anúncio' : 'Alugado';
    const statusClass = property.status === 'AVAILABLE' 
        ? styles.statusAvailable 
        : styles.statusRented;
    

    return (
        <div
            className={styles.card}
            onClick={() => navigate(`/properties/${property.id}`)}
            role="button"
            tabIndex={0}
        >
            {showStatus && (
                <div className={`${styles.statusBadge} ${statusClass}`}>
                    {statusText}
                </div>
            )}
            <img 
                src={imageUrl} 
                alt={property.title} 
                className={styles.image}
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/400x300.png?text=Erro+na+Imagem';
                }}
            />
            <div className={styles.content}>
                <h3 className={styles.title}>{property.title}</h3>
                <p className={styles.address}>
                    {property.address.neighborhood}, {property.address.city}
                </p>
                <p className={styles.price}>
                    {priceFormatter.format(property.rentalPrice)}
                    <span> /mês</span>
                </p>
                <div className={styles.features}>
                    <span>{property.bedrooms} qua.</span>
                    <span>{property.bathrooms} ban.</span>
                    <span>{property.garageSpaces} vag.</span>
                </div>
            </div>
        </div>
    );
}
