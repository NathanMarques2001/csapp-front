import './style.css';
import imgCadastroUsuarios from '../../assets/images/img-cadastro-usuario.png';

export default function FormUsuario({ mode = "cadastro" }) {
  return (
    <div>
      <h2>Formulário de Usuários</h2>
      <p>Campos com "*" são obrigatórios.</p>
      <div>
        <form>
          <label htmlFor="nome">Nome <span>*</span></label>
          <input type="text" name='nome' />
          <label htmlFor="email">Email <span>*</span></label>
          <input type="email" name='email' />
          <label htmlFor="tipo-usuario">Tipo de usuário <span>*</span></label>
          <select name="tipo-usuario">
            <option value="s/ tipo"></option>
            <option value="Admin">Administrador</option>
            <option value="Usuario">Usuário comum</option>
          </select>
          <label htmlFor="senha">Senha <span>*</span></label>
          <input type="password" name='senha' />
          <label htmlFor="confirmar-senha">Confirmar senha <span>*</span></label>
          <input type="password" name='confirmar-senha' />
          <p>A senha do usuário será redefinida em seu primeiro acesso.</p>
          <div>
            <button>Cancelar</button><button>Adicionar usuário</button>
          </div>
        </form>
        <div>
          <img src={imgCadastroUsuarios} alt="" />
        </div>
      </div>
    </div>
  );
}