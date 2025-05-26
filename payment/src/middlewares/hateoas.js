export default (req, res, next) => {
  // Extensão para retornar um único item com links HATEOAS
  res.hateoas_item = (item) => {
    return res.status(200).json(item);
  };

  // Extensão para retornar uma lista com paginação e links HATEOAS
  res.hateoas_list = (items, totalPages = 1) => {
    const currentPage = parseInt(req.query._page || "1");
    const size = parseInt(req.query._size || "10");
    
    return res.status(200).json({
      data: items,
      pagination: {
        currentPage,
        totalPages,
        size
      }
    });
  };

  next();
}
