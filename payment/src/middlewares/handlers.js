export default (req, res, next) => {
  // Resposta padrão para 404
  res.notFoundResponse = () => {
    return res.status(404).json({ message: "Recurso não encontrado" });
  };

  // Resposta padrão para 201 Created
  res.createdResponse = () => {
    return res.status(201).json({ message: "Recurso criado com sucesso" });
  };

  // Resposta padrão para 204 No Content
  res.noContentResponse = () => {
    return res.status(204).end();
  };

  next();
}
