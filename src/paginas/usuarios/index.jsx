import { useEffect, useState } from "react";
import Api from "../../utils/api";
import Loading from "../../componetes/loading";
import editIcon from "../../assets/icons/icon-lapis.png";
import iconeExcluir from "../../assets/icons/icon-lixeira.png";
import { useNavigate } from "react-router-dom";
import formataTipoUsuario from "../../utils/formatUserType";
import PopUpMigrate from "../../componetes/pop-up-migrate";
// Bibliotecas
// Componentes
// Estilos, funcoes, classes, imagens e etc

export default function Usuarios() {
  const api = new Api();
  const [response, setResponse] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [idAntigo, setIdAntigo] = useState(null);
  const [reload, setReload] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await api.get("/usuarios");
        setResponse(data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [reload]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleEditUser = async (id) => {
    try {
      setLoading(true);
      const userData = await api.get(`/usuarios/${id}`);
      if (userData) {
        navigate(`/edicao-usuario/${id}`, { state: { userData } });
      } else {
        console.error(`Usuário com id ${id} não encontrado.`);
      }
    } catch (err) {
      console.error("Erro ao buscar usuário:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setModalAberto(true);
    setIdAntigo(id);
  };

  const handleCloseModal = () => {
    setModalAberto(false);
  };

  const filteredUsuarios =
    response && response.usuarios
      ? response.usuarios.filter((usuario) =>
          usuario.nome.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : [];

  const totalUsuarios = filteredUsuarios.length;

  // const handleAddUser = () => {
  //   navigate("/cadastro-usuario");
  // };

  return (
    <>
      {loading && <Loading />}
      {modalAberto && (
        <PopUpMigrate
          id_antigo={idAntigo}
          fechar={handleCloseModal}
          reload={() => setReload((prev) => prev + 1)}
        />
      )}
      <div>
        <h3 className="gestao-section-subtitulo">Usuários ({totalUsuarios})</h3>
        <input
          type="text"
          placeholder="Procure pelo seu nome"
          value={searchTerm}
          onChange={handleSearch}
          className="gestao-section-input"
        />
        {/* <button
          onClick={handleAddUser}
          className="gestao-section-btn gestao-section-btn-verde"
        >
          Adicionar Usuário
        </button> */}
        {response && response.usuarios ? (
          <table className="gestao-section-tabela">
            <thead>
              <tr>
                <th className="gestao-section-titulo-tabela">Nome</th>
                <th className="gestao-section-titulo-tabela">Função</th>
                <th className="gestao-section-titulo-tabela">Email</th>
                <th className="gestao-section-titulo-tabela">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td className="gestao-section-conteudo-tabela">
                    {usuario.nome}
                  </td>
                  <td className="gestao-section-conteudo-tabela">
                    {formataTipoUsuario(usuario.tipo)}
                  </td>
                  <td className="gestao-section-conteudo-tabela">
                    {usuario.email}
                  </td>
                  <td className="gestao-section-conteudo-tabela gestao-section-container-btn">
                    <button
                      className="gestao-section-editar-btn gestao-section-item-btn"
                      onClick={() => handleEditUser(usuario.id)}
                      disabled={usuario.tipo == "Dev"}
                    >
                      <img src={editIcon} alt="" />
                    </button>
                    <button
                      className="gestao-section-excluir-btn gestao-section-item-btn"
                      onClick={() => handleDelete(usuario.id)}
                      disabled={usuario.tipo == "Dev"}
                    >
                      <img src={iconeExcluir} alt="" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="gestao-section-sem-registros">
            Ainda não foram cadastrados usuários!
          </p>
        )}
      </div>
    </>
  );
}
