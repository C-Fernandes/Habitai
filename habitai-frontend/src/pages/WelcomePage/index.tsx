
import styles from './welcomepage.module.css';
import NavBar from "../../components/NavBar";
import { PropertyListing } from "../../components/PropertyListing";

export function WelcomePage() {
    return (
        <>
            <NavBar/>
            <div className={styles.heroContainer}>
                <h1 className={styles.heroTitle}>Encontre o seu próximo lar.</h1>
                <p className={styles.heroSubtitle}>Aluguel fácil, rápido e 100% digital.</p>
            </div>
            <div className={styles.container}>
                <PropertyListing />
            </div>
        </>
    );
}