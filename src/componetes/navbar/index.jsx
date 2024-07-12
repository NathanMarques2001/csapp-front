// Bibliotecas
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
// Estilos, funções, classes, imagens e etc.
import "./style.css";
import iconeContratos from "../../assets/icons/icon-contratos.png";
import iconeUsuarios from "../../assets/icons/icon-usuarios.png";
import iconeCentralGestao from "../../assets/icons/icon-central-gestao.png";
import iconeSair from "../../assets/icons/icon-sair.png";
import logo from "../../assets/images/logo.png";

export default function Navbar() {

    const [cookies, setCookie, removeCookie] = useCookies(['jwtToken', 'nomeUsuario', 'id', 'tipo']);
    const [isAdminOrDev, setIsAdminOrDev] = useState(false);

    useEffect(() => {
        // Verifica o tipo de usuário e atualiza o estado
        if (cookies.tipo === "dev" || cookies.tipo === "admin") {
            setIsAdminOrDev(true);
        } else {
            setIsAdminOrDev(false);
        }
    }, [cookies.tipo]);

    function deslogar() {
        removeCookie('jwtToken', { path: '/' });
        removeCookie('nomeUsuario', { path: '/' });
        removeCookie('id', { path: '/' });
        removeCookie('tipo', { path: '/' });
    }

    return (
        <>
            <div id="navbar-preenchimento"></div>
            <nav id='navbar-container'>
                <img src={logo} alt="logo prolinx" id="logo-img" />
                <div id="navbar-links-client">
                    <div id='navbar-links'>
                        <Link to="/clientes" className="link">
                            <img className='navbar-icon' src={iconeUsuarios} alt="ícone cliente" />
                            <span className='navbar-span'>Clientes</span>
                        </Link>
                        <Link to="/contratos" className="link">
                            <img className='navbar-icon' src={iconeContratos} alt="ícone contrato" />
                            <span className='navbar-span'>Contratos</span>
                        </Link>
                        {isAdminOrDev && (
                            <Link to="/gestao" className="link">
                                <img className='navbar-icon' src={iconeCentralGestao} alt="ícone gestão" />
                                <span className='navbar-span'>Gestão</span>
                            </Link>
                        )}
                    </div>
                    <div id='navbar-client'>
                        <span id="navbar-nomeUsuario" className='navbar-span'>{cookies.nomeUsuario}</span>
                    </div>
                </div>
                <button id='navbar-btn' onClick={deslogar}>
                    <img className='navbar-icon' src={iconeSair} alt="ícone sair" />
                    <span className='navbar-span'>Sair</span>
                </button>
            </nav>
        </>
    );
}
