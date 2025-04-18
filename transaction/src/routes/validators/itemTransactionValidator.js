import yup from "yup"

export default yup
  .object()
  .shape({
    productId: yup
      .number()
      .integer()
      .typeError("Must be a number (productId)")
      .required("Required (productId)"),
    quantity: yup
      .number()
      .integer()
      .min(0, "Negative not allowed (quantity)")
      .max(100000, "Too high (quantity)")
      .required("Required (quantity)"),
    totalValue: yup
      .number()
      .typeError("Must be a number (totalValue)")
      .min(0, "Negative not allowed (totalValue)")
      .max(99999999.99, "Too high (totalValue)")
      .required("Required (totalValue)")
  })
