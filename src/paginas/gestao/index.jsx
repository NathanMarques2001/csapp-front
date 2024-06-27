import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../../componetes/navbar';
import './style.css';
import Solucoes from '../solucoes';
import Usuarios from '../usuarios';
import Fabricantes from '../fabricantes';

export default function Gestao() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const aba = queryParams.get("aba") || "usuarios";

    const [selectedItem, setSelectedItem] = useState(aba);

    const handleClick = (item) => {
        setSelectedItem(item);
    };

    useEffect(() => {
        setSelectedItem(aba);
    }, [aba]);

    return (
        <body className="global-display">
            <Navbar />
            <div className="global-container">
                <h2>Central de Gestão</h2>
                <div id="switch-container">
                    <p
                        className={`switch-item ${selectedItem === 'usuarios' ? 'active' : ''}`}
                        onClick={() => handleClick('usuarios')}
                    >
                        Usuários
                    </p>
                    <p
                        className={`switch-item ${selectedItem === 'solucoes' ? 'active' : ''}`}
                        onClick={() => handleClick('solucoes')}
                    >
                        Soluções
                    </p>
                    <p
                        className={`switch-item ${selectedItem === 'fabricantes' ? 'active' : ''}`}
                        onClick={() => handleClick('fabricantes')}
                    >
                        Fornecedores
                    </p>
                </div>

                <div>
                    {selectedItem === 'usuarios' && (
                        <Usuarios />
                    )}
                    {selectedItem === 'solucoes' && (
                        <Solucoes />
                    )}
                    {selectedItem === 'fabricantes' && (
                        <Fabricantes />
                    )}
                </div>
            </div>
        </body>
    );
}
