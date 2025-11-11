import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiClient } from "../../services/apiClient.ts";
import type { Contract, PaymentStatus } from "../../types/index.tsx";
import styles from "./contractdetailspage.module.css";
import NavBar from "../../components/NavBar/index.tsx";
import { FiCalendar, FiDollarSign, FiEdit2, FiMail, FiPhone, FiPlus, FiTrash2, FiUser } from "react-icons/fi";
import { ContractModal } from "../../components/Modals/ContractModal/ContractModal.tsx";
import { toast } from "sonner";
import { deleteContract } from "../../services/contractService.ts";

export function ContractDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const [contract, setContract] = useState<Contract | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const fetchContract = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await apiClient.get<Contract>(`/contracts/${id}`);
            setContract(data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError("Não foi possível carregar o contrato.");
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) fetchContract();
    }, [id, fetchContract]);
    
    const handleModalClose = (wasContractUpdated = false) => {
        setIsEditModalOpen(false);
        if (wasContractUpdated) {
            fetchContract(); 
        }
    };

    const handleDelete = async () => {
    
        const performDelete = async (toastId: number | string) => {
            try {
                if (!id) return;
                
                await deleteContract(id);
                toast.success("Contrato excluído com sucesso!", { id: toastId }); 
                navigate("/contracts"); 
            } catch (error) {
                console.error("Erro ao deletar contrato:", error);
                toast.error("Falha ao deletar o contrato. Tente novamente.", { id: toastId });
            }
        };

        const toastId = toast.custom((t) => (
            <div className={styles.confirmToast}> 
                <p className={styles.toastText}>Tem certeza que deseja <b>deletar</b> este contrato?</p>
                <p className={styles.warning}>Esta ação é irreversível.</p>
                <div className={styles.confirmActions}>
                    <button 
                        onClick={() => toast.dismiss(t)} 
                        className={styles.cancelButton}
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={() => performDelete(t)
                            .then(()=>toast.dismiss(t))}
                        className={styles.confirmButton}
                    >
                        Confirmar Exclusão
                    </button>
                </div>
            </div>
        ), {
            duration: Infinity,
            position: 'top-center'
        });
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString + "T00:00:00"); 
        if (isNaN(date.getTime())) return dateString;
        return date.toLocaleDateString("pt-BR", { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
        });
    };

    const formatCurrency = (value: number | undefined | null) => {
        if (value === undefined || value === null) return "R$ --";
        return `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const getStatusDisplay = (status: PaymentStatus): { text: string, className: string } => {
        switch (status) {
            case 'PAID':
                return { text: 'Pago', className: styles.statusPaid };
            case 'PENDING':
                return { text: 'Pendente', className: styles.statusPending };
            case 'OVERDUE':
                return { text: 'Atrasado', className: styles.statusOverdue };
            case 'CANCELED':
                return { text: 'Cancelado', className: styles.statusCanceled };
            default:
                return { text: 'Desconhecido', className: '' };
        }
    };

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
                    <div>
                        <p>
                            <b>Período: </b>
                            {formatDate(contract.startDate)} até {formatDate(contract.endDate)}
                        </p>
                        <p>
                            <b>Valor acordado: </b> R${contract.monthlyPrice}/mês
                        </p>
                        <p>
                            <b>Dia de pagamento:</b> {contract.paymentDueDay}
                        </p>
                    </div>
                    <div className={styles.actionButtons}> 
                        <button 
                            type="button" 
                            className={styles.deleteButton}
                            onClick={handleDelete}
                        >
                            <FiTrash2 />
                        </button>
                        <button 
                            type="button" 
                            className={styles.editButton}
                            onClick={() => setIsEditModalOpen(true)}
                        >
                            <FiEdit2 />
                        </button>
                    </div>
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


                <div className={styles.paymentsSection}>
                    <div className={styles.paymentsHeader}>
                        <h2>Histórico de Pagamentos ({contract.payments.length})</h2>
                        <button 
                            type="button" 
                            className={styles.addPaymentButton}
                            onClick={() => window.alert("Adicionar novo pagamento!")}
                            title="Adicionar novo pagamento"
                        >
                            <FiPlus size={24} />
                        </button>
                    </div>
                    <div className={styles.paymentsList}>
                        {contract.payments.length === 0 ? (
                            <p>Nenhum pagamento registrado para este contrato.</p>
                        ) : (
                            contract.payments
                                .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())
                                .map((payment, index) => {
                                    const statusDisplay = getStatusDisplay(payment.status);
                                    return (
                                        <div key={payment.id || index} className={styles.paymentItem}>
                                            <div className={styles.paymentDetails}>
                                                <p>
                                                    <FiCalendar style={{ marginRight: "5px", color: '#666' }} />
                                                    <b>Vencimento:</b> {formatDate(payment.dueDate)}
                                                </p>
                                                <p>
                                                    <FiDollarSign style={{ marginRight: "5px", color: '#666' }} />
                                                    <b>Valor Devido:</b> {formatCurrency(payment.amountDue)}
                                                </p>
                                                {payment.status === 'PAID' && (
                                                    <p>
                                                        <FiCalendar style={{ marginRight: "5px", color: '#666' }} />
                                                        <b>Data Pagamento:</b> {formatDate(payment.paymentDate!)}
                                                    </p>
                                                )}
                                                {payment.status === 'PAID' && payment.amountPaid !== undefined && payment.amountPaid !== null && (
                                                    <p>
                                                        <FiDollarSign style={{ marginRight: "5px", color: '#666' }} />
                                                        <b>Valor Pago:</b> {formatCurrency(payment.amountPaid)}
                                                    </p>
                                                )}
                                            </div>
                                            <span className={`${styles.paymentStatus} ${statusDisplay.className}`}>
                                                {statusDisplay.text}
                                            </span>
                                        </div>
                                    );
                                })
                        )}
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

            <ContractModal
                isOpen={isEditModalOpen}
                contract={contract} 
                onRequestClose={() => handleModalClose(false)} 
                onContractUpdated={() => handleModalClose(true)}
            />

        </>
    );
}
