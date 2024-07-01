import { useState } from 'react';
import './style.css';

export default function PopUpFiltro({ onFilter }) {
  const [filters, setFilters] = useState({
    id_cliente: '',
    id_produto: '',
    faturado: '',
    dia_vencimento: '',
    indice_reajuste: '',
    proximo_reajuste: '',
    status: '',
    duracao: '',
    valor_mensal: '',
    quantidade: '',
    email_envio: '',
    descricao: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  return (
    <form onSubmit={handleSubmit} className="filter-form">
      {Object.keys(filters).map((filterKey) => (
        <div className="form-group" key={filterKey}>
          <label>{filterKey.replace(/_/g, ' ')}:</label>
          <input
            type="text"
            name={filterKey}
            value={filters[filterKey]}
            onChange={handleChange}
          />
        </div>
      ))}
      <button type="submit" className="filter-button">Filtrar</button>
    </form>
  );
}
