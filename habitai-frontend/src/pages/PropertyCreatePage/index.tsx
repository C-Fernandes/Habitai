import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../services/apiClient';
import { viaCepClient } from '../../services/viaCepClient';
import { Button } from '../../components/Button';
import styles from './propertyCreatePage.module.css';

import { Step1Title } from './Steps/Step1Title';
import { Step2Photos } from './Steps/Step2Photos';
import { Step3Details } from './Steps/Step3Details';
import { Step4Address } from './Steps/Step4Address';
import { Step5Price } from './Steps/Step5Price';
import NavBar from '../../components/NavBar';

const initialState = {
  title: '',
  description: '',
  rentalPrice: '',
  bedrooms: '',
  bathrooms: '',
  garageSpaces: '',
  totalArea: '',
  amenityIds: [],
  address: {
    cep: '', street: '', number: '', complement: '',
    neighborhood: '', city: '', state: '',
  },
};

const TOTAL_STEPS = 5;

const formatCep = (value: string): string => {
    const cleanValue = value.replace(/\D/g, '');
    const limitedValue = cleanValue.slice(0, 8);
    return limitedValue.replace(/^(\d{5})(\d)/, '$1-$2');
};

export function PropertyCreatePage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState(initialState);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [isCepLoading, setIsCepLoading] = useState(false);
    const [cepError, setCepError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const cep = formData.address.cep.replace(/\D/g, '');
        if (cep.length !== 8) {
            setCepError(null);
        return;
        }
        const fetchAddress = async () => {
            setIsCepLoading(true);
            setCepError(null);
            try {
                const data = await viaCepClient.get(cep);
                setFormData(prev => ({
                    ...prev,
                    address: { ...prev.address, street: data.logradouro,
                        neighborhood: data.bairro, city: data.localidade,
                        state: data.estado, complement: data.complemento,
                    },
                }));
                document.getElementsByName("number")[0]?.focus();
            } catch (err: any) { 
                setCepError(err.message);
                setFormData(prev => ({
                    ...prev,
                    address: { ...prev.address, street: "",
                        neighborhood: "", city: "",
                        state: "", complement: "",
                    },
                }));
            } 
            finally { setIsCepLoading(false); }
        };
        fetchAddress();
    }, [formData.address.cep]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === "cep") {
        const formattedCep = formatCep(value);
        
        setFormData(prev => ({
            ...prev,
            address: {
            ...prev.address,
            cep: formattedCep,
            },
        }));

        } else {
            setFormData(prev => ({
                ...prev,
                address: {
                ...prev.address,
                [name]: value,
                },
            }));
        }
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
        setImageFiles(Array.from(e.target.files));
        }
    };

    const nextStep = () => {
        if (step === 3) {
            const bedrooms = parseInt(formData.bedrooms, 10);
            const bathrooms = parseInt(formData.bathrooms, 10);
            const garageSpaces = parseInt(formData.garageSpaces, 10);
            const totalArea = parseFloat(formData.totalArea);

            if (isNaN(bedrooms) || isNaN(bathrooms) || isNaN(garageSpaces) || isNaN(totalArea)) {
                toast.error("Por favor, preencha todos os detalhes do imóvel.");
                return;
            }

            if (totalArea <= 0) {
                toast.error("A área total deve ser maior que 0.");
                return;
            }
        }
        
        if (step === 1) {
            if (!formData.title.trim()) {
                toast.error("Por favor, preencha o título.");
                return;
            }
        }
        
        if (step === 2) {
            if (imageFiles.length === 0) { 
                toast.error("Você deve adicionar pelo menos uma imagem.");
                return;
            }
            if (imageFiles.length > 10) {
                toast.error("Você pode adicionar no máximo 10 fotos.");
                return; 
            }
        }
        setStep(prev => Math.min(prev + 1, TOTAL_STEPS));
    };

    const prevStep = () => {
        setStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (step !== TOTAL_STEPS) return;

        if (!formData.rentalPrice) {
            toast.error("Por favor, preencha o preço do aluguel.");
            return;
        }
        if (!user) {
            toast.error("Você precisa estar logado.");
            return;
        }

        setIsSubmitting(true);
        
        try {
            const propertyDTO = {
                ...formData,
                ownerId: user.id,
                rentalPrice: parseFloat(formData.rentalPrice) || 0,
                bedrooms: parseInt(formData.bedrooms) || 0,
                bathrooms: parseInt(formData.bathrooms) || 0,
                garageSpaces: parseInt(formData.garageSpaces) || 0,
                totalArea: parseFloat(formData.totalArea) || 0,
            };

            const data = new FormData();
            data.append('property', new Blob([JSON.stringify(propertyDTO)], { type: 'application/json' }));
            imageFiles.forEach(file => data.append('images', file));

            await apiClient.post('/properties', data);
            toast.success("Imóvel cadastrado com sucesso!");
            navigate('/');
        } catch (err: any) {
            toast.error(err.message || "Falha ao cadastrar.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStep = () => {
        const stepProps = {
            formData,
            handleChange,
            handleAddressChange,
        };
        
        switch (step) {
        case 1:
            return <Step1Title {...stepProps} />;
        case 2:
            return <Step2Photos imageFiles={imageFiles} onChange={handleImageChange} />;
        case 3:
            return <Step3Details {...stepProps} />;
        case 4:
            return <Step4Address {...stepProps} isCepLoading={isCepLoading} cepError={cepError} />;
        case 5:
            return <Step5Price {...stepProps} />;
        default:
            return <Step1Title {...stepProps} />;
        }
    };
    
    const progressPercent = (step / TOTAL_STEPS) * 100;

    return (
        <>
            <NavBar/>
            <div className={styles.wizardContainer}>
                <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${progressPercent}%` }}></div>
                </div>
            
                <form className={styles.stepContent} onSubmit={handleSubmit}>
                    {renderStep()}
                </form>
            
                <footer className={styles.navigation}>
                    {step > 1 ? (
                        <Button 
                            type="button" 
                            onClick={prevStep}
                            disabled={step === 1 || isSubmitting}
                            className={styles.backButton}
                        >
                            Voltar
                        </Button>
                    ) : <div/>}

                    {step < TOTAL_STEPS ? (
                        <Button type="button" onClick={nextStep} disabled={isSubmitting}>
                            Continuar
                        </Button>
                        ) : (
                        <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? "Finalizando..." : "Finalizar Cadastro"}
                        </Button>
                    )}
                </footer>
            </div>
        </>
    );
}