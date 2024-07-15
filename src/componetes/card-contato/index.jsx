// Estilos, funcoes, classes, imagens e etc
import "./style.css";

export default function CardContato({ titulo, contatos, abrirPopUp, permissao }) {
    return (
        <div className="card-cliente-contatos">
            <div className="card-cliente-contatos-titulo-btn">
                <p className="card-cliente-contatos-titulo">{titulo}</p>
                <button className={`card-cliente-contatos-btn ${permissao ? 'disabled' : ''}`} onClick={abrirPopUp} disabled={permissao}>+</button>
            </div>
            <div className="card-cliente-contatos-container-conteudos">
                {contatos.map(contato => (
                    <p className="card-cliente-contatos-conteudo" key={contato.id}>{contato.conteudo}</p>
                ))}
            </div>
        </div>
    );
}