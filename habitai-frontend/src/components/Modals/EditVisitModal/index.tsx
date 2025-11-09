import { useState } from "react";
import styles from "./editvisitmodal.module.css";
import {visitService} from "../../../services/visitService.ts";
import {toast} from "sonner";

export default function EditVisitModal({ visit, onClose, onUpdated }: any) {
    const [dateTime, setDateTime] = useState(visit.dateTime);
    const [message, setMessage] = useState(visit.message || "");
    const [loading, setLoading] = useState(false);

    const today = new Date().toISOString().split("T")[0];

    const handleSubmit = async () => {
        try {
            setLoading(true);

            const normalizedDateTime =
                dateTime.length === 16 ? `${dateTime}:00` : dateTime;

            await visitService.updateVisit(visit.id, {
                dateTime: normalizedDateTime,
                message,
            });

            toast.success("Visita editada com sucesso!"); 

            onUpdated();
            onClose();
        } catch (error) {
            console.error("Erro ao editar visita:", error);
            toast.error("Erro ao editar a visita. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h3>Editar Visita</h3>
                <label>Data e Hora</label>
                <input
                    id="dateTime"
                    type="datetime-local"
                    value={dateTime}
                    min={today + "T00:00"}
                    onChange={(e) => setDateTime(e.target.value)}
                    required
                />                <label>Mensagem</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
                <div className={styles.modalActions}>
                    <button onClick={onClose}>Cancelar</button>
                    <button onClick={handleSubmit} disabled={loading}>
                        {loading ? "Salvando..." : "Salvar"}
                    </button>
                </div>
            </div>
        </div>
    );
}
