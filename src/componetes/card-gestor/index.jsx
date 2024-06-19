import "./style.css"
import iconeGestor from "../../assets/icons/icon-gestor.png"
import iconeEmail from "../../assets/icons/icon-email.png"
import iconeTelefone from "../../assets/icons/icon-telefone.png"
import iconeTelefoneAdicional from "../../assets/icons/icon-telefone-adicional.png"

export default function CardGestor({ titulo, nome, email, telefone1, telefone2 }) {
    return (
        <div className="cliente-card-gestor">
            <h3>{titulo}</h3>
            <div>
                <p><img src={iconeGestor} alt="" />{nome}</p>
                <p><img src={iconeEmail} alt="" />{email}</p>
                <p><img src={iconeTelefone} alt="" />{telefone1}</p>
                <p><img src={iconeTelefoneAdicional} alt="" />{telefone2}</p>
            </div>
        </div>
    );
}