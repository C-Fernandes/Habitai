import styles from "./deletevisitmodal.module.css";
import { visitService } from "../../../services/visitService.ts";
import { toast } from "sonner";

export default function DeleteVisitModal({ visit, onClose, onDeleted }: any) {
    const handleDelete = async () => {
        try {
            await visitService.deleteVisit(visit.id);
            toast.success("Visita desmarcada com sucesso!");
            onDeleted();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Erro ao desmarcar a visita. Tente novamente.");
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h3>Desmarcar visita</h3>
                <p>Tem certeza que deseja desmarcar esta visita?</p>
                <div className={styles.modalActions}>
                    <button onClick={onClose}>Cancelar</button>
                    <button className={styles.deleteBtn} onClick={handleDelete}>
                        Desmarcar
                    </button>
                </div>
            </div>
        </div>
    );
}
