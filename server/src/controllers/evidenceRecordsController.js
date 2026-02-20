const evidenceRecordsService = require("../services/evidenceRecordsService");
const { sendSuccess, sendError } = require("../utils/response");

class EvidenceRecordsController {

  async getAll(req, res, next) {
        try {
            const evidenceRecords = await evidenceRecordsService.getAllEvidenceRecords();
            sendSuccess(res, evidenceRecords, "Registros de evidencia obtenidos exitosamente");
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const evidenceRecord = await evidenceRecordsService.getEvidenceRecordById(id);
            sendSuccess(res, evidenceRecord, "Registro de evidencia obtenido exitosamente");
        } catch (error) {
            next(error);
        }
    }

    async getByCampaignId(req, res, next) {
        try {
            const { campaignId } = req.params;
            const data = await evidenceRecordsService.getByCampaignId(campaignId);
            sendSuccess(res, data, "Registros de evidencia por campaña obtenidos exitosamente");
        } catch (error) {
            next(error);
        }
    }

    async getByUserId(req, res, next) {
        try {
            const { userId } = req.params;
            const data = await evidenceRecordsService.getByUserId(userId);
            sendSuccess(res, data, "Registros de evidencia por usuario obtenidos exitosamente");
        } catch (error) {
            next(error);
        }
    }

    async getCountUserEvidences(req, res, next) {
        try {
            const { userId } = req.params;
            const total = await evidenceRecordsService.getCountUserEvidences(userId);
            sendSuccess(res, { total }, "Conteo de evidencias por usuario obtenido exitosamente");
        } catch (error) {
            next(error);
        }
    }

    async getCountByMediaChannel(req, res, next) {
        try {
            const { mediaChannelId } = req.params;
            const data = await evidenceRecordsService.getCountByMediaChannel(mediaChannelId);
            sendSuccess(res, data, "Conteo de evidencias por canal de medio obtenido exitosamente");
        } catch (error) {
            next(error);
        }
    }
    

    async getCountsByMediaType(req, res, next) {
        try {
            const data = await evidenceRecordsService.getCountsByMediaType();
            sendSuccess(res, data, "Conteo de evidencias por tipo de medio obtenido exitosamente");
        } catch (error) {
            next(error);
        }
    }

    async getProgressByOrder(req, res, next) {
        try {
            const data = await evidenceRecordsService.getProgressByOrder();
            sendSuccess(res, data, "Progreso por orden de difusión obtenido exitosamente");
        } catch (error) {
            next(error);
        }
    }
    async getCountsByStatus(req, res, next) {
        try {
            const data = await evidenceRecordsService.getCountsByStatus();
            sendSuccess(res, data, "Conteo de evidencias por estado obtenido exitosamente");
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const evidenceRecord = await evidenceRecordsService.createEvidenceRecord(req.body);
            sendSuccess(res, evidenceRecord, "Registro de evidencia creado exitosamente", 201);
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const evidenceRecord = await evidenceRecordsService.updateEvidenceRecord(id, req.body);
            sendSuccess(res, evidenceRecord, "Registro de evidencia actualizado exitosamente");
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            await evidenceRecordsService.deleteEvidenceRecord(id);
            sendSuccess(res, null, "Registro de evidencia eliminado exitosamente");
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new EvidenceRecordsController();