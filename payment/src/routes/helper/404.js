export default (req, res, next) => {
  res.status(404).json({
    message: "Rota não encontrada"
  });
}
