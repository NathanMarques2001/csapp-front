import { useEffect, useState } from "react";
import Api from "../../utils/api";
import editIcon from "../../assets/icons/icon-lapis.png";
import iconeInativar from "../../assets/icons/icon-inativar.png";
import iconeAtivar from "../../assets/icons/icon-ativar.png";
import Loading from "../../componetes/loading";
import { useNavigate } from "react-router-dom";
import Popup from "../../componetes/pop-up";

export default function CategoriasProdutos() {
  const api = new Api();
  const [categorias, setCategorias] = useState([]);
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
    const fetchCategorias = async () => {
      try {
        setLoading(true);
        const response = await api.get("/categorias-produtos");
        setCategorias(response.categorias);
      } catch (err) {
        console.error("Erro ao buscar categorias:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, [atualizar]);

  const handleEdit = (id) => navigate(`/edicao-categoria-produto/${id}`);

  const handleChangeStatus = async () => {
    const { id } = popupConfig;
    setPopupConfig((prev) => ({ ...prev, open: false }));
    setLoading(true);
    try {
      const response = await api.get(`/categorias-produtos/${id}`);
      const newStatus =
        response.categoria.status === "ativo" ? "inativo" : "ativo";
      await api.put(`/categorias-produtos/${id}`, { status: newStatus });
      setAtualizar((prev) => prev + 1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (id, status) => {
    const titles = {
      ativo: "Inativar Categoria",
      inativo: "Ativar Categoria",
    };
    const messages = {
      ativo: "Tem certeza que deseja inativar esta categoria?",
      inativo: "Tem certeza que deseja ativar esta categoria?",
    };
    setPopupConfig({
      open: true,
      title: titles[status],
      message: messages[status],
      id,
    });
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleRedirect = (url) => {
    navigate(url);
  };

  const categoriasFiltradas = categorias.filter((categoria) =>
    categoria.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          Categorias de Soluções ({categoriasFiltradas.length})
        </h3>
        <input
          type="text"
          placeholder="Procure pelo nome da categoria"
          value={searchTerm}
          onChange={handleSearch}
          className="gestao-section-input"
        />
        <button
          className="gestao-section-btn gestao-section-btn-verde"
          onClick={() => handleRedirect("/cadastro-categoria-produto")}
        >
          Adicionar categoria
        </button>
        {categoriasFiltradas.length > 0 ? (
          <table className="gestao-section-tabela">
            <thead>
              <tr>
                <th className="gestao-section-titulo-tabela">Nome</th>
                <th className="gestao-section-titulo-tabela">Status</th>
                <th className="gestao-section-titulo-tabela">Ações</th>
              </tr>
            </thead>
            <tbody>
              {categoriasFiltradas.map((categoria) => (
                <tr key={categoria.id}>
                  <td className="gestao-section-conteudo-tabela">
                    {categoria.nome}
                  </td>
                  <td className="gestao-section-conteudo-tabela">
                    {categoria.status}
                  </td>
                  <td className="gestao-section-conteudo-tabela">
                    <div className="gestao-section-container-btn">
                      <button
                        className="gestao-section-editar-btn gestao-section-item-btn"
                        onClick={() => handleEdit(categoria.id)}
                      >
                        <img src={editIcon} alt="Editar" />
                      </button>
                      <button
                        className={`${
                          categoria.status === "ativo"
                            ? "gestao-section-excluir-btn "
                            : "gestao-section-editar-btn "
                        } gestao-section-item-btn`}
                        onClick={() =>
                          handleStatusChange(categoria.id, categoria.status)
                        }
                      >
                        <img
                          src={
                            categoria.status === "ativo"
                              ? iconeInativar
                              : iconeAtivar
                          }
                          alt={
                            categoria.status === "ativo" ? "Inativar" : "Ativar"
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
            Ainda não foram cadastradas categorias!
          </p>
        )}
      </div>
    </>
  );
}
