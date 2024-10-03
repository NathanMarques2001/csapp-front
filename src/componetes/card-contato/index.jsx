import "./style.css";

export default function CardContato({ titulo, contatos, abrirPopUp, permissao }) {
    return (
        <div className="card-cliente-contatos">
            <div className="card-cliente-contatos-titulo-btn">
                <p className="card-cliente-contatos-titulo">{titulo}</p>
                <button className={`card-cliente-contatos-btn ${permissao ? 'disabled' : ''}`} onClick={(e) => abrirPopUp(e, titulo)} disabled={permissao}>+</button>
            </div>
            <div className="card-cliente-contatos-container-conteudos">
                {contatos.map(contato => (
                    <p onClick={(e) => abrirPopUp(e, titulo, contato.conteudo, contato.id)} className="card-cliente-contatos-conteudo" key={contato.id}>{contato.conteudo}</p>
                ))}
            </div>
        </div>
    );
}