import { useEffect, useState } from "react";
import Api from "../../utils/api";

export default function Usuarios() {
    const api = new Api("http://http://20.186.19.140/api");
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
            <h3 className="global-subtitulo">Usuários ({totalUsuarios})</h3>
            <input
                type="text"
                placeholder="Procure pelo seu nome"
                value={searchTerm}
                onChange={handleSearch}
                className="global-input"
            />
            <button className="global-btn global-btn-verde">Adicionar Usuário</button>
            {response && response.usuarios ? (
                <table className="global-tabela">
                    <thead>
                        <tr>
                            <th className="global-titulo-tabela">Nome</th>
                            <th className="global-titulo-tabela">Função</th>
                            <th className="global-titulo-tabela">Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsuarios.map(usuario => (
                            <tr key={usuario.id}>
                                <td className="global-conteudo-tabela">{usuario.nome}</td>
                                <td className="global-conteudo-tabela">{usuario.tipo}</td>
                                <td className="global-conteudo-tabela">{usuario.email}</td>
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
