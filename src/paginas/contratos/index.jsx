import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../componetes/navbar";
import Loading from "../../componetes/loading";
import PopUpFiltro from "../../componetes/pop-up-filtro";
import Api from "../../utils/api";
import "./style.css";
import { useCookies } from "react-cookie";
import { baixarModelo } from "../../utils/modeloExcelContratos";
import PopUpImportaContratos from "../../componetes/pop-up-importa-contrato";

export default function Contratos() {
  const api = new Api();
  const [cookies] = useCookies(["tipo", "id"]);
  const [isAdminOrDev, setIsAdminOrDev] = useState(false);
  const [contratos, setContratos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [vendedores, setVendedores] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [filter, setFilter] = useState("");
  const [filters, setFilters] = useState({ status: "ativo" });
  const [loading, setLoading] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [mostrarModalImportacao, setMostrarModalImportacao] = useState(false);
  const [totalGeral, setTotalGeral] = useState(0);
  const [totalPorFaturamento, setTotalPorFaturamento] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (cookies.tipo === "dev" || cookies.tipo === "admin") {
          setIsAdminOrDev(true);
        } else {
          setIsAdminOrDev(false);
        }

        const contratosResponse = await api.get("/contratos");
        const contratosMap = contratosResponse.contratos.reduce(
          (map, contrato) => {
            map[contrato.id] = contrato;
            return map;
          },
          {}
        );
        setContratos(Object.values(contratosMap));

        const clientesResponse = await api.get("/clientes");
        const clientesMap = clientesResponse.clientes.reduce((map, cliente) => {
          map[cliente.id] = cliente;
          return map;
        }, {});
        setClientes(clientesMap);

        const vendedoresResponse = await api.get("/usuarios");
        const vendedoresMap = vendedoresResponse.usuarios.reduce(
          (map, vendedor) => {
            map[vendedor.id] = vendedor;
            return map;
          },
          {}
        );
        setVendedores(vendedoresMap);

        const produtosResponse = await api.get("/produtos");
        const produtosMap = produtosResponse.produtos.reduce((map, produto) => {
          map[produto.id] = produto;
          return map;
        }, {});
        setProdutos(produtosMap);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cookies.tipo, cookies.id]);

  const detalhesContrato = (id) => {
    navigate(`/edicao-contrato/${id}`);
  };

  const addContrato = () => {
    navigate("/cadastro-contrato");
  };

  const filtratContratos = (e) => {
    setFilter(e.target.value);
  };

  const aplicarFiltroPopUp = (filters) => {
    setFilters(filters);
    setShowFilterPopup(false);
  };

  const limparFiltros = () => {
    setFilters({ status: "ativo" });
  };

  const filteredContratos = contratos.filter((contrato) => {
    const cliente = clientes[contrato.id_cliente];
    const produto = produtos[contrato.id_produto];
    const clienteNome = cliente?.nome_fantasia || "";
    const clienteRazao = cliente?.razao_social || "";
    const produtoNome = produto?.nome || "";

    const filterConditions = [
      filters.id_cliente
        ? contrato.id_cliente.toString().includes(filters.id_cliente)
        : true,
      filters.id_produto
        ? contrato.id_produto.toString().includes(filters.id_produto)
        : true,
      filters.status ? contrato.status === filters.status : true,
      filters.duracao
        ? contrato.duracao.toString().includes(filters.duracao)
        : true,
      filters.valor_mensal
        ? contrato.valor_mensal.toString().includes(filters.valor_mensal)
        : true,
      filters.razao_social
        ? clienteRazao
            .toLowerCase()
            .includes(filters.razao_social.toLowerCase())
        : true,
      filters.nome_fantasia
        ? clienteNome
            .toLowerCase()
            .includes(filters.nome_fantasia.toLowerCase())
        : true,
      filters.nome_produto
        ? produtoNome.toLowerCase().includes(filters.nome_produto.toLowerCase())
        : true,
      clienteNome.toLowerCase().includes(filter.toLowerCase()),
    ];

    return filterConditions.every((condition) => condition);
  });

  const calculaValorImpostoMensal = (valor, indice) =>
    valor + (valor * indice) / 100;

  useEffect(() => {
    // Calcula o total geral dos contratos filtrados
    const novoTotalGeral = filteredContratos.reduce((acc, contrato) => {
      const valorContrato = calculaValorImpostoMensal(
        parseFloat(contrato.valor_mensal),
        contrato.indice_reajuste
      );
      return acc + valorContrato;
    }, 0);
    setTotalGeral(novoTotalGeral);

    // Calcula os totais segregados por tipo de faturamento
    const novoTotalPorFaturamento = filteredContratos.reduce(
      (acc, contrato) => {
        const valorContrato = calculaValorImpostoMensal(
          parseFloat(contrato.valor_mensal),
          contrato.indice_reajuste
        );
        const tipo = contrato.tipo_faturamento || "Não especificado";

        if (!acc[tipo]) {
          acc[tipo] = 0;
        }
        acc[tipo] += valorContrato;
        return acc;
      },
      {}
    );
    setTotalPorFaturamento(novoTotalPorFaturamento);
  }, [filteredContratos]);

  return (
    <>
      {loading && <Loading />}
      <div id="contratos-display">
        <Navbar />
        <div id="contratos-container">
          <h1 id="contratos-titulo">Contratos</h1>
          <input
            type="text"
            placeholder="Procure pelo cliente"
            id="contratos-input"
            value={filter}
            onChange={filtratContratos}
          />
          <button
            onClick={addContrato}
            disabled={!isAdminOrDev}
            className={`contratos-botao ${!isAdminOrDev ? "disabled" : ""}`}
            id="contratos-botao-add"
          >
            Adicionar Contrato
          </button>
          <button
            onClick={() => setShowFilterPopup(true)}
            className="contratos-botao"
            id="contratos-botao-filtro"
          >
            Filtrar
          </button>
          <button
            onClick={() => setMostrarModalImportacao(true)}
            className="contratos-botao"
            id="contratos-botao-importar"
          >
            Importar Contratos
          </button>

          {mostrarModalImportacao && (
            <PopUpImportaContratos
              baixarModelo={baixarModelo}
              setLoading={setLoading}
              setMostrarModalImportacao={setMostrarModalImportacao}
            />
          )}

          {showFilterPopup && (
            <div className="filter-popup">
              <PopUpFiltro
                onFilter={aplicarFiltroPopUp}
                closeModal={() => setShowFilterPopup(false)}
                clientes={clientes}
                produtos={produtos}
              />
            </div>
          )}
          {Object.keys(filters).length > 0 && (
            <div className="active-filters">
              <p>
                <b>Filtros Ativos:</b>
              </p>
              <p id="active-filters-container">
                {Object.entries(filters).map(
                  ([key, value]) =>
                    value && (
                      <span className="active-filters-current" key={key}>
                        {`${key.replace(/_/g, " ")}: ${value}`}
                      </span>
                    )
                )}
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

          {filteredContratos.length > 0 ? (
            <table id="contratos-tabela">
              <thead>
                <tr>
                  <th className="contratos-titulo-tabela">Cliente</th>
                  <th className="contratos-titulo-tabela">CPF/CNPJ</th>
                  <th className="contratos-titulo-tabela">Solução</th>
                  <th className="contratos-titulo-tabela">Valor Contrato</th>
                  <th className="contratos-titulo-tabela">Faturamento</th>
                  <th className="contratos-titulo-tabela">Vendedor</th>
                </tr>
              </thead>
              <tbody>
                {filteredContratos.map((contrato) => {
                  const cliente = clientes[contrato.id_cliente];
                  const produto = produtos[contrato.id_produto];
                  const vendedor = vendedores[cliente?.id_usuario];

                  return (
                    <tr
                      key={contrato.id}
                      onClick={() => detalhesContrato(contrato.id)}
                      className="clickable-row"
                    >
                      <td className="contratos-conteudo-tabela">
                        {cliente?.nome_fantasia || "-"}
                      </td>
                      <td className="contratos-conteudo-tabela">
                        {cliente?.cpf_cnpj || "-"}
                      </td>
                      <td className="contratos-conteudo-tabela">
                        {produto?.nome || "-"}
                      </td>
                      <td className="contratos-conteudo-tabela">
                        {calculaValorImpostoMensal(
                          parseFloat(contrato.valor_mensal),
                          contrato.indice_reajuste
                        ).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                      <td className="contratos-conteudo-tabela contratos-tipo-faturamento">
                        {contrato?.tipo_faturamento || "-"}
                      </td>
                      <td className="contratos-conteudo-tabela">
                        {vendedor?.nome || "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>

              <tfoot>
                <tr className="contratos-total-geral-linha">
                  <td className="contratos-total-label" colSpan={3}>
                    TOTAL:
                  </td>
                  <td className="contratos-total-valor">
                    {totalGeral.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                  {/* Células vazias para Faturamento e Vendedor */}
                  <td colSpan={2}></td>
                </tr>

                {/* Mapeia e exibe os totais para cada tipo de faturamento */}
                {Object.entries(totalPorFaturamento)
                  .sort(([tipoA], [tipoB]) => tipoA.localeCompare(tipoB)) // Ordena por nome
                  .map(([tipo, total]) => (
                    <tr key={tipo} className="contratos-total-categoria-linha">
                      <td className="contratos-total-label" colSpan={3}>
                        Total {tipo}:
                      </td>
                      <td className="contratos-total-valor">
                        {total.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                      <td colSpan={2}></td>
                    </tr>
                  ))}
              </tfoot>
            </table>
          ) : (
            <p id="contratos-sem-contratos">
              Ainda não foram cadastrados contratos!
            </p>
          )}
        </div>
      </div>
    </>
  );
}
