import httpStatus from "http-status";

export default (req, res, next) => {
  /*
  #swagger.ignore = true
   */
  res.hateoas_item = (data) => {
    /*
    #swagger.ignore = true
    */
    res.okResponse({
      ...data.toJSON(),
      _links: generateHateoasLinks(req, data.id),
    });
  }

  res.hateoas_list = (data, totalPages = 1) => {
    res.okResponse(generateHateoasCollection(req, data, totalPages));
  }

  next();
}

const generateHateoasLinks = (req, id) => {
  return [
    {
      rel: "self",
      href: `${req.baseUrl}/${id}`,
      method: 'GET',
    },
    {
      rel: "list",
      href: req.baseUrl,
      method: 'GET',
    },
    {
      rel: "update",
      href: `${req.baseUrl}/${id}`,
      method: 'PUT',
    },
    {
      rel: "delete",
      href: `${req.baseUrl}/${id}`,
      method: 'DELETE',
    },
  ];
};

const generateHateoasCollection = (req, items, totalPages) => {
  const {_page, _size} = req.query;
  const page = parseInt(_page) || 1;
  const size = parseInt(_size) || 10;

  return {
    _page: {
      current: page,
      total: totalPages,
      size: items.length,
    },
    _links: [
      {
        rel: "self",
        href: req.baseUrl,
        method: 'GET',
      },
      {
        rel: "create",
        href: req.baseUrl,
        method: 'POST',
      },
      {
        rel: "previous",
        href: page > 1 ? `${req.baseUrl}?_page=${page - 1}&_size=${size}` : null,
        method: 'GET',
      },
      {
        rel: "next",
        href: page < totalPages ? `${req.baseUrl}?_page=${page + 1}&_size=${size}` : null,
        method: 'GET',
      },
    ],
    data: items.map(item => ({
      ...item.toJSON(),
      _links: generateHateoasLinks(req, item.id),
    })),
  };
};
