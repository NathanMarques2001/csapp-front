// Bibliotecas
// Componentes
import Navbar from "../../componetes/navbar";
import Loading from "../../componetes/loading";
import RelatorioContratos from "../../relatorios/contratos";
// Estilos, funcoes, classes, imagens e etc
import './style.css';
import { useEffect, useState } from "react";
import Api from "../../utils/api";
import { useCookies } from "react-cookie";
import RelatorioClientes from "../../relatorios/clientes";

export default function Relatorios() {
  const [loading, setLoading] = useState(false);
  const tabelas = ['Clientes', 'Contratos'];
  const [tabelaSelecionada, setTabeleSelecionada] = useState('Contratos');
  const api = new Api();
  const [contratos, setContratos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [segmentos, setSegmentos] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies(['tipo', 'id']);
  const [isAdminOrDev, setIsAdminOrDev] = useState(false);
  const [contratosRoute, setContratosRoute] = useState("");

  useEffect(() => {
    setLoading(true);
    setClientes([])
    setContratos([])
    setContratosRoute('/contratos');
    if (cookies.tipo === "dev" || cookies.tipo === "admin") {
      setIsAdminOrDev(true);
      // setContratosRoute('/contratos');
    } else {
      setIsAdminOrDev(false);
      // setContratosRoute(`/contratos/vendedor/${cookies.id}`);
    }

    const fetchData = async () => {
      try {
        const contratosResponse = await api.get(contratosRoute);
        const contratosMap = contratosResponse.contratos.reduce((map, contrato) => {
          map[contrato.id] = contrato;
          return map;
        }, {});
        setContratos(Object.values(contratosMap));

        const clientesResponse = await api.get('/clientes');
        const clientesMap = clientesResponse.clientes.reduce((map, cliente) => {
          map[cliente.id] = cliente;
          return map;
        }, {});
        setClientes(Object.values(clientesMap));

        const produtosResponse = await api.get('/produtos');
        const produtosMap = produtosResponse.produtos.reduce((map, produto) => {
          map[produto.id] = produto;
          return map;
        }, {});
        setProdutos(Object.values(produtosMap));

        const vendedoresResponse = await api.get('/usuarios');
        const vendedoresMap = vendedoresResponse.usuarios.reduce((map, vendedor) => {
          map[vendedor.id] = vendedor;
          return map;
        }, {});
        setUsuarios(Object.values(vendedoresMap));

        const responseSegmentos = await api.get('/segmentos');
        const segmentosMap = responseSegmentos.segmentos.reduce((map, segmento) => {
          map[segmento.id] = segmento;
          return map;
        }, {});
        setSegmentos(Object.values(segmentosMap));

      } catch (error) {
        console.error("Aconteceu algo inesperado: " + error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [tabelaSelecionada, cookies.tipo, cookies.id, contratosRoute]);

  return (
    <>
      {loading && <Loading />}
      <div id="clientes-display">
        <Navbar />
        <div id="clientes-container">
          <h1 id="clientes-titulo">Relatórios</h1>
          <select onChange={e => setTabeleSelecionada(e.target.value)} name="" id="select-tabela-relatorios">
            <option value="">Selecione a fonte de dados</option>
            {tabelas.map(tabela => (
              <option key={tabela} value={tabela}>{tabela}</option>
            ))}
          </select>
          {
            tabelaSelecionada == 'Contratos' ? (<RelatorioContratos contratos={contratos} produtos={produtos} clientes={clientes} usuarios={usuarios} />) : <RelatorioClientes clientes={clientes} contratos={contratos} usuarios={usuarios} segmentos={segmentos} />
          }
        </div>
      </div>
    </>
  );
}
