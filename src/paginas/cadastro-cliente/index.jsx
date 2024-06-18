import "./style.css"
import Navbar from "../../componetes/navbar";
import imgCadastroCliente from "../../assets/images/img-cadastro-cliente.png";

export default function CadastroCliente() {
  return (
    <body className="global-display">
      <Navbar />
      <div class="global-container">
        <main class="main-content">
          <form class="form">
            <div>
              <h1>Cadastro de Cliente</h1>
              <p>Campos com <span class="required">*</span> são obrigatórios.</p>
              <div class="form-group">
                <label for="nome">Nome <span class="required">*</span></label>
                <input type="text" id="nome" required />
              </div>
              <div class="form-group">
                <label for="cpf-cnpj">CPF/CNPJ <span class="required">*</span></label>
                <input type="text" id="cpf-cnpj" required />
              </div>
              <div class="form-group">
                <label for="relacionamento">Relacionamento</label>
                <select id="relacionamento">
                  <option value="">Selecione...</option>
                  {/* <!-- Valores a serem inseridos posteriormente --> */}
                </select>
              </div>
              <div class="form-group">
                <label for="segmento">Segmento <span class="required">*</span></label>
                <input type="text" id="segmento" required />
              </div>
              <div class="form-group">
                <label for="nps">NPS</label>
                <input type="text" id="nps" />
              </div>
            </div>
            <div id="cadastro-cliente-img-div">
              <img id="cadastro-cliente-img" src={imgCadastroCliente} alt="" />
            </div>


            <div>
              <h2>Gestor de Contrato</h2>
              <div class="form-group">
                <label for="nome-contrato">Nome <span class="required">*</span></label>
                <input type="text" id="nome-contrato" required />
              </div>
              <div class="form-group">
                <label for="email-contrato">Email <span class="required">*</span></label>
                <input type="email" id="email-contrato" required />
              </div>
              <div class="form-group">
                <label for="aniversario-contrato">Aniversário</label>
                <input type="date" id="aniversario-contrato" />
              </div>
              <div class="form-group">
                <label for="telefone1-contrato">Telefone 1</label>
                <input type="text" id="telefone1-contrato" />
              </div>
              <div class="form-group">
                <label for="telefone2-contrato">Telefone 2</label>
                <input type="text" id="telefone2-contrato" />
              </div>
            </div>
            <div>
              <h2>Gestor de Chamados</h2>
              <div class="form-group">
                <label for="nome-chamados">Nome <span class="required">*</span></label>
                <input type="text" id="nome-chamados" required />
              </div>
              <div class="form-group">
                <label for="email-chamados">Email <span class="required">*</span></label>
                <input type="email" id="email-chamados" required />
              </div>
              <div class="form-group">
                <label for="aniversario-chamados">Aniversário</label>
                <input type="date" id="aniversario-chamados" />
              </div>
              <div class="form-group">
                <label for="telefone1-chamados">Telefone 1</label>
                <input type="text" id="telefone1-chamados" />
              </div>
              <div class="form-group">
                <label for="telefone2-chamados">Telefone 2</label>
                <input type="text" id="telefone2-chamados" />
              </div>
            </div>
            <div>
              <h2>Gestor Financeiro</h2>
              <div class="form-group">
                <label for="nome-financeiro">Nome <span class="required">*</span></label>
                <input type="text" id="nome-financeiro" required />
              </div>
              <div class="form-group">
                <label for="email-financeiro">Email <span class="required">*</span></label>
                <input type="email" id="email-financeiro" required />
              </div>
              <div class="form-group">
                <label for="aniversario-financeiro">Aniversário</label>
                <input type="date" id="aniversario-financeiro" />
              </div>
              <div class="form-group">
                <label for="telefone1-financeiro">Telefone 1</label>
                <input type="text" id="telefone1-financeiro" />
              </div>
              <div class="form-group">
                <label for="telefone2-financeiro">Telefone 2</label>
                <input type="text" id="telefone2-financeiro" />
              </div>
            </div>
          </form>
          <div class="form-buttons">
            <button type="button" class="cancel-button">Cancelar</button>
            <button type="submit" class="submit-button">Adicionar usuário</button>
          </div>
        </main>
      </div>
      <script src="script.js"></script>
    </body>
  );
}