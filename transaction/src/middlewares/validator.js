export default (schema) => (req, res, next) => {
  try {
    schema.validateSync(req.body, {
      abortEarly: false,
      recursive: true
    })

    next();
  } catch (err) {
    /*
    #swagger.responses[402] = {
      schema: { $ref: "#/definitions/PaymentRequired" }
    }
    */
    res.paymentRequired({
      message: err.message,
      errors: err.errors
    })
  }
}
