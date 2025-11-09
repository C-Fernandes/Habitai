import styles from './Step.module.css';

export function Step4Address({ formData, handleAddressChange, handleChange, isCepLoading, cepError }) {
  return (
    <div className={styles.stepContainer}>
      <h2 className={styles.headline}>Onde fica esta maravilha?</h2>
      <p className={styles.subheadline}>Comece pelo CEP para preenchimento automático.</p>
      
      <div className={styles.formGroup}>
        <label htmlFor="description">Descreva o imóvel</label>
        <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={5} />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="cep">CEP</label>
        <input type="text" id="cep" name="cep" value={formData.address.cep} onChange={handleAddressChange} maxLength={9} />
        {isCepLoading && <small>Buscando...</small>}
        {cepError && <small className={styles.errorText}>{cepError}</small>}
      </div>
      
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label>Rua</label>
          <input type="text" name="street" value={formData.address.street} onChange={handleAddressChange} readOnly />
        </div>
        <div className={styles.formGroup}>
          <label>Número</label>
          <input type="text" name="number" value={formData.address.number} onChange={handleAddressChange} />
        </div>
        <div className={styles.formGroup}>
          <label>Bairro</label>
          <input type="text" name="neighborhood" value={formData.address.neighborhood} onChange={handleAddressChange} readOnly />
        </div>
        <div className={styles.formGroup}>
          <label>Cidade</label>
          <input type="text" name="city" value={formData.address.city} onChange={handleAddressChange} readOnly />
        </div>
        <div className={styles.formGroup}>
          <label>Estado</label>
          <input type="text" name="state" value={formData.address.state} onChange={handleAddressChange} readOnly />
        </div>
        <div className={styles.formGroup}>
          <label>Complemento</label>
          <input type="text" name="complement" value={formData.address.complement} onChange={handleAddressChange} />
        </div>
      </div>
    </div>
  );
}