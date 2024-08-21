import { useEffect, useState } from "react";
import Api from "../../utils/api";
import editIcon from "../../assets/icons/icon-lapis.png";
import iconeInativar from "../../assets/icons/icon-inativar.png";
import Loading from "../../componetes/loading";
import { useNavigate } from "react-router-dom";
// Bibliotecas
// Componentes
// Estilos, funcoes, classes, imagens e etc

export default function Faturados() {
    const api = new Api();
    const [faturados, setFaturados] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const faturadosResponse = await api.get('/faturados');
                setFaturados(faturadosResponse.faturados);

            } catch (err) {
                console.error("Error fetching data:", err);
            }
            finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleEdit = (id) => {
        navigate(`/edicao-faturado/${id}`)
    };

    const handleDelete = async (id) => {
        const response = await api.get(`/faturados/${id}`);
        if (response.faturado.status === 'ativo') {
            await api.put(`/faturados/${id}`, { status: 'inativo' });
            return;
        }
        await api.put(`/faturados/${id}`, { status: 'ativo' });
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleRedirect = (url) => {
        navigate(url);
    }

    const filteredfaturados = faturados.filter(faturado => {
        return faturado.nome.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const totalfaturados = filteredfaturados.length;

    return (
        <>
            {loading && <Loading />}
            <div>
                <h3 className="gestao-section-subtitulo">Faturistas ({totalfaturados})</h3>
                <input
                    type="text"
                    placeholder="Procure pelo nome"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="gestao-section-input"
                />
                <button className="gestao-section-btn" onClick={e => handleRedirect("/cadastro-faturado")}>Adicionar faturista</button>
                {faturados.length > 0 ? (
                    <table className="gestao-section-tabela">
                        <thead>
                            <tr>
                                <th className="gestao-section-titulo-tabela">Nome</th>
                                <th className="gestao-section-titulo-tabela">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredfaturados.map(faturado => (
                                <tr key={faturado.id}>
                                    <td className="gestao-section-conteudo-tabela">{faturado.nome}</td>
                                    <td className="gestao-section-conteudo-tabela">
                                        <div className="gestao-section-container-btn">
                                            <button className="gestao-section-editar-btn gestao-section-item-btn" onClick={() => handleEdit(faturado.id)}>
                                                <img src={editIcon} alt="" />
                                            </button>
                                            <button className="gestao-section-excluir-btn gestao-section-item-btn" onClick={() => handleDelete(faturado.id)}>
                                                <img src={iconeInativar} alt="" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="gestao-section-sem-registros">Ainda não foram cadastrados fornecedores!</p>
                )}
            </div>
        </>
    );
}
