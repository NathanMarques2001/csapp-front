import { useEffect, useState } from "react";
import Api from "../../utils/api";
import Loading from "../../componetes/loading";
import editIcon from "../../assets/icons/icon-lapis.png";
import iconeExcluir from "../../assets/icons/icon-lixeira.png";
import { useNavigate } from "react-router-dom";

export default function Usuarios() {
    const api = new Api();
    const [response, setResponse] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await api.get('/usuarios');
                setResponse(data);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleEditUser = async (id) => {
        try {
            setLoading(true);
            const userData = await api.get(`/usuarios/${id}`);
            if (userData) {
                navigate(`/edicao-usuario/${id}`, { state: { userData } });
            } else {
                console.error(`Usuário com id ${id} não encontrado.`);
            }
        } catch (err) {
            console.error("Erro ao buscar usuário:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        console.log("Delete user with ID:", id);
    };

    const filteredUsuarios = response && response.usuarios
        ? response.usuarios.filter(usuario =>
            usuario.nome.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];

    const totalUsuarios = filteredUsuarios.length;

    const handleAddUser = () => {
        navigate("/cadastro-usuario");
    }

    return (
        <>
            {loading && <Loading />}
            <div>
                <h3 className="global-subtitulo">Usuários ({totalUsuarios})</h3>
                <input
                    type="text"
                    placeholder="Procure pelo seu nome"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="global-input"
                />
                <button onClick={handleAddUser} className="global-btn global-btn-verde">Adicionar Usuário</button>
                {response && response.usuarios ? (
                    <table className="global-tabela">
                        <thead>
                            <tr>
                                <th className="global-titulo-tabela">Nome</th>
                                <th className="global-titulo-tabela">Função</th>
                                <th className="global-titulo-tabela">Email</th>
                                <th className="global-titulo-tabela">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsuarios.map(usuario => (
                                <tr key={usuario.id}>
                                    <td className="global-conteudo-tabela">{usuario.nome}</td>
                                    <td className="global-conteudo-tabela">{usuario.tipo}</td>
                                    <td className="global-conteudo-tabela">{usuario.email}</td>
                                    <td className="global-conteudo-tabela solucoes-container-btn">
                                        <button className="solucoes-editar-btn solucoes-item-btn" onClick={() => handleEditUser(usuario.id)}>
                                            <img src={editIcon} alt="" />
                                        </button>
                                        <button className="solucoes-excluir-btn solucoes-item-btn" onClick={() => handleDelete(usuario.id)}>
                                            <img src={iconeExcluir} alt="" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Ainda não foram cadastrados usuários!</p>
                )}
            </div>
        </>
    );
}
