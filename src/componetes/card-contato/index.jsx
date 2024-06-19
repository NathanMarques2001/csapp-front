import "./style.css"

export default function CardContato({ titulo, contatos }) {
    return (
        <div className="cliente-contatos">
            <h3>{titulo}</h3>
            <div>
                {contatos.map(contato => (
                    <p key={contato.id}>{contato.conteudo}</p>
                ))}
            </div>
        </div>
    );
}