import './style.css';
import { useEffect, useState } from "react";
import Api from "../../utils/api";
import Navbar from '../../componetes/navbar';
import imgCadastroContrato from "../../assets/images/img-cadastro-contrato.png";

export default function FormContrato({ mode = "cadastro" }) {
  const api = new Api();
  const [clientes, setClientes] = useState([]);
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [clienteInput, setClienteInput] = useState("");
  const [selectedClienteId, setSelectedClienteId] = useState(null);
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
    setSelectedClienteId(null); // Resetar o ID selecionado ao digitar no campo
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
    setTimeout(() => setShowDropdown(false), 100);
  };

  const handleClienteItemClick = (cliente) => {
    setClienteInput(cliente.nome);
    setSelectedClienteId(cliente.id);
    setShowDropdown(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedClienteId) {
      alert("Por favor, selecione um cliente.");
      return;
    }
    const formData = {
      clienteId: selectedClienteId,
      // Adicione aqui outros campos do formulário que você possa ter
    };
    console.log("Dados do formulário enviados:", formData);
    // Aqui você pode enviar `formData` para sua API
  };

  return (
    <div className="global-display">
      <Navbar />
      <div className="global-container">
        <h2>{mode === 'cadastro' ? 'Cadastro de Contrato' : 'Edição de Contrato'}</h2>
        <p id='cadastro-contrato-descricao'>Campos com "*" são obrigatórios.</p>
        <div id='form-contrato-container'>
          <form id='form-contrato-form' onSubmit={handleSubmit}>
            <div id='form-contrato-cliente-cpf-cnpj-container'>
              <div className='form-contrato-label-input-container dois-inputs'>
                <label htmlFor="cliente" className='label-form-contrato'><b>Cliente <span className='required'>*</span></b></label>
                <input
                  type="text"
                  name='cliente'
                  value={clienteInput}
                  onChange={handleClienteInputChange}
                  onFocus={handleClienteInputFocus}
                  onBlur={handleClienteInputBlur}
                  autoComplete="off"
                  placeholder='Digite a razão social, nome fantasia ou CPF/CNPJ'
                  className='form-contrato-input'
                />
                {showDropdown && filteredClientes.length > 0 && (
                  <ul className="dropdown-list">
                    {filteredClientes.map(cliente => (
                      <li key={cliente.id} onMouseDown={() => handleClienteItemClick(cliente)}>
                        {cliente.nome} - {cliente.cpf_cnpj}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className='form-contrato-label-input-container dois-inputs'>
                <label htmlFor="cpf-cnpj" className='label-form-contrato'><b>CPF/CNPJ</b></label>
                <input type="text" disabled id='input-desabilitado' className='form-contrato-input' />
              </div>
            </div>
            <div className='form-contrato-cliente-tres-inputs-container'>
              <div className='form-contrato-label-input-container tres-inputs'>
                <label htmlFor="faturado" className='label-form-contrato'><b>Faturado por <span className='required'>*</span></b></label>
                <select name="faturado" id="" className='form-contrato-input'>
                  <option value="faturado"></option>
                </select>
              </div>
              <div className='form-contrato-label-input-container tres-inputs'>
                <label htmlFor="solucao" className='label-form-contrato'><b>Solução ofertada <span className='required'>*</span></b></label>
                <select name="solucao" id="" className='form-contrato-input'>
                  <option value="solucao"></option>
                </select>
              </div>
              <div className='form-contrato-label-input-container tres-inputs'>
                <label htmlFor="duracao" className='label-form-contrato'><b>Duração do contrato <span className='required'>*</span></b></label>
                <select name="duracao" id="" className='form-contrato-input'>
                  <option value="duracao"></option>
                </select>
              </div>
            </div>
            <div className='form-contrato-cliente-tres-inputs-container'>
              <div className='form-contrato-label-input-container tres-inputs'>
                <label htmlFor="vencimento" className='label-form-contrato'><b>Dia vencimento <span className='required'>*</span></b></label>
                <select name="vencimento" id="" className='form-contrato-input'>
                  <option value="vencimento"></option>
                </select>
              </div>
              <div className='form-contrato-label-input-container tres-inputs'>
                <label htmlFor="reajuste" className='label-form-contrato'><b>Índice reajuste <span className='required'>*</span></b></label>
                <select name="reajuste" id="" className='form-contrato-input'>
                  <option value="reajuste"></option>
                </select>
              </div>
              <div className='form-contrato-label-input-container tres-inputs'>
                <label htmlFor="proximo-reajuste" className='label-form-contrato'><b>Próximo reajuste <span className='required'>*</span></b></label>
                <input type="date" name="proximo-reajuste" id="" className='form-contrato-input' />
              </div>
            </div>
            <div className='form-contrato-cliente-tres-inputs-container'>
              <div className='form-contrato-label-input-container tres-inputs'>
                <label htmlFor="valor-mensal" className='label-form-contrato'><b>Valor mensal <span className='required'>*</span></b></label>
                <input type="text" name="valor-mensal" id="" className='form-contrato-input' placeholder='Valor do contrato mensalmente' />
              </div>
              <div className='form-contrato-label-input-container tres-inputs'>
                <label htmlFor="quantidade" className='label-form-contrato'><b>Quantidade <span className='required'>*</span></b></label>
                <input type="text" name="quantidade" id="" className='form-contrato-input' placeholder='Quantidade da solução' />
              </div>
              <div className='form-contrato-label-input-container tres-inputs'>
                <label htmlFor="data-inicio" className='label-form-contrato'><b>Data ínicio <span className='required'>*</span></b></label>
                <input type="date" name="data-inicio" id="" className='form-contrato-input' />
              </div>
            </div>
            <div className='form-contrato-cliente-tres-inputs-container'>
              <img id='form-contrato-img' src={imgCadastroContrato} alt="" />
              <div>
                <div className='form-contrato-label-input-container'>
                  <label htmlFor="email" className='label-form-contrato'><b>Email de envio <span className='required'>*</span></b></label>
                  <input type="email" name="email" id="" className='form-contrato-input' placeholder='Email que receberá o contrato' />
                </div>
                <div className='form-contrato-label-input-container'>
                  <label htmlFor="descricao" className='label-form-contrato'><b>Descrição breve <span className='required'>*</span></b></label>
                  <textarea name="descricao" id="" className='form-contrato-input' placeholder='Algo a mais que deveria ser descrito aqui...'></textarea>
                </div>
                <div>
                  <button type="button">Cancelar</button>
                  <button onClick={e => console.log(selectedClienteId)}>{mode === "cadastro" ? "Adicionar contrato" : "Salvar alterações"}</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
