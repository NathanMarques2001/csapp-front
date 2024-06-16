import { useEffect, useState } from "react";
import "./style.css";
import Api from "../../utils/api";
import Navbar from "../../componetes/navbar";

export default function Solucoes() {
    const api = new Api("http://localhost:8080");
    const [produtos, setProdutos] = useState([]);
    const [fabricantes, setFabricantes] = useState({});

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
        // Lógica para editar o produto
        console.log("Edit product with ID:", id);
    };

    const handleDelete = (id) => {
        // Lógica para deletar o produto
        console.log("Delete product with ID:", id);
    };

    const totalSolucoes = produtos.length;

    return (
        <div>
            <h2>SOLUÇÕES ({totalSolucoes})</h2>
            <input type="text" />
            <button>Adicionar Usuário</button>
            <button>Adicionar Fornecedor</button>
            {produtos.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Nome do Produto</th>
                            <th>Nome do Fornecedor</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {produtos.map(produto => (
                            <tr key={produto.id}>
                                <td>{produto.nome}</td>
                                <td>{fabricantes[produto.id_fabricante] || "Carregando..."}</td>
                                <td>
                                    <button onClick={() => handleEdit(produto.id)}>Editar</button>
                                    <button onClick={() => handleDelete(produto.id)}>Excluir</button>
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
