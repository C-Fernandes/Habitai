import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { apiClient } from '../../services/apiClient';
import { viaCepClient } from '../../services/viaCepClient';
import type { Property, Image, Amenity } from '../../types';
import { Button } from '../../components/Button';
import NavBar from '../../components/NavBar';
import styles from './PropertyEditPage.module.css';
import { ImagePlus, Trash2 } from 'lucide-react';
import { formatAsCurrency, formatCep} from '../../utils/propertyUtils';

const API_BASE_URL = 'http://localhost:8080';

export function PropertyEditPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [property, setProperty] = useState<Property | null>(null);
    const [availableAmenities, setAvailableAmenities] = useState<Amenity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCepLoading, setIsCepLoading] = useState(false);
    const [cepError, setCepError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            toast.error("ID do imóvel não encontrado.");
            navigate('/meus-imoveis');
            return;
        }

        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [propertyData, amenitiesData] = await Promise.all([
                    apiClient.get<Property>(`/properties/${id}`),
                    apiClient.get<Amenity[]>('/amenities')
                ]);
                setProperty(propertyData);
                setAvailableAmenities(amenitiesData);
            } catch (err: any) {
                toast.error(err.message || "Falha ao carregar dados do imóvel.");
                navigate('/meus-imoveis');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id, navigate]);

    useEffect(() => {
        if (!property?.address.cep) return;
        const cep = property.address.cep.replace(/\D/g, '');
        if (cep.length !== 8) return;

        const fetchAddress = async () => {
            setIsCepLoading(true); setCepError(null);
            try {
                const data = await viaCepClient.get(cep);
                setProperty(prev => prev ? ({
                    ...prev,
                    address: { ...prev.address, street: data.logradouro,
                        neighborhood: data.bairro, city: data.localidade,
                        state: data.uf, complement: data.complemento }
                }) : null);
            } catch (err: any) { setCepError(err.message); } 
            finally { setIsCepLoading(false); }
        };
        fetchAddress();
    }, [property?.address.cep]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === "rentalPrice") {
            let formattedValue = formatAsCurrency(value);
            if(formattedValue.length === 0) formattedValue = "0";
            setProperty(prev => prev ? ({ ...prev, [name]: parseFloat(formattedValue) }) : null);
        } else {
            setProperty(prev => prev ? ({ ...prev, [name]: value }) : null);
        }
    };
    const handleAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        if (name === "cep") {
            const formattedCep = formatCep(value);
            setProperty(prev => prev ? ({
                ...prev,
                address: { ...prev.address, cep: formattedCep }
            }) : null);
        } else {
            setProperty(prev => prev ? ({
                ...prev,
                address: { ...prev.address, [name]: value }
            }) : null);
        }
    };
    const handleAmenityChange = (amenityId: number) => {
        setProperty(prev => {
            if (!prev) return null;
            const currentIds = prev.amenities.map(a => a.id);
            if (currentIds.includes(amenityId)) {
                return { ...prev, amenities: prev.amenities.filter(a => a.id !== amenityId) };
            } else {
                const amenityToAdd = availableAmenities.find(a => a.id === amenityId);
                if (!amenityToAdd) return prev;
                return { ...prev, amenities: [...prev.amenities, amenityToAdd] };
            }
        });
    };

    const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !id) return;
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const formData = new FormData();
        files.forEach(file => formData.append('images', file));
        
        try {
            const newImages = await apiClient.post<Image[]>(`/properties/${id}/images`, formData);
            setProperty(prev => prev ? ({ ...prev, images: [...prev.images, ...newImages] }) : null);
            toast.success("Imagens adicionadas!");
        } catch (err: any) {
        toast.error(err.message || "Falha ao enviar imagem.");
        }
    };

    const handleDeleteImage = async (imageId: number) => {
        if (!window.confirm("Tem certeza que deseja apagar esta imagem?")) return;
        try {
            await apiClient.delete(`/properties/images/${imageId}`);
            setProperty(prev => prev ? ({
                ...prev,
                images: prev.images.filter(img => img.id !== imageId)
            }) : null);
            toast.success("Imagem removida.");
        } catch (err: any) {
            toast.error(err.message || "Falha ao remover imagem.");
        }
    };

    const handleSubmitTextForm = async (e: FormEvent) => {
        e.preventDefault();
        if (!property) return;
        setIsSubmitting(true);

        if (isCepLoading) {
            toast.error("Por favor, aguarde a validação do CEP antes de salvar.");
            return;
        }

        if (cepError) {
            toast.error(`CEP inválido: ${cepError}. Por favor, corrija o CEP.`);
            return;
        }
        
        const cleanCep = property.address.cep.replace(/\D/g, '');
        if (cleanCep.length !== 8) {
            toast.error("O CEP deve ter 8 dígitos válidos.");
            return;
        }
        
        if (!property.address.number.trim()) {
            toast.error("O número do imóvel é obrigatório");
            return;
        }
        
        try {
            const propertyDTO = {
                ...property,
                rentalPrice: parseFloat(property.rentalPrice as any) || 0,
                bedrooms: parseInt(property.bedrooms as any) || 0,
                bathrooms: parseInt(property.bathrooms as any) || 0,
                garageSpaces: parseInt(property.garageSpaces as any) || 0,
                totalArea: parseFloat(property.totalArea as any) || 0,
                amenityIds: property.amenities.map(a => a.id), 
            };

            const updatedProperty = await apiClient.put<Property>(`/properties/${id}`, propertyDTO);
            
            setProperty(updatedProperty);
            toast.success("Imóvel atualizado com sucesso!");
            navigate('/my-properties');
        } catch (err: any) {
            toast.error(err.message || "Falha ao salvar. Verifique os campos.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading || !property) {
        return <div>Carregando dados do imóvel...</div>;
    }

    return (
        <>
        <NavBar />
        <div className={styles.pageContainer}>
            <form onSubmit={handleSubmitTextForm} className={styles.form}>
                <div className={styles.galleryContainer}>
                    <h3 className={styles.photosTitle}>Galeria de fotos</h3>
                    <div className={styles.imageGallery}>
                        {property.images.map((image) => (
                            <div key={image.id} className={styles.imageCard}>
                                <img src={`${API_BASE_URL}/${image.imagePath}`}/>
                                <button 
                                    type="button" 
                                    className={styles.deleteButton}
                                    onClick={() => handleDeleteImage(image.id)}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                        <label htmlFor="imageUpload" className={styles.uploadButton}>
                            <ImagePlus size={32} />
                            <span>Adicionar</span>
                            <input 
                                id="imageUpload" 
                                type="file" 
                                multiple 
                                accept="image/png, image/jpeg"
                                onChange={handleImageUpload}
                                className={styles.fileInput}
                            />
                        </label>
                    </div>
                </div>
                
                <fieldset className={styles.fieldset}>
                    <legend className={styles.legend}>Informações Básicas</legend>
                    <div className={styles.formGroup}>
                        <label htmlFor="title">Título do Anúncio</label>
                        <input type="text" id="title" name="title" value={property.title} onChange={handleChange} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Descrição</label>
                        <textarea name="description" value={property.description} onChange={handleChange} rows={7} maxLength={1000} />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Preço (R$)</label>
                        <input 
                            type="text" 
                            inputMode="numeric"
                            name="rentalPrice" 
                            value={property.rentalPrice} 
                            onChange={handleChange}
                            min="1"
                            required 
                        />
                    </div>
                </fieldset>

                <fieldset className={styles.fieldset}>
                    <legend className={styles.legend}>Detalhes do Imóvel</legend>
                    <div className={styles.grid}>
                        <div className={styles.formGroup}>
                            <label>Quartos</label>
                            <input type="number" name="bedrooms" value={property.bedrooms} onChange={handleChange} min="0" required />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Banheiros</label>
                            <input type="number" name="bathrooms" value={property.bathrooms} onChange={handleChange} min="0" required />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Vagas de Garagem</label>
                            <input type="number" name="garageSpaces" value={property.garageSpaces} onChange={handleChange} min="0" required />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Área Total (m²)</label>
                            <input type="number" name="totalArea" value={property.totalArea} onChange={handleChange} min="0" required />
                        </div>
                    </div>
                </fieldset>

                <fieldset className={styles.fieldset}>
                    <legend className={styles.legend}>Endereço</legend>
                    <div className={styles.formGroup}>
                        <label htmlFor="cep">CEP</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            id="cep"
                            name="cep"
                            maxLength={9}
                            value={property.address.cep}
                            onChange={handleAddressChange}
                            placeholder="00000-000"
                        />
                        {isCepLoading && <small>Buscando CEP...</small>}
                        {cepError && <small className={styles.errorText}>{cepError}</small>}
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="street">Rua (Logradouro)</label>
                        <input type="text" name="street" value={property.address.street} onChange={handleAddressChange} readOnly />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="neighborhood">Bairro</label>
                        <input type="text" name="neighborhood" value={property.address.neighborhood} onChange={handleAddressChange} readOnly />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="city">Cidade</label>
                        <input type="text" name="city" value={property.address.city} onChange={handleAddressChange} readOnly />
                    </div>
                    <div className={styles.grid}>
                        <div className={styles.formGroup}>
                            <label htmlFor="number">Número</label>
                            <input type="text" name="number" value={property.address.number} onChange={handleAddressChange} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="state">Estado (UF)</label>
                            <input type="text" name="state" value={property.address.state} onChange={handleAddressChange} readOnly />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="complement">Complemento</label>
                            <input type="text" name="complement" value={property.address.complement} onChange={handleAddressChange} />
                        </div>
                    </div>
                </fieldset>

                <fieldset className={styles.fieldset}>
                    <legend className={styles.legend}>Comodidades</legend>
                    <div className={styles.amenityGrid}>
                        {availableAmenities.map((amenity) => (
                            <label key={amenity.id} className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={property.amenities.some(a => a.id === amenity.id)}
                                    onChange={() => handleAmenityChange(amenity.id)}
                                />
                                {amenity.name}
                            </label>
                        ))}
                    </div>
                </fieldset>

                <div className={styles.submitContainer}>
                    <Button 
                        type="submit" 
                        disabled={isSubmitting || isCepLoading}
                        className={styles.submitButton}
                    >
                        {isSubmitting ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                </div>
            </form>
        </div>
        </>
    );
}