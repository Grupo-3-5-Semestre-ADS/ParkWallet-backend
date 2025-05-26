import yup from "yup"

export default yup
  .object()
  .shape({
    amount: yup
      .number()
      .min(0.01, "Valor deve ser maior que zero")
      .max(99999.99, "Valor muito alto")
      .required("Valor é obrigatório")
  })
