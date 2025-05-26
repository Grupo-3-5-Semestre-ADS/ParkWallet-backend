export default (req, res, next) => {
  // Permitir ordenar resultados com base em query param _order
  if (req.query._order) {
    req.orderBy = req.query._order;
  }
  next();
}
