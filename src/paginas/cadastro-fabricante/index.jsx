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
            <div className="global-container">
                <h2>Cadastro de Solução</h2>
                <p id="cadastro-fabricante-descricao">Campos com "*" são obrigatórios.</p>
                <div id="cadastro-fabricante-form-container">
                    <form id="cadastro-fabricante-form" onSubmit={handleAddProduct}>
                        <div id="cadastro-fabricante-input-labels">
                            <label htmlFor="nome"><b>Nome *</b></label>
                            <input
                                type="text"
                                id="cadastro-fabricante-input"
                                className="cadastro-fabricante-input"
                                name="nome"
                                placeholder="Digite o nome do fabricante"
                                value={nomeFabricante}
                                onChange={(e) => setNomeFabricante(e.target.value)}
                                required
                            />
                        </div>
                        <div className="cadastro-fabricante-container-btn">
                            <button id="cadastro-fabricante-btn-cancelar" className="cadastro-fabricante-btn" onClick={handleCancel}>Cancelar</button>
                            <button id="cadastro-fabricante-btn-cadastrar" className="cadastro-fabricante-btn">Adicionar fabricante</button>
                        </div>
                    </form>
                    <div id="cadastro-fabricante-container-img">
                        <img src={imgCadastroFabricante} alt="" id="cadastro-fabricante-img" />
                    </div>
                </div>
            </div>
        </div>
    );
}
