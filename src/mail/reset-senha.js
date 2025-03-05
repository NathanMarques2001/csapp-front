function MailResetSenha(hash) {
  const resetLink = `http://localhost:3000/reset-senha?hash=${hash}`;
  const emailContent = {
    "reset-senha": {
      "subject": "Resetar Senha",
      "html": `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 20px;
              }
              .container {
                background-color: #ffffff;
                border-radius: 8px;
                padding: 20px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                max-width: 600px;
                margin: 0 auto;
              }
              h2 {
                color: #333;
              }
              p {
                color: #555;
                font-size: 16px;
              }
              a {
                display: inline-block;
                background-color: #007bff;
                color: #fff;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 20px;
              }
              a:hover {
                background-color: #0056b3;
              }
              footer {
                margin-top: 20px;
                font-size: 14px;
                color: #777;
                text-align: center;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>Redefinir sua Senha</h2>
              <p>Olá, você solicitou a alteração da sua senha. Clique no link abaixo para redefinir sua senha:</p>
              <a href="${resetLink}" target="_blank">Redefinir Senha</a>
              <footer>
                <p>Se você não fez essa solicitação, ignore este e-mail.</p>
              </footer>
            </div>
          </body>
        </html>
      `,
      "text": `Olá, você solicitou a alteração da sua senha. Clique no link abaixo para redefinir sua senha: ${resetLink}`
    }
  };
  return emailContent;
}

export default MailResetSenha;
