const usersService = require('../services/UsersService');

class UsersController {

  async getAll(req, res, next) {
    try {
      const users = await usersService.getAllUsers();
      res.json(users);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const user = await usersService.getUserById(req.params.id);
      res.json(user);
    } catch (err) {
      next(err);
    }
  }

  async createAuditor(req, res, next) {
  try {
    const user = await usersService.createAuditor(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}


  async update(req, res, next) {
    try {
      const user = await usersService.updateUser(req.params.id, req.body);
      res.json(user);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      await usersService.deleteUser(req.params.id);
      res.json({ message: 'Usuario eliminado correctamente' });
    } catch (err) {
      next(err);
    }
  }

}

module.exports = new UsersController();
