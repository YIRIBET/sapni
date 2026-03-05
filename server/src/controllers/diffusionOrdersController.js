const diffusionOrdersService = require("../services/diffusionOrdersService");
const { sendSuccess, sendError } = require("../utils/response");

class DiffusionOrdersController {
  async getAll(req, res, next) {
    try {
      const diffusionOrders =
        await diffusionOrdersService.getAllDiffusionOrders();
      sendSuccess(res, diffusionOrders);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const diffusionOrder =
        await diffusionOrdersService.getDiffusionOrderById(id);
      sendSuccess(res, diffusionOrder);
    } catch (error) {
      next(error);
    }
  }

 async getOrdersByMediaType(req, res) {
  try {

    const { media_type_id } = req.params;

    const orders =
      await diffusionOrdersService.getAllDiffusionOrdersByMediaType(media_type_id);

    res.json(orders);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

  async create(req, res, next) {
    try {
      const diffusionOrder = await diffusionOrdersService.createDiffusionOrder(
        req.body,
      );
      sendSuccess(
        res,
        diffusionOrder,
        "Orden de difusión creada exitosamente",
        201,
      );
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const diffusionOrder = await diffusionOrdersService.updateDiffusionOrder(
        id,
        req.body,
      );
      sendSuccess(
        res,
        diffusionOrder,
        "Orden de difusión actualizada exitosamente",
      );
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await diffusionOrdersService.deleteDiffusionOrder(id);
      sendSuccess(res, null, "Orden de difusión eliminada exitosamente");
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new DiffusionOrdersController();
