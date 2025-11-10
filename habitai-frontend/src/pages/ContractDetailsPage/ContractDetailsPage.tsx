import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiClient } from "../../services/apiClient.ts";
import type { Contract } from "../../types/index.tsx";
import styles from "./contractdetailspage.module.css";
import NavBar from "../../components/NavBar/index.tsx";
import { FiMail, FiPhone, FiUser } from "react-icons/fi";

export function ContractDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const [contract, setContract] = useState<Contract | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                setIsLoading(true);
                const data = await apiClient.get<Contract>(`/contracts/${id}`);
                setContract(data);
            } catch {
                setError("Não foi possível carregar o contrato.");
            } finally {
                setIsLoading(false);
            }
        };
        if (id) fetchProperty();
    }, [id]);

    if (isLoading) return <div className={styles.container}>Carregando...</div>;
    if (error) return <div className={styles.container}>{error}</div>;
    if (!contract) return <div className={styles.container}>Imóvel não encontrado.</div>;


    return (
        <>
            <NavBar />
            <div className={styles.container}>
                <h1>Contrato: "{contract.property.title}"</h1>
                <div className={styles.propertyInfo}>
                    <div>
                        <p>
                            {contract.property.neighborhood}, {contract.property.city} - {contract.property.state}
                        </p>
                        <p className={styles.price}>
                            R$ {contract.property.rentalPrice.toLocaleString("pt-BR")}/mês
                        </p>
                    </div>
                        <button 
                            className={styles.propertyButton}
                            type="button"
                            onClick={()=> navigate(`/properties/${contract.property.id}`)}
                        >
                            Ver imóvel
                        </button>
                </div>

                <div className={styles.description}>
                    <p>
                        <b>Período: </b>
                        {contract.startDate} até {contract.endDate}
                    </p>
                    <p>
                        <b>Valor acordado: </b> R${contract.monthlyPrice}/mês
                    </p>
                    <p>
                        <b>Dia de pagamento:</b> {contract.paymentDueDay}
                    </p>
                </div>


                <div className={styles.ownerBox}>
                    <div className={styles.contactSplit}> 
                        <div className={styles.contactColumn}>
                            <h3>Detalhes do Inquilino</h3>
                            <p>
                                <FiUser style={{ marginRight: "5px", color: '#666' }} />
                                <b>Nome:</b> {contract.tenant.name}
                            </p>
                            <p>
                                <FiMail style={{ marginRight: "5px", color: '#666' }} />
                                <b>Email:</b> {contract.tenant.email}
                            </p>
                            <p>
                                <FiPhone style={{ marginRight: "5px", color: '#666' }} />
                                <b>Telefone:</b> {contract.tenant.phone}
                            </p>
                        </div>

                        <div className={`${styles.contactColumn} ${styles.columnSeparator}`}>
                            <h3>Detalhes do Proprietário</h3>
                            <p>
                                <FiUser style={{ marginRight: "5px", color: '#666' }} />
                                <b>Nome:</b> {contract.owner.name}
                            </p>
                            <p>
                                <FiMail style={{ marginRight: "5px", color: '#666' }} />
                                <b>Email:</b> {contract.owner.email}
                            </p>
                            <p>
                                <FiPhone style={{ marginRight: "5px", color: '#666' }} />
                                <b>Telefone:</b> {contract.owner.phone}
                            </p>
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
                </div>
            </div>

        </>
    );
}
