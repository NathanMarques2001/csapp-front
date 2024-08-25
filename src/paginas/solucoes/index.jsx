import { useEffect, useState } from "react";
import Api from "../../utils/api";
import editIcon from "../../assets/icons/icon-lapis.png";
import iconeInativar from "../../assets/icons/icon-inativar.png";
import iconeAtivar from "../../assets/icons/icon-ativar.png";
import Loading from "../../componetes/loading";
import { useNavigate } from "react-router-dom";
import Popup from "../../componetes/pop-up";

export default function Solucoes() {
    const api = new Api();
    const [produtos, setProdutos] = useState([]);
    const [fabricantes, setFabricantes] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [atualizar, setAtualizar] = useState(0);
    const [popupConfig, setPopupConfig] = useState({
        open: false,
        title: "",
        message: "",
        id: null,
    });
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
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [atualizar]);

    const handleEdit = (id) => navigate(`/edicao-solucao/${id}`);

    const handleChangeStatus = async () => {
        const { id } = popupConfig;
        setPopupConfig((prev) => ({ ...prev, open: false }));
        setLoading(true);
        try {
            const response = await api.get(`/produtos/${id}`);
            const newStatus = response.produto.status === "ativo" ? "inativo" : "ativo";
            await api.put(`/produtos/${id}`, { status: newStatus });
            setAtualizar((prev) => prev + 1);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (id, status) => {
        const titles = {
            ativo: "Inativar Solução",
            inativo: "Ativar Solução",
        };
        const messages = {
            ativo: "Tem certeza que deseja inativar esta solução?",
            inativo: "Tem certeza que deseja ativar esta solução?",
        };
        setPopupConfig({
            open: true,
            title: titles[status],
            message: messages[status],
            id,
        });
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleRedirect = (url) => {
        navigate(url);
    };

    const filteredProdutos = produtos.filter(produto => {
        const fornecedorNome = fabricantes[produto.id_fabricante] || "";
        return produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            fornecedorNome.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const totalSolucoes = filteredProdutos.length;

    return (
        <>
            {loading && <Loading />}
            {popupConfig.open && (
                <Popup
                    title={popupConfig.title}
                    message={popupConfig.message}
                    onConfirm={handleChangeStatus}
                    onCancel={() =>
                        setPopupConfig((prev) => ({ ...prev, open: false }))
                    }
                />
            )}
            <div>
                <h3 className="gestao-section-subtitulo">Soluções ({totalSolucoes})</h3>
                <input
                    type="text"
                    placeholder="Procure pelo nome ou fornecedor"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="gestao-section-input"
                />
                <button className="gestao-section-btn gestao-section-btn-verde" onClick={() => handleRedirect("/cadastro-solucao")}>
                    Adicionar solução
                </button>
                {produtos.length > 0 ? (
                    <table className="gestao-section-tabela">
                        <thead>
                            <tr>
                                <th className="gestao-section-titulo-tabela">Nome</th>
                                <th className="gestao-section-titulo-tabela">Fornecedor</th>
                                <th className="gestao-section-titulo-tabela">Status</th>
                                <th className="gestao-section-titulo-tabela">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProdutos.map(produto => (
                                <tr key={produto.id}>
                                    <td className="gestao-section-conteudo-tabela">{produto.nome}</td>
                                    <td className="gestao-section-conteudo-tabela">{fabricantes[produto.id_fabricante]}</td>
                                    <td className="gestao-section-conteudo-tabela">{produto.status}</td>
                                    <td className="gestao-section-conteudo-tabela">
                                        <div className="gestao-section-container-btn">
                                            <button className="gestao-section-editar-btn gestao-section-item-btn" onClick={() => handleEdit(produto.id)}>
                                                <img src={editIcon} alt="Editar" />
                                            </button>
                                            <button
                                                className={`${produto.status === 'ativo' ? "gestao-section-excluir-btn " : "gestao-section-editar-btn "} gestao-section-item-btn`}
                                                onClick={() => handleStatusChange(produto.id, produto.status)}
                                            >
                                                <img
                                                    src={produto.status === "ativo" ? iconeInativar : iconeAtivar}
                                                    alt={produto.status === "ativo" ? "Inativar" : "Ativar"}
                                                />
                                            </button>
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
