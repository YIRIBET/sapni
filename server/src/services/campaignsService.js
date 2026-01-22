const db = require("../config/database");
const { NotFoundError, ValidationError } = require("../utils/errors");
const campaignsValidator = require("../validators/campaignsValidator");

class campaignsService {
  formatCampaign(campaign) {
    const formatDate = (date) => {
      if (!date) return null;
      if (typeof date === 'string') {
        return date.split('T')[0];
      }
      return date.toISOString().split('T')[0];
    };

    return {
      ...campaign,
      start_date: formatDate(campaign.start_date),
      end_date: formatDate(campaign.end_date),
    };
  }

  async getAllCampaigns() {
    const campaigns = await db("campaigns")
      .join("clients", "campaigns.client_id", "=", "clients.id")
      .select(
        "campaigns.id",
        "campaigns.campaign_name",
        "campaigns.start_date",
        "campaigns.end_date",
        "campaigns.client_id",
        "clients.company_name",
      )
      .where("campaigns.is_active", 1)
      .orderBy("campaigns.id", "asc");
    
    return campaigns.map(c => this.formatCampaign(c));
  }

  async getCampaignById(id) {
    const campaign = await db("campaigns")
      .join("clients", "campaigns.client_id", "=", "clients.id")
      .select(
        "campaigns.id",
        "campaigns.campaign_name",
        "campaigns.start_date",
        "campaigns.end_date",
        "campaigns.client_id",
        "clients.company_name",
      )
      .where("campaigns.id", id)
      .where("campaigns.is_active", 1)
      .first();
    
    if (!campaign) {
      throw new NotFoundError("Campaña no encontrada");
    }
    
    return this.formatCampaign(campaign);
  }

  async createCampaign(data) {
    const errors = campaignsValidator.validateCreate(data);
    if (errors.length > 0) {
      throw new ValidationError(errors.join(", "));
    }

    const client = await db("clients")
      .where({ id: data.client_id, is_active: 1 })
      .first();
    if (!client) {
      throw new ValidationError("El cliente no existe o está inactivo");
    }
    const [id] = await db("campaigns").insert({
      campaign_name: data.campaign_name,
      start_date: data.start_date,
      end_date: data.end_date,
      client_id: data.client_id,
      is_active: 1,
    });
    return this.getCampaignById(id);
  }

  async updateCampaign(id, data) {
  
    const errors = campaignsValidator.validateUpdate(data);
    if (errors.length > 0) {
      throw new ValidationError(errors.join(", "));
    }

    const campaign = await db("campaigns")
      .where({ id: id, is_active: 1 })
      .first();
    if (!campaign) {
      throw new NotFoundError("Campaña no encontrada");
    }
    if (data.client_id) {
      const client = await db("clients")
        .where({ id: data.client_id, is_active: 1 })
        .first();

      if (!client) {
        throw new ValidationError("El cliente no existe o está inactivo");
      }
    }
    await db("campaigns").where({ id: id }).update({
      campaign_name: data.campaign_name,
      start_date: data.start_date,
      end_date: data.end_date,
      client_id: data.client_id,
    });
    return this.getCampaignById(id);
  }

  async deleteCampaign(id) {
    const campaign = await db("campaigns")
      .where({ id: id, is_active: 1 })
      .first();
    if (!campaign) {
      throw new NotFoundError("Campaña no encontrada");
    }
    await db("campaigns").where({ id: id }).update({ is_active: 0 });
  }
}
module.exports = new campaignsService();