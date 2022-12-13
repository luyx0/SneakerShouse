const Router = require('express')
const router = new Router()
const deviceController = require('../controllers/deviceController')
const checkRole = require('../middleware/checkRoleMiddleware')


router.post('/',checkRole('ADMIN'), deviceController.create)

module.exports = router
