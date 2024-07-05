import "./style.css"
import logo from "../../assets/images/logo.png"
import imgLogin from "../../assets/images/img-login.png"
import Auth from "../../utils/auth";
import { useState } from "react";
import { useCookies } from 'react-cookie';
import Loading from "../../componetes/loading";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const auth = new Auth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [cookies, setCookie] = useCookies(['jwtToken', 'nomeUsuario']);
  const navigate = useNavigate();

  async function sendForm(event) {
    try {
      setLoading(true);
      event.preventDefault();

      const now = new Date();
      const expireAt = new Date(now);
      expireAt.setHours(6, 0, 0, 0); // Define a expiração para as 6h da manhã

      if (now > expireAt) {
        expireAt.setDate(expireAt.getDate() + 1); // Se já passou das 6h, define para o próximo dia
      }

      const expirationTime = expireAt.getTime() - now.getTime(); // Calcula o tempo restante em milissegundos

      const response = await auth.login('/usuarios/login', { email: email, senha: password });
      if (response.token !== '') {
        setCookie('jwtToken', response.token, { maxAge: expirationTime / 1000 }); // Define o token com 6 horas de expiração
        setCookie('nomeUsuario', response.usuario.nome, { maxAge: expirationTime / 1000 }); // Define o nome do usuário com 6 horas de expiração
        navigate("/contratos");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {loading && <Loading />}
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
    </>
  );
}