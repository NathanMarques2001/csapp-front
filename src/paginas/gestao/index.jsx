import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../../componetes/navbar";
import "./style.css";
import Solucoes from "../solucoes";
import Usuarios from "../usuarios";
import Fabricantes from "../fabricantes";
import Segmentos from "../segmentos";
import Faturados from "../faturados";
import GruposEconomicos from "../grupos-economicos";
// Bibliotecas
// Componentes
// Estilos, funcoes, classes, imagens e etc

export default function Gestao() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const aba = queryParams.get("aba") || "grupos-economicos";

  const [selectedItem, setSelectedItem] = useState(aba);

  const handleClick = (item) => {
    setSelectedItem(item);
  };

  useEffect(() => {
    setSelectedItem(aba);
  }, [aba]);

  return (
    <body id="gestao-display">
      <Navbar />
      <div id="gestao-container">
        <h1 id="central-gestao-titulo">Central de Gestão</h1>
        <div id="central-gestao-switch-container">
          <p
            className={`switch-item ${selectedItem === "grupos-economicos" ? "active" : ""}`}
            onClick={() => handleClick("grupos-economicos")}
          >
            Grupos Econômicos
          </p>
          <p
            className={`switch-item ${selectedItem === "faturados" ? "active" : ""}`}
            onClick={() => handleClick("faturados")}
          >
            Faturista
          </p>
          <p
            className={`switch-item ${selectedItem === "fabricantes" ? "active" : ""}`}
            onClick={() => handleClick("fabricantes")}
          >
            Fornecedores
          </p>
          <p
            className={`switch-item ${selectedItem === "segmentos" ? "active" : ""}`}
            onClick={() => handleClick("segmentos")}
          >
            Segmentos
          </p>
          <p
            className={`switch-item ${selectedItem === "solucoes" ? "active" : ""}`}
            onClick={() => handleClick("solucoes")}
          >
            Soluções
          </p>
          <p
            className={`switch-item ${selectedItem === "usuarios" ? "active" : ""}`}
            onClick={() => handleClick("usuarios")}
          >
            Usuários
          </p>
        </div>

        <div>
          {selectedItem === "grupos-economicos" && <GruposEconomicos />}
          {selectedItem === "usuarios" && <Usuarios />}
          {selectedItem === "solucoes" && <Solucoes />}
          {selectedItem === "fabricantes" && <Fabricantes />}
          {selectedItem === "segmentos" && <Segmentos />}
          {selectedItem === "faturados" && <Faturados />}
        </div>
      </div>
    </body>
  );
}
