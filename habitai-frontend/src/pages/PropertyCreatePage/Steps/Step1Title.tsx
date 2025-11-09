import styles from './Step.module.css';

export function Step1Title({ formData, handleChange }) {
  return (
    <div className={styles.stepContainer}>
      <h2 className={styles.headline}>Vamos começar com um título que chame a atenção.</h2>
      <p className={styles.subheadline}>Dê um nome ao seu anúncio.</p>
      <input
        type="text"
        id="title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Ex: Apartamento 3 quartos em Lagoa Nova"
        className={styles.mainInput}
        autoFocus
      />
    </div>
  );
}