import { useEffect, useState } from "react";
import "./style.css";
import Api from "../../utils/api";
import editIcon from "../../assets/icons/icon-lapis.png";
import iconeExcluir from "../../assets/icons/icon-lixeira.png";

export default function Solucoes() {
    const api = new Api("http://localhost:8080");
    const [produtos, setProdutos] = useState([]);
    const [fabricantes, setFabricantes] = useState({});
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const produtosResponse = await api.get('/produtos');
                console.log('Produtos:', produtosResponse.produtos);
                setProdutos(produtosResponse.produtos);

                const fabricantesResponse = await api.get('/fabricantes');
                console.log('Fabricantes:', fabricantesResponse.fabricantes);
                const fabricantesMap = fabricantesResponse.fabricantes.reduce((map, fabricante) => {
                    map[fabricante.id] = fabricante.nome;
                    return map;
                }, {});
                setFabricantes(fabricantesMap);

            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };

        fetchData();
    }, []);

    const handleEdit = (id) => {
        console.log("Edit product with ID:", id);
    };

    const handleDelete = (id) => {
        console.log("Delete product with ID:", id);
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredProdutos = produtos.filter(produto => {
        const fornecedorNome = fabricantes[produto.id_fabricante] || "";
        return produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            fornecedorNome.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const totalSolucoes = filteredProdutos.length;

    return (
        <div>
            <h2 className="gestao-subtitulo">Soluções ({totalSolucoes})</h2>
            <input
                type="text"
                placeholder="Procure pelo nome ou fornecedor"
                value={searchTerm}
                onChange={handleSearch}
                className="gestao-input"
            />
            <button className="gestao-btn" id="solucoes-adicionar-usuario-btn">Adicionar Usuário</button>
            <button className="gestao-btn" id="solucoes-adicionar-fornecedor-btn">Adicionar Fornecedor</button>
            {produtos.length > 0 ? (
                <table className="gestao-tabela">
                    <thead>
                        <tr>
                            <th className="gestao-titulo-tabela">Nome</th>
                            <th className="gestao-titulo-tabela">Fornecedor</th>
                            <th className="gestao-titulo-tabela">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProdutos.map(produto => (
                            <tr key={produto.id}>
                                <td className="gestao-conteudo-tabela">{produto.nome}</td>
                                <td className="gestao-conteudo-tabela">{fabricantes[produto.id_fabricante] || "Carregando..."}</td>
                                <td className="gestao-conteudo-tabela">
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
                <p>Carregando...</p>
            )}
        </div>
    );
}
