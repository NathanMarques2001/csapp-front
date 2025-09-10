export default function formataTipoUsuario(tipo) {
  if (tipo == "dev") {
    return "Desenvolvedor";
  } else if (tipo == "admin") {
    return "Superadministrador";
  } else if (tipo == "usuario") {
    return "Administrador";
  } else if (tipo == "vendedor") {
    return "Usuário";
  }
  return "Usuário";
}
