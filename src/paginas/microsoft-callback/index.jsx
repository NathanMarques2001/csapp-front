import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";

import Loading from "../../componetes/loading"; // Reutilizando seu componente de loading
import "./style.css"; // Vamos criar um CSS simples para ele

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation(); // Hook para acessar a URL atual
  const [, setCookie] = useCookies(["jwtToken", "nomeUsuario", "id", "tipo"]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Esta função executa assim que o componente é renderizado
    const processToken = () => {
      try {
        // 1. Pega o token da URL (ex: ?token=ey...)
        const params = new URLSearchParams(location.search);
        const token = params.get("token");

        if (!token) {
          throw new Error("Token de autenticação não encontrado.");
        }

        const decodedToken = jwtDecode(token);
        const { id, nome, tipo } = decodedToken;

        if (!id || !nome || !tipo) {
          throw new Error(
            "O token recebido é inválido ou não contém as informações necessárias.",
          );
        }

        // 3. Define a data de expiração para os cookies (mesma lógica do seu Login.js)
        const expireAt = new Date();
        // Definindo para 8 horas a partir de agora para simplificar
        expireAt.setHours(expireAt.getHours() + 8);

        // 4. Salva todas as informações nos cookies
        setCookie("jwtToken", token, { path: "/", expires: expireAt });
        setCookie("nomeUsuario", nome, { path: "/", expires: expireAt });
        setCookie("id", id, { path: "/", expires: expireAt });
        setCookie("tipo", tipo, { path: "/", expires: expireAt });

        // 5. Redireciona o usuário para a página de contratos
        // O { replace: true } impede que o usuário volte para a página de callback
        navigate("/contratos", { replace: true });
      } catch (err) {
        console.error("Erro no callback de autenticação:", err.message);
        setError(err.message);
        // Após um erro, redireciona de volta para a tela de login após alguns segundos
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 4000);
      }
    };

    processToken();
  }, [location, navigate, setCookie]);

  // Se houver um erro, exibe a mensagem de erro.
  if (error) {
    return (
      <div className="callback-container">
        <div className="callback-box">
          <h2>Erro na Autenticação</h2>
          <p className="callback-error-message">{error}</p>
          <p>Você será redirecionado para a página de login.</p>
        </div>
      </div>
    );
  }

  // Enquanto processa, exibe o seu componente de Loading
  return <Loading />;
}
