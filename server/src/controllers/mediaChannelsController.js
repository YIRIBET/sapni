const mediaChannelsService = require("../services/mediaChannelsService");
const { sendSuccess, sendError } = require("../utils/response");

class MediaChannelsController {
  async getAll(req, res, next) {
    try {
      const mediaChannels = await mediaChannelsService.getAllMediaChannels();
      sendSuccess(
        res,
        mediaChannels,
        "Canales de medios obtenidos exitosamente",
      );
    } catch (error) {
      next(error);
    }
  }
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const mediaChannel = await mediaChannelsService.getMediaChannelById(id);
      sendSuccess(res, mediaChannel, "Canal de medio obtenido exitosamente");
    } catch (error) {
      next(error);
    }
  }
  async create(req, res, next) {
    try {
      const mediaChannel = await mediaChannelsService.createMediaChannel(
        req.body,
      );
      sendSuccess(res, mediaChannel, "Canal de medio creado exitosamente", 201);
    } catch (error) {
      next(error);
    }
  }
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const mediaChannel = await mediaChannelsService.updateMediaChannel(
        id,
        req.body,
      );
      sendSuccess(res, mediaChannel, "Canal de medio actualizado exitosamente");
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await mediaChannelsService.deleteMediaChannel(id);
      sendSuccess(res, null, "Canal de medio eliminado exitosamente");
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new MediaChannelsController();

