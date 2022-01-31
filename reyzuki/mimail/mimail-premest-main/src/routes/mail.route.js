const { Router } = require("express");
const { route } = require("express/lib/application");
const router = Router();
const { send, deliver, sync } = require("../controllers/mail.control");

router.post("/mail", sync);
router.post("/mail/send", send);
router.post("/mail/deliver", deliver);

module.exports = router;
