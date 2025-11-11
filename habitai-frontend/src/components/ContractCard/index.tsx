import { useNavigate } from "react-router-dom";
import type { Contract } from "../../types";
import styles from "./contractcard.module.css"

type ContractCardProps = {
    contract: Contract;
    isOwner: boolean;
};

export function ContractCard({contract, isOwner}: ContractCardProps){
    const navigate = useNavigate();
    
    return (
        <>
            <div 
                className={styles.card} 
                data-contract-id={contract.id}
                onClick={() => navigate(`/contracts/${contract.id}`)}
                role="button"
            >
                <div className={styles.content}>
                    <h3 className={styles.title}>{contract.property.title}</h3>
                    <p className={styles.address}>
                        {contract.property.neighborhood}, {contract.property.city} -
                        {contract.property.state}
                    </p>
                    <div className={styles.contrDetails}>
                        {isOwner ?
                            <div>
                                <span>Inquilino: </span> {contract.tenant.name}
                            </div>
                            
                            :
                            <div>
                                <span>Dono: </span> {contract.owner.name}
                            </div>
                        }
                        <div>
                            <span>Valor:</span> R$ {contract.monthlyPrice}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}