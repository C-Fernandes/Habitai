import React from 'react';
import './PropertyCard.css';
import type { PropertyResponseDTO } from '../../services/propertyService';

interface PropertyCardProps {
    property: PropertyResponseDTO;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
    return (
        <div className="property-card">
            <img
                src={property.imageUrl || '/placeholder-house.jpg'}
                alt={property.title}
                className="property-image"
            />
            <div className="property-content">
                <h3 className="property-title">{property.title}</h3>
                <p className="property-location">{property.location}</p>
                <p className="property-price">
                    R$ {property.price?.toLocaleString('pt-BR')}
                </p>
                <p className="property-description">{property.description}</p>
            </div>
        </div>
    );
};
