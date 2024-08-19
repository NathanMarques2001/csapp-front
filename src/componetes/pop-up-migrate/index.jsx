import { useEffect, useState } from 'react';
import Api from '../../utils/api';
import './style.css';

export default function PopUpMigrate({ id_antigo, fechar, reload }) {
  const [vendedores, setVendedores] = useState([]);
  const [vendedorAntigo, setVendedorAntigo] = useState({});
  const [novoVendedor, setNovoVendedor] = useState(null);
  const api = new Api();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usuariosResponse = await api.get('/usuarios');
        setVendedores(usuariosResponse.usuarios);

        const vendedorAntigoResponse = await api.get(`/usuarios/${id_antigo}`);
        setVendedorAntigo(vendedorAntigoResponse.usuario);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [id_antigo]);

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await api.put('/clientes/migrate', {
        antigo_vendedor: vendedorAntigo.id,
        novo_vendedor: novoVendedor
      });
      if (response.message === 'Migração de clientes realizada com sucesso!') {
        await api.delete(`/usuarios/${vendedorAntigo.id}`);
        fechar();
        reload();
      }
    } catch (err) {
      console.error("Error migrating clients:", err);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <p>Migrar Clientes</p>
        <label htmlFor="vendedor-antigo">Vendedor Antigo</label>
        <input
          type="text"
          disabled
          name="vendedor-antigo"
          value={vendedorAntigo.nome || ''}
        />
        <label htmlFor="vendedor-novo">Novo Vendedor</label>
        <select onChange={e => setNovoVendedor(e.target.value)} name="vendedor-novo" id="vendedor-novo">
          {vendedores.map(vendedor => (
            vendedor.id !== vendedorAntigo.id && (
              <option key={vendedor.id} value={vendedor.id}>{vendedor.nome}</option>
            )
          ))}
        </select>
        <button type="submit">Migrar</button>
        <button type="button" onClick={fechar}>Fechar</button>
      </form>
    </div>
  );
}
