import Navbar from "../../componetes/navbar";
import "./style.css"
import imgCadastroSolucao from "../../assets/images/img-cadastro-solucao.png";
import Api from "../../utils/api";
import { useEffect, useState } from "react";

export default function CadastroSolucao() {
  const api = new Api();
  const [fabricantes, setFabricantes] = useState([]);
  const [selectedFabricante, setSelectedFabricante] = useState({ id: "", nome: "" });
  const [nomeProduto, setNomeProduto] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.get('/fabricantes');
        setFabricantes(data.fabricantes);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  const handleCancel = (e) => {
    e.preventDefault();
    window.location.href = "/gestao";
  }

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (selectedFabricante.id === "s/ fabricante") {
      alert("Favor cadastrar um fabricante.");
      return;
    }
    const data = {
      nome: nomeProduto,
      id_fabricante: selectedFabricante.id
    };
    try {
      const req = await api.post('/produtos', data);
      if (req.message === "Produto criado com sucesso!") {
        setNomeProduto("");
        setSelectedFabricante({ id: "", nome: "" });
        window.location.href = "/gestao";
      } else {
        alert("Erro ao cadastrar solução.");
      }
    } catch (err) {
      console.error("Error posting data:", err);
      alert("Erro ao cadastrar solução.");
    }
  }

  const handleFabricanteChange = (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    setSelectedFabricante({
      id: selectedOption.value,
      nome: selectedOption.text
    });
  }

  return (
    <div className="global-display">
      <Navbar />
      <div className="global-container">
        <h2>Cadastro de Solução</h2>
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
                value={selectedFabricante.id}
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
              <button type="button" onClick={handleCancel}>Cancelar</button>
              <button type="submit">Adicionar solução</button>
            </div>
          </form>
          <div id="cadastro-solucao-container-img">
            <img src={imgCadastroSolucao} alt="" id="cadastro-solucao-img" />
          </div>
        </div>
      </div>
    </div>
  );
}
