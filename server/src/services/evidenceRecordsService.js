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

  async getCountUserEvidences() {
    const result = await db("evidence_records as er")
      .join("users as u", "er.user_id", "u.id")
      .groupBy("u.id", "u.nombre")
      .select(
        "u.id as user_id",
        "u.nombre as user_name",
        db.raw("COUNT(er.id) as total_evidences")
      );
    return result;

  }

  async getCountByMediaChannel() {
    return db("evidence_records as er")
      .join("diffusion_orders as do", "er.order_id", "do.id")
      .join("media_channels as mc", "do.media_channel_id", "mc.id")
      .groupBy("mc.id", "mc.channel_name")
      .select(
        "mc.id as media_channel_id",
        "mc.channel_name",
        db.raw("COUNT(er.id) as total_evidences")
      );
  }

  async getCountsByMediaType() {
  return db("evidence_records as er")
    .join("diffusion_orders as do", "er.order_id", "do.id")
    .join("media_channels as mc", "do.media_channel_id", "mc.id")
    .join("media_types as mt", "mc.media_type_id", "mt.id")
    .groupBy("mt.id", "mt.type_name")
    .select(
      "mt.id as media_type_id",
      "mt.type_name",
      db.raw("COUNT(er.id) as total_evidences")
    );
}

async getProgressByOrder() {
  return db("diffusion_orders as do")
    .leftJoin("evidence_records as er", "er.order_id", "do.id")
    .groupBy(
      "do.id",
      "do.campaign_id",
      "do.total_spots_ordered"
    )
    .select(
      "do.id as order_id",
      "do.campaign_id",
      "do.total_spots_ordered",
      db.raw("COUNT(er.id) as evidences_done"),
      db.raw(`
        ROUND(
          (COUNT(er.id) / do.total_spots_ordered) * 100,
          2
        ) as progress_percentage
      `)
    );
}

async getCountsByStatus() {
  return db("evidence_records as er")
    .join("review_status as rs", "er.status_id", "rs.id")
    .groupBy("rs.id", "rs.status_name")
    .select(
      "rs.id as status_id",
      "rs.status_name",
      db.raw("COUNT(er.id) as total")
    );
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
