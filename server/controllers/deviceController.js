const uuid = require('uuid')
const path = require('path')
const {Device} = require('../models/models')
const ApiError = require('../error/ApiError')

class DeviceController {
    async create(req, res, next){
        try{
            let {name, price} = req.body
            const {img} = req.files
            let fileName = uuid.v4() + ".jpg"
            img.mv(path.resolve(__dirname, '..', 'static', fileName))

            const device = await Device.create({name, price, img: fileName })

            return res.json(device)
        } catch(e){
            next(ApiError.badRequest(e.message))
        }


    }

}

module.exports = new DeviceController()
