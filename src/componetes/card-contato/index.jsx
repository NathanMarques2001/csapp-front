// Estilos, funcoes, classes, imagens e etc
import "./style.css";

export default function CardContato({ titulo, contatos }) {
    return (
        <div className="card-cliente-contatos">
            <p className="card-cliente-contatos-titulo">{titulo}</p>
            <div className="card-cliente-contatos-container-conteudos">
                {contatos.map(contato => (
                    <p className="card-cliente-contatos-conteudo" key={contato.id}>{contato.conteudo}</p>
                ))}
            </div>
        </div>
    );
}