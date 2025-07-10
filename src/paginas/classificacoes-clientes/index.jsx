import { useEffect, useState } from "react";
import Api from "../../utils/api";
import editIcon from "../../assets/icons/icon-lapis.png";
import iconeInativar from "../../assets/icons/icon-inativar.png";
import iconeAtivar from "../../assets/icons/icon-ativar.png";
import Loading from "../../componetes/loading";
import { useNavigate } from "react-router-dom";
import Popup from "../../componetes/pop-up";

export default function ClassificacoesClientes() {
  const api = new Api();
  const [classificacoes, setClassificacoes] = useState([]);
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
        const response = await api.get("/classificacoes-clientes");
        setClassificacoes(response.classificacoes);
      } catch (err) {
        console.error("Erro ao buscar classificações:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [atualizar]);

  const handleEdit = (id) => navigate(`/edicao-classificacao/${id}`);

  const handleChangeStatus = async () => {
    const { id } = popupConfig;
    setPopupConfig((prev) => ({ ...prev, open: false }));
    setLoading(true);
    try {
      const response = await api.get(`/classificacoes-clientes/${id}`);
      const newStatus =
        response.classificacao.status === "ativo" ? "inativo" : "ativo";
      await api.put(`/classificacoes-clientes/${id}`, { status: newStatus });
      setAtualizar((prev) => prev + 1);
    } catch (e) {
      console.error("Erro ao alterar status:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (id, status) => {
    const titles = {
      ativo: "Inativar Classificação",
      inativo: "Ativar Classificação",
    };
    const messages = {
      ativo:
        "Tem certeza que deseja inativar esta classificação? Clientes e grupos deixarão de ser vinculados automaticamente.",
      inativo:
        "Tem certeza que deseja ativar esta classificação? Ela voltará a ser usada na lógica de classificação automática.",
    };
    setPopupConfig({
      open: true,
      title: titles[status],
      message: messages[status],
      id,
    });
  };

  const filteredClassificacoes = classificacoes.filter(({ nome }) =>
    nome.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalClassificacoes = filteredClassificacoes.length;

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
          Classificações ({totalClassificacoes})
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
          onClick={() => navigate("/cadastro-classificacao")}
        >
          Adicionar classificação
        </button>
        {classificacoes.length > 0 ? (
          <table className="gestao-section-tabela">
            <thead>
              <tr>
                <th className="gestao-section-titulo-tabela">Nome</th>
                <th className="gestao-section-titulo-tabela">Categoria</th>
                <th className="gestao-section-titulo-tabela">Qtd/Valor</th>
                <th className="gestao-section-titulo-tabela">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredClassificacoes.map(
                ({ id, nome, status, tipo_categoria, quantidade, valor }) => (
                  <tr key={id}>
                    <td className="gestao-section-conteudo-tabela">{nome}</td>
                    <td className="gestao-section-conteudo-tabela">
                      {tipo_categoria === "quantidade" ? "Quantidade" : "Valor"}
                    </td>
                    <td className="gestao-section-conteudo-tabela">
                      {tipo_categoria === "quantidade"
                        ? quantidade
                        : `R$ ${valor}`}
                    </td>
                    <td className="gestao-section-conteudo-tabela">
                      <div className="gestao-section-container-btn">
                        <button
                          className="gestao-section-editar-btn gestao-section-item-btn"
                          onClick={() => handleEdit(id)}
                        >
                          <img src={editIcon} alt="Editar" />
                        </button>
                        <button
                          className={`${
                            status === "ativo"
                              ? "gestao-section-excluir-btn"
                              : "gestao-section-editar-btn"
                          } gestao-section-item-btn`}
                          onClick={() => handleStatusChange(id, status)}
                        >
                          <img
                            src={
                              status === "ativo" ? iconeInativar : iconeAtivar
                            }
                            alt={status === "ativo" ? "Inativar" : "Ativar"}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        ) : (
          <p className="gestao-section-sem-registros">
            Ainda não foram cadastradas classificações!
          </p>
        )}
      </div>
    </>
  );
}
