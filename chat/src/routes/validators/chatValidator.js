import yup from "yup"

export default yup
  .object()
  .shape({
    senderUserId: yup
      .number()
      .integer()
      .typeError("Must be a number (senderUserId)")
      .required("Required (senderUserId)"),
    recipientUserId: yup
      .number()
      .integer()
      .typeError("Must be a number (recipientUserId)")
      .required("Required (recipientUserId)"),
    message: yup
      .string()
      .min(1, "Message too short (message)")
      .max(5000, "Message too long (message)")
      .required("Required (message)"),
    wasRead: yup
      .boolean()
      .required("Required (wasRead)")
  })
