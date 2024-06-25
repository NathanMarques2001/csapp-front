import './style.css';
import { useEffect, useState } from "react";
import Api from "../../utils/api"; // Supondo que você tenha um utilitário de API similar

export default function FormContrato({ mode = "cadastro" }) {
  const api = new Api();
  const [clientes, setClientes] = useState([]);
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [clienteInput, setClienteInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await api.get('/clientes');
        setClientes(response.clientes);
      } catch (err) {
        console.error("Erro ao buscar clientes:", err);
      }
    };

    fetchClientes();
  }, []);

  const handleClienteInputChange = (e) => {
    const input = e.target.value;
    setClienteInput(input);
    if (input === "") {
      setFilteredClientes(clientes);
    } else {
      const filtered = clientes.filter(cliente =>
        (cliente.nome && cliente.nome.toLowerCase().includes(input.toLowerCase())) ||
        (cliente.cpf_cnpj && cliente.cpf_cnpj.includes(input))
      );
      setFilteredClientes(filtered);
    }
  };

  const handleClienteInputFocus = () => {
    setFilteredClientes(clientes);
    setShowDropdown(true);
  };

  const handleClienteInputBlur = () => {
    setShowDropdown(false);
  };

  const handleClienteItemClick = (cliente) => {
    setClienteInput(cliente.nome);
    setShowDropdown(false);
  };

  return (
    <div>
      <h2>Formulário de Contratos</h2>
      <p>Campos com "*" são obrigatórios.</p>
      <div>
        <form>
          <label htmlFor="cliente">Cliente <span>*</span></label>
          <input
            type="text"
            name='cliente'
            value={clienteInput}
            onChange={handleClienteInputChange}
            onFocus={handleClienteInputFocus}
            onBlur={handleClienteInputBlur}
            autoComplete="off"
          />
          {showDropdown && filteredClientes.length > 0 && (
            <ul className="dropdown-list">
              {filteredClientes.map(cliente => (
                <li key={cliente.id} onClick={() => handleClienteItemClick(cliente)}>
                  {cliente.nome} - {cliente.cpf_cnpj}
                </li>
              ))}
            </ul>
          )}
          <div>
            <button type="button">Cancelar</button>
            <button type="submit">{mode === "cadastro" ? "Adicionar contrato" : "Salvar alterações"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
