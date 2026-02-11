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
router.get("/client/:clientId", validateRequest(clientIdParamSchema, 'params'), evidenceRecordsController.getByClientId);
router.get("/diffusion-order/:diffusionOrderId", validateRequest(diffusionOrderIdParamSchema, 'params'), evidenceRecordsController.getByDiffusionOrderId);
router.get("/status/:status", validateRequest(statusParamSchema, 'params'),evidenceRecordsController.getByStatus);
router.get("/user/:userId", validateRequest(userIdParamSchema, 'params'),evidenceRecordsController.getByUserId);
router.get("/:id", validateRequest(idParamSchema, 'params'), evidenceRecordsController.getById);
router.get("/media-channel/:mediaChannelId",validateRequest(mediaChannelIdParamSchema, 'params'),evidenceRecordsController.getByMediaChannelId);
router.get("/media-type/:mediaTypeId",validateRequest(mediaTypeIdParamSchema, 'params'),evidenceRecordsController.getByMediaTypeId);
router.put("/:id", validateRequest(idParamSchema, 'params'),validateRequest(update, 'body'), evidenceRecordsController.update);
router.delete("/:id", validateRequest(idParamSchema, 'params'), evidenceRecordsController.delete);

module.exports = router;