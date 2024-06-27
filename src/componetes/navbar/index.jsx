import "./style.css"
import iconeContratos from "../../assets/icons/icon-contratos.png"
import iconeUsuarios from "../../assets/icons/icon-usuarios.png"
import iconeCentralGestao from "../../assets/icons/icon-central-gestao.png"
import iconeSair from "../../assets/icons/icon-sair.png"
import logo from "../../assets/images/logo.png"
import { useCookies } from "react-cookie"
import { Link } from "react-router-dom"

export default function Navbar() {

    const [cookies, setCookie, removeCookie] = useCookies(['jwtToken', 'nomeUsuario']);

    function handleLogout() {
        removeCookie('jwtToken');
        removeCookie('nomeUsuario');
    }

    return (
        <>
        <div id="navbar-preenchimento"></div>
            <nav id='navbar-container'>
                <img src={logo} alt="logo prolinx" id="logo-img" />
                <div id="navbar-links-client">
                    <div id='navbar-links'>
                        <Link to="/contratos" className="link">
                            <img className='navbar-icon' src={iconeContratos} alt="ícone contrato" />
                            <span className='navbar-span'>Contratos</span>
                        </Link>
                        <Link to="/clientes" className="link">
                            <img className='navbar-icon' src={iconeUsuarios} alt="ícone cliente" />
                            <span className='navbar-span'>Clientes</span>
                        </Link>
                        <Link to="/gestao" className="link">
                            <img className='navbar-icon' src={iconeCentralGestao} alt="ícone gestão" />
                            <span className='navbar-span'>Gestão</span>
                        </Link>
                    </div>
                    <div id='navbar-client'>
                        <span className='navbar-span'>{cookies.nomeUsuario}</span>
                    </div>
                </div>
                <button id='navbar-btn' onClick={e => handleLogout()}>
                    <img className='navbar-icon' src={iconeSair} alt="ícone sair" />
                    <span className='navbar-span'>Sair</span>
                </button>
            </nav>
        </>
    );
}