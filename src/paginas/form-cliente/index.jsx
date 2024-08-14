import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../componetes/navbar";
import Api from "../../utils/api";
import imgCadastroCliente from "../../assets/images/img-cadastro-cliente.png";
import "./style.css";
import Loading from "../../componetes/loading";
import Popup from "../../componetes/pop-up";
import { useCookies } from "react-cookie";
// Bibliotecas
// Componentes
// Estilos, funcoes, classes, imagens e etc

export default function FormCliente({ mode }) {
  const api = new Api();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupAction, setPopupAction] = useState(null);
  const [segmentos, setSegmentos] = useState([]);

  const [cliente, setCliente] = useState({
    razao_social: "",
    nome_fantasia: "",
    cpf_cnpj: "",
    id_usuario: "",
    segmento: "",
    nps: "",
    gestor_contratos_nome: "",
    gestor_contratos_email: "",
    gestor_contratos_nascimento: null,
    gestor_contratos_telefone_1: "",
    gestor_contratos_telefone_2: "",
    gestor_chamados_nome: "",
    gestor_chamados_email: "",
    gestor_chamados_nascimento: null,
    gestor_chamados_telefone_1: "",
    gestor_chamados_telefone_2: "",
    gestor_financeiro_nome: "",
    gestor_financeiro_email: "",
    gestor_financeiro_nascimento: null,
    gestor_financeiro_telefone_1: "",
    gestor_financeiro_telefone_2: "",
  });

  const [usuarios, setUsuarios] = useState([]);

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
    if (mode === "edicao" && id) {
      const fetchCliente = async () => {
        try {
          setLoading(true);
          const response = await api.get(`/clientes/${id}`);

          const formatDate = (dateString) => {
            if (!dateString || dateString === "" || dateString === "Invalid date") return null;
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return null; // Verifica se é uma data válida
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
          };


          const clienteData = response.cliente;
          clienteData.gestor_contratos_nascimento = formatDate(clienteData.gestor_contratos_nascimento);
          clienteData.gestor_chamados_nascimento = formatDate(clienteData.gestor_chamados_nascimento);
          clienteData.gestor_financeiro_nascimento = formatDate(clienteData.gestor_financeiro_nascimento);

          setCliente(clienteData);
        } catch (error) {
          console.error("Error fetching client data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchCliente();
    }
  }, [mode, id]);


  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await api.get("/usuarios");
        setUsuarios(response.usuarios);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsuarios();
  }, []);

  useEffect(() => {
    const fetchSegmentos = async () => {
      try {
        const response = await api.get("/segmentos");
        setSegmentos(response.segmentos);
      } catch (error) {
        console.error("Erro ao buscar os segmentos: " + error);
      }
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCliente((prevCliente) => ({
      ...prevCliente,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPopupAction(() => confirmSubmit);
    setShowPopup(true);
  };

  const handleCancel = () => {
    setPopupAction(() => confirmCancel);
    setShowPopup(true);
  };

  const confirmSubmit = async () => {
    setShowPopup(false);
    try {
      setLoading(true);
      console.log(cliente);
      if (mode === "cadastro") {
        await api.post("/clientes", cliente);
        navigate(`/clientes`);
      } else if (mode === "edicao" && id) {
        await api.put(`/clientes/${id}`, cliente);
        navigate(`/clientes/${cliente.id}`);
      }
    } catch (error) {
      console.error("Error submitting client data:", error);
      alert("Erro ao salvar cliente.");
    }
    finally {
      setLoading(false);
    }
  };

  const confirmCancel = () => {
    setShowPopup(false);
    navigate(`/clientes/${cliente.id}`);
  };

  const cancelPopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      {loading && <Loading />}
      {showPopup && (
        <Popup
          title={mode == "cadastro" ? "Adicionar Novo Cliente" : "Editar Cliente"}
          message={mode == "cadastro" ? "Você está prestes a adicionar um novo Cliente. Deseja continuar?" : "Você está prestes a salvar as alterações feitas neste Cliente. Deseja continuar?"}
          onConfirm={popupAction}
          onCancel={cancelPopup}
        />
      )}
      <div className="global-display">
        <Navbar />
        <div className="global-container">
          <h2>{mode === "cadastro" ? "Cadastro de Cliente" : "Edição de Cliente"}</h2>
          <p id="cadastro-solucao-descricao">Campos com "*" são obrigatórios.</p>
          <div id="cadastro-solucao-form-container">
            <form className="form" onSubmit={handleSubmit}>
              <div className="form-cliente-container">
                <div id="form-cliente-container-1">
                  <div className="form-group">
                    <label htmlFor="razao_social">
                      Razão Social <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="razao_social"
                      name="razao_social"
                      required
                      disabled={!isAdminOrDev}
                      placeholder="Digite a razão social"
                      value={cliente.razao_social}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="nome_fantasia">
                      Nome Fantasia <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="nome_fantasia"
                      name="nome_fantasia"
                      required
                      disabled={!isAdminOrDev}
                      placeholder="Digite o nome fantasia"
                      value={cliente.nome_fantasia}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cpf_cnpj">
                      CPF/CNPJ <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="cpf_cnpj"
                      name="cpf_cnpj"
                      required
                      disabled={!isAdminOrDev}
                      placeholder="Digite o CPF ou CNPJ"
                      value={cliente.cpf_cnpj}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="id_usuario">Relacionamento <span className="required">*</span></label>
                    <select required id="id_usuario" disabled={!isAdminOrDev} name="id_usuario" value={cliente.id_usuario} onChange={handleChange}>
                      <option value="">Selecione...</option>
                      {usuarios.map((usuario) => (
                        <option key={usuario.id} value={usuario.id}>{usuario.nome}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <div className="form-group">
                      <label htmlFor="segmento">
                        Segmento <span className="required">*</span>
                      </label>
                      <select
                        name="segmento"
                        id="segmento"
                        required
                        disabled={!isAdminOrDev}
                        value={cliente.segmento}
                        onChange={handleChange}>
                        <option value="">Selecione...</option>
                        {segmentos.map((segmento) => (
                          <option key={segmento.id} value={segmento.id}>
                            {segmento.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="nps">NPS</label>
                      <input
                        type="text"
                        id="nps"
                        name="nps"
                        disabled={!isAdminOrDev}
                        placeholder="Digite o NPS do cliente"
                        value={cliente.nps}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                <div id="cadastro-cliente-img-div">
                  <img id="cadastro-cliente-img" src={imgCadastroCliente} alt="" />
                </div>
              </div>
              <div className="form-cliente-container form-cliente-container-border">
                <div id="form-cliente-container-2">
                  <h2>Gestor de Contrato</h2>
                  <div className="form-group">
                    <label htmlFor="gestor_contratos_nome">
                      Nome <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="gestor_contratos_nome"
                      name="gestor_contratos_nome"
                      required
                      disabled={!isAdminOrDev}
                      placeholder="Digite o nome completo"
                      value={cliente.gestor_contratos_nome}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="gestor_contratos_email">
                      Email <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      id="gestor_contratos_email"
                      name="gestor_contratos_email"
                      required
                      disabled={!isAdminOrDev}
                      placeholder="Digite seu endereço de email"
                      value={cliente.gestor_contratos_email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="date-container">
                    <div className="form-group form-group-3">
                      <label htmlFor="gestor_contratos_nascimento">Aniversário</label>
                      <input
                        type="date"
                        id="gestor_contratos_nascimento"
                        name="gestor_contratos_nascimento"
                        disabled={!isAdminOrDev}
                        value={cliente.gestor_contratos_nascimento}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group form-group-3">
                      <label htmlFor="gestor_contratos_telefone_1">Telefone 1 <span className="required">*</span></label>
                      <input
                        type="text"
                        id="gestor_contratos_telefone_1"
                        name="gestor_contratos_telefone_1"
                        placeholder="Primeiro contato"
                        disabled={!isAdminOrDev}
                        value={cliente.gestor_contratos_telefone_1}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group form-group-3">
                      <label htmlFor="gestor_contratos_telefone_2">Telefone 2</label>
                      <input
                        type="text"
                        id="gestor_contratos_telefone_2"
                        name="gestor_contratos_telefone_2"
                        placeholder="Segundo contato"
                        disabled={!isAdminOrDev}
                        value={cliente.gestor_contratos_telefone_2}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                <div id="form-cliente-container-2">
                  <h2>Gestor de Chamados</h2>
                  <div className="form-group">
                    <label htmlFor="gestor_chamados_nome">
                      Nome
                    </label>
                    <input
                      type="text"
                      id="gestor_chamados_nome"
                      name="gestor_chamados_nome"
                      placeholder="Digite o nome completo"
                      disabled={!isAdminOrDev}
                      value={cliente.gestor_chamados_nome}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="gestor_chamados_email">
                      Email
                    </label>
                    <input
                      type="email"
                      id="gestor_chamados_email"
                      name="gestor_chamados_email"
                      placeholder="Digite seu endereço de email"
                      disabled={!isAdminOrDev}
                      value={cliente.gestor_chamados_email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="date-container">
                    <div className="form-group form-group-3">
                      <label htmlFor="gestor_chamados_nascimento">Aniversário</label>
                      <input
                        type="date"
                        id="gestor_chamados_nascimento"
                        name="gestor_chamados_nascimento"
                        disabled={!isAdminOrDev}
                        value={cliente.gestor_chamados_nascimento}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group form-group-3">
                      <label htmlFor="gestor_chamados_telefone_1">
                        Telefone 1
                      </label>
                      <input
                        type="text"
                        id="gestor_chamados_telefone_1"
                        name="gestor_chamados_telefone_1"
                        placeholder="Primeiro contato"
                        disabled={!isAdminOrDev}
                        value={cliente.gestor_chamados_telefone_1}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group form-group-3">
                      <label htmlFor="gestor_chamados_telefone_2">Telefone 2</label>
                      <input
                        type="text"
                        id="gestor_chamados_telefone_2"
                        name="gestor_chamados_telefone_2"
                        placeholder="Segundo contato"
                        disabled={!isAdminOrDev}
                        value={cliente.gestor_chamados_telefone_2}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-cliente-container">
                <div id="form-cliente-container-2">
                  <h2>Gestor Financeiro</h2>
                  <div className="form-group">
                    <label htmlFor="gestor_financeiro_nome">
                      Nome
                    </label>
                    <input
                      type="text"
                      id="gestor_financeiro_nome"
                      name="gestor_financeiro_nome"
                      placeholder="Digite o nome completo"
                      disabled={!isAdminOrDev}
                      value={cliente.gestor_financeiro_nome}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="gestor_financeiro_email">
                      Email
                    </label>
                    <input
                      type="email"
                      id="gestor_financeiro_email"
                      name="gestor_financeiro_email"
                      placeholder="Digite seu endereço de email"
                      disabled={!isAdminOrDev}
                      value={cliente.gestor_financeiro_email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="date-container">
                    <div className="form-group form-group-3">
                      <label htmlFor="gestor_financeiro_nascimento">Aniversário</label>
                      <input
                        type="date"
                        id="gestor_financeiro_nascimento"
                        name="gestor_financeiro_nascimento"
                        disabled={!isAdminOrDev}
                        value={cliente.gestor_financeiro_nascimento}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group form-group-3">
                      <label htmlFor="gestor_financeiro_telefone_1">
                        Telefone 1
                      </label>
                      <input
                        type="text"
                        id="gestor_financeiro_telefone_1"
                        name="gestor_financeiro_telefone_1"
                        placeholder="Primeiro contato"
                        disabled={!isAdminOrDev}
                        value={cliente.gestor_financeiro_telefone_1}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group form-group-3">
                      <label htmlFor="gestor_financeiro_telefone_2">Telefone 2</label>
                      <input
                        type="text"
                        id="gestor_financeiro_telefone_2"
                        name="gestor_financeiro_telefone_2"
                        placeholder="Segundo contato"
                        disabled={!isAdminOrDev}
                        value={cliente.gestor_financeiro_telefone_2}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-buttons">
                <button type="button" className="form-cliente-btn-cancelar" onClick={() => navigate('/clientes')}>
                  {!isAdminOrDev ? "Voltar" : "Cancelar"}
                </button>
                {!isAdminOrDev ? <></> : <button type="submit" className="global-btn-verde form-cliente-btn-enviar">
                  {mode === "cadastro" ? "Adicionar cliente" : "Salvar alterações"}
                </button>}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
