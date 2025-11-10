import { useState } from "react";
import styles from "./ownervisitactionmodal.module.css";
import { visitService } from "../../../services/visitService";

export default function OwnerVisitActionModal({ visitId, action, onClose, onUpdated }: any) {
    const [loading, setLoading] = useState(false);

    const handleAction = async () => {
        setLoading(true);
        try {
            if (action === "CONFIRM") await visitService.confirmVisit(visitId);
            if (action === "REJECT") await visitService.rejectVisit(visitId);
            onUpdated();
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h3>{action === "CONFIRM" ? "Confirmar visita" : "Rejeitar visita"}</h3>
                <p>Tem certeza que deseja {action === "CONFIRM" ? "confirmar" : "rejeitar"} esta visita?</p>
                <div className={styles.modalActions}>
                    <button className={styles.cancelBtn} onClick={onClose} disabled={loading}>Cancelar</button>
                    <button
                        className={action === "CONFIRM" ? styles.confirmBtn : styles.rejectBtn}
                        onClick={handleAction}
                        disabled={loading}
                    >
                        {loading ? "Processando..." : action === "CONFIRM" ? "Confirmar" : "Rejeitar"}
                    </button>
                </div>
            </div>
        </div>
    );
}
