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
        db.raw("COUNT(er.id) as total_evidences"),
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
        db.raw("COUNT(er.id) as total_evidences"),
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
        db.raw("COUNT(er.id) as total_evidences"),
      );
  }

 async getProgressByOrder() {
  return db("diffusion_orders as do")
    .leftJoin("evidence_records as er", "er.order_id", "do.id")
    .leftJoin("campaigns as c", "c.id", "do.campaign_id")
    .leftJoin("media_channels as mc", "mc.id", "do.media_channel_id")
    .groupBy(
      "do.id",
      "do.campaign_id",
      "do.total_spots_ordered",
      "c.campaign_name",
      "mc.channel_name" 
    )
    .select(
      "do.id as order_id",
      "c.campaign_name",
      "mc.channel_name",
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
    return db("review_status as rs")
      .leftJoin("evidence_records as er", "er.status_id", "rs.id")
      .groupBy("rs.id", "rs.status_name")
      .select(
        "rs.id as status_id",
        "rs.status_name",
        db.raw("COUNT(er.id) as total"),
      );
  }

  async getAllEvidenceRecords() {
  const evidenceRecords = await db("evidence_records as er")
    .leftJoin("users as u", "er.user_id", "u.id")
    .leftJoin("review_status as rs", "er.status_id", "rs.id")
    .leftJoin("content_formats as f", "er.format_id", "f.id")
    .leftJoin("diffusion_orders as o", "er.order_id", "o.id")
    .leftJoin("media_channels as mc", "o.media_channel_id", "mc.id")
    .leftJoin("media_types as mt", "mc.media_type_id", "mt.id")
    .select(
      "er.id",
      "er.order_id",
      "er.program_name",
      "er.publication_title",
      "er.evidence_date",
      "er.evidence_time",
      "er.link",
      "er.has_anomaly",
      "er.internal_notes",
      "er.created_at",

      "u.id as user_id",
      db.raw("CONCAT(u.nombre, ' ', u.apellidos) as user_name"),

      "rs.status_name",
      "f.format_name",

      "mc.channel_name",
      "mt.type_name"
    )
    .where("er.is_active", 1)
    .orderBy("er.id", "asc");

  for (let record of evidenceRecords) {
    const anomalies = await db("evidence_anomalies as ea")
      .join("anomaly_types as at", "ea.anomaly_type_id", "at.id")
      .select(
        "at.code as type",
        "ea.description",
        "ea.is_resolved"
      )
      .where("ea.evidence_id", record.id);

    record.anomalies = anomalies;
  }

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

  async getAnomalyTypeId(trx, code, description = null) {
    let anomalyType = await trx("anomaly_types").where("code", code).first();

    if (!anomalyType) {
      const [id] = await trx("anomaly_types").insert({
        code,
        description: description || code,
      });

      return id;
    }

    return anomalyType.id;
  }

  async getByAnomalies() {
  return await db("evidence_records as er")
    .join("evidence_anomalies as ea", "er.id", "ea.evidence_id")
    .join("anomaly_types as at", "ea.anomaly_type_id", "at.id")

    .leftJoin("review_status as rs", "er.status_id", "rs.id")
    .leftJoin("content_formats as f", "er.format_id", "f.id")
    .leftJoin("diffusion_orders as o", "er.order_id", "o.id")
    .leftJoin("media_channels as mc", "o.media_channel_id", "mc.id")
    .leftJoin("media_types as mt", "mc.media_type_id", "mt.id")

    .select(
      "er.id",
      "er.order_id",
      "er.evidence_date",
      "er.evidence_time",
      "er.has_anomaly",
      "rs.status_name",
      "f.format_name",
      "mc.channel_name",
      "mt.type_name",

      "ea.id as anomaly_id",
      "ea.description as anomaly_description",
      "ea.detected_at",
      "ea.is_resolved",

      "at.code as anomaly_code",
      "at.description as anomaly_type"
    )
    .where("er.is_active", 1)
    .orderBy("er.id", "asc");
}

async createEvidenceRecord(data) {
  const validatedData = evidenceRecordsValidator.validateCreate(data);

  const order = await db("diffusion_orders as do")
    .join("media_channels as mc", "do.media_channel_id", "mc.id")
    .select("do.id", "do.total_spots_ordered", "mc.media_type_id")
    .where("do.id", validatedData.order_id)
    .first();

  if (!order) {
    throw new ValidationError("Orden no válida");
  }

  await db.transaction(async (trx) => {
    let hasAnomaly = false;

    const [{ count }] = await trx("evidence_records")
      .where("order_id", validatedData.order_id)
      .andWhere("is_active", 1)
      .count("id as count");

    const nextCount = Number(count) + 1;


    const localDateTime = new Date(
      `${validatedData.evidence_date}T${validatedData.evidence_time}:00`
    );

    const utcDate = new Date(
      localDateTime.getTime() - (localDateTime.getTimezoneOffset() * 60000)
    );

    const utcDateStr = utcDate.toISOString().slice(0, 10);
    const utcTimeStr = utcDate.toISOString().slice(11, 19);

    const [evidenceId] = await trx("evidence_records").insert({
      ...validatedData,
      evidence_date: utcDateStr,
      evidence_time: utcTimeStr,
      has_anomaly: 0,
    });


    if (nextCount > order.total_spots_ordered) {
      hasAnomaly = true;

      const anomalyTypeId = await this.getAnomalyTypeId(trx, "EXTRA_SPOT");

      await trx("evidence_anomalies").insert({
        evidence_id: evidenceId,
        anomaly_type_id: anomalyTypeId,
        description: `Spot ${nextCount}/${order.total_spots_ordered}`,
      });
    }
    const duplicate = await trx("evidence_records")
      .where({
        order_id: validatedData.order_id,
        evidence_date: utcDateStr,
        evidence_time: utcTimeStr,
        is_active: 1,
      })
      .andWhere("id", "!=", evidenceId)
      .first();

    if (duplicate) {
      hasAnomaly = true;

      const anomalyTypeId = await this.getAnomalyTypeId(
        trx,
        "DUPLICATE_EVIDENCE"
      );

      await trx("evidence_anomalies").insert({
        evidence_id: evidenceId,
        anomaly_type_id: anomalyTypeId,
        description: "Evidencia duplicada (fecha y hora repetidas)",
      });
    }
    const now = new Date();
    const diffMinutes = Math.abs((now - utcDate) / 60000);
    const TOLERANCE_MINUTES = 10;

    if (diffMinutes > TOLERANCE_MINUTES) {
      hasAnomaly = true;

      const anomalyTypeId = await this.getAnomalyTypeId(trx, "TIME_EXCEEDED");

      await trx("evidence_anomalies").insert({
        evidence_id: evidenceId,
        anomaly_type_id: anomalyTypeId,
        description: `Diferencia de ${Math.round(diffMinutes)} minutos`,
      });
    }

    if (hasAnomaly) {
      await trx("evidence_records")
        .where("id", evidenceId)
        .update({ has_anomaly: 1 });
    }
  });

  return { success: true };
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
      is_active: 0,
    });

    return {
      message: "Registro de evidencia eliminado exitosamente",
      id: evidenceRecord.id,
    };
  }
}

module.exports = new EvidenceRecordsService();
