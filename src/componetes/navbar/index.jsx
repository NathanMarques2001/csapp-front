import "./style.css"
import { Link } from 'react-router-dom'
import iconeContratos from "../../assets/icons/icon-contratos.png"
import iconeUsuarios from "../../assets/icons/icon-usuarios.png"
import iconeCentralGestao from "../../assets/icons/icon-central-gestao.png"
import iconeSair from "../../assets/icons/icon-sair.png"
import logo from "../../assets/images/logo.png"

export default function Navbar() {
    return (
        <nav id='navbar-container'>
            <img src={logo} alt="logo prolinx" id="logo-img" />
            <div id="navbar-links-client">
                <div id='navbar-links'>
                    <Link to="/" className="link">
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
                    <img id='navbar-user-photo' src={iconeUsuarios} alt="foto do usuário" />
                    <span className='navbar-span'>Fulano da Silva</span>
                </div>
            </div>
            <button id='navbar-btn'>
                <img className='navbar-icon' src={iconeSair} alt="ícone sair" />
                <span className='navbar-span'>Sair</span>
            </button>
        </nav>
    );
}