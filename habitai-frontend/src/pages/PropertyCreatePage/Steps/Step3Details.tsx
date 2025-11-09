import styles from './Step.module.css';

export function Step3Details({ formData, handleChange }) {
    return (
        <div className={styles.stepContainer}>
            <h2 className={styles.headline}>Detalhes que os inquilinos procuram.</h2>
            <p className={styles.subheadline}>Informe as características principais do seu imóvel.</p>
            <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                    <label htmlFor="bedrooms">Quartos</label>
                    <input
                        type="number" 
                        placeholder="0" 
                        id="bedrooms" 
                        name="bedrooms" 
                        min="0"
                        value={formData.bedrooms}
                        required
                        onChange={handleChange} />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="bathrooms">Banheiros</label>
                    <input 
                        type="number" 
                        placeholder="0" 
                        id="bathrooms" 
                        name="bathrooms" 
                        min="0" 
                        value={formData.bathrooms}
                        required
                        onChange={handleChange} />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="garageSpaces">Vagas de Garagem</label>
                    <input 
                        type="number" 
                        placeholder="0" 
                        id="garageSpaces" 
                        name="garageSpaces" 
                        min="0" 
                        value={formData.garageSpaces}
                        required
                        onChange={handleChange} />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="totalArea">Área Total (m²)</label>
                    <input 
                        type="number" 
                        placeholder="0" 
                        id="totalArea" 
                        name="totalArea" 
                        min="1" 
                        value={formData.totalArea} 
                        required
                        onChange={handleChange}/>
                </div>
            </div>
        </div>
    );
}