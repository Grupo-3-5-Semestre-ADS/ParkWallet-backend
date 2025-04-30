import httpStatus from "http-status";

export default (req, res, next) => {
  res.createdResponse = (data) => {
    res.status(httpStatus.CREATED).json(data);
  }

  res.okResponse = (data) => {
    res.status(httpStatus.OK).json(data);
  }

  res.noContentResponse = () => {
    res.status(httpStatus.NO_CONTENT).send();
  }

  res.notFoundResponse = () => {
    res.status(httpStatus.NOT_FOUND).json({message: 'Not found'});
  }

  res.internalServerError = (err) => {
    /*
    #swagger.responses[500] = {
      schema: { $ref: "#/definitions/InternalServerError" }
    }
    */
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json(err);
  }

  res.paymentRequired = (err) => {
    res
      .status(httpStatus.PAYMENT_REQUIRED)
      .json(err);
  }

  res.unauthorized = () => {
    /*
    #swagger.responses[401] = {
      schema: { $ref: "#/definitions/Unauthorized" }
    }
    */
    res
      .status(httpStatus.UNAUTHORIZED)
      .send();
  }

  next();
}
