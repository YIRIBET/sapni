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
  mediaTypeIdParamSchema,
} = require("../validators/evidenceRecordsValidator");

const { authenticate } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/requireMedia");

const router = express.Router();

router.post("/", validateRequest(create, "body"), evidenceRecordsController.create);

router.use(authenticate, authorize(["Super Admin"]));

router.get("/", evidenceRecordsController.getAll);

router.get("/campaign/:campaignId", validateRequest(campaignIdParamSchema, "params"), evidenceRecordsController.getByCampaignId);
router.get("/user/:userId", validateRequest(userIdParamSchema, "params"), evidenceRecordsController.getByUserId);

router.get("/count/user", evidenceRecordsController.getCountUserEvidences);
router.get("/count/media-channel", evidenceRecordsController.getCountByMediaChannel);
router.get("/counts/media-type", evidenceRecordsController.getCountsByMediaType);
router.get("/counts/status", evidenceRecordsController.getCountsByStatus);
router.get("/progress/order", evidenceRecordsController.getProgressByOrder);

router.get("/stats/by-month", evidenceRecordsController.getCountsByMonth);
router.get("/stats/by-media-type-month", evidenceRecordsController.getCountsByMediaTypePerMonth);
router.get("/stats/progress-by-month", evidenceRecordsController.getProgressByMonth);

router.get("/:id", validateRequest(idParamSchema, "params"), evidenceRecordsController.getById);
router.put("/:id", validateRequest(idParamSchema, "params"), validateRequest(update, "body"), evidenceRecordsController.update);
router.delete("/:id", validateRequest(idParamSchema, "params"), evidenceRecordsController.delete);

module.exports = router;