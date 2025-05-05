import yup from "yup";

export default yup.object().shape({
  name: yup
    .string()
    .min(2, "Too short (name)")
    .max(50, "Too long (name)")
    .required("Required (name)"),
  description: yup
    .string()
    .max(255, "Too long (description)")
    .optional(),
  active: yup
    .boolean()
    .optional()
});
