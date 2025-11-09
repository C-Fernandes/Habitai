import styles from './Step.module.css';

export function Step3Details({ formData, handleChange }) {
  return (
    <div className={styles.stepContainer}>
      <h2 className={styles.headline}>Detalhes que os inquilinos procuram.</h2>
      <p className={styles.subheadline}>Informe as características principais do seu imóvel.</p>
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label htmlFor="bedrooms">Quartos</label>
          <input type="number" id="bedrooms" name="bedrooms" value={formData.bedrooms} onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="bathrooms">Banheiros</label>
          <input type="number" id="bathrooms" name="bathrooms" value={formData.bathrooms} onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="garageSpaces">Vagas de Garagem</label>
          <input type="number" id="garageSpaces" name="garageSpaces" value={formData.garageSpaces} onChange={handleChange} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="totalArea">Área Total (m²)</label>
          <input type="number" id="totalArea" name="totalArea" value={formData.totalArea} onChange={handleChange}/>
        </div>
      </div>
    </div>
  );
}