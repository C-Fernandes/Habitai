import styles from './welcomepage.module.css';
import NavBar from "../components/NavBar";
import { PropertyListing } from '../components/PropertyListing';

export function WelcomePage() {
    return (
        <>
            <NavBar/>
            <div className={styles.container}>
                <h1 className={styles.pageTitle}>Imóveis Disponíveis</h1>
                <PropertyListing />
            </div>
        </>
    );
}