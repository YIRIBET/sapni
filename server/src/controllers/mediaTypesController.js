const mediaTypesService = require('../services/MediaTypesService');

class MediaTypesController {

  async getAll(req, res, next) {
    try {
      const data = await mediaTypesService.getAll();
      res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const data = await mediaTypesService.getById(req.params.id);
      res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const data = await mediaTypesService.create(req.body);
      res.status(201).json(data);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const data = await mediaTypesService.update(req.params.id, req.body);
      res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      await mediaTypesService.delete(req.params.id);
      res.json({ message: 'Tipo de medio eliminado correctamente' });
    } catch (err) {
      next(err);
    }
  }

}

module.exports = new MediaTypesController();
