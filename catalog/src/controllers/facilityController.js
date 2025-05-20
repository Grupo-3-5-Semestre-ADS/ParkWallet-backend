import {Facility, Product} from "../models/index.js";
import axios from "axios";

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
    const where = activesOnly === "true" ? {active: true} : {};

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

export const listTransactionsByFacility = async (req, res, next) => {
  /*
  #swagger.tags = ["Facilities"]
  #swagger.responses[200]
  #swagger.responses[404] = {
    schema: { $ref: "#/definitions/NotFound" }
  }
  */
  try {
    const {_page = "1", _size = "10"} = req.query;
    const {id} = req.params;

    const facility = await Facility.findByPk(id, {
      include: [{
        model: Product,
        as: 'products',
      }]
    });

    if (!facility) {
      return res.notFoundResponse();
    }

    if (!facility.products || facility.products.length === 0) {
      return res.hateoas_list([], 0);
    }

    const productMap = new Map();
    facility.products.forEach(product => {
      productMap.set(product.id, product.toJSON());
    });

    const productIds = facility.products.map(product => product.id);

    const transactionServiceBaseUrl = `http://${process.env.GATEWAY_HOST}:${process.env.GATEWAY_PORT}`;
    const transactionsEndpoint = `${transactionServiceBaseUrl}/api/transactions/by-products`;

    const params = {
      productIds: productIds.join(','),
      _page,
      _size,
    };

    const transactionServiceResponse = await axios.get(transactionsEndpoint, {params});
    const transactionData = transactionServiceResponse.data;

    if (!transactionData || !Array.isArray(transactionData.data) || transactionData.data.length === 0) {
      return res.hateoas_list([], 0);
    }

    transactionData.data = await Promise.all(transactionData.data.map(async transaction => {
      const enrichedItems = await Promise.all(transaction.itemsTransaction.map(async item => {
        let productDetails = productMap.get(item.productId);

        if (!productDetails) {
          const foundProduct = await Product.findByPk(item.productId);
          productDetails = foundProduct ? foundProduct.toJSON() : null;
          if (productDetails) {
            productMap.set(item.productId, productDetails);
          }
        }

        return {
          ...item,
          product: productDetails
        };
      }));

      return {
        ...transaction,
        itemsTransaction: enrichedItems
      };
    }));

    return res.okResponse(transactionData);
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
      active: true
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
      active: !facility.active,
    });

    res.okResponse();
  } catch (err) {
    next(err);
  }
};
