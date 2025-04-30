import yup from "yup"

export default yup
  .object()
  .shape({
    name: yup
      .string()
      .min(2, "Too short (name)")
      .max(200, "Too long (name)")
      .required("Required (name)"),
    description: yup
      .string()
      .min(10, "Too short (description)")
      .max(2000, "Too long (description)")
      .required("Required (description)"),
    type: yup
      .string()
      .oneOf(["store", "attraction", "other"],
        "Invalid type (must be 'store', 'attraction' or 'other')")
      .required("Required (type)"),
    latitude: yup
      .number()
      .typeError("Must be a number (latitude)")
      .min(-90, "Invalid latitude (min is -90)")
      .max(90, "Invalid latitude (max is 90)")
      .required("Required (latitude)"),
    longitude: yup
      .number()
      .typeError("Must be a number (longitude)")
      .min(-180, "Invalid longitude (min is -180)")
      .max(180, "Invalid longitude (max is 180)")
      .required("Required (longitude)")
  })
