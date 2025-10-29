import type { Property } from '../../types';
import styles from './propertycard.module.css';

const priceFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const API_BASE_URL = 'http://localhost:8080';

type PropertyCardProps = {
  property: Property;
};

export function PropertyCard({ property }: PropertyCardProps) {
  const firstImage = property.images?.[0]?.imagePath;

  const imageUrl = `${API_BASE_URL}/${firstImage}`;

  return (
    <div className={styles.card}>
      <img 
        src={imageUrl} 
        alt={property.title} 
        className={styles.image} 
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