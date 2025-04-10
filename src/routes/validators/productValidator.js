import yup from "yup"

export default yup
    .object()
    .shape({
        name: yup
            .string()
            .min(2, "Too short (name)")
            .max(40, "Too long (name)")
            .required("Required (name)"),
        description: yup
            .string()
            .min(10, "Too short (description)")
            .max(100, "Too long (description)")
            .required("Required (description)"),
        price: yup
            .string()
            .required("Required (price)"),
})
