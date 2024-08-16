import { useEffect, useState } from 'react';
import Api from '../../utils/api';
import './style.css'

export default function PopUpMigrate({ id_antigo, fechar }) {
  const [vendedores, setVendedores] = useState([]);
  const [vendedorAntigo, setVendedorAntigo] = useState({});
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
    const vendedorAntigo = event.target['vendedor-antigo'].value;
    const vendedorNovo = event.target['vendedor-novo'].value;

    try {
      await api.post('/clientes/migrate', { antigo_vendedor: vendedorAntigo, novo_vendedor: vendedorNovo });
      fechar();
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
          name='vendedor-antigo'
          value={vendedorAntigo.nome || ''}
        />
        <label htmlFor="vendedor-novo">Novo Vendedor</label>
        <select name="vendedor-novo" id="vendedor-novo">
          {vendedores.map(vendedor => (
            <option key={vendedor.id} value={vendedor.id}>{vendedor.nome}</option>
          ))}
        </select>
        <button type="submit">Migrar</button>
        <button onClick={fechar}>Fechar</button>
      </form>
    </div>
  );
}
