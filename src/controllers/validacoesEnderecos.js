export const validarCampo = (campo, valor) => {
  switch (campo) {
    case "tipo":     return !valor.trim() ? "Tipo obrigatório." : valor.length > 40 ? "Máx. 40 caracteres." : "";
    case "nome":     return valor.length > 80 ? "Máx. 80 caracteres." : (/[0-9]/.test(valor) ? "Nome não pode ter números." : "");
    case "rua":      return !valor.trim() ? "Rua obrigatória." : valor.length > 100 ? "Máx. 100 caracteres." : "";
    case "numero":   return !valor.trim() ? "Número obrigatório." : valor.length > 10 ? "Máx. 10 caracteres." : "";
    case "bairro":   return !valor.trim() ? "Bairro obrigatório." : valor.length > 60 ? "Máx. 60 caracteres." : "";
    case "cidade":   return !valor.trim() ? "Cidade obrigatória." : valor.length > 60 ? "Máx. 60 caracteres." : (/[0-9]/.test(valor) ? "Cidade não pode ter números." : "");
    case "uf":       return !valor.trim() ? "UF obrigatória." : "";
    case "telefone": return valor && valor.replace(/\D/g, "").length < 10 ? "Telefone inválido." : "";
    default: return "";
  }
};

export const validarTudo = (form) => {
  const erros = {};
  Object.keys(form).forEach((c) => {
    if (c !== "id") erros[c] = validarCampo(c, form[c]);
  });
  return erros;
};

export const temErros = (erros) => Object.values(erros).some((e) => e);

export const formatarTelefone = (valor) => {
  const nums = valor.replace(/\D/g, "").slice(0, 11);
  if (nums.length <= 10) return nums.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").trim();
  return nums.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").trim();
};