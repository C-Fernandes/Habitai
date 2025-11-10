import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

import { ContractListByOwner, ContractListByTenant } from "../../components/ContractsList";
import NavBar from "../../components/NavBar";
import styles from "./mycontractspage.module.css"

export function MyContractsPage(){
    return(
        <>
            <NavBar/>
            <div className={styles.container}>
                <h1 className={styles.pageTitle}>Meus Contratos</h1>
                <div>
                    <section>
                        <h2 className={styles.sectionTitle}>Imóveis (Proprietário)</h2>
                        <ContractListByOwner/>
                    </section>
                    
                    <section>
                        <h2 className={styles.sectionTitle}>Locações (Inquilino)</h2>
                        <ContractListByTenant/>
                    </section>
                </div>


            </div>
        </>
    );
}