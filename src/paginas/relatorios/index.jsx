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
  const [clientesRoute, setClientesRoute] = useState("");
  const [contratosRoute, setContratosRoute] = useState("");

  useEffect(() => {
    setLoading(true);
    setClientes([])
    setContratos([])
    if (cookies.tipo === "dev" || cookies.tipo === "admin") {
      setIsAdminOrDev(true);
      setClientesRoute('/clientes');
      setContratosRoute('/contratos');
    } else {
      setIsAdminOrDev(false);
      setClientesRoute(`/clientes/vendedor/${cookies.id}`);
      setContratosRoute(`/contratos/vendedor/${cookies.id}`);
    }

    const fetchData = async () => {
      try {
        const contratosResponse = await api.get(contratosRoute);
        setContratos(contratosResponse.contratos);

        const clientesResponse = await api.get(clientesRoute);
        setClientes(clientesResponse.clientes);

        const produtosResponse = await api.get('/produtos');
        setProdutos(produtosResponse.produtos);

        const vendedoresResponse = await api.get('/usuarios');
        setUsuarios(vendedoresResponse.usuarios);

        const responseSegmentos = await api.get('/segmentos');
        setSegmentos(responseSegmentos.segmentos);

      } catch (error) {
        console.error("AConteceu algo inesperado: " + error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [tabelaSelecionada, cookies.tipo, cookies.id, clientesRoute, contratosRoute]);

  return (
    <>
      {loading && <Loading />}
      <div id="clientes-display">
        <Navbar />
        <div id="clientes-container">
          <h1 id="clientes-titulo">Relatórios</h1>
          <label htmlFor="">Escolha a fonte de dados</label>
          <select onChange={e => setTabeleSelecionada(e.target.value)} name="" id="">
            <option value="">Selecione a fonte</option>
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
