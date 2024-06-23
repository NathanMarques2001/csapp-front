import Navbar from "../../componetes/navbar";
import "./style.css";
import imgCadastroSolucao from "../../assets/images/img-cadastro-solucao.png";
import Api from "../../utils/api";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../componetes/loading";

export default function FormSolucao({ mode = 'cadastro' }) {
  const api = new Api();
  const [fabricantes, setFabricantes] = useState([]);
  const [selectedFabricante, setSelectedFabricante] = useState("");
  const [nomeProduto, setNomeProduto] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchFabricantes = async () => {
      try {
        const data = await api.get('/fabricantes');
        setFabricantes(data.fabricantes);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    const fetchProduto = async () => {
      if (mode === 'edicao' && id) {
        try {
          setLoading(true);
          const response = await api.get(`/produtos/${id}`);
          const produto = response.produto;
          setNomeProduto(produto.nome);
          setSelectedFabricante(produto.id_fabricante);
          setLoading(false);
        } catch (err) {
          console.error("Error fetching product:", err);
        }
      }
    };

    fetchFabricantes();
    fetchProduto();
  }, [mode, id]);

  const handleCancel = (e) => {
    e.preventDefault();
    navigate("/gestao");
  }

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (selectedFabricante === "s/ fabricante") {
      alert("Favor cadastrar um fabricante.");
      return;
    }
    const data = {
      nome: nomeProduto,
      id_fabricante: selectedFabricante
    };
    try {
      let req;
      if (mode === 'cadastro') {
        req = await api.post('/produtos', data);
      } else if (mode === 'edicao') {
        req = await api.put(`/produtos/${id}`, data);
      }
      if (req.message === "Produto criado com sucesso!" || req.message === "Produto atualizado com sucesso!") {
        setNomeProduto("");
        setSelectedFabricante("");
        navigate("/gestao");
      } else {
        alert("Erro ao cadastrar solução.");
      }
    } catch (err) {
      console.error("Error posting data:", err);
      alert("Erro ao cadastrar solução.");
    }
  }

  const handleFabricanteChange = (e) => {
    setSelectedFabricante(e.target.value);
  }

  return (
    <>
      {loading && <Loading />}
      <div className="global-display">
        <Navbar />
        <div className="global-container">
          <h2>{mode === 'cadastro' ? 'Cadastro de Solução' : 'Edição de Solução'}</h2>
          <p id="cadastro-solucao-descricao">Campos com "*" são obrigatórios.</p>
          <div id="cadastro-solucao-form-container">
            <form id="cadastro-solucao-form" onSubmit={handleAddProduct}>
              <div id="cadastro-solucao-input-labels">
                <label htmlFor="nome"><b>Nome *</b></label>
                <input
                  type="text"
                  id="cadastro-solucao-input"
                  name="nome"
                  value={nomeProduto}
                  onChange={(e) => setNomeProduto(e.target.value)}
                  required
                  placeholder="Digite o nome da solução"
                  className="cadastro-solucao-input"
                />
                <label htmlFor="fabricante"><b>Fornecedor *</b></label>
                <select
                  name="fabricante"
                  id="cadastro-solucao-select"
                  value={selectedFabricante}
                  onChange={handleFabricanteChange}
                  required
                  className="cadastro-solucao-input"
                >
                  <option value="s/ fabricante"></option>
                  {fabricantes.length > 0 && fabricantes.map(fabricante => (
                    <option key={fabricante.id} value={fabricante.id}>{fabricante.nome}</option>
                  ))}
                </select>
              </div>
              <div className="cadastro-solucao-container-btn">
                <button id="cadastro-solucao-btn-cancelar" className="cadastro-solucao-btn" onClick={handleCancel}>Cancelar</button>
                <button id="cadastro-solucao-btn-cadastrar" className="cadastro-solucao-btn">
                  {mode === 'cadastro' ? 'Adicionar solução' : 'Salvar alterações'}
                </button>
              </div>
            </form>
            <div id="cadastro-solucao-container-img">
              <img src={imgCadastroSolucao} alt="" id="cadastro-solucao-img" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
