import { useEffect, useState } from "react";
import Api from "../../utils/api";
import editIcon from "../../assets/icons/icon-lapis.png";
import iconeInativar from "../../assets/icons/icon-inativar.png";
import iconeAtivar from "../../assets/icons/icon-ativar.png";
import Loading from "../../componetes/loading";
import Popup from "../../componetes/pop-up";
import { useNavigate } from "react-router-dom";

export default function Faturados() {
  const api = new Api();
  const [faturados, setFaturados] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
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
        const faturadosResponse = await api.get("/faturados");
        setFaturados(faturadosResponse.faturados);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (id) => {
    navigate(`/edicao-faturado/${id}`);
  };

  const handleStatusChange = (id, status) => {
    const titles = {
      ativo: "Inativar Faturista",
      inativo: "Ativar Faturista",
    };
    const messages = {
      ativo:
        "Tem certeza que deseja inativar este faturista? Após isso, ele não estará mais disponível.",
      inativo:
        "Tem certeza que deseja ativar este faturista? Após isso, ele estará disponível para uso.",
    };
    setPopupConfig({
      open: true,
      title: titles[status],
      message: messages[status],
      id,
    });
  };

  const handleChangeStatus = async () => {
    const { id } = popupConfig;
    setPopupConfig((prev) => ({ ...prev, open: false }));
    setLoading(true);
    try {
      const response = await api.get(`/faturados/${id}`);
      const newStatus =
        response.faturado.status === "ativo" ? "inativo" : "ativo";
      await api.put(`/faturados/${id}`, { status: newStatus });
      setFaturados((prev) =>
        prev.map((faturado) =>
          faturado.id === id ? { ...faturado, status: newStatus } : faturado
        )
      );
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleRedirect = (url) => {
    navigate(url);
  };

  const filteredFaturados = faturados.filter((faturado) =>
    faturado.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalFaturados = filteredFaturados.length;

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
          Faturistas ({totalFaturados})
        </h3>
        <input
          type="text"
          placeholder="Procure pelo nome"
          value={searchTerm}
          onChange={handleSearch}
          className="gestao-section-input"
        />
        <button
          className="gestao-section-btn"
          onClick={() => handleRedirect("/cadastro-faturado")}
        >
          Adicionar faturista
        </button>
        {faturados.length > 0 ? (
          <table className="gestao-section-tabela">
            <thead>
              <tr>
                <th className="gestao-section-titulo-tabela">Nome</th>
                <th className="gestao-section-titulo-tabela">Status</th>
                <th className="gestao-section-titulo-tabela">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredFaturados.map((faturado) => (
                <tr key={faturado.id}>
                  <td className="gestao-section-conteudo-tabela">
                    {faturado.nome}
                  </td>
                  <td className="gestao-section-conteudo-tabela">
                    {faturado.status}
                  </td>
                  <td className="gestao-section-conteudo-tabela">
                    <div className="gestao-section-container-btn">
                      <button
                        className="gestao-section-editar-btn gestao-section-item-btn"
                        onClick={() => handleEdit(faturado.id)}
                      >
                        <img src={editIcon} alt="Editar" />
                      </button>
                      <button
                        className={`${faturado.status === "ativo" ? "gestao-section-excluir-btn" : "gestao-section-editar-btn"} gestao-section-item-btn`}
                        onClick={() =>
                          handleStatusChange(faturado.id, faturado.status)
                        }
                      >
                        <img
                          src={
                            faturado.status === "ativo"
                              ? iconeInativar
                              : iconeAtivar
                          }
                          alt={
                            faturado.status === "ativo" ? "Inativar" : "Ativar"
                          }
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
            Ainda não foram cadastrados faturistas!
          </p>
        )}
      </div>
    </>
  );
}
