// Bibliotecas
import { useEffect, useState } from "react";
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
  const [cookies, setCookie, removeCookie] = useCookies(["tipo", "id"]);
  const [isAdminOrDev, setIsAdminOrDev] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [gruposEconomicos, setGruposEconomicos] = useState([]);
  const [clientesGrupos, setClientesGrupos] = useState([]);
  const [contratos, setContratos] = useState([]);
  const [vendedores, setVendedores] = useState({});
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
        setGruposEconomicos(grupos);

        const clientesResponse = await api.get("/clientes");
        const clientesData = clientesResponse.clientes;
        setClientes(clientesData);

        const vendedoresResponse = await api.get("/usuarios");
        const vendedoresMap = vendedoresResponse.usuarios.reduce(
          (map, vendedor) => {
            map[vendedor.id] = vendedor.nome;
            return map;
          },
          {},
        );
        setVendedores(vendedoresMap);

        const contratosResponse = await api.get("/contratos");
        setContratos(contratosResponse.contratos);

        const agrupados = agruparClientesPorGrupo(clientesData, grupos);
        setClientesGrupos(agrupados);
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

    const semGrupo = { grupo: { id: 0, nome: "Sem grupo" }, unidades: [] };

    clientes.forEach((cliente) => {
      const grupo = cliente.id_grupo_economico;
      if (grupo && gruposIndex[grupo]) {
        gruposIndex[grupo].unidades.push(cliente);
      } else {
        semGrupo.unidades.push(cliente);
      }
    });

    const resultado = Object.values(gruposIndex);
    if (semGrupo.unidades.length) resultado.push(semGrupo);

    return resultado;
  };

  console.log(clientesGrupos);

  const calculaValorImpostoMensal = (valor, indice) =>
    valor + (valor * indice) / 100;

  const calculaValorTotalContratos = (clienteId) => {
    const clienteContratos = contratos.filter(
      (contrato) =>
        contrato.id_cliente === clienteId && contrato.status === "ativo",
    );

    const total = clienteContratos.reduce((sum, contrato) => {
      const valorContrato = parseFloat(contrato.valor_mensal);
      const valorComImposto = calculaValorImpostoMensal(
        valorContrato,
        contrato.indice_reajuste,
      );
      return sum + valorComImposto;
    }, 0);

    return total;
  };

  const detalhesCliente = (id) => {
    navigate(`/clientes/${id}`);
  };

  const filtraClientes = (e) => {
    setFilter(e.target.value);
  };

  const clientesGruposFiltrados = clientesGrupos.filter((clientesGrupo) => {
    const texto = filter.toLowerCase();

    const grupoPassa = clientesGrupo.grupo.nome.toLowerCase().includes(texto);

    const algumaUnidadePassa = clientesGrupo.unidades.some(
      (unidade) =>
        unidade.nome_fantasia.toLowerCase().includes(texto) ||
        unidade.cpf_cnpj.includes(filter),
    );

    return grupoPassa || algumaUnidadePassa;
  });

  const addCliente = () => {
    navigate("/cadastro-cliente");
  };

  return (
    <>
      {loading && <Loading />}
      <div id="clientes-display">
        <Navbar />
        <div id="clientes-container">
          <h1 id="clientes-titulo">Clientes</h1>
          <div id="header-clientes">
            <input
              type="text"
              placeholder="Procure pelo nome"
              id="clientes-input"
              value={filter}
              onChange={filtraClientes}
            />
            <button
              disabled={!isAdminOrDev}
              className={!isAdminOrDev ? "disabled" : ""}
              onClick={(e) => addCliente()}
              id="clientes-botao"
            >
              Adicionar cliente
            </button>
            <div id="tooltip-container">
              <img id="img-top30" src={imgQuestao} alt="imagem top 30" />
              <span id="tooltip-text">
                Categoria TOP 30: 30 Maiores faturamentos <br /> Categoria A:
                Faturamento acima de R$ 3.000,00 <br />
                Categoria B: Faturamento acima de R$ 1.000,00 <br />
                Categoria C: Faturamento até R$ 999,00
              </span>
            </div>
          </div>
          {clientesGruposFiltrados.length > 0 ? (
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
              <tbody>
                {clientesGruposFiltrados.map((grupo) =>
                  grupo.unidades.map((cliente) => (
                    <tr
                      key={cliente.id}
                      onClick={() => detalhesCliente(cliente.id)}
                      className="clickable-row"
                    >
                      <td className="clientes-conteudo-tabela">
                        {grupo.grupo.nome}
                      </td>
                      <td className="clientes-conteudo-tabela">
                        {cliente.cpf_cnpj}
                      </td>
                      <td className="clientes-conteudo-tabela">
                        {grupo.grupo.tipo?.toUpperCase()}
                      </td>
                      <td className="clientes-conteudo-tabela">
                        {calculaValorTotalContratos(cliente.id).toLocaleString(
                          "pt-BR",
                          {
                            style: "currency",
                            currency: "BRL",
                          },
                        )}
                      </td>
                      <td className="clientes-conteudo-tabela">
                        {vendedores[grupo.grupo.id_usuario]}
                      </td>
                    </tr>
                  )),
                )}
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
