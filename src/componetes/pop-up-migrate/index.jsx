import { useEffect, useState } from 'react';
import Api from '../../utils/api';
import 'style.css'

export default function PopUpMigrate() {
  const [vendedores, setVendedores] = useState([]);
  const api = new Api();

  useEffect(() => {
    const response = api.get('/usuarios');
    setVendedores(response);
  }, []);
  return (
    <div>
      <form action="">
        <p>Migrar Clientes</p>
        <label htmlFor="vendedor-antigo">Vendedor Antigo</label>
        <input type="text" disabled name='vendedor-antigo'/>
      </form>
    </div>
  );
}