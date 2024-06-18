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
      <div>
        <div>
          <h2>Cadastro de Solução</h2>
          <p>Campos com "*" são obrigatórios.</p>
        </div>
        <div>
          <form onSubmit={handleAddProduct}>
            <div>
              <label htmlFor="nome">Nome</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={nomeProduto}
                onChange={(e) => setNomeProduto(e.target.value)}
                required
              />
              <label htmlFor="fabricante">Fornecedor</label>
              <select
                name="fabricante"
                value={selectedFabricante.id}
                onChange={handleFabricanteChange}
                required
              >
                <option value="s/ fabricante">Nenhum fabricante cadastrado</option>
                {fabricantes.length > 0 && fabricantes.map(fabricante => (
                  <option key={fabricante.id} value={fabricante.id}>{fabricante.nome}</option>
                ))}
              </select>
            </div>
            <div>
              <button type="button" onClick={handleCancel}>Cancelar</button>
              <button type="submit">Adicionar solução</button>
            </div>
          </form>
          <img src={imgCadastroSolucao} alt="" />
        </div>
      </div>
    </div>
  );
}
