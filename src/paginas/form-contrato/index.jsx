import './style.css';
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Api from "../../utils/api";
import Navbar from '../../componetes/navbar';
import imgCadastroContrato from "../../assets/images/img-cadastro-contrato.png";
import Loading from '../../componetes/loading';
import Popup from '../../componetes/pop-up';
import formatDate from '../../utils/formatDate';
import { useCookies } from 'react-cookie';

export default function FormContrato({ mode = "cadastro" }) {
  const api = new Api();
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupAction, setPopupAction] = useState(null);
  const [faturados, setFaturados] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [clienteInput, setClienteInput] = useState("");
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [selectedClienteId, setSelectedClienteId] = useState(null);
  const [selectedClienteCpfCnpj, setSelectedClienteCpfCnpj] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [produtos, setProdutos] = useState([]);
  const [status, setStatus] = useState("");

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
  const [indiceReajusteValor, setIndiceReajusteValor] = useState(null);
  const [isQuantidadeDisabled, setIsQuantidadeDisabled] = useState(true);

  const [cookies, setCookie, removeCookie] = useCookies(['tipo']);
  const [isAdminOrDev, setIsAdminOrDev] = useState(false);

  useEffect(() => {
    // Verifica o tipo de usuário e atualiza o estado
    if (cookies.tipo === "dev" || cookies.tipo === "admin") {
      setIsAdminOrDev(true);
    } else {
      setIsAdminOrDev(false);
    }
  }, [cookies.tipo]);

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
        const produtosAtivos = response.produtos.filter((produto) => produto.status !== 'inativo');
        setProdutos(produtosAtivos);
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
      }
    };

    const formatDateForInput = (dateString) => {
      if (!dateString) return "";
      return dateString.split("T")[0]; // Extrai apenas a parte "YYYY-MM-DD"
    };

    const fetchContrato = async () => {
      if (mode === 'edicao' && id) {
        try {
          setLoading(true);
          const response = await api.get(`/contratos/${id}`);
          const contrato = response.contrato;
          const clienteResponse = await api.get(`/clientes/${contrato.id_cliente}`);
          const selectedCliente = clienteResponse.cliente;
          const faturado = await api.get(`/faturados/${contrato.id_faturado}`);
          const selectedFaturado = faturado.faturado;

          console.log(contrato);

          setSelectedClienteId(contrato.id_cliente);
          setClienteInput(selectedCliente ? `${selectedCliente.razao_social} - ${selectedCliente.nome_fantasia}` : "");
          setSelectedClienteCpfCnpj(selectedCliente ? selectedCliente.cpf_cnpj : "");
          setFaturadoPor(selectedFaturado ? selectedFaturado.id : "");

          setSolucao(contrato.id_produto);
          setVencimento(contrato.dia_vencimento);
          setReajuste(contrato.nome_indice);
          setProximoReajuste(formatDateForInput(contrato.proximo_reajuste));
          setDuracao(contrato.duracao);
          setValorMensal(contrato.valor_mensal);
          setQuantidade(contrato.quantidade);
          setDataInicio(formatDateForInput(contrato.data_inicio));
          setEmail(contrato.email_envio);
          setDescricao(contrato.descricao);
          setStatus(contrato.status);
        } catch (err) {
          console.error("Erro ao buscar contrato:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    const fetchFaturados = async () => {
      try {
        const response = await api.get('/faturados');
        const faturadosAtivos = response.faturados.filter((faturado) => faturado.status !== 'inativo');
        setFaturados(faturadosAtivos);
      } catch (err) {
        console.error("Erro ao buscar faturado:", err);
      }
    };

    fetchClientes();
    fetchProdutos();
    fetchContrato();
    fetchFaturados();
  }, [mode, id]);

  useEffect(() => {
    const removeAcentos = (str) => {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    // Habilita ou desabilita o campo quantidade dependendo da solução selecionada
    if (solucao !== "") {
      const produtoAtual = produtos.filter((item) => item.id === Number(solucao));
      const nomeProdutoAtual = removeAcentos(produtoAtual[0].nome.trim().toLowerCase());
      if (produtoAtual.length > 0 && (nomeProdutoAtual.includes("backup") || nomeProdutoAtual.includes("antivirus"))) {
        setIsQuantidadeDisabled(false);
      } else {
        setIsQuantidadeDisabled(true);
        setQuantidade("");
      }
    }
  }, [solucao, produtos]);

  const fetchIndice = async (indice) => {
    let code = '';
    if (indice === 'inpc') {
      code = '188';
    } else if (indice === 'igpm') {
      code = '189';
    } else if (indice === 'ipc-fipe') {
      code = '193';
    } else if (indice === 'ipca') {
      code = '433';
    }

    // Obtenha a data de 12 meses atrás
    const today = new Date();
    const lastYear = new Date();
    lastYear.setFullYear(today.getFullYear() - 1);

    // Formate as datas para 'DD/MM/YYYY'
    const startDate = `${lastYear.getDate().toString().padStart(2, '0')}/${(lastYear.getMonth() + 1).toString().padStart(2, '0')}/${lastYear.getFullYear()}`;
    const endDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;

    try {
      const response = await fetch(`https://api.bcb.gov.br/dados/serie/bcdata.sgs.${code}/dados?dataInicial=${startDate}&dataFinal=${endDate}&formato=json`);
      const data = await response.json();

      const total = data.reduce((acc, item) => acc + parseFloat(item.valor), 0);

      console.log(`Soma dos últimos 12 meses para ${indice}: ${total}`);
      return total; // Retorna a soma
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
        (cliente.nome_fantasia && cliente.nome_fantasia.toLowerCase().includes(input.toLowerCase())) ||
        (cliente.cpf_cnpj.includes(input))
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

    if (indice) {
      const valor = await fetchIndice(indice);
      if (valor !== null) {
        setIndiceReajusteValor(valor);
        console.log(`Valor do índice ${indice}: ${valor}`);
      } else {
        console.warn(`Não foi possível obter valor para o índice: ${indice}`);
        setIndiceReajusteValor(null); // ou algum valor padrão
      }
    } else {
      setIndiceReajusteValor(null); // ou um valor padrão se necessário
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedClienteId) {
      alert("Por favor, selecione um cliente.");
      return;
    }

    setPopupAction(() => confirmSubmit);
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
        id_faturado: Number(faturadoPor),
        dia_vencimento: Number(vencimento),
        indice_reajuste: Number(indiceReajusteValor),
        nome_indice: reajuste,
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

  const inativarContrato = async () => {
    try {
      setLoading(true);
      let req;
      if (status === 'ativo') {
        req = await api.put(`/contratos/${id}`, { status: "inativo" });
      } else {
        req = await api.put(`/contratos/${id}`, { status: "ativo" });
      }
      if (req.message === "Contrato atualizado com sucesso!") {
        navigate(`/contratos`);
      } else {
        alert("Erro ao inativar contrato.");
      }
    } catch (error) {
      console.error("Erro ao inativar contrato:", error);
      alert("Erro ao inativar contrato.");
    } finally {
      setLoading(false);
    }
  }

  const options = [6, 12, 24, 36, 48, 60];

  const days = [];
  for (let i = 1; i <= 31; i++) {
    days.push(i);
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
          <div id='div-cadastro-contrato-descricao-btn'>
            <p id='cadastro-contrato-descricao'>Campos com "*" são obrigatórios.</p>
            {mode !== 'cadastro' && (
              <button id={`${status === 'ativo' ? 'btn-inativar-contrato' : 'btn-ativar-contrato'}`} onClick={() => {
                setPopupAction(() => inativarContrato);
                setShowPopup(true);
              }}>{status === 'ativo' ? 'Inativar Contrato' : 'Ativar Contrato'}</button>
            )}
          </div>
          <div id='form-contrato-container'>
            <form id='form-contrato-form' onSubmit={handleSubmit}>
              <div id='form-contrato-cliente-cpf-cnpj-container'>
                <div className='form-contrato-label-input-container dois-inputs'>
                  <label htmlFor="cliente" className='label-form-contrato'><b>Cliente <span className='required'>*</span></b></label>
                  <input
                    type="text"
                    name='cliente'
                    disabled={!isAdminOrDev}
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
                  <select name="faturado" className='form-contrato-input form-contrato-select' value={faturadoPor} disabled={!isAdminOrDev} onChange={(e) => setFaturadoPor(e.target.value)}>
                    <option value="">Selecione</option>
                    {faturados.map(faturado => (
                      <option key={faturado.id} value={faturado.id}>{faturado.nome}</option>
                    ))}
                  </select>
                </div>
                <div className='form-contrato-label-input-container tres-inputs'>
                  <label htmlFor="solucao" className='label-form-contrato'><b>Solução ofertada <span className='required'>*</span></b></label>
                  <select name="solucao" disabled={!isAdminOrDev} className='form-contrato-input form-contrato-select' value={solucao} onChange={(e) => setSolucao(e.target.value)}>
                    <option value="">Selecione uma solução</option>
                    {produtos.map(produto => (
                      <option key={produto.id} value={produto.id}>{produto.nome}</option>
                    ))}
                  </select>
                </div>
                <div className='form-contrato-label-input-container tres-inputs'>
                  <label htmlFor="duracao" className='label-form-contrato'><b>Duração do contrato <span className='required'>*</span></b></label>
                  <select name="duracao" disabled={!isAdminOrDev} className='form-contrato-input form-contrato-select' value={duracao} onChange={(e) => setDuracao(e.target.value)}>
                    <option value="">Selecione</option>
                    {options.map((i) => (
                      <option key={i} value={i}>
                        {i} MESES
                      </option>
                    ))}
                    <option value={12000}>
                      INDETERMINADO
                    </option>
                  </select>
                </div>
              </div>
              <div className='form-contrato-cliente-tres-inputs-container'>
                <div className='form-contrato-label-input-container tres-inputs'>
                  <label htmlFor="vencimento" className='label-form-contrato'><b>Dia vencimento <span className='required'>*</span></b></label>
                  <select name="vencimento" disabled={!isAdminOrDev} className='form-contrato-input form-contrato-select' value={vencimento} onChange={(e) => setVencimento(e.target.value)}>
                    <option value="">Selecione</option>
                    {days.map((i) => (
                      <option key={i} value={i}>
                        DIA {i}
                      </option>
                    ))}
                  </select>
                </div>
                <div className='form-contrato-label-input-container tres-inputs'>
                  <label htmlFor="reajuste" className='label-form-contrato'><b>Índice reajuste</b></label>
                  <select name="reajuste" disabled={!isAdminOrDev} value={reajuste} onChange={handleReajusteChange} className='form-contrato-input form-contrato-select'>
                    <option value="">Selecione um índice</option>
                    <option value="igpm">IGPM</option>
                    <option value="ipca">IPCA</option>
                    <option value="ipc-fipe">IPC-FIPE</option>
                    <option value="inpc">INPC</option>
                  </select>
                </div>
                <div className='form-contrato-label-input-container tres-inputs'>
                  <label htmlFor="proximo-reajuste" className='label-form-contrato'><b>Próximo reajuste <span className='required'>*</span></b></label>
                  <input type="date" disabled={!isAdminOrDev} name="proximo-reajuste" className='form-contrato-input' value={proximoReajuste} onChange={(e) => setProximoReajuste(e.target.value)} />
                </div>
              </div>
              <div className='form-contrato-cliente-tres-inputs-container'>
                <div className='form-contrato-label-input-container tres-inputs'>
                  <label htmlFor="valor-mensal" className='label-form-contrato'><b>Valor mensal <span className='required'>*</span></b></label>
                  <input type="text" disabled={!isAdminOrDev} name="valor-mensal" className='form-contrato-input' placeholder='Valor do contrato mensalmente' value={valorMensal}
                    onChange={(e) => {
                      const valorFormatado = e.target.value.replace(',', '.');
                      setValorMensal(valorFormatado);
                    }} />
                </div>
                <div className='form-contrato-label-input-container tres-inputs'>
                  <label htmlFor="quantidade" className='label-form-contrato'><b>Quantidade <span className='required'>*</span></b></label>
                  <input type="text" disabled={!isAdminOrDev || isQuantidadeDisabled} name="quantidade" className='form-contrato-input' placeholder='Quantidade da solução' value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
                </div>
                <div className='form-contrato-label-input-container tres-inputs'>
                  <label htmlFor="data-inicio" className='label-form-contrato'><b>Data ínicio <span className='required'>*</span></b></label>
                  <input type="date" disabled={!isAdminOrDev} name="data-inicio" className='form-contrato-input' value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
                </div>
              </div>
              <div className='form-contrato-cliente-tres-inputs-container'>
                <img id='form-contrato-img' src={imgCadastroContrato} alt="" />
                <div className='form-contrato-label-input-container' id='form-cliente-container-input-descricao'>
                  <label htmlFor="descricao" className='label-form-contrato'><b>Descrição breve</b></label>
                  <textarea name="descricao" disabled={!isAdminOrDev} id="form-cliente-input-descricao" className='form-contrato-input' placeholder='Algo a mais que deveria ser descrito aqui...' value={descricao} onChange={(e) => setDescricao(e.target.value)}></textarea>
                </div>
              </div>
              <div id='form-contrato-container-btn'>
                <button type="button" className='form-cliente-btn-cancelar' onClick={() => navigate('/contratos')}>{!isAdminOrDev ? "Voltar" : "Cancelar"}</button>
                {!isAdminOrDev ? <></> : <button className="global-btn-verde form-cliente-btn-enviar">
                  {mode === "cadastro" ? "Adicionar contrato" : "Salvar alterações"}
                </button>}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
