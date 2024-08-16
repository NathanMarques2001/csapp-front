import { useEffect, useState } from "react";
import Api from "../../utils/api";
import editIcon from "../../assets/icons/icon-lapis.png";
import iconeExcluir from "../../assets/icons/icon-lixeira.png";
import Loading from "../../componetes/loading";
import { useNavigate } from "react-router-dom";
// Bibliotecas
// Componentes
// Estilos, funcoes, classes, imagens e etc

export default function Segmentos() {
  const api = new Api();
  const [segmentos, setSegmentos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/segmentos');
        setSegmentos(response.segmentos);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
      finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (id) => {
    navigate(`/edicao-segmento/${id}`)
  };

  const handleDelete = (id) => {
    console.log("Delete product with ID:", id);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleRedirect = (url) => {
    navigate(url);
  }

  const filteredSegmentos = segmentos.filter(segmentos => {
    return segmentos.nome.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalSegmentos = filteredSegmentos.length;

  return (
    <>
      {loading && <Loading />}
      <div>
        <h3 className="gestao-section-subtitulo">Segmentos ({totalSegmentos})</h3>
        <input
          type="text"
          placeholder="Procure pelo nome"
          value={searchTerm}
          onChange={handleSearch}
          className="gestao-section-input"
        />
        <button className="gestao-section-btn gestao-section-btn-verde" onClick={e => handleRedirect("/cadastro-segmento")}>Adicionar segmento</button>
        {segmentos.length > 0 ? (
          <table className="gestao-section-tabela">
            <thead>
              <tr>
                <th className="gestao-section-titulo-tabela">Nome</th>
                <th className="gestao-section-titulo-tabela">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredSegmentos.map(segmento => (
                <tr key={segmento.id}>
                  <td className="gestao-section-conteudo-tabela">{segmento.nome}</td>
                  <td className="gestao-section-conteudo-tabela">
                    <div className="gestao-section-container-btn">
                      <button className="gestao-section-editar-btn gestao-section-item-btn" onClick={() => handleEdit(segmento.id)}>
                        <img src={editIcon} alt="" />
                      </button>
                      <button className="gestao-section-excluir-btn gestao-section-item-btn" onClick={() => handleDelete(segmento.id)}>
                        <img src={iconeExcluir} alt="" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="gestao-section-sem-registros">Ainda não foram cadastrados segmentos!</p>
        )}
      </div>
    </>
  );
}
