const express = require("express")
const router = express.Router()

const controller = require("../../controllers/admin/trash.controller")
router.get('/', controller.index)
router.delete('/recovery/:id', controller.recoveryitem)

module.exports = router