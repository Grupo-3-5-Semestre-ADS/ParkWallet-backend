import { Role } from '../models/index.js';


export const showRole = async (req, res, next) => {
  /*
  #swagger.tags = ["Roles"]
  #swagger.responses[200]
  #swagger.responses[404] = {
    schema: { $ref: "#/definitions/NotFound" }
  }
  */
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id, { include: ['roles'] });
    if (!role) return res.notFoundResponse();

    res.hateoas_item(role);
  } catch (err) {
    next(err);
  }
};


export const listRoles = async (req, res, next) => {
  /*
  #swagger.tags = ["Roles"]
  #swagger.responses[200]
  */
  try {
    const roles = await Role.findAll();
    res.hateoas_list(roles);
  } catch (err) {
    next(err);
  }
};

export const createRole = async (req, res, next) => {
  /*
  #swagger.tags = ["Roles"]
  #swagger.requestBody = {
    required: true,
    schema: { name: 'admin' }
  }
  #swagger.responses[200]
  */
  try {
    const { name } = req.body;
    await Role.create({ name });
    res.createdResponse();
  } catch (err) {
    next(err);
  }
};

export const editRole = async (req, res, next) => {
  /*
  #swagger.tags = ["Roles"]
  #swagger.requestBody = {
    required: true,
    schema: { $ref: "#/definitions/CreateOrUpdateRole" }
  }
  #swagger.responses[200]
  #swagger.responses[404] = {
    schema: { $ref: "#/definitions/NotFound" }
  }
  */
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id);

    if (!role) return res.notFoundResponse();

    const { name } = req.body;

    await role.update({ name });
    res.hateoas_item(role);
  } catch (err) {
    next(err);
  }
};

export const deleteRole = async (req, res, next) => {
    /*
    #swagger.tags = ["Roles"]
    #swagger.responses[204] = {
      description: "Role deletado com sucesso"
    }
    #swagger.responses[404] = {
      description: "Role não encontrado"
    }
    */
    try {
      const { id } = req.params;
  
      // Verificar se o role existe
      const role = await Role.findByPk(id);
      if (!role) {
        return res.status(404).json({ message: "Role não encontrado" });
      }
  
      // Deletar o role
      await role.destroy();
      res.status(204).send(); // Sucesso ao deletar, sem conteúdo a retornar
    } catch (err) {
      next(err);
    }
};
