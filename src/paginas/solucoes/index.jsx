import { useEffect, useState } from "react";
import "./style.css";
import Api from "../../utils/api";
import editIcon from "../../assets/icons/icon-lapis.png";
import iconeExcluir from "../../assets/icons/icon-lixeira.png";
import Loading from "../../componetes/loading";
import { useNavigate } from "react-router-dom";

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
                setLoading(false);
            } catch (err) {
                console.error("Error fetching data:", err);
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
                <h3 className="global-subtitulo">Soluções ({totalSolucoes})</h3>
                <input
                    type="text"
                    placeholder="Procure pelo nome ou fornecedor"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="global-input"
                />
                <button className="global-btn global-btn-verde" onClick={e => handleRedirect("/cadastro-solucao")}>Adicionar solução</button>
                <button className="global-btn global-btn-azul" onClick={e => handleRedirect("/cadastro-fabricante")}>Adicionar fornecedor</button>
                {produtos.length > 0 ? (
                    <table className="global-tabela">
                        <thead>
                            <tr>
                                <th className="global-titulo-tabela">Nome</th>
                                <th className="global-titulo-tabela">Fornecedor</th>
                                <th className="global-titulo-tabela">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProdutos.map(produto => (
                                <tr key={produto.id}>
                                    <td className="global-conteudo-tabela">{produto.nome}</td>
                                    <td className="global-conteudo-tabela">{fabricantes[produto.id_fabricante] || "Carregando..."}</td>
                                    <td className="global-conteudo-tabela">
                                        <div className="solucoes-container-btn">
                                            <button className="solucoes-editar-btn solucoes-item-btn" onClick={() => handleEdit(produto.id)}>
                                                <img src={editIcon} alt="" />
                                            </button>
                                            <button className="solucoes-excluir-btn solucoes-item-btn" onClick={() => handleDelete(produto.id)}>
                                                <img src={iconeExcluir} alt="" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Ainda não foram cadastrados soluções!</p>
                )}
            </div>
        </>
    );
}
