import yup from "yup";

const productValidator = yup.object().shape({
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
});

export default yup.object().shape({
    products: yup.array().of(productValidator).min(1, "Product list cannot be empty")
});
