import './style.css';
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Api from "../../utils/api";
import Navbar from '../../componetes/navbar';
import imgCadastroContrato from "../../assets/images/img-cadastro-contrato.png";
import Loading from '../../componetes/loading';
import Popup from '../../componetes/pop-up';
import formatDate from '../../utils/formatDate';

export default function FormContrato({ mode = "cadastro" }) {
  const api = new Api();
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupAction, setPopupAction] = useState(null);

  const [clientes, setClientes] = useState([]);
  const [cliente, setCliente] = useState(null);
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [clienteInput, setClienteInput] = useState("");
  const [selectedClienteId, setSelectedClienteId] = useState(null);
  const [selectedClienteCpfCnpj, setSelectedClienteCpfCnpj] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [produtos, setProdutos] = useState([]);

  // Campos do formulário
  const [faturadoPor, setFaturadoPor] = useState("");
  const [solucao, setSolucao] = useState("");
  const [duracao, setDuracao] = useState("");
  const [vencimento, setVencimento] = useState("");
  const [reajuste, setReajuste] = useState("");
  const [proximoReajuste, setProximoReajuste] = useState("");
  const [valorMensal, setValorMensal] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [email, setEmail] = useState("");
  const [descricao, setDescricao] = useState("");
  const [indiceReajusteValor, setIndiceReajusteValor] = useState(null); // Novo estado para armazenar o valor do índice de reajuste

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await api.get('/clientes');
        setClientes(response.clientes);
      } catch (err) {
        console.error("Erro ao buscar clientes:", err);
      }
    };

    const fetchProdutos = async () => {
      try {
        const response = await api.get('/produtos');
        setProdutos(response.produtos);
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
      }
    };

    const fetchContrato = async () => {
      if (mode === 'edicao' && id) {
        try {
          setLoading(true);
          const response = await api.get(`/contratos/${id}`);
          const contrato = response.contrato;
          const clienteResponse = await api.get(`/clientes/${contrato.id_cliente}`);
          const selectedCliente = clienteResponse.cliente;

          setSelectedClienteId(contrato.id_cliente);
          setClienteInput(selectedCliente ? `${selectedCliente.razao_social} - ${selectedCliente.nome_fantasia}` : "");
          setSelectedClienteCpfCnpj(selectedCliente ? selectedCliente.cpf_cnpj : "");

          setSolucao(contrato.id_produto);
          setFaturadoPor(contrato.faturado_por);
          setVencimento(contrato.dia_vencimento);
          setReajuste(contrato.indice_reajuste);
          setProximoReajuste(formatDate(contrato.proximo_reajuste));
          setDuracao(contrato.duracao);
          setValorMensal(contrato.valor_mensal);
          setQuantidade(contrato.quantidade);
          setDataInicio(formatDate(contrato.data_inicio));
          setEmail(contrato.email_envio);
          setDescricao(contrato.descricao);
        } catch (err) {
          console.error("Erro ao buscar contrato:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchClientes();
    fetchProdutos();
    fetchContrato();
  }, [mode, id]);

  const fetchIndice = async (indice) => {
    let url = '';
    if (indice === 'igpm') {
      url = 'https://api.bcb.gov.br/dados/serie/bcdata.sgs.189/dados?formato=json';
    } else if (indice === 'ipca') {
      url = 'https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados?formato=json';
    }

    try {
      const response = await fetch(url);
      const data = await response.json();
      return data[data.length - 1].valor;
    } catch (err) {
      console.error(`Erro ao buscar ${indice}:`, err);
      return null;
    }
  };

  const handleClienteInputChange = (e) => {
    const input = e.target.value;
    setClienteInput(input);
    setSelectedClienteId(null);
    if (input === "") {
      setFilteredClientes(clientes);
    } else {
      const filtered = clientes.filter(cliente =>
        (cliente.razao_social && cliente.razao_social.toLowerCase().includes(input.toLowerCase())) ||
        (cliente.nome_fantasia && cliente.nome_fantasia.toLowerCase().includes(input.toLowerCase()))
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
    setClienteInput(`${cliente.razao_social} - ${cliente.nome_fantasia}`);
    setSelectedClienteId(cliente.id);
    setSelectedClienteCpfCnpj(cliente.cpf_cnpj);
    setShowDropdown(false);
  };

  const handleReajusteChange = async (e) => {
    const indice = e.target.value;
    setReajuste(indice);
    const valor = await fetchIndice(indice);
    if (valor) {
      setIndiceReajusteValor(valor);
      console.log(`Valor do índice ${indice}: ${valor}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClienteId) {
      alert("Por favor, selecione um cliente.");
      return;
    }

    setPopupAction(confirmSubmit);
    setShowPopup(true);
  };

  const confirmSubmit = async () => {
    setShowPopup(false);
    try {
      setLoading(true);
      const formData = {
        id_cliente: Number(selectedClienteId),
        id_produto: Number(solucao),
        faturado: false,
        faturado_por: faturadoPor,
        dia_vencimento: Number(vencimento),
        indice_reajuste: Number(indiceReajusteValor), // Usando o valor do índice de reajuste armazenado
        proximo_reajuste: formatDate(proximoReajuste),
        status: "ativo",
        duracao: Number(duracao),
        valor_mensal: Number(valorMensal),
        quantidade: Number(quantidade),
        email_envio: email,
        descricao: descricao,
        data_inicio: formatDate(dataInicio),
      };

      let req;
      if (mode === "cadastro") {
        req = await api.post("/contratos", formData);
      } else if (mode === "edicao" && id) {
        req = await api.put(`/contratos/${id}`, formData);
      }

      if (req.message === "Contrato criado com sucesso!" || req.message === "Contrato atualizado com sucesso!") {
        navigate(`/contratos`);
      } else {
        alert("Erro ao salvar contrato.");
      }
    } catch (error) {
      console.error("Erro ao enviar os dados do contrato:", error);
      alert("Erro ao salvar contrato.");
    } finally {
      setLoading(false);
    }
  };

  const cancelPopup = () => {
    setShowPopup(false);
  };

  const options = [];
  for (let i = 6; i <= 60; i++) {
    options.push(i);
  }

  return (
    <>
      {loading && <Loading />}
      {showPopup && (
        <Popup
          message="Tem certeza que deseja continuar com esta ação?"
          onConfirm={popupAction}
          onCancel={cancelPopup}
        />
      )}
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
                    className='form-contrato-input form-contrato-input-padding-menor'
                  />
                  {showDropdown && filteredClientes.length > 0 && (
                    <ul className="dropdown-list">
                      {filteredClientes.map(cliente => (
                        <li key={cliente.id} onMouseDown={() => handleClienteItemClick(cliente)}>
                          {cliente.razao_social} - {cliente.nome_fantasia}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className='form-contrato-label-input-container dois-inputs'>
                  <label htmlFor="cpf-cnpj" className='label-form-contrato'><b>CPF/CNPJ</b></label>
                  <input type="text" disabled id='input-desabilitado' className='form-contrato-input form-contrato-input-padding-menor' value={selectedClienteCpfCnpj} />
                </div>
              </div>
              <div className='form-contrato-cliente-tres-inputs-container'>
                <div className='form-contrato-label-input-container tres-inputs'>
                  <label htmlFor="faturado" className='label-form-contrato'><b>Faturado por <span className='required'>*</span></b></label>
                  <select name="faturado" className='form-contrato-input form-contrato-select' value={faturadoPor} onChange={(e) => setFaturadoPor(e.target.value)}>
                    <option value="">Selecione</option>
                    <option value="teste01">teste01</option>
                  </select>
                </div>
                <div className='form-contrato-label-input-container tres-inputs'>
                  <label htmlFor="solucao" className='label-form-contrato'><b>Solução ofertada <span className='required'>*</span></b></label>
                  <select name="solucao" className='form-contrato-input form-contrato-select' value={solucao} onChange={(e) => setSolucao(e.target.value)}>
                    <option value="">Selecione uma solução</option>
                    {produtos.map(produto => (
                      <option key={produto.id} value={produto.id}>{produto.nome}</option>
                    ))}
                  </select>
                </div>
                <div className='form-contrato-label-input-container tres-inputs'>
                  <label htmlFor="duracao" className='label-form-contrato'><b>Duração do contrato <span className='required'>*</span></b></label>
                  <select name="duracao" className='form-contrato-input form-contrato-select' value={duracao} onChange={(e) => setDuracao(e.target.value)}>
                    <option value="">Selecione</option>
                    {options.map((i) => (
                      <option key={i} value={i}>
                        {i} MESES
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className='form-contrato-cliente-tres-inputs-container'>
                <div className='form-contrato-label-input-container tres-inputs'>
                  <label htmlFor="vencimento" className='label-form-contrato'><b>Dia vencimento <span className='required'>*</span></b></label>
                  <select name="vencimento" className='form-contrato-input form-contrato-select' value={vencimento} onChange={(e) => setVencimento(e.target.value)}>
                    <option value="">Selecione</option>
                    <option value="1">1</option>
                  </select>
                </div>
                <div className='form-contrato-label-input-container tres-inputs'>
                  <label htmlFor="reajuste" className='label-form-contrato'><b>Índice reajuste <span className='required'>*</span></b></label>
                  <select name="reajuste" value={reajuste} onChange={handleReajusteChange} className='form-contrato-input form-contrato-select'>
                    <option value="">Selecione um índice</option>
                    <option value="igpm">IGPM</option>
                    <option value="ipca">IPCA</option>
                  </select>
                </div>
                <div className='form-contrato-label-input-container tres-inputs'>
                  <label htmlFor="proximo-reajuste" className='label-form-contrato'><b>Próximo reajuste <span className='required'>*</span></b></label>
                  <input type="date" name="proximo-reajuste" className='form-contrato-input' value={proximoReajuste} onChange={(e) => setProximoReajuste(e.target.value)} />
                </div>
              </div>
              <div className='form-contrato-cliente-tres-inputs-container'>
                <div className='form-contrato-label-input-container tres-inputs'>
                  <label htmlFor="valor-mensal" className='label-form-contrato'><b>Valor mensal <span className='required'>*</span></b></label>
                  <input type="text" name="valor-mensal" className='form-contrato-input' placeholder='Valor do contrato mensalmente' value={valorMensal} onChange={(e) => setValorMensal(e.target.value)} />
                </div>
                <div className='form-contrato-label-input-container tres-inputs'>
                  <label htmlFor="quantidade" className='label-form-contrato'><b>Quantidade <span className='required'>*</span></b></label>
                  <input type="text" name="quantidade" className='form-contrato-input' placeholder='Quantidade da solução' value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
                </div>
                <div className='form-contrato-label-input-container tres-inputs'>
                  <label htmlFor="data-inicio" className='label-form-contrato'><b>Data ínicio <span className='required'>*</span></b></label>
                  <input type="date" name="data-inicio" className='form-contrato-input' value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
                </div>
              </div>
              <div className='form-contrato-cliente-tres-inputs-container'>
                <img id='form-contrato-img' src={imgCadastroContrato} alt="" />
                <div id='form-contrato-container-email-descricao'>
                  <div className='form-contrato-label-input-container'>
                    <label htmlFor="email" className='label-form-contrato'><b>Email de envio <span className='required'>*</span></b></label>
                    <input type="email" name="email" id="form-cliente-input-email" className='form-contrato-input form-contrato-input-padding-menor' placeholder='Email que receberá o contrato' value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className='form-contrato-label-input-container' id='form-cliente-container-input-descricao'>
                    <label htmlFor="descricao" className='label-form-contrato'><b>Descrição breve <span className='required'>*</span></b></label>
                    <textarea name="descricao" id="form-cliente-input-descricao" className='form-contrato-input' placeholder='Algo a mais que deveria ser descrito aqui...' value={descricao} onChange={(e) => setDescricao(e.target.value)}></textarea>
                  </div>
                </div>
              </div>
              <div id='form-contrato-container-btn'>
                <button type="button" className='form-cliente-btn-cancelar' onClick={() => navigate('/contratos')}>Cancelar</button>
                <button className="global-btn-verde form-cliente-btn-enviar">
                  {mode === "cadastro" ? "Adicionar contrato" : "Salvar alterações"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
