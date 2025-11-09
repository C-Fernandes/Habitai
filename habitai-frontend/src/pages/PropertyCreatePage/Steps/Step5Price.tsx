import styles from './Step.module.css';

export function Step5Price({ formData, handleChange }) {
    return (
        <div className={styles.stepContainer}>
            <h2 className={styles.headline}>Quase lá! Quanto custa por mês?</h2>
            <p className={styles.subheadline}>Defina o valor do aluguel.</p>
            <div className={styles.priceInputWrapper}>
                <span className={styles.priceSymbol}>R$</span>
                <input
                    type="text"
                    inputMode="numeric"
                    id="rentalPrice"
                    name="rentalPrice"
                    value={formData.rentalPrice}
                    onChange={handleChange}
                    placeholder="0"
                    className={styles.priceInput}
                    autoFocus
                    min="0"
                />
            </div>
        </div>
    );
}