import {Facility} from "../models/index.js";

export const showFacility = async (req, res, next) => {
  /*
  #swagger.tags = ["Facilities"]
  #swagger.responses[200]
  #swagger.responses[404] = {
    schema: { $ref: "#/definitions/NotFound" }
  }
  */
  try {
    const {id} = req.params;

    const facility = await Facility.findByPk(id);

    if (!facility) {
      return res.notFoundResponse();
    }

    res.hateoas_item(facility);
  } catch (err) {
    next(err);
  }
};

export const listFacilities = async (req, res, next) => {
  /*
  #swagger.tags = ["Facilities"]
  #swagger.responses[200]
  */
  try {
    const {_page = "1", _size = "10", _order = 'id', activesOnly = "false"} = req.query;
    const offset = (parseInt(_page) - 1) * _size;
    const where = activesOnly === "true" ? {inactive: false} : {};

    const {rows: Facilities, count: totalItems} = await Facility.findAndCountAll({
      where,
      offset,
      limit: parseInt(_size),
      order: [[_order, 'ASC']],
    });

    const totalPages = Math.ceil(totalItems / _size);
    res.hateoas_list(Facilities, totalPages);
  } catch (err) {
    next(err);
  }
};

export const listProductsByFacility = async (req, res, next) => {
  /*
  #swagger.tags = ["Facilities"]
  #swagger.responses[200]
  #swagger.responses[404] = {
    schema: { $ref: "#/definitions/NotFound" }
  }
  */
  try {
    const {id} = req.params;

    const facility = await Facility.findByPk(id);

    if (!facility) {
      return res.notFoundResponse();
    }

    const products = await facility.getProducts();

    res.hateoas_list(products);
  } catch (err) {
    next(err);
  }
};

export const createFacility = async (req, res, next) => {
  /*
  #swagger.tags = ["Facilities"]
  #swagger.requestBody = {
    required: true,
    schema: { $ref: "#/definitions/CreateOrUpdateFacility" }
  }
  #swagger.responses[200]
  */
  try {
    const {name, description, type, latitude, longitude} = req.body;

    const createdFacility = await Facility.create({
      name,
      description,
      type,
      latitude,
      longitude,
      inactive: false
    });

    res.createdResponse(createdFacility);
  } catch (err) {
    next(err);
  }
};

export const editFacility = async (req, res, next) => {
  /*
  #swagger.tags = ["Facilities"]
  #swagger.requestBody = {
    required: true,
    schema: { $ref: "#/definitions/CreateOrUpdateFacility" }
  }
  #swagger.responses[200]
  #swagger.responses[404] = {
    schema: { $ref: "#/definitions/NotFound" }
  }
  */
  try {
    const {name, description, type, latitude, longitude} = req.body;
    const {id} = req.params;

    const facility = await Facility.findByPk(id);

    if (!facility) {
      return res.notFoundResponse();
    }

    await facility.update({
      name,
      description,
      type,
      latitude,
      longitude
    });

    res.hateoas_item(facility);
  } catch (err) {
    next(err);
  }
};

export const toggleFacilityStatus = async (req, res, next) => {
  /*
  #swagger.tags = ["Facilities"]
  #swagger.responses[204]
  #swagger.responses[404] = {
    schema: { $ref: "#/definitions/NotFound" }
  }
  */
  try {
    const {id} = req.params;

    const facility = await Facility.findByPk(id);

    if (!facility) {
      return res.notFoundResponse();
    }

    await facility.update({
      inactive: !facility.inactive,
    });

    res.okResponse();
  } catch (err) {
    next(err);
  }
};
