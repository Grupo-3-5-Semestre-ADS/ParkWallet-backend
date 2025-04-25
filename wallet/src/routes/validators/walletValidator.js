import yup from "yup"

export default yup
  .object()
  .shape({
    userId: yup
      .number()
      .integer()
      .typeError("Must be a number (userId)")
      .required("Required (userId)"),
    balance: yup
      .number()
      .min(0, "Negative not allowed (balance)")
      .max(99999999.99, "Too high (balance)")
      .required("Required (balance)")
  })
