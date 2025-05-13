import yup from "yup"

export default yup
  .object()
  .shape({
    value: yup
      .number()
      .min(-99999999.99, "Too low (value)")
      .max(99999999.99, "Too high (value)")
      .required("Required (balance)")
  })
