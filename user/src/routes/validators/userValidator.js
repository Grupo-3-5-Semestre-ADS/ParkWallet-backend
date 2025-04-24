import yup from "yup";

export default yup
  .object()
  .shape({
    name: yup
      .string()
      .min(2, "Too short (name)")
      .max(100, "Too long (name)")
      .required("Required (name)"),
    email: yup
      .string()
      .email("Invalid email format")
      .required("Required (email)"),
    cpf: yup
      .string()
      .length(11, "CPF must be 11 digits")
      .matches(/^\d+$/, "CPF must contain only digits")
      .required("Required (cpf)"),
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Za-z]/, "Password must contain letters")
      .matches(/\d/, "Password must contain numbers")
      .required("Required (password)"),
    birthdate: yup
      .string()
      .matches(/^\d{4}-\d{2}-\d{2}$/, "Birthdate must be in YYYY-MM-DD format")
      .required("Required (birthdate)"),
    inactive: yup
      .boolean()
      .optional()
  });
