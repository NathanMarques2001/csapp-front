import { useState } from 'react';
import './style.css';

export default function PopUpFiltro({ onFilter, closeModal }) {
  const [filters, setFilters] = useState({
    razao_social: '',
    nome_fantasia: '',
    status: '',
    valor_mensal: '',
    nome_produto: '',
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
    <div id='filter-container'>
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
        <button type="submit" id='filter-apply-button' className="filter-button">Filtrar</button>
        <button type="button" onClick={closeModal} id='filter-close-button' className="filter-button">Fechar</button>
      </form>
    </div>
  );
}
