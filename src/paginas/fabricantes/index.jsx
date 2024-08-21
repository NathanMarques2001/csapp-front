import { useEffect, useState } from "react";
import Api from "../../utils/api";
import editIcon from "../../assets/icons/icon-lapis.png";
import iconeInativar from "../../assets/icons/icon-inativar.png";
import Loading from "../../componetes/loading";
import { useNavigate } from "react-router-dom";
// Bibliotecas
// Componentes
// Estilos, funcoes, classes, imagens e etc

export default function Fabricantes() {
    const api = new Api();
    const [fabricantes, setFabricantes] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const fabricantesResponse = await api.get('/fabricantes');
                setFabricantes(fabricantesResponse.fabricantes);

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
        navigate(`/edicao-fabricante/${id}`)
    };

    const handleDelete = async (id) => {
        const response = await api.get(`/fabricantes/${id}`);
        if (response.fabricante.status === 'ativo') {
            await api.put(`/fabricantes/${id}`, { status: 'inativo' });
            return;
        }
        await api.put(`/fabricantes/${id}`, { status: 'ativo' });
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleRedirect = (url) => {
        navigate(url);
    }

    const filteredFabricantes = fabricantes.filter(fabricante => {
        return fabricante.nome.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const totalFabricantes = filteredFabricantes.length;

    return (
        <>
            {loading && <Loading />}
            <div>
                <h3 className="gestao-section-subtitulo">Fornecedores ({totalFabricantes})</h3>
                <input
                    type="text"
                    placeholder="Procure pelo nome"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="gestao-section-input"
                />
                <button className="gestao-section-btn" onClick={e => handleRedirect("/cadastro-fabricante")}>Adicionar fornecedor</button>
                {fabricantes.length > 0 ? (
                    <table className="gestao-section-tabela">
                        <thead>
                            <tr>
                                <th className="gestao-section-titulo-tabela">Nome</th>
                                <th className="gestao-section-titulo-tabela">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredFabricantes.map(fabricante => (
                                <tr key={fabricante.id}>
                                    <td className="gestao-section-conteudo-tabela">{fabricante.nome}</td>
                                    <td className="gestao-section-conteudo-tabela">
                                        <div className="gestao-section-container-btn">
                                            <button className="gestao-section-editar-btn gestao-section-item-btn" onClick={() => handleEdit(fabricante.id)}>
                                                <img src={editIcon} alt="" />
                                            </button>
                                            <button className="gestao-section-excluir-btn gestao-section-item-btn" onClick={() => handleDelete(fabricante.id)}>
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
