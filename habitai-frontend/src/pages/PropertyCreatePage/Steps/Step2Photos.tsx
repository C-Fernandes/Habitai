import { ImagePlus } from 'lucide-react';
import styles from './Step.module.css';

export function Step2Photos({ imageFiles, onChange }) {
    return (
        <div className={styles.stepContainer}>
            <h2 className={styles.headline}>Mostre o melhor do seu imóvel!</h2>
            <p className={styles.subheadline}>Fotos de qualidade fazem toda a diferença.</p>
            
            <div className={styles.imageDropzone}>
                <input
                    type="file"
                    id="images"
                    name="images"
                    onChange={onChange}
                    multiple
                    accept="image/png, image/jpeg"
                    className={styles.fileInput}
                />
                
                <label htmlFor="images" className={styles.dropzoneLabel}>
                    <ImagePlus size={48} strokeWidth={1.5} className={styles.dropzoneIcon} />
                    <p className={styles.dropzoneText}>
                        Clique para selecionar ou arraste suas fotos aqui
                    </p>
                    <p className={styles.dropzoneHint}>
                        Formatos: JPG, PNG. Máximo de 10 fotos.
                    </p>
                </label>
            </div>

            <div className={styles.imagePreviewContainer}>
                {imageFiles.length > 0 && (
                    <p className={styles.previewCount}>{imageFiles.length} foto(s) selecionada(s):</p>
                )}
                <div className={styles.imageGrid}>
                    {Array.from(imageFiles).map((file, index) => (
                        <img 
                        key={index} 
                        src={URL.createObjectURL(file)} 
                        alt={`preview ${index}`}
                        className={styles.previewImage}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}