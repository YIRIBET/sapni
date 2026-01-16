const clientsService = require('../services/clientsService');
const { sendSuccess, sendError } = require('../utils/response');

class ClientsController {
  async getAll(req, res, next) {
    try {
      const clients = await clientsService.getAllClients();
      sendSuccess(res, clients, 'Clientes obtenidos exitosamente');
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const client = await clientsService.getClientById(id);
      sendSuccess(res, client, 'Cliente obtenido exitosamente');
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const client = await clientsService.createClient(req.body);
      sendSuccess(res, client, 'Cliente creado exitosamente', 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const client = await clientsService.updateClient(id, req.body);
      sendSuccess(res, client, 'Cliente actualizado exitosamente');
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await clientsService.deleteClient(id);
      sendSuccess(res, null, 'Cliente eliminado exitosamente');
    } catch (error) {
      next(error);
    }
  }

  async getCampaigns(req, res, next) {
    try {
      const { id } = req.params;
      const campaigns = await clientsService.getClientCampaigns(id);
      sendSuccess(res, campaigns, 'Campañas del cliente obtenidas');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ClientsController();