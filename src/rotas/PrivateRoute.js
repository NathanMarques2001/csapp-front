import React from 'react';
import { useCookies } from 'react-cookie';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ allowedRoles }) => {
    const [cookies] = useCookies(['jwtToken', 'tipo']);
    const isLoggedIn = !!cookies.jwtToken;
    const userRole = cookies.tipo;

    // 1. O usuário está logado?
    if (!isLoggedIn) {
        // Se não, redireciona para a página de login
        return <Navigate to="/login" replace />;
    }

    // 2. A rota exige uma permissão específica (role)?
    // E o usuário tem essa permissão?
    if (allowedRoles && !allowedRoles.includes(userRole)) {
        // Se o usuário não tem a permissão, redireciona para uma página "não autorizado"
        // ou de volta para a página principal (ex: /contratos)
        return <Navigate to="/contratos" replace />;
    }

    // 3. Se tudo estiver certo, renderiza a página que a rota protege
    return <Outlet />;
};

export default PrivateRoute;