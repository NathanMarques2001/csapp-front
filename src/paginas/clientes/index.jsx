// Bibliotecas
import { useEffect, useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
// Componentes
import Navbar from "../../componetes/navbar";
import Loading from "../../componetes/loading";
// Estilos, funcoes, classes, imagens e etc
import Api from "../../utils/api";
import "./style.css";
import { useCookies } from "react-cookie";
import imgQuestao from "../../assets/images/questao.png";
import { FaUser, FaUsers } from "react-icons/fa";
import PopUpFiltroClientes from "../../componetes/pop-up-filtro-clientes";

export default function Clientes() {
  const api = new Api();
  const [cookies] = useCookies(["tipo", "id"]);
  const [isAdminOrDev, setIsAdminOrDev] = useState(false);
  const [clientesGrupos, setClientesGrupos] = useState([]);
  const [contratos, setContratos] = useState([]);
  const [vendedores, setVendedores] = useState({});
  const [classificacoesClientes, setClassificacoesClientes] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [hoverGrupoId, setHoverGrupoId] = useState(null);
  const [clientesSemGrupo, setClientesSemGrupo] = useState([]);
  const [totalGeralContratos, setTotalGeralContratos] = useState(0);
  const [totalPorCategoria, setTotalPorCategoria] = useState({});
  const [filters, setFilters] = useState({ status: "ativo" });
  const [showFilter, setShowFilter] = useState(false);

  // Paginação
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Verifica permissão
  useEffect(() => {
    setIsAdminOrDev(cookies.tipo === "dev" || cookies.tipo === "admin");
  }, [cookies.tipo]);

  // Fetch vendedores e classificações (uma vez só)
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const vendedoresResponse = await api.get("/usuarios");
        const vendedoresMap = vendedoresResponse.usuarios.reduce((map, v) => {
          map[v.id] = v.nome;
          return map;
        }, {});
        setVendedores(vendedoresMap);

        const classificacoesResponse = await api.get("/classificacoes-clientes");
        const classificacoesMap = classificacoesResponse.classificacoes.reduce((map, c) => {
          map[c.id] = c;
          return map;
        }, {});
        setClassificacoesClientes(classificacoesMap);

        const contratosResponse = await api.get("/contratos");
        setContratos(contratosResponse.contratos);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMeta();
  }, []);

  // Fetch clientes paginados
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        setLoading(true);

        const clientesResponse = await api.get(`/clientes/paginados?page=${page}`);
        const { clientes, pagination } = clientesResponse;

        const gruposEconomicosResponse = await api.get("/grupos-economicos");
        const grupos = gruposEconomicosResponse.grupoEconomico;

        const { agrupados, semGrupo } = agruparClientesPorGrupo(clientes, grupos);
        setClientesGrupos(agrupados);
        setClientesSemGrupo(semGrupo);

        setPage(pagination.page);
        setTotalPages(pagination.totalPages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, [page]);

  // Totalizadores
  useEffect(() => {
    let totalGeral = 0;
    const totaisCategoria = {};

    if (!Object.keys(classificacoesClientes).length) {
      setTotalGeralContratos(0);
      setTotalPorCategoria({});
      return;
    }

    // Clientes com grupo
    clientesGrupos.forEach(({ grupo, unidades }) => {
      const categoriaNome = classificacoesClientes[grupo.id_classificacao_cliente]?.nome || "Não Classificado";

      if (!totaisCategoria[categoriaNome]) totaisCategoria[categoriaNome] = 0;

      unidades.forEach((cliente) => {
        const valor = calculaValorTotalContratos(cliente.id);
        totaisCategoria[categoriaNome] += valor;
        totalGeral += valor;
      });
    });

    // Clientes sem grupo
    clientesSemGrupo.forEach((cliente) => {
      const categoriaNome = classificacoesClientes[cliente.id_classificacao_cliente]?.nome || "Não Classificado";
      if (!totaisCategoria[categoriaNome]) totaisCategoria[categoriaNome] = 0;
      const valor = calculaValorTotalContratos(cliente.id);
      totaisCategoria[categoriaNome] += valor;
      totalGeral += valor;
    });

    setTotalGeralContratos(totalGeral);
    setTotalPorCategoria(totaisCategoria);
  }, [clientesGrupos, clientesSemGrupo, contratos, classificacoesClientes]);

  const agruparClientesPorGrupo = (clientes, grupos) => {
    const gruposIndex = grupos.reduce((acc, grupo) => {
      acc[grupo.id] = { grupo, unidades: [] };
      return acc;
    }, {});

    const semGrupo = [];

    clientes.forEach((cliente) => {
      const grupo = cliente.id_grupo_economico;
      if (grupo && gruposIndex[grupo]) {
        gruposIndex[grupo].unidades.push(cliente);
      } else {
        semGrupo.push(cliente);
      }
    });

    const agrupados = Object.values(gruposIndex);
    return { agrupados, semGrupo };
  };

  const calculaValorImpostoMensal = (valor, indice) =>
    valor + (valor * indice) / 100;

  const calculaValorTotalContratos = (clienteId) => {
    const clienteContratos = contratos.filter(
      (contrato) =>
        contrato.id_cliente === clienteId && contrato.status === "ativo"
    );

    return clienteContratos.reduce((sum, contrato) => {
      const valorContrato = parseFloat(contrato.valor_mensal);
      const valorComImposto = calculaValorImpostoMensal(
        valorContrato,
        contrato.indice_reajuste
      );
      return sum + valorComImposto;
    }, 0);
  };

  const detalhesCliente = (id) => {
    navigate(`/clientes/${id}`);
  };

  const detalhesGrupo = (id) => {
    navigate(`/grupo-economico/${id}`);
  };

  const getMatriz = (grupo) =>
    grupo.unidades.find((c) => c.tipo_unidade === "matriz") ||
    grupo.unidades[0];

  const calculaTotalContratosGrupo = (grupo) =>
    grupo.unidades.reduce(
      (total, cliente) => total + calculaValorTotalContratos(cliente.id),
      0
    );

  const clientesGruposFiltrados = clientesGrupos.filter(({ grupo, unidades }) =>
    unidades.some((unidade) => {
      const passaClassificacao =
        !filters.classificacao_cliente ||
        unidade.id_classificacao_cliente === parseInt(filters.classificacao_cliente);
      const passaVendedor =
        !filters.nome_vendedor ||
        unidade.id_usuario === parseInt(filters.nome_vendedor);
      const passaStatus =
        !filters.status || unidade.status === filters.status;

      const passaBusca =
        !filter || unidade.nome_fantasia.toLowerCase().includes(filter.toLowerCase());

      return passaClassificacao && passaVendedor && passaStatus && passaBusca;
    })
  );

  const limparFiltros = () => {
    setFilters({ status: "ativo" });
  };

  return (
    <>
      {loading && <Loading />}
      {showFilter && (
        <PopUpFiltroClientes
          onFilter={(newFilters) => {
            setFilters(newFilters);
            setShowFilter(false);
          }}
          closeModal={() => setShowFilter(false)}
          classificacoes={classificacoesClientes}
          vendedores={vendedores}
        />

      )}

      <div id="clientes-display">
        <Navbar />
        <div id="clientes-container">
          <h1 id="clientes-titulo">Clientes</h1>

          {/* Filtro + botão */}
          <div id="header-clientes">
            <input
              type="text"
              placeholder="Procure pelo nome"
              id="clientes-input"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <button
              disabled={!isAdminOrDev}
              className={`clientes-botao${!isAdminOrDev ? " disabled" : ""}`}
              onClick={() => navigate("/cadastro-cliente")}
              id="clientes-add-edit-botao"
            >
              Adicionar cliente
            </button>

            <button
              className="clientes-botao"
              id="clientes-filtrar"
              onClick={() => setShowFilter(true)}
            >
              Filtrar
            </button>

            {/* Tooltip categorias */}
            <div id="tooltip-container">
              <img id="img-top30" src={imgQuestao} alt="imagem top 30" />
              <span id="tooltip-text">
                Categoria TOP 30: 30 Maiores faturamentos <br /> Categoria A:
                Faturamento acima de R$ 3.000,00 <br />
                Categoria B: Faturamento acima de R$ 2.000,00 <br />
                Categoria C: Faturamento até R$ 1.999,00
              </span>
            </div>
          </div>

          {Object.keys(filters).length > 0 && (
            <div className="active-filters">
              <p>
                <b>Filtros Ativos:</b>
              </p>
              <p id="active-filters-container">
                {Object.entries(filters).map(([key, value]) => {
                  if (!value) return null;

                  let displayValue = value;

                  if (key === "classificacao_cliente") {
                    displayValue = classificacoesClientes[value]?.nome || value;
                  } else if (key === "nome_vendedor") {
                    displayValue = vendedores[value] || value;
                  }

                  return (
                    <span className="active-filters-current" key={key}>
                      {`${key.replace(/_/g, " ")}: ${displayValue}`}
                    </span>
                  );
                })}
              </p>
              <button
                onClick={limparFiltros}
                className="contratos-botao"
                id="contratos-botao-limpar-filtros"
              >
                Limpar Filtros
              </button>
            </div>
          )}


          {/* Tabela principal */}
          {clientesGruposFiltrados.length || clientesSemGrupo.length ? (
            <table id="clientes-tabela">
              <thead>
                <tr>
                  <th className="clientes-titulo-tabela">Nome</th>
                  <th className="clientes-titulo-tabela">CPF/CNPJ</th>
                  <th className="clientes-titulo-tabela">Categoria</th>
                  <th className="clientes-titulo-tabela">Valor Contratos</th>
                  <th className="clientes-titulo-tabela">Vendedor</th>
                  <th className="clientes-titulo-tabela">Tipo</th>
                </tr>
              </thead>

              {/* Grupos econômicos com unidades */}
              {clientesGruposFiltrados.map((grupo) => {
                const matriz = getMatriz(grupo);
                const totalContratos = calculaTotalContratosGrupo(grupo);
                const aberto = hoverGrupoId === grupo.grupo.id;

                return (
                  <Fragment key={grupo.grupo.id}>
                    <tbody
                      className={`grupo-unidades ${aberto ? "aberto" : ""}`}
                      onMouseEnter={() => setHoverGrupoId(grupo.grupo.id)}
                      onMouseLeave={() => setHoverGrupoId(null)}
                    >
                      {/* Linha do grupo */}
                      <tr
                        className={
                          aberto ? "clientes-conteudo-tabela-grupo-aberto" : ""
                        }
                        onClick={() => detalhesGrupo(grupo.grupo.id)}
                      >
                        <td className="clientes-conteudo-tabela">
                          {grupo.grupo.nome}
                        </td>
                        <td className="clientes-conteudo-tabela">
                          {matriz?.cpf_cnpj || "-"}
                        </td>
                        <td className="clientes-conteudo-tabela">
                          {classificacoesClientes[
                            grupo.grupo?.id_classificacao_cliente
                          ]?.nome || "-"}
                        </td>
                        <td className="clientes-conteudo-tabela">
                          {totalContratos.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </td>
                        <td className="clientes-conteudo-tabela">
                          {vendedores[matriz?.id_usuario] || "-"}
                        </td>
                        <td className="clientes-conteudo-tabela">
                          <FaUsers />
                        </td>
                      </tr>

                      {/* Unidades visíveis apenas no hover */}
                      {aberto &&
                        grupo.unidades.map((cliente) => (
                          <tr
                            key={cliente.id}
                            className="clientes-conteudo-tabela-hover"
                            onClick={(e) => {
                              e.stopPropagation();
                              detalhesCliente(cliente.id);
                            }}
                          >
                            <td className="clientes-conteudo-tabela">
                              {cliente.nome_fantasia}
                            </td>
                            <td className="clientes-conteudo-tabela">
                              {cliente.cpf_cnpj}
                            </td>
                            <td className="clientes-conteudo-tabela">
                              {classificacoesClientes[
                                cliente?.id_classificacao_cliente
                              ]?.nome || "-"}
                            </td>
                            <td className="clientes-conteudo-tabela">
                              {calculaValorTotalContratos(
                                cliente.id
                              ).toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}
                            </td>
                            <td className="clientes-conteudo-tabela">
                              {vendedores[cliente?.id_usuario] || "-"}
                            </td>
                            <td className="clientes-conteudo-tabela">
                              <FaUser />
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Fragment>
                );
              })}

              {/* Clientes sem grupo aparecem normalmente na listagem */}
              <tbody>
                {clientesSemGrupo.filter((cliente) => {
                  const passaClassificacao =
                    !filters.classificacao_cliente ||
                    cliente.id_classificacao_cliente === parseInt(filters.classificacao_cliente);
                  const passaVendedor =
                    !filters.nome_vendedor ||
                    cliente.id_usuario === parseInt(filters.nome_vendedor);
                  const passaStatus =
                    !filters.status || cliente.status === filters.status;

                  const passaBusca =
                    !filter || cliente.nome_fantasia.toLowerCase().includes(filter.toLowerCase());

                  return passaClassificacao && passaVendedor && passaStatus && passaBusca;
                }).map((cliente) => (
                  <tr
                    key={`semgrupo-${cliente.id}`}
                    className="clientes-conteudo-tabela-sem-grupo"
                    onClick={() => detalhesCliente(cliente.id)}
                  >
                    <td className="clientes-conteudo-tabela">
                      {cliente.nome_fantasia}
                    </td>
                    <td className="clientes-conteudo-tabela">
                      {cliente.cpf_cnpj}
                    </td>
                    <td className="clientes-conteudo-tabela">
                      {classificacoesClientes[
                        cliente?.id_classificacao_cliente
                      ]?.nome || "-"}
                    </td>
                    <td className="clientes-conteudo-tabela">
                      {calculaValorTotalContratos(cliente.id).toLocaleString(
                        "pt-BR",
                        {
                          style: "currency",
                          currency: "BRL",
                        }
                      )}
                    </td>
                    <td className="clientes-conteudo-tabela">
                      {vendedores[cliente.id_usuario] || "-"}
                    </td>
                    <td className="clientes-conteudo-tabela">
                      <FaUser />
                    </td>
                  </tr>
                ))}
              </tbody>

              <tfoot>
                <tr className="clientes-total-geral-linha">
                  <td className="clientes-total-label" colSpan={4}>
                    TOTAL DE CONTRATOS ATIVOS:
                  </td>
                  <td className="clientes-total-valor">
                    {totalGeralContratos.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                  <td /> {/* Célula vazia para a coluna Vendedor */}
                </tr>

                {/* Mapeia e exibe os totais para cada categoria */}
                {Object.entries(totalPorCategoria)
                  .sort(([catA], [catB]) => catA.localeCompare(catB)) // Ordena por nome da categoria
                  .map(([categoria, total]) => (
                    <tr
                      key={categoria}
                      className="clientes-total-categoria-linha"
                    >
                      <td className="clientes-total-label" colSpan={4}>
                        Total Categoria: {categoria}
                      </td>
                      <td className="clientes-total-valor">
                        {total.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                      <td /> {/* Célula vazia para a coluna Vendedor */}
                    </tr>
                  ))}
              </tfoot>
            </table>
          ) : (
            <p id="clientes-sem-clientes">
              Ainda não foram cadastrados clientes!
            </p>
          )}

          {/* Paginação */}
          <div className="pagination">
            <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}>Anterior</button>
            <span>Página {page} de {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}>Próxima</button>
          </div>
        </div>
      </div>
    </>
  );
}
