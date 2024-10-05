const { isAuthenticated } = require("../middleware/isAuthenticated")
const { createOrganization, createPayment, deleteUser, getOrganization } = require("../controller/blog/organizationController")



const router = require("express").Router()

router.route("/organization").post(isAuthenticated, createOrganization)
router.route("/payment").post(isAuthenticated,createPayment)

router.route("/user").delete(isAuthenticated, deleteUser)

router.route('/currentOrgDetails').get(isAuthenticated, getOrganization)
module.exports = router 