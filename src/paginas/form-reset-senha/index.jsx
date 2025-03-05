import { useState, useEffect } from 'react';
import './style.css';
import Email from '../../utils/email';
import Api from '../../utils/api';
import MailResetSenha from '../../mail/reset-senha';

export default function ResetSenha() {
  const emailService = new Email();
  const api = new Api();
  const [email, setEmail] = useState('');
  const [hash, setHash] = useState(null);  // Para armazenar a hash
  const [password, setPassword] = useState('');  // Para armazenar a nova senha
  const [confirmPassword, setConfirmPassword] = useState('');  // Para confirmar a senha

  useEffect(() => {
    // Verifica o parâmetro hash na URL
    const urlParams = new URLSearchParams(window.location.search);
    const hashParam = urlParams.get('hash');
    if (hashParam) {
      setHash(hashParam);  // Se o hash estiver presente, armazena-o no estado
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (hash) {
      // Se há hash, trata-se de redefinir a senha
      if (password !== confirmPassword) {
        alert("As senhas não coincidem.");
        return;
      }

      try {
        // Enviar a nova senha e o hash para a API
        const res = await api.post('/reset-senha/reset', { hash: hash, senha: password });

        alert(res.message);
      } catch (error) {
        console.error(error);
        alert(`Erro ao redefinir a senha! ${error}`);
      }
    } else {
      // Caso contrário, envia o e-mail de redefinição de senha
      try {
        const res = await api.post('/reset-senha', { email: email });

        if (!res || !res.resetSenha || !res.resetSenha.hash) {
          throw new Error('Erro ao recuperar a hash de redefinição');
        }

        const hash = res.resetSenha.hash;

        const mailReset = MailResetSenha(hash);

        const emailData = {
          to: email,
          subject: mailReset['reset-senha'].subject,
          text: mailReset['reset-senha'].text,
          html: mailReset['reset-senha'].html,
        };

        await emailService.sendEmail({ to: emailData.to, subject: emailData.subject, text: emailData.text, html: emailData.html });
        alert('E-mail enviado com sucesso!');

        setEmail('');
      } catch (error) {
        console.error(error);
        alert(`Erro ao enviar e-mail! ${error}`);
      }
    }
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  return (
    <div id="reset-senha-container">
      <h1 id="reset-senha-titulo">Resetar Senha</h1>

      {hash ? (
        <div>
          <h2>Redefinir sua senha</h2>
          <form id="reset-senha-form" onSubmit={handleSubmit}>
            <label htmlFor="password">Nova Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
            <label htmlFor="confirm-password">Confirmar Senha</label>
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
            />
            <button type="submit">Redefinir Senha</button>
          </form>
        </div>
      ) : (
        <form id="reset-senha-form" onSubmit={handleSubmit}>
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
          <button type="submit">Enviar</button>
        </form>
      )}
    </div>
  );
}
