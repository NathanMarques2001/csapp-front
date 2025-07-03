import Navbar from "../../componetes/navbar";
import "./style.css";
import imgCadastroGrupoEconomico from "../../assets/images/img-cadastro-grupo-economico.png";
import Api from "../../utils/api";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../componetes/loading";
import Popup from "../../componetes/pop-up";
// Bibliotecas
// Componentes
// Estilos, funcoes, classes, imagens e etc

export default function FormGrupoEconomico({ mode = 'cadastro' }) {
  const api = new Api();
  const [nomeGrupoEconomico, setNomeGrupoEconomico] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupAction, setPopupAction] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchGruposEconomicos = async () => {
      if (mode === 'edicao' && id) {
        try {
          setLoading(true);
          const response = await api.get(`/grupos-economicos/${id}`);
          const grupoEconomico = response.grupoEconomico;
          setNomeGrupoEconomico(grupoEconomico.nome);
        } catch (err) {
          console.error("Error fetching grupos econômicos:", err);
        }
        finally {
          setLoading(false);
        }
      }
    };

    fetchGruposEconomicos();
  }, [mode, id]);

  const handleCancel = (e) => {
    e.preventDefault();
    setPopupAction(() => confirmCancel);
    setShowPopup(true);
  };

  const confirmCancel = () => {
    setShowPopup(false);
    navigate("/gestao?aba=grupos-economicos");
  };

  const handleSaveGrupoEconomico = (e) => {
    e.preventDefault();
    setPopupAction(() => confirmSaveGrupoEconomico);
    setShowPopup(true);
  };

  const confirmSaveGrupoEconomico = async () => {
    setShowPopup(false);
    const data = {
      nome: nomeGrupoEconomico,
    };

    try {
      setLoading(true);
      let req;
      if (mode === 'cadastro') {
        req = await api.post('/grupos-economicos', data);
      } else if (mode === 'edicao') {
        req = await api.put(`/grupos-economicos/${id}`, data);
      }
      if (req.message === "Grupo econômico criado com sucesso!" || req.message === "Grupo econômico atualizado com sucesso!") {
        setNomeGrupoEconomico("");
        navigate("/gestao?aba=grupos-economicos");
      } else {
        alert("Erro ao salvar grupo econômico.");
      }
    } catch (err) {
      console.error("Error saving data:", err);
      alert(err);
    }
    finally {
      setLoading(false);
    }
  };

  const cancelPopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      {loading && <Loading />}
      {showPopup && (
        <Popup
          title={mode == "cadastro" ? "Adicionar Novo Grupo Econômico" : "Editar Grupo Econômico"}
          message={mode == "cadastro" ? "Você está prestes a adicionar um novo grupo econômico. Deseja continuar?" : "Você está prestes a salvar as alterações feitas neste grupo econômico. Deseja continuar?"}
          onConfirm={popupAction}
          onCancel={cancelPopup}
        />
      )}
      <div className="global-display">
        <Navbar />
        <div className="global-container">
          <h2>{mode === 'cadastro' ? 'Cadastro de Grupo Econômico' : 'Edição de Grupo Econômico'}</h2>
          <p id="cadastro-grupo-economico-descricao">Campos com "*" são obrigatórios.</p>
          <div id="cadastro-grupo-economico-form-container">
            <form id="cadastro-grupo-economico-form" onSubmit={handleSaveGrupoEconomico}>
              <div id="cadastro-grupo-economico-input-labels">
                <label htmlFor="nome"><b>Nome *</b></label>
                <input
                  type="text"
                  id="cadastro-grupo-economico-input"
                  className="cadastro-grupo-economico-input"
                  name="nome"
                  placeholder="Digite o nome do grupo econômico"
                  value={nomeGrupoEconomico}
                  onChange={(e) => setNomeGrupoEconomico(e.target.value)}
                  required
                />
              </div>
              <div className="cadastro-grupo-economico-container-btn">
                <button id="cadastro-grupo-economico-btn-cancelar" className="cadastro-grupo-economico-btn" onClick={() => navigate('/gestao?aba=grupos-economicos')}>Cancelar</button>
                <button id="cadastro-grupo-economico-btn-cadastrar" className="cadastro-grupo-economico-btn">
                  {mode === 'cadastro' ? 'Adicionar grupo econômico' : 'Salvar alterações'}
                </button>
              </div>
            </form>
            <div id="cadastro-grupo-economico-container-img">
              <img src={imgCadastroGrupoEconomico} alt="" id="cadastro-grupo-economico-img" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
