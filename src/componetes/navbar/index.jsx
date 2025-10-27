// Bibliotecas
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaRegBell } from "react-icons/fa";
// Estilos, funções, classes, imagens e etc.
import "./style.css";
import iconeContratos from "../../assets/icons/icon-contratos.png";
import iconeUsuarios from "../../assets/icons/icon-usuarios.png";
import iconeCentralGestao from "../../assets/icons/icon-central-gestao.png";
import iconeSair from "../../assets/icons/icon-sair.png";
import iconeRelatorios from "../../assets/icons/icon-relatorios.png";
import logo from "../../assets/images/logo.png";
import Popup from "../pop-up";
import Api from "../../utils/api";

export default function Navbar() {
  // PODE NAO FAZER SENTIDO, MAS NAO MEXA
  const [cookies, , removeCookie] = useCookies([
    "jwtToken",
    "nomeUsuario",
    "id",
    "tipo",
  ]);
  const [isAdminOrDev, setIsAdminOrDev] = useState(false);
  const [abrirPopup, setAbrirPopup] = useState(false);

  const navigate = useNavigate();
  const [notificacoes, setNotificacoes] = useState([]);
  const [mostrarToast, setMostrarToast] = useState(false);
  const api = new Api();

  useEffect(() => {
    async function carregarNotificacoes() {
      try {
        const response = await api.get(`/notificacoes/usuario/${cookies.id}`);
        console.log(response)
        setNotificacoes(response);
      } catch (error) {
        console.error("Erro ao buscar notificações:", error);
      }
    }

    if (cookies.id) carregarNotificacoes();
  }, [cookies.id]);


  useEffect(() => {
    // Verifica o tipo de usuário e atualiza o estado
    if (cookies.tipo === "dev" || cookies.tipo === "admin") {
      setIsAdminOrDev(true);
    } else {
      setIsAdminOrDev(false);
    }
  }, [cookies.tipo]);

  function deslogar() {
    removeCookie("jwtToken", { path: "/" });
    removeCookie("nomeUsuario", { path: "/" });
    removeCookie("id", { path: "/" });
    removeCookie("tipo", { path: "/" });
    setAbrirPopup(false);
  }

  useEffect(() => {
    if (mostrarToast) {
      toast.dismiss("notificacoes-toast"); // 🔒 evita duplicar toasts
      toast(
        <div className="toast-notificacoes">
          <h4>🔔 Notificações</h4>
          {notificacoes.map((n) => (
            <div key={n.id} className="toast-item">
              <p>{n.descricao}</p>
              <button
                className="toast-link"
                onClick={() => {
                  navigate(`/edicao-contrato/${n.id_contrato}`);
                  toast.dismiss("notificacoes-toast"); // fecha o toast ao clicar
                }}
              >
                Ver contrato
              </button>
            </div>
          ))}
          <button
            className="toast-fechar"
            onClick={() => {
              toast.dismiss("notificacoes-toast"); // fecha o toast visualmente
              setMostrarToast(false); // reseta o estado no React
            }}
          >
            Fechar
          </button>

        </div>,
        {
          toastId: "notificacoes-toast", // ✅ único
          position: "top-right",
          autoClose: false,
          hideProgressBar: true,
          closeOnClick: false,
          draggable: false,
          pauseOnHover: true,
          theme: "dark",
          style: {
            background: "transparent",
            boxShadow: "none",
          },
        }
      );
    }
  }, [mostrarToast, notificacoes, navigate]);


  return (
    <>
      {abrirPopup && (
        <Popup
          title="Deslogar"
          message="Tem certeza que deseja sair?"
          onConfirm={deslogar}
          onCancel={() => setAbrirPopup(false)}
        />
      )}

      <ToastContainer />

      <div id="navbar-preenchimento"></div>
      <nav id="navbar-container">
        <img src={logo} alt="logo prolinx" id="logo-img" />
        <div id="navbar-links-client">
          <div id="navbar-links">
            <Link to="/clientes" className="link">
              <img
                className="navbar-icon"
                src={iconeUsuarios}
                alt="ícone cliente"
              />
              <span className="navbar-span">Clientes</span>
            </Link>
            <Link to="/contratos" className="link">
              <img
                className="navbar-icon"
                src={iconeContratos}
                alt="ícone contrato"
              />
              <span className="navbar-span">Contratos</span>
            </Link>
            {isAdminOrDev && (
              <Link to="/gestao" className="link">
                <img
                  className="navbar-icon"
                  src={iconeCentralGestao}
                  alt="ícone gestão"
                />
                <span className="navbar-span">Gestão</span>
              </Link>
            )}
            <Link to="/relatorios" className="link">
              <img
                className="navbar-icon"
                src={iconeRelatorios}
                alt="ícone relatórios"
              />
              <span className="navbar-span">Relatórios</span>
            </Link>
          </div>
          <div id="navbar-client">
            <span id="navbar-nomeUsuario" className="navbar-span">
              {cookies.nomeUsuario}
            </span>

            <button
              id="navbar-btn-notificacoes"
              onClick={() => {
                if (notificacoes.length === 0) {
                  toast.info("Nenhuma notificação pendente 😊", { position: "top-center" });
                } else {
                  setMostrarToast(true); // dispara o useEffect só uma vez
                }
              }}
            >
              <FaRegBell color="white" />
              {notificacoes.length > 0 && (
                <span className="badge-notificacoes">{notificacoes.length}</span>
              )}
            </button>

          </div>

        </div>
        <button id="navbar-btn" onClick={() => setAbrirPopup(true)}>
          <img className="navbar-icon" src={iconeSair} alt="ícone sair" />
          <span className="navbar-span">Sair</span>
        </button>
      </nav>
    </>
  );
}
