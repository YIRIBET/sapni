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

    async getByClientId(req, res, next) {
        try {
            const { clientId } = req.params;
            const data = await evidenceRecordsService.getByClientId(clientId);
            sendSuccess(res, data, "Registros de evidencia por cliente obtenidos exitosamente");
        } catch (error) {
            next(error);
        }
    }

    async getByDiffusionOrderId(req, res, next) {
        try {
            const { diffusionOrderId } = req.params;
            const data = await evidenceRecordsService.getByDiffusionOrderId(diffusionOrderId);
            sendSuccess(res, data, "Registros de evidencia por orden de difusión obtenidos exitosamente");
        } catch (error) {
            next(error);
        }
    }

    async getByStatus(req, res, next) {
        try {
            const { status } = req.params;
            const data = await evidenceRecordsService.getByStatus(status);
            sendSuccess(res, data, "Registros de evidencia por estado obtenidos exitosamente");
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

    async getByMediaChannelId(req, res, next) {
        try {
            const { mediaChannelId } = req.params;
            const data = await evidenceRecordsService.getByMediaChannelId(mediaChannelId);
            sendSuccess(res, data, "Evidencias por canal de medio obtenidas exitosamente");
        } catch (error) {
            next(error);
        }
    }

    async getByMediaTypeId(req, res, next) {
        try {
            const { mediaTypeId } = req.params;
            const data = await evidenceRecordsService.getByMediaTypeId(mediaTypeId);
            sendSuccess(res, data, "Evidencias por tipo de medio obtenidas exitosamente");
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