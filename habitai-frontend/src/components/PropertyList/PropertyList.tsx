import React, { useEffect, useState } from 'react';
import { getAllProperties, type PropertyResponseDTO } from '../../services/propertyService';
import { PropertyCard } from '../PropertyCard/PropertyCard';
import './PropertyList.css';

export const PropertyList: React.FC = () => {
    const [properties, setProperties] = useState<PropertyResponseDTO[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllProperties()
            .then(setProperties)
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <p className="loading">Loading properties...</p>;
    }

    if (!properties.length) {
        return <p className="noResults">No properties found.</p>;
    }

    return (
        <div className="grid">
            {properties.map((p) => (
                <PropertyCard key={p.id} property={p} />
            ))}
        </div>
    );
};
