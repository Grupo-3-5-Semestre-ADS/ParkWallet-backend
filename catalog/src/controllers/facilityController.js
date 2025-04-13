import Facility from "../models/facilityModel.js";

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
    const {_page = 1, _size = 10, _order = 'id', ...filter} = req.query;
    const offset = (_page - 1) * _size;

    const {rows: Facilities, count: totalItems} = await Facility.findAndCountAll({
      where: filter,
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

    await Facility.create({
      name,
      description,
      type,
      latitude,
      longitude
    });

    res.createdResponse();
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

export const deleteFacility = async (req, res, next) => {
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

    await facility.destroy();

    res.noContentResponse();
  } catch (err) {
    next(err);
  }
};
