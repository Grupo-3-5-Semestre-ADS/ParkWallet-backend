import yup from "yup"

export default yup
  .object()
  .shape({
    userId: yup
      .number()
      .integer()
      .typeError("Must be a number (userId)")
      .required("Required (userId)"),
    text: yup
      .string()
      .min(4, "Message too short (text)")
      .required("Required (text)"),
    receivedByTheUser: yup
      .boolean
      .required("Required (receivedByTheUser)")
  })
