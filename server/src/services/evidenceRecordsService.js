const db = require("../config/database");
const { NotFoundError, ValidationError } = require("../utils/errors");
const evidenceRecordsValidator = require("../validators/evidenceRecordsValidator");

class EvidenceRecordsService {

  async getByCampaignId(campaignId) {
    return await db("evidence_records as er")
      .select("er.*", "do.campaign_id")
      .join("diffusion_orders as do", "er.order_id", "do.id")
      .where("do.campaign_id", campaignId)
      .where("er.is_active", 1);
  }

  async getByClientId(clientId) {
    return await db("evidence_records as er")
      .select("er.*", "c.client_id")
      .join("diffusion_orders as do", "er.order_id", "do.id")
      .join("campaigns as c", "do.campaign_id", "c.id")
      .where("c.client_id", clientId)
      .where("er.is_active", 1);
  }

  async getByDiffusionOrderId(orderId) {
    return await db("evidence_records")
      .where("order_id", orderId)
      .where("is_active", 1);
  }

  async getByStatus(status) {
    return await db("evidence_records as er")
      .select("er.*", "rs.name as status_name")
      .join("review_status as rs", "er.status_id", "rs.id")
      .where(isNaN(status) ? "rs.name" : "er.status_id", status)
      .where("er.is_active", 1);
  }

  async getByUserId(userId) {
    return await db("evidence_records as er")
      .select(
        "er.*",
        "cf.format_name as format_name",
        "rs.status_name as status_name",
      )
      .leftJoin("content_formats as cf", "er.format_id", "cf.id")
      .leftJoin("review_status as rs", "er.status_id", "rs.id")
      .where("er.user_id", userId)
      .where("er.is_active", 1);
  }

  async getByMediaTypeId(mediaTypeId) {
    return await db("evidence_records as er")
      .select(
        "er.*",
        "cf.format_name",
        "rs.status_name",
        "mc.channel_name",
        "mc.id as media_channel_id",
        "mt.type_name as media_type",
        "mt.id as media_type_id",
      )
      .join("diffusion_orders as do", "er.order_id", "do.id")
      .join("media_channels as mc", "do.media_channel_id", "mc.id")
      .join("media_types as mt", "mc.media_type_id", "mt.id")
      .leftJoin("content_formats as cf", "er.format_id", "cf.id")
      .leftJoin("review_status as rs", "er.status_id", "rs.id")
      .where("mt.id", mediaTypeId)
      .where("er.is_active", 1);
  }

  async getByMediaChannelId(mediaChannelId) {
    return await db("evidence_records as er")
      .select(
        "er.*",
        "cf.format_name",
        "rs.status_name",
        "mc.channel_name",
        "mc.id as media_channel_id",
        "mt.type_name as media_type",
      )
      .join("diffusion_orders as do", "er.order_id", "do.id")
      .leftJoin("content_formats as cf", "er.format_id", "cf.id")
      .leftJoin("review_status as rs", "er.status_id", "rs.id")
      .leftJoin("media_channels as mc", "do.media_channel_id", "mc.id")
      .leftJoin("media_types as mt", "mc.media_type_id", "mt.id")
      .where("do.media_channel_id", mediaChannelId)
      .where("er.is_active", 1);
  }

  async getAllEvidenceRecords() {
    const evidenceRecords = await db("evidence_records")
      .select(
        "id",
        "order_id",
        "user_id",
        "format_id",
        "status_id",
        "program_name",
        "publication_title",
        "evidence_date",
        "evidence_time",
        "link",
        "internal_notes",
        "attachment_path",
        "created_at"
      )
      .where("is_active", 1)
      .orderBy("id", "asc");
    return evidenceRecords;
  }

  async getEvidenceRecordById(id) {
    const evidenceRecord = await db("evidence_records")
      .select(
        "id",
        "order_id",
        "user_id",
        "format_id",
        "status_id",
        "program_name",
        "publication_title",
        "evidence_date",
        "evidence_time",
        "link",
        "internal_notes",
        "attachment_path",
        "created_at",
      )
      .where("id", id)
      .where("is_active", 1)
      .first();

    if (!evidenceRecord) {
      throw new NotFoundError("Registro de evidencia no encontrado");
    }
    return evidenceRecord;
  }

  async createEvidenceRecord(data) {
    const validatedData = evidenceRecordsValidator.validateCreate(data);

    const [newId] = await db("evidence_records").insert(validatedData);
    return this.getEvidenceRecordById(newId);
  }

  async updateEvidenceRecord(id, data) {
    await this.getEvidenceRecordById(id);

    const validatedData = evidenceRecordsValidator.validateUpdate(data);

    await db("evidence_records")
      .where("id", id)
      .update({
        ...validatedData,
      });

    return this.getEvidenceRecordById(id);
  }

  async deleteEvidenceRecord(id) {
    const evidenceRecord = await this.getEvidenceRecordById(id);
    await db("evidence_records").where("id", evidenceRecord.id).update({
      is_active: 0
    });

    return {
      message: "Registro de evidencia eliminado exitosamente",
      id: evidenceRecord.id,
    };
  }
}

module.exports = new EvidenceRecordsService();
