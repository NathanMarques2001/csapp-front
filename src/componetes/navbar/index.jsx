import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaRegBell } from "react-icons/fa";
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
  const [cookies, , removeCookie] = useCookies(["jwtToken", "nomeUsuario", "id", "tipo"]);
  const [isAdminOrDev, setIsAdminOrDev] = useState(false);
  const [abrirPopup, setAbrirPopup] = useState(false);

  const navigate = useNavigate();
  const [notificacoes, setNotificacoes] = useState([]);
  const [mostrarToast, setMostrarToast] = useState(false);
  const [popupConcluir, setPopupConcluir] = useState(false);
  const [notifSelecionada, setNotifSelecionada] = useState(null);
  const api = new Api();

  // 🔄 Busca notificações do usuário logado
  async function carregarNotificacoes() {
    try {
      let response;
      if(cookies.tipo === "dev" || cookies.tipo === "admin") {
        response = await api.get("/notificacoes/ativas")
      } else {
        response = await api.get(`/notificacoes/usuario/${cookies.id}`);
      }
      setNotificacoes(response);
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
    }
  }

  useEffect(() => {
    if (cookies.id) carregarNotificacoes();
  }, [cookies.id]);

  useEffect(() => {
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

  async function confirmarNotificacao(id) {
    try {
      await api.put(`/notificacoes/${id}/confirmar`);

      toast.dismiss("notificacoes-toast"); // 🔒 fecha o toast de notificações
      toast.success("Notificação concluída com sucesso!", {
        position: "top-center",
        autoClose: 2500,
      });

      setPopupConcluir(false);
      setMostrarToast(false);
      await carregarNotificacoes(); // atualiza lista do sino
    } catch (err) {
      console.error("Erro ao concluir notificação:", err);
      toast.error("Erro ao concluir notificação.", { position: "top-center" });
    }
  }

  // ⚙️ Mostra o toast de notificações
  useEffect(() => {
    if (mostrarToast) {
      toast.dismiss("notificacoes-toast");

      toast(
        <div className="toast-notificacoes">
          <h4>🔔 Notificações</h4>
          {notificacoes.map((n) => (
            <div key={n.id} className="toast-item">
              <p>{n.descricao}</p>

              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  className="toast-link"
                  onClick={() => {
                    navigate(`/edicao-contrato/${n.id_contrato}`);
                    toast.dismiss("notificacoes-toast");
                  }}
                >
                  Ver contrato
                </button>

                <button
                  className="toast-concluir"
                  onClick={() => {
                    setNotifSelecionada(n);
                    setPopupConcluir(true);
                  }}
                >
                  Concluir
                </button>
              </div>
            </div>
          ))}

          <button
            className="toast-fechar"
            onClick={() => {
              toast.dismiss("notificacoes-toast");
              setMostrarToast(false);
            }}
          >
            Fechar
          </button>
        </div>,
        {
          toastId: "notificacoes-toast",
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

      {/* 🧩 Popup para concluir notificação */}
      {popupConcluir && notifSelecionada && (
        <Popup
          title="Concluir Notificação"
          message="Tem certeza que deseja concluir essa notificação? Essa ação é irreversível."
          onConfirm={() => confirmarNotificacao(notifSelecionada.id)}
          onCancel={() => setPopupConcluir(false)}
        />
      )}

      <ToastContainer />

      <div id="navbar-preenchimento"></div>
      <nav id="navbar-container">
        <img src={logo} alt="logo prolinx" id="logo-img" />
        <div id="navbar-links-client">
          <div id="navbar-links">
            <Link to="/clientes" className="link">
              <img className="navbar-icon" src={iconeUsuarios} alt="ícone cliente" />
              <span className="navbar-span">Clientes</span>
            </Link>
            <Link to="/contratos" className="link">
              <img className="navbar-icon" src={iconeContratos} alt="ícone contrato" />
              <span className="navbar-span">Contratos</span>
            </Link>
            {isAdminOrDev && (
              <Link to="/gestao" className="link">
                <img className="navbar-icon" src={iconeCentralGestao} alt="ícone gestão" />
                <span className="navbar-span">Gestão</span>
              </Link>
            )}
            <Link to="/relatorios" className="link">
              <img className="navbar-icon" src={iconeRelatorios} alt="ícone relatórios" />
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
                  setMostrarToast(true);
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
