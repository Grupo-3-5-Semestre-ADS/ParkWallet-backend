import yup from "yup"

export default yup
  .object()
  .shape({
    userId: yup
      .number()
      .integer()
      .typeError("Must be a number (userId)")
      .required("Required (userId)"),
    totalValue: yup
      .string()
      .min(0, "Negative not allowed (totalValue)")
      .max(99999999.99, "Too high (totalValue)")
      .required("Required (totalValue)"),
    operation: yup
      .string()
      .oneOf(["purchase", "credit"],
        "Invalid operation (must be 'purchase' or 'credit')")
      .required("Required (operation)"),
    active: yup
      .boolean()
      .optional()
  })
