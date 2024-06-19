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
                <input type="text" id="nome" required placeholder="Digite o nome completo"/>
              </div>
              <div class="form-group">
                <label for="cpf-cnpj">CPF/CNPJ <span class="required">*</span></label>
                <input type="text" id="cpf-cnpj" required placeholder="Digite o CPF ou CNPJ"/>
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
                <input type="text" id="segmento" required placeholder="Digite o ramo do cliente"/>
              </div>
              <div class="form-group">
                <label for="nps">NPS</label>
                <input type="text" id="nps" placeholder="Digite o NPS do cliente"/>
              </div>
            </div>
            <div id="cadastro-cliente-img-div">
              <img id="cadastro-cliente-img" src={imgCadastroCliente} alt="" />
            </div>


            <div>
              <h2>Gestor de Contrato</h2>
              <div class="form-group">
                <label for="nome-contrato">Nome <span class="required">*</span></label>
                <input type="text" id="nome-contrato" required placeholder="Digite o nome completo"/>
              </div>
              <div class="form-group">
                <label for="email-contrato">Email <span class="required">*</span></label>
                <input type="email" id="email-contrato" required placeholder="Digite seu endereço de email"/>
              </div>
              <div className="date-container">
              <div class="form-group">
                <label for="aniversario-contrato">Aniversário</label>
                <input type="date" id="aniversario-contrato" />
              </div>
              <div class="form-group">
                <label for="telefone1-contrato">Telefone 1</label>
                <input type="text" id="telefone1-contrato" placeholder="Primeiro contato"/>
              </div>
              <div class="form-group">
                <label for="telefone2-contrato">Telefone 2</label>
                <input type="text" id="telefone2-contrato" placeholder="Segundo contato"/>
              </div>
              </div>
            </div>
            <div>
              <h2>Gestor de Chamados</h2>
              <div class="form-group">
                <label for="nome-chamados">Nome <span class="required">*</span></label>
                <input type="text" id="nome-chamados" required placeholder="Digite o nome completo"/>
              </div>
              <div class="form-group">
                <label for="email-chamados">Email <span class="required">*</span></label>
                <input type="email" id="email-chamados" required placeholder="Digite seu endereço de email"/>
              </div>
              <div className="date-container">
              <div class="form-group">
                <label for="aniversario-chamados">Aniversário</label>
                <input type="date" id="aniversario-chamados" />
              </div>
              <div class="form-group">
                <label for="telefone1-chamados">Telefone 1</label>
                <input type="text" id="telefone1-chamados" placeholder="Primeiro contato"/>
              </div>
              <div class="form-group">
                <label for="telefone2-chamados">Telefone 2</label>
                <input type="text" id="telefone2-chamados" placeholder="Segundo contato"/>
              </div>
              </div>
            </div>
            <div>
              <h2>Gestor Financeiro</h2>
              <div class="form-group">
                <label for="nome-financeiro">Nome <span class="required">*</span></label>
                <input type="text" id="nome-financeiro" required placeholder="Digite o nome completo"/>
              </div>
              <div class="form-group">
                <label for="email-financeiro">Email <span class="required">*</span></label>
                <input type="email" id="email-financeiro" required placeholder="Digite seu endereço de email"/>
              </div>
              <div className="date-container">
              <div class="form-group">
                <label for="aniversario-financeiro">Aniversário</label>
                <input type="date" id="aniversario-financeiro" />
              </div>
              <div class="form-group">
                <label for="telefone1-financeiro">Telefone 1</label>
                <input type="text" id="telefone1-financeiro" placeholder="Primeiro contato"/>
              </div>
              <div class="form-group">
                <label for="telefone2-financeiro">Telefone 2</label>
                <input type="text" id="telefone2-financeiro" placeholder="Segundo contato"/>
              </div>
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