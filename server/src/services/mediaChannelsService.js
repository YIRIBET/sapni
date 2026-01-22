const db = require("../config/database");
const { NotFoundError, ValidationError } = require("../utils/errors");

class MediaChannelsService {

  async getAllMediaChannels() {
    return db("media_channels as mc")
      .join("media_types as mt", "mc.media_type_id", "=", "mt.id")
      .select(
        "mc.id",
        "mc.channel_name",
        "mc.social_network",
        "mc.frequency",
        "mc.contact_name",
        "mc.media_type_id",
        "mt.type_name",
      )
      .where("mc.is_active", 1)
      .orderBy("mc.id", "asc");
  }

  async getMediaChannelById(id) {
    const channel = await db("media_channels as mc")
      .join("media_types as mt", "mc.media_type_id", "=", "mt.id")
      .select(
        "mc.id",
        "mc.channel_name",
        "mc.social_network",
        "mc.frequency",
        "mc.contact_name",
        "mc.media_type_id",
        "mt.type_name",
      )
      .where("mc.id", id)
      .where("mc.is_active", 1)
      .first();

    if (!channel) {
      throw new NotFoundError("Canal de medio no encontrado");
    }

    return channel;
  }

  async createMediaChannel(data) {
    const mediaType = await db("media_types")
      .where({ id: data.media_type_id, is_active: 1 })
      .first();

    if (!mediaType) {
      throw new ValidationError("El tipo de medio no existe o está inactivo");
    }

    const [id] = await db("media_channels").insert({
      channel_name: data.channel_name,
      social_network: data.social_network,
      frequency: data.frequency,
      contact_name: data.contact_name,
      media_type_id: data.media_type_id,
      is_active: 1,
    });

    return this.getMediaChannelById(id);
  }

  async updateMediaChannel(id, data) {
    await this.getMediaChannelById(id);

    if (data.media_type_id) {
      const mediaType = await db("media_types")
        .where({ id: data.media_type_id, is_active: 1 })
        .first();

      if (!mediaType) {
        throw new ValidationError("El tipo de medio no existe o está inactivo");
      }
    }

    await db("media_channels").where({ id }).update({
      channel_name: data.channel_name,
      social_network: data.social_network,
      frequency: data.frequency,
      contact_name: data.contact_name,
      media_type_id: data.media_type_id,
    });

    return this.getMediaChannelById(id);
  }

  async deleteMediaChannel(id) {
    await this.getMediaChannelById(id);

    await db("media_channels")
      .where({ id })
      .update({ is_active: 0 });

    return true;
  }
}

module.exports = new MediaChannelsService();
