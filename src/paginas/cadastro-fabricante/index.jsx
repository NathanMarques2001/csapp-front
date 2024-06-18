import Navbar from "../../componetes/navbar";
import "./style.css"
import imgCadastroFabricante from "../../assets/images/img-cadastro-fornecedor.png";
import Api from "../../utils/api";
import { useState } from "react";

export default function CadastroFabricante() {
    const api = new Api();
    const [nomeFabricante, setNomeFabricante] = useState("");

    const handleCancel = (e) => {
        e.preventDefault();
        window.location.href = "/gestao";
    }

    const handleAddProduct = async (e) => {
        e.preventDefault();

        const data = {
            nome: nomeFabricante,
        };

        try {
            const req = await api.post('/fabricantes', data);
            if (req.message === "Fabricante criado com sucesso!") {
                setNomeFabricante("");
                window.location.href = "/gestao";
            } else {
                alert("Erro ao cadastrar fabricante.");
            }
        } catch (err) {
            console.error("Error posting data:", err);
            alert("Erro ao cadastrar fabricante.");
        }
    }

    return (
        <div className="global-display">
            <Navbar />
            <div>
                <div>
                    <h2>Cadastro de Solução</h2>
                    <p>Campos com "*" são obrigatórios.</p>
                </div>
                <div>
                    <form onSubmit={handleAddProduct}>
                        <div>
                            <label htmlFor="nome">Nome</label>
                            <input
                                type="text"
                                id="nome"
                                name="nome"
                                value={nomeFabricante}
                                onChange={(e) => setNomeFabricante(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <button type="button" onClick={handleCancel}>Cancelar</button>
                            <button type="submit">Adicionar fabricante</button>
                        </div>
                    </form>
                    <img src={imgCadastroFabricante} alt="" />
                </div>
            </div>
        </div>
    );
}
