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

  useEffect(() => {
    if (cookies.tipo === "dev" || cookies.tipo === "admin") {
      setIsAdminOrDev(true);
    } else {
      setIsAdminOrDev(false);
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const gruposEconomicosResponse = await api.get("/grupos-economicos");
        const grupos = gruposEconomicosResponse.grupoEconomico;

        const clientesResponse = await api.get("/clientes");
        const clientesData = clientesResponse.clientes;

        const vendedoresResponse = await api.get("/usuarios");
        const vendedoresMap = vendedoresResponse.usuarios.reduce(
          (map, vendedor) => {
            map[vendedor.id] = vendedor.nome;
            return map;
          },
          {}
        );
        setVendedores(vendedoresMap);

        const contratosResponse = await api.get("/contratos");
        setContratos(contratosResponse.contratos);

        const { agrupados, semGrupo } = agruparClientesPorGrupo(
          clientesData,
          grupos
        );
        setClientesGrupos(agrupados);
        setClientesSemGrupo(semGrupo);

        const classificacoesClientesResponse = await api.get(
          "/classificacoes-clientes"
        );
        const classificacoesClientesMap =
          classificacoesClientesResponse.classificacoes.reduce(
            (map, classificacao) => {
              map[classificacao.id] = classificacao;
              return map;
            },
            {}
          );
        setClassificacoesClientes(classificacoesClientesMap);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cookies.tipo, cookies.id]);

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

  const clientesGruposFiltrados = clientesGrupos.filter((clientesGrupo) => {
    const texto = filter.toLowerCase();
    const grupoPassa = clientesGrupo.grupo.nome.toLowerCase().includes(texto);
    const algumaUnidadePassa = clientesGrupo.unidades.some(
      (unidade) =>
        unidade.nome_fantasia.toLowerCase().includes(texto) ||
        unidade.cpf_cnpj.includes(filter)
    );
    return grupoPassa || algumaUnidadePassa;
  });

  return (
    <>
      {loading && <Loading />}
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
              className={!isAdminOrDev ? "disabled" : ""}
              onClick={() => navigate("/cadastro-cliente")}
              id="clientes-botao"
            >
              Adicionar cliente
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
                              {cliente.tipo || "-"}
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
                          </tr>
                        ))}
                    </tbody>
                  </Fragment>
                );
              })}

              {/* Clientes sem grupo aparecem normalmente na listagem */}
              <tbody>
                {clientesSemGrupo
                  .filter((cliente) => {
                    const texto = filter.toLowerCase();
                    return (
                      cliente.nome_fantasia.toLowerCase().includes(texto) ||
                      cliente.cpf_cnpj.includes(filter)
                    );
                  })
                  .map((cliente) => (
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
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <p id="clientes-sem-clientes">
              Ainda não foram cadastrados clientes!
            </p>
          )}
        </div>
      </div>
    </>
  );
}
