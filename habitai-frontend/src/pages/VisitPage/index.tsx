import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { visitService } from "../../services/visitService";
import styles from "./visitsPage.module.css";
import NavBar from "../../components/NavBar";
import DeleteVisitModal from "../../components/Modals/DeleteVisitModal/index";
import EditVisitModal from "../../components/Modals/EditVisitModal/index";
import OwnerVisitActionModal from "../../components/Modals/OwnerVisitActionModal/index";

interface Visit {
    id: number;
    propertyId: number;
    dateTime: string;
    message?: string;
    status: string;
    userId: number;
    userName: string;
    propertyUserName: string;
    propertyUserId: number;
}

export default function VisitsPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<"myVisits" | "ownerVisits">("myVisits");
    const [visits, setVisits] = useState<Visit[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [ownerActionModal, setOwnerActionModal] = useState<{ visitId: number; action: "CONFIRM" | "REJECT" } | null>(null);

    const fetchVisits = async () => {
        if (!user) return;
        setLoading(true);
        setError(null);

        try {
            const data =
                activeTab === "myVisits"
                    ? await visitService.getVisitsByUser(Number(user.id))
                    : await visitService.getVisitsByPropertyOwner(Number(user.id));

            setVisits(data);
        } catch (err: never) {
            setError(err.message || "Falha ao carregar visitas.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVisits();
    }, [activeTab]);

    const formatDateTime = (dateStr: string) =>
        new Date(dateStr).toLocaleString("pt-BR", {
            dateStyle: "short",
            timeStyle: "short",
        });

    const handleEdit = (visit: Visit) => {
        setSelectedVisit(visit);
        setEditModalOpen(true);
    };

    const handleDelete = (visit: Visit) => {
        setSelectedVisit(visit);
        setDeleteModalOpen(true);
    };

    return (
        <>
            <NavBar />
            <div className={styles.container}>
                <h2 className={styles.title}>Minhas Visitas</h2>

                <div className={styles.tabs}>
                    <button
                        className={`${styles.tabButton} ${activeTab === "myVisits" ? styles.active : ""}`}
                        onClick={() => setActiveTab("myVisits")}
                    >
                        Visitas que agendei
                    </button>
                    <button
                        className={`${styles.tabButton} ${activeTab === "ownerVisits" ? styles.active : ""}`}
                        onClick={() => setActiveTab("ownerVisits")}
                    >
                        Visitas nos meus imóveis
                    </button>
                </div>

                {loading && <p>Carregando...</p>}
                {error && <p className={styles.error}>{error}</p>}

                {!loading && visits.length === 0 && <p className={styles.empty}>Nenhuma visita encontrada.</p>}

                <div className={styles.list}>
                    {visits
                        .slice() // cria uma cópia para não mutar o estado
                        .sort((a, b) => {
                            if (a.status === "CANCELED" && b.status !== "CANCELED") return 1;
                            if (a.status !== "CANCELED" && b.status === "CANCELED") return -1;
                            return 0; // mantém a ordem relativa dos demais
                        })
                        .map((visit) => (
                            <div key={visit.id} className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <strong>Imóvel #{visit.propertyId}</strong>
                                    <span
                                        className={`${styles.status} ${
                                            visit.status === "CONFIRMED"
                                                ? styles.confirmed
                                                : visit.status === "REJECTED"
                                                    ? styles.rejected
                                                    : visit.status === "CANCELED"
                                                        ? styles.canceled
                                                        : styles.scheduled
                                        }`}
                                    >
            {visit.status === "CONFIRMED"
                ? "Confirmada"
                : visit.status === "REJECTED"
                    ? "Rejeitada"
                    : visit.status === "CANCELED"
                        ? "Cancelada"
                        : "Agendada"}
          </span>
                                </div>

                                <div className={styles.cardBody}>
                                    <p>
                                        <strong>Data:</strong> {formatDateTime(visit.dateTime)}
                                    </p>
                                    {visit.message && <p><strong>Mensagem:</strong> {visit.message}</p>}
                                    <p>
                                        <strong>{activeTab === "myVisits" ? "Proprietário" : "Visitante"}:</strong>{" "}
                                        {activeTab === "myVisits" ? visit.propertyUserName : visit.userName}
                                    </p>
                                </div>

                                <div className={styles.cardActions}>
                                    {activeTab === "myVisits" && visit.status === "SCHEDULED" && (
                                        <>
                                            <button onClick={() => handleEdit(visit)} className={styles.editBtn}>
                                                Editar
                                            </button>
                                            <button onClick={() => handleDelete(visit)} className={styles.deleteBtn}>
                                                Desmarcar
                                            </button>
                                        </>
                                    )}

                                    {activeTab === "ownerVisits" && visit.status === "SCHEDULED" && (
                                        <div className={styles.cardActions}>
                                            <button onClick={() => setOwnerActionModal({ visitId: visit.id, action: "CONFIRM" })} className={styles.confirmBtn}>
                                                Confirmar
                                            </button>
                                            <button onClick={() => setOwnerActionModal({ visitId: visit.id, action: "REJECT" })} className={styles.rejectBtn}>
                                                Rejeitar
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                </div>

            </div>

            {isEditModalOpen && selectedVisit && (
                <EditVisitModal
                    visit={selectedVisit}
                    onClose={() => setEditModalOpen(false)}
                    onUpdated={fetchVisits}
                />
            )}

            {isDeleteModalOpen && selectedVisit && (
                <DeleteVisitModal
                    visit={selectedVisit}
                    onClose={() => setDeleteModalOpen(false)}
                    onDeleted={fetchVisits}
                />
            )}

            {ownerActionModal && (
                <OwnerVisitActionModal
                    visitId={ownerActionModal.visitId}
                    action={ownerActionModal.action}
                    onClose={() => setOwnerActionModal(null)}
                    onUpdated={fetchVisits}
                />
            )}
        </>
    );
}
