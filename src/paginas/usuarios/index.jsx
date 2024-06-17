import { useEffect, useState } from "react";
import "./style.css";
import Api from "../../utils/api";

export default function Usuarios() {
    const api = new Api("http://localhost:8080");
    const [response, setResponse] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await api.get('/usuarios');
                setResponse(data);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
        fetchData();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredUsuarios = response && response.usuarios
        ? response.usuarios.filter(usuario =>
            usuario.nome.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];

    const totalUsuarios = filteredUsuarios.length;

    return (
        <div>
            <h2 className="gestao-subtitulo">Usuários ({totalUsuarios})</h2>
            <input
                type="text"
                placeholder="Procure pelo seu nome"
                value={searchTerm}
                onChange={handleSearch}
                className="gestao-input"
            />
            <button className="gestao-btn" id="usuarios-btn">Adicionar Usuário</button>
            {response && response.usuarios ? (
                <table className="gestao-tabela">
                    <thead>
                        <tr>
                            <th className="gestao-titulo-tabela">Nome</th>
                            <th className="gestao-titulo-tabela">Função</th>
                            <th className="gestao-titulo-tabela">Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsuarios.map(usuario => (
                            <tr key={usuario.id}>
                                <td className="gestao-conteudo-tabela">{usuario.nome}</td>
                                <td className="gestao-conteudo-tabela">{usuario.tipo}</td>
                                <td className="gestao-conteudo-tabela">{usuario.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Carregando...</p>
            )}
        </div>
    );
}
