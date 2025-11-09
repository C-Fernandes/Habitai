import styles from './Step.module.css';

export function Step2Photos({ imageFiles, onChange }) {
  return (
    <div className={styles.stepContainer}>
      <h2 className={styles.headline}>Mostre o melhor do seu imóvel!</h2>
      <p className={styles.subheadline}>Fotos de qualidade fazem toda a diferença.</p>
      <div className={styles.uploadBox}>
        <input
          type="file"
          id="images"
          name="images"
          onChange={onChange}
          multiple
          accept="image/png, image/jpeg"
          className={styles.fileInput}
        />
        <label htmlFor="images" className={styles.fileLabel}>
          Clique para selecionar ou arraste suas fotos
        </label>
        <p className={styles.infoText}>Formatos permitidos: JPG, PNG. Limite de 10 fotos.</p>
      </div>
      {/* Preview das imagens selecionadas */}
      <div className={styles.imagePreviewContainer}>
        {imageFiles.length > 0 && (
          <p>{imageFiles.length} foto(s) selecionada(s):</p>
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