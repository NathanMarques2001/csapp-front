import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../componetes/navbar";
import Loading from "../../componetes/loading";
import "./style.css";
import Api from "../../utils/api";
import imgGrupoEconomico from "../../assets/images/img-grupo-economico.png";

export default function GrupoEconomico() {
  const api = new Api();
  const [contratos, setContratos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [fabricantes, setFabricantes] = useState([]);
  const [grupoEconomico, setGrupoEconomico] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const grupoEconomicoData = await api.get(`/grupos-economicos/${id}`);
        setGrupoEconomico(grupoEconomicoData.grupoEconomico);

        const clienteData = await api.get(
          `/clientes/grupo-economico/${grupoEconomicoData.grupoEconomico.id}`,
        );
        setClientes(clienteData.clientes);

        // Busca contratos de todos os clientes em paralelo
        const contratosPorCliente = await Promise.all(
          clienteData.clientes.map(async (cliente) => {
            const contratosData = await api.get(
              `/contratos/cliente/${cliente.id}`,
            );
            return contratosData.contratos;
          }),
        );

        const todosContratos = contratosPorCliente.flat();
        setContratos(todosContratos);

        console.log(contratosPorCliente);

        const produtosData = await api.get("/produtos");
        setProdutos(produtosData.produtos);

        const fabricantesData = await api.get("/fabricantes");
        setFabricantes(fabricantesData.fabricantes);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getProdutoNome = (produtoId) => {
    const produto = produtos.find((p) => p.id === produtoId);
    return produto ? produto.nome : "Desconhecido";
  };

  const getFabricanteNome = (produtoId) => {
    const produto = produtos.find((p) => p.id === produtoId);
    if (produto) {
      const fabricante = fabricantes.find(
        (f) => f.id === produto.id_fabricante,
      );
      return fabricante ? fabricante.nome : "Desconhecido";
    }
    return "Desconhecido";
  };

  const editarContato = (id) => {
    navigate(`/edicao-contrato/${id}`);
  };

  const calculaValorImpostoMensal = (valor, indice) =>
    valor + (valor * indice) / 100;

  const calculaValorTotalContratos = () => {
    const vendedorContratosAtivos = contratos.filter(
      (contrato) => contrato.status === "ativo",
    );
    return vendedorContratosAtivos
      .reduce(
        (total, contrato) =>
          total +
          calculaValorImpostoMensal(
            parseFloat(contrato.valor_mensal),
            contrato.indice_reajuste,
          ),
        0,
      )
      .toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  return (
    <>
      {loading && <Loading />}
      <div id="grupo-economico-display">
        <Navbar />
        <div id="grupo-economico-container">
          <div id="grupo-economico-cabecalho">
            <div>
              <h1 id="grupo-economico-titulo-nome">
                Grupo Econômico - {grupoEconomico.nome}
              </h1>
              <p id="cliente-titulo-razao">
                {clientes.map((cliente) =>
                  cliente.tipo_unidade === "matriz"
                    ? `${cliente.razao_social} - ${cliente.cpf_cnpj}`
                    : null,
                )}
              </p>
            </div>
          </div>
          <h2 id="grupo-economico-subtitulo-contratos">Contratos</h2>
          <table id="grupo-economico-tabela">
            <thead>
              <tr>
                <th>Status</th>
                <th>Solução</th>
                <th>Contratação</th>
                <th>Valor</th>
                <th>Recorrência</th>
                <th>Fabricante</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => {
                const contratosCliente = contratos.filter(
                  (contrato) => contrato.id_cliente === cliente.id,
                );

                const valorTotalCliente = contratosCliente.reduce(
                  (total, contrato) =>
                    total +
                    calculaValorImpostoMensal(
                      parseFloat(contrato.valor_mensal),
                      contrato.indice_reajuste,
                    ),
                  0,
                );

                return (
                  <React.Fragment key={cliente.id}>
                    {/* Linha do cliente */}
                    <tr className="linha-cliente">
                      <td colSpan="6" className="cliente-header">
                        <span>{cliente.tipo_unidade}</span> -{" "}
                        {cliente.nome_fantasia} - {cliente.cpf_cnpj} - Total:{" "}
                        {valorTotalCliente.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                    </tr>

                    {/* Contratos da unidade */}
                    {contratosCliente.map((contrato) => (
                      <tr
                        key={contrato.id}
                        className={`clickable-row ${
                          contrato.status !== "ativo" ? "inactive-contract" : ""
                        }`}
                        onClick={() => editarContato(contrato.id)}
                      >
                        <td>{contrato.status}</td>
                        <td>{getProdutoNome(contrato.id_produto)}</td>
                        <td>
                          {new Date(contrato.data_inicio).toLocaleDateString()}
                        </td>
                        <td>
                          {calculaValorImpostoMensal(
                            parseFloat(contrato.valor_mensal),
                            contrato.indice_reajuste,
                          ).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </td>
                        <td>
                          {contrato.duracao == 12000
                            ? "INDETERMINADO"
                            : `${contrato.duracao} MESES`}
                        </td>
                        <td>{getFabricanteNome(contrato.id_produto)}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
          <div id="grupo-economico-faturamento-mensal">
            Faturamento mensal: <b>{calculaValorTotalContratos()}</b>
          </div>

          <div
            className="grupo-economico-contatos-container"
            id="grupo-economico-contatos-container-img"
          >
            <img src={imgGrupoEconomico} alt="" id="grupo-economico-img" />
          </div>
        </div>
      </div>
    </>
  );
}
