import { useEffect, useState, type FormEvent } from 'react';
import { Star } from 'lucide-react';
import { apiClient } from '../../../services/apiClient';
import { Button } from '../../Button';
import { BaseModal } from '../BaseModal';
import { toast } from 'sonner';
import styles from './ReviewModal.module.css';
import type { Review } from '../../../types';

type ReviewModalProps = {
  userId: number;
  isOpen: boolean;
  onRequestClose: () => void;
  propertyId: number;
  onSuccess: () => void;
  reviewToEdit?: Review | null;
};

export function ReviewModal({ userId, isOpen, onRequestClose, propertyId, onSuccess, reviewToEdit }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (reviewToEdit) {
      setRating(reviewToEdit.rating);
      setComment(reviewToEdit.comment);
    } else {
      setRating(0);
      setComment("");
    }
  }, [reviewToEdit, isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Por favor, selecione uma nota de 1 a 5.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (reviewToEdit) {
        await apiClient.put(`/reviews/${userId}/${reviewToEdit.id}`, {
          propertyId,
          rating,
          comment
        });
        toast.success("Avaliação atualizada!");
      } else {
        await apiClient.post(`/reviews/${userId}`, {
          propertyId,
          rating,
          comment
        });
        toast.success("Avaliação enviada!");
      }

      onSuccess();
      onRequestClose();

    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Erro ao enviar avaliação.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onRequestClose={onRequestClose}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>{reviewToEdit ? 'Editar Avaliação' : 'Avaliar Imóvel'}</h2>
          <button onClick={onRequestClose} className={styles.closeButton}></button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.starsContainer}>
            <p>Sua nota:</p>
            <div className={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  className={styles.starButton}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  <Star 
                    size={32} 
                    fill={(hoverRating || rating) >= star ? "#FFD700" : "none"} 
                    color={(hoverRating || rating) >= star ? "#FFD700" : "#E5E7EB"}
                    strokeWidth={2}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="comment">Comentário (Opcional)</label>
            <textarea
              id="comment"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Conte como foi sua experiência..."
              className={styles.textarea}
              maxLength={1000}
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className={styles.submitButton}>
            {isSubmitting ? "Salvando..." : (reviewToEdit ? "Salvar Alterações" : "Enviar Avaliação")}
          </Button>
        </form>
      </div>
    </BaseModal>
  );
}