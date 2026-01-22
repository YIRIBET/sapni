const campaignsService = require("../services/campaignsService");
const { sendSuccess, sendError } = require("../utils/response");

class CampaignsController {
  async getAll(req, res, next) {
    try {
      const campaigns = await campaignsService.getAllCampaigns();
      sendSuccess(res, campaigns, "Campañas obtenidas exitosamente");
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const campaign = await campaignsService.getCampaignById(id);
      sendSuccess(res, campaign, "Campaña obtenida exitosamente");
    } catch (error) {
      next(error);
    }
  }
  async create(req, res, next) {
    try {
      const campaign = await campaignsService.createCampaign(req.body);
      sendSuccess(res, campaign, "Campaña creada exitosamente", 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const campaign = await campaignsService.updateCampaign(id, req.body);
      sendSuccess(res, campaign, "Campaña actualizada exitosamente");
    } catch (error) {
      next(error);
    }
  }
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await campaignsService.deleteCampaign(id);
      sendSuccess(res, null, "Campaña eliminada exitosamente");
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new CampaignsController();
