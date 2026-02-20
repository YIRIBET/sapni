const express = require("express");
const evidenceRecordsController = require("../controllers/evidenceRecordsController");
const validateRequest = require("../middlewares/validateRequest");

const { 
    create,
    update,
    idParamSchema,
    campaignIdParamSchema,
    clientIdParamSchema,
    diffusionOrderIdParamSchema,
    statusParamSchema,
    userIdParamSchema,
    mediaChannelIdParamSchema,
    mediaTypeIdParamSchema
} = require("../validators/evidenceRecordsValidator");

const { authenticate } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/requireMedia");

const router = express.Router();

router.post("/", validateRequest(create, 'body'), evidenceRecordsController.create);

router.use(authenticate, authorize(["Super Admin"]));

router.get("/", evidenceRecordsController.getAll);
router.get("/campaign/:campaignId", validateRequest(campaignIdParamSchema, 'params'), evidenceRecordsController.getByCampaignId);
router.get("/user/:userId", validateRequest(userIdParamSchema, 'params'),evidenceRecordsController.getByUserId);
router.get("/:id", validateRequest(idParamSchema, 'params'), evidenceRecordsController.getById);
router.get("/count/user", evidenceRecordsController.getCountUserEvidences);
router.get("/count/media-channel", evidenceRecordsController.getCountByMediaChannel);
router.get("/counts/media-type", evidenceRecordsController.getCountsByMediaType);
router.get("/progress/order", evidenceRecordsController.getProgressByOrder);
router.get("/counts/status", evidenceRecordsController.getCountsByStatus);

router.put("/:id", validateRequest(idParamSchema, 'params'),validateRequest(update, 'body'), evidenceRecordsController.update);
router.delete("/:id", validateRequest(idParamSchema, 'params'), evidenceRecordsController.delete);

module.exports = router;