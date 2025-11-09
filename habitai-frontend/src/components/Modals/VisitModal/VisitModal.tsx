import { useState } from "react";
import styles from "./visitmodal.module.css";
import { toast } from "sonner";
import { visitService } from "../../../services/visitService.ts";

interface VisitModalProps {
    propertyId: number;
    onClose: () => void;
}

export function VisitModal({ propertyId, onClose }: VisitModalProps) {
    const [dateTime, setDateTime] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const today = new Date().toISOString().split("T")[0];

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const loggedUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");

        if (!loggedUser.id) {
            toast.error("Usuário não autenticado.");
            return;
        }

        if (!dateTime) {
            toast.error("Selecione uma data válida.");
            return;
        }

        if (message.length > 255) {
            toast.error("A mensagem deve ter no máximo 255 caracteres.");
            return;
        }

        try {
            setIsLoading(true);
            await visitService.createVisit({
                propertyId,
                dateTime,
                message,
                userId: loggedUser.id,
            });
            toast.success("Reserva realizada com sucesso!");
            onClose();
        } catch (err) {
            console.error(err);
            toast.error("Erro ao realizar reserva.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2>Agendar visita</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="date">Data:</label>
                        <input
                            id="dateTime"
                            type="datetime-local"
                            value={dateTime}
                            min={today + "T00:00"}
                            onChange={(e) => setDateTime(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="message">Mensagem (opcional):</label>
                        <textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            maxLength={255}
                            placeholder="Escreva uma mensagem para o proprietário..."
                        />
                    </div>

                    <div className={styles.modalButtons}>
                        <button
                            type="button"
                            onClick={onClose}
                            className={styles.cancel}
                            disabled={isLoading}
                        >
                            Cancelar
                        </button>
                        <button type="submit" disabled={isLoading}>
                            {isLoading ? "Enviando..." : "Confirmar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
