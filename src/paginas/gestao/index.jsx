import React, { useState } from 'react';
import Navbar from '../../componetes/navbar';
import './style.css';
import Solucoes from '../solucoes';
import Usuarios from '../usuarios';

export default function Gestao() {
    const [selectedItem, setSelectedItem] = useState('usuarios');

    const handleClick = (item) => {
        setSelectedItem(item);
    };

    return (
        <body id="global-display">
            <Navbar />
            <div id="gestao-container">
                <h1>Central de Gestão</h1>
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
                </div>

                <div>
                    {selectedItem === 'usuarios' && (
                        <Usuarios />
                    )}
                    {selectedItem === 'solucoes' && (
                        <Solucoes />
                    )}
                </div>
            </div>
        </body>
    );
}
