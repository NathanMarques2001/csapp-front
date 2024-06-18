import "./style.css"
import logo from "../../assets/images/logo.png"
import imgLogin from "../../assets/images/img-login.png"
import Auth from "../../utils/auth";
import { useState } from "react";
import { useCookies } from 'react-cookie';

export default function Login() {
  const auth = new Auth();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [cookies, setCookie] = useCookies(['jwtToken', 'nomeUsuario']);

  async function sendForm(event) {
    event.preventDefault()
    const response = await auth.login('/usuarios/login', { email: email, senha: password });
    if (response.token !== '') {
      setCookie('jwtToken', response.token);
      setCookie('nomeUsuario', response.usuario.nome);
      window.location.href = "/contratos";
    }
  }

  return (
    <body id="login-container">

      <div class="login-container">
        <img class="logo" src={logo} alt="logo" />
        <div class="lower-container">
          <div id="form-container">
            <h1>Bem Vindo(a)!</h1>
            <form id="form">
              <label for="email" className="form-label">Email</label>
              <input
                type="email"
                className="login-input"
                placeholder="Entre com o endereço de email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <label for="password" className="form-label">Senha</label>
              <input
                type="password"
                className="login-input"
                placeholder="Entre com sua senha"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button onClick={e => sendForm(e)} id="login-button">Entrar</button>
            </form>
          </div>

          <img class="imagem-login" src={imgLogin} alt="tela-login" />

        </div>
      </div>

    </body>
  );
}