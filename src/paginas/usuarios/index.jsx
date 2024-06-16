import { useEffect, useState } from "react";
import "./style.css";
import Api from "../../utils/api";

export default function Usuarios() {
    const api = new Api("http://localhost:8080");
    const [response, setResponse] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await api.get('/usuarios');
                setResponse(data);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
        fetchData();
    }, []);

    const totalUsuarios = response && response.usuarios ? response.usuarios.length : 0;

    return (
        <div>
            <h2>USUÁRIOS ({totalUsuarios})</h2>
            <input type="text" />
            <button>Adicionar Usuário</button>
            {response && response.usuarios ? (
                <table>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Função</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {response.usuarios.map(usuario => (
                            <tr key={usuario.id}>
                                <td>{usuario.nome}</td>
                                <td>{usuario.tipo}</td>
                                <td>{usuario.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Carregando...</p>
            )}
        </div>
    );
}
