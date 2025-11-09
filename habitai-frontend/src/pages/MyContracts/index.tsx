import NavBar from "../../components/NavBar";
import styles from "./mycontracts.module.css"

export function MyContractsCollection(){
    return(
        <>
            <NavBar/>
            <div className={styles.container}>
                <h1 className={styles.pageTitle}>Como dono</h1>
                
                <h1 className={styles.pageTitle}>Como inquilino</h1>

                
            </div>
        </>
    );
}