const db = require("../config/database");
const { NotFoundError, ValidationError } = require("../utils/errors");
const diffusionOrdersValidator = require("../validators/diffusionOrdersValidator");


class diffusionOrdersService {

  async getAllDiffusionOrders() {
    const diffusionOrders = await db("diffusion_orders")
      .join("campaigns", "diffusion_orders.campaign_id", "=", "campaigns.id")
      .select(
        "diffusion_orders.id",
        "diffusion_orders.campaign_id",
        "campaigns.campaign_name",
        "campaigns.is_active as campaign_status",
        "diffusion_orders.total_spots_ordered",
        "diffusion_orders.contract_amount"
      )
      .where("diffusion_orders.is_active", 1)
      .orderBy("diffusion_orders.id", "asc");

    return diffusionOrders;
  }

  async getAllOrdersbyCampaignActive() {
    const diffusionOrders = await db("diffusion_orders")
      .join("campaigns", "diffusion_orders.campaign_id", "=", "campaigns.id")
      .select(
        "diffusion_orders.id",
        "diffusion_orders.campaign_id",
        "campaigns.campaign_name",
        "diffusion_orders.total_spots_ordered",
        "diffusion_orders.contract_amount"
      )
      .where({
        "diffusion_orders.is_active": 1,
        "campaigns.is_active": 1,
      })
      .orderBy("diffusion_orders.id", "asc");

    return diffusionOrders;
  }

  async getDiffusionOrderById(id) {
    const diffusionOrder = await db("diffusion_orders")
      .join("campaigns", "diffusion_orders.campaign_id", "=", "campaigns.id")
      .select(
        "diffusion_orders.id",
        "diffusion_orders.campaign_id",
        "campaigns.campaign_name",
        "diffusion_orders.total_spots_ordered",
        "diffusion_orders.contract_amount"
      )
      .where("diffusion_orders.id", id)
      .where("diffusion_orders.is_active", 1)
      .first();

    if (!diffusionOrder) {
      throw new NotFoundError("Orden de difusión no encontrada");
    }

    return diffusionOrder;
  }

  async deactivateExpiredCampaigns() {
    const today = new Date().toISOString().split("T")[0];
    await db("campaigns")
      .where("is_active", 1)
      .where("end_date", "<", today)
      .update({ is_active: 0 });
  }

  async createDiffusionOrder(data) {
    const errors = diffusionOrdersValidator.validateCreate(data);
    if (errors.length > 0) {
      throw new ValidationError(errors.join(", "));
    }
    const [newId] = await db("diffusion_orders").insert(data);
    return this.getDiffusionOrderById(newId);
  }

  async updateDiffusionOrder(id, data) {
    const errors = diffusionOrdersValidator.validateUpdate(data);
    if (errors.length > 0) {
      throw new ValidationError(errors.join(", "));
    }
    const diffusionOrder = await this.getDiffusionOrderById(id);
    await db("diffusion_orders").where({ id: diffusionOrder.id }).update(data);
    return this.getDiffusionOrderById(diffusionOrder.id);
  }
  async deleteDiffusionOrder(id) {
    const diffusionOrder = await this.getDiffusionOrderById(id);
    await db("diffusion_orders")
      .where({ id: diffusionOrder.id })
      .update({ is_active: 0 });
    return;
  }
}

module.exports = new diffusionOrdersService();