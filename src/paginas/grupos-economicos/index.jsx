import { useEffect, useState } from "react";
import Api from "../../utils/api";
import editIcon from "../../assets/icons/icon-lapis.png";
import iconeInativar from "../../assets/icons/icon-inativar.png";
import iconeAtivar from "../../assets/icons/icon-ativar.png";
import Loading from "../../componetes/loading";
import { useNavigate } from "react-router-dom";
import Popup from "../../componetes/pop-up";

export default function GruposEconomicos() {
  const api = new Api();
  const [gruposEconomicos, setGruposEconomicos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [atualizar, setAtualizar] = useState(0);
  const [popupConfig, setPopupConfig] = useState({
    open: false,
    title: "",
    message: "",
    id: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/grupos-economicos");
        setGruposEconomicos(response.grupoEconomico);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [atualizar]);

  const handleEdit = (id) => navigate(`/edicao-grupo-economico/${id}`);

  const handleChangeStatus = async () => {
    const { id } = popupConfig;
    setPopupConfig((prev) => ({ ...prev, open: false }));
    setLoading(true);
    try {
      const response = await api.get(`/grupos-economicos/${id}`);
      const newStatus =
        response.grupoEconomico.status === "ativo" ? "inativo" : "ativo";
      await api.put(`/grupos-economicos/${id}`, { status: newStatus });
      setAtualizar((prev) => prev + 1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (id, status) => {
    const titles = {
      ativo: "Inativar Segmento",
      inativo: "Ativar Segmento",
    };
    const messages = {
      ativo:
        "Tem certeza que deseja inativar este segmento? Após isso, não será possível criar clientes com o mesmo.",
      inativo:
        "Tem certeza que deseja ativar este segmento? Após isso, será possível criar clientes com o mesmo.",
    };
    setPopupConfig({
      open: true,
      title: titles[status],
      message: messages[status],
      id,
    });
  };

  const filteredGruposEconomicos = gruposEconomicos.filter(({ nome }) =>
    nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalGruposEconomicos = filteredGruposEconomicos.length;

  return (
    <>
      {loading && <Loading />}
      {popupConfig.open && (
        <Popup
          title={popupConfig.title}
          message={popupConfig.message}
          onConfirm={handleChangeStatus}
          onCancel={() => setPopupConfig((prev) => ({ ...prev, open: false }))}
        />
      )}
      <div>
        <h3 className="gestao-section-subtitulo">
          Grupos Econômicos ({totalGruposEconomicos})
        </h3>
        <input
          type="text"
          placeholder="Procure pelo nome"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="gestao-section-input"
        />
        <button
          className="gestao-section-btn gestao-section-btn-verde"
          onClick={() => navigate("/cadastro-grupo-economico")}
        >
          Adicionar grupo econômico
        </button>
        {gruposEconomicos.length > 0 ? (
          <table className="gestao-section-tabela">
            <thead>
              <tr>
                <th className="gestao-section-titulo-tabela">Nome</th>
                {/* <th className="gestao-section-titulo-tabela">Status</th> */}
                <th className="gestao-section-titulo-tabela">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredGruposEconomicos.map(({ id, nome, status }) => (
                <tr key={id}>
                  <td className="gestao-section-conteudo-tabela">{nome}</td>
                  {/* <td className="gestao-section-conteudo-tabela">{status}</td> */}
                  <td className="gestao-section-conteudo-tabela">
                    <div className="gestao-section-container-btn">
                      <button
                        className="gestao-section-editar-btn gestao-section-item-btn"
                        onClick={() => handleEdit(id)}
                      >
                        <img src={editIcon} alt="Editar" />
                      </button>
                      <button
                        className={`${status === "ativo" ? "gestao-section-excluir-btn " : "gestao-section-editar-btn "} gestao-section-item-btn`}
                        onClick={() => handleStatusChange(id, status)}
                      >
                        <img
                          src={status === "ativo" ? iconeInativar : iconeAtivar}
                          alt={status === "ativo" ? "Inativar" : "Ativar"}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="gestao-section-sem-registros">
            Ainda não foram cadastrados grupos econômicos!
          </p>
        )}
      </div>
    </>
  );
}
