import { useEffect, useState } from "react";
import Api from "../../utils/api";
import editIcon from "../../assets/icons/icon-lapis.png";
import iconeInativar from "../../assets/icons/icon-inativar.png";
import iconeAtivar from "../../assets/icons/icon-ativar.png";
import Loading from "../../componetes/loading";
import { useNavigate } from "react-router-dom";
// Bibliotecas
// Componentes
// Estilos, funcoes, classes, imagens e etc

export default function Solucoes() {
    const api = new Api();
    const [produtos, setProdutos] = useState([]);
    const [fabricantes, setFabricantes] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const produtosResponse = await api.get('/produtos');
                setProdutos(produtosResponse.produtos);

                const fabricantesResponse = await api.get('/fabricantes');
                const fabricantesMap = fabricantesResponse.fabricantes.reduce((map, fabricante) => {
                    map[fabricante.id] = fabricante.nome;
                    return map;
                }, {});
                setFabricantes(fabricantesMap);
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
        navigate(`/edicao-solucao/${id}`)
    };

    const handleDelete = (id) => {
        console.log("Delete product with ID:", id);
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleRedirect = (url) => {
        navigate(url);
    }

    const filteredProdutos = produtos.filter(produto => {
        const fornecedorNome = fabricantes[produto.id_fabricante] || "";
        return produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            fornecedorNome.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const totalSolucoes = filteredProdutos.length;

    return (
        <>
            {loading && <Loading />}
            <div>
                <h3 className="gestao-section-subtitulo">Soluções ({totalSolucoes})</h3>
                <input
                    type="text"
                    placeholder="Procure pelo nome ou fornecedor"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="gestao-section-input"
                />
                <button className="gestao-section-btn gestao-section-btn-verde" onClick={e => handleRedirect("/cadastro-solucao")}>Adicionar solução</button>
                {produtos.length > 0 ? (
                    <table className="gestao-section-tabela">
                        <thead>
                            <tr>
                                <th className="gestao-section-titulo-tabela">Nome</th>
                                <th className="gestao-section-titulo-tabela">Fornecedor</th>
                                <th className="gestao-section-titulo-tabela">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProdutos.map(produto => (
                                <tr key={produto.id}>
                                    <td className="gestao-section-conteudo-tabela">{produto.nome}</td>
                                    <td className="gestao-section-conteudo-tabela">{fabricantes[produto.id_fabricante] || "Carregando..."}</td>
                                    <td className="gestao-section-conteudo-tabela">
                                        <div className="gestao-section-container-btn">
                                            <button className="gestao-section-editar-btn gestao-section-item-btn" onClick={() => handleEdit(produto.id)}>
                                                <img src={editIcon} alt="" />
                                            </button>
                                            {produto.status == 'ativo' ? (
                                                <button className="gestao-section-excluir-btn gestao-section-item-btn" onClick={() => handleDelete(produto.id)}>
                                                    <img src={iconeInativar} alt="" />
                                                </button>
                                            ) : (
                                                <button className="gestao-section-excluir-btn gestao-section-item-btn" onClick={() => handleDelete(produto.id)}>
                                                    <img src={iconeAtivar} alt="" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="gestao-section-sem-registros">Ainda não foram cadastrados soluções!</p>
                )}
            </div>
        </>
    );
}
