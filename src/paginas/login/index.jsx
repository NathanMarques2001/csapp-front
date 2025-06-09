import "./style.css";
import logo from "../../assets/images/logo.png";
import imgLogin from "../../assets/images/img-login.png";
import Auth from "../../utils/auth";
import { useState, useEffect } from "react";
import { useCookies } from 'react-cookie';
import Loading from "../../componetes/loading";
import { useNavigate } from "react-router-dom";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";

export default function Login() {
  const { instance, accounts } = useMsal();
  const isAuthenticatedWithMicrosoft = useIsAuthenticated();
  const auth = new Auth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [cookies, setCookie] = useCookies(['jwtToken', 'nomeUsuario', 'id', 'tipo']);
  const navigate = useNavigate();

  useEffect(() => {
    // Garante que só vamos agir se a conta estiver disponível
    if (isAuthenticatedWithMicrosoft && accounts[0]) {
      //setLoading(true);

      const handleBackendAuthentication = async () => {
        try {
          // 1. Pega o token da Microsoft
          const response = await instance.acquireTokenSilent({
            scopes: ["User.Read"],
            account: accounts[0],
          });

          console.log("Token obtido da Microsoft:", response);

          if (!response.idToken) {
            throw new Error("Não foi possível obter o ID Token da Microsoft.");
          }

          // 2. Envia o token para o nosso backend
          const data = await auth.loginWithMicrosoft(response.idToken);

          // 3. Se o backend respondeu com sucesso e com nosso token...
          if (data && data.token) {
            // ...reutilizamos sua lógica de cookies e navegação
            const now = new Date();
            const expireAt = new Date(now);
            expireAt.setHours(6, 0, 0, 0);
            if (now > expireAt) expireAt.setDate(expireAt.getDate() + 1);
            const expirationTime = expireAt.getTime() - now.getTime();

            setCookie('jwtToken', data.token, { maxAge: expirationTime / 1000, path: '/' });
            setCookie('nomeUsuario', data.usuario.nome, { maxAge: expirationTime / 1000, path: '/' });
            setCookie('id', data.usuario.id, { maxAge: expirationTime / 1000, path: '/' });
            setCookie('tipo', data.usuario.tipo, { maxAge: expirationTime / 1000, path: '/' });
            
            navigate("/contratos");
          } else {
            // Caso estranho onde o backend respondeu OK mas sem token
            throw new Error("Resposta do backend inválida.");
          }

        } catch (error) {
          // 4. CAPTURA QUALQUER ERRO no processo (seja no acquireToken ou na chamada ao backend)
          console.error("Falha crítica durante o handshake com o backend:", error);
          
          // AÇÃO MAIS IMPORTANTE: DESLOGAR DA MICROSOFT PARA QUEBRAR O LOOP
          instance.logoutRedirect({
            // Redireciona de volta para a pág de login com uma msg de erro
            postLogoutRedirectUri: "/" 
          });
        }
      };

      handleBackendAuthentication();
    }
  }, [isAuthenticatedWithMicrosoft, accounts, instance, navigate, setCookie, auth]);

  async function sendForm(event) {
    try {
      setLoading(true);
      event.preventDefault();
      const response = await auth.login('/usuarios/login', { email: email, senha: password });
      if (response.token) {
        const now = new Date();
        const expireAt = new Date(now);
        expireAt.setHours(6, 0, 0, 0);
        if (now > expireAt) expireAt.setDate(expireAt.getDate() + 1);
        const expirationTime = expireAt.getTime() - now.getTime();

        setCookie('jwtToken', response.token, { maxAge: expirationTime / 1000, path: '/' });
        setCookie('nomeUsuario', response.usuario.nome, { maxAge: expirationTime / 1000, path: '/' });
        setCookie('id', response.usuario.id, { maxAge: expirationTime / 1000, path: '/' });
        setCookie('tipo', response.usuario.tipo, { maxAge: expirationTime / 1000, path: '/' });
        navigate("/contratos");
      }
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || 'Erro ao fazer login.');
    } finally {
      setLoading(false);
    }
  }

  async function handleMicrosoftLogin() {
    try {
      setLoading(true);
      await instance.loginRedirect({ scopes: ["User.Read"] });
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  const resetSenha = () => navigate("/reset-senha");

  return (
    <>
      {loading && <Loading />}
      <div id="login-container">
        <div className="login-container">
          <img className="logo" src={logo} alt="logo" />
          <div className="lower-container">
            <div id="form-container">
              <h1>Bem Vindo(a)!</h1>
              <form id="form">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="login-input"
                  placeholder="Entre com o endereço de email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                <label htmlFor="password" className="form-label">Senha</label>
                <input
                  type="password"
                  className="login-input"
                  placeholder="Entre com sua senha"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button onClick={sendForm} type="submit" id="login-button">Entrar</button>
                <button type="button" onClick={handleMicrosoftLogin} id="microsoft-login-button">Entrar com Microsoft</button>
                <button type="button" onClick={resetSenha} id="reset-senha">Esqueci minha senha</button>
              </form>
            </div>
            <img className="imagem-login" src={imgLogin} alt="tela-login" />
          </div>
        </div>
      </div>
    </>
  );
}