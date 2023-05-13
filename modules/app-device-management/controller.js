const { success, error } = require('../../helper/response')
const { AppDevices } = require('../../models')
const Validate = require('../../helper/get-errors-messages-validate');

async function create(req, res) {
    // req.body.user = req.user.id;
    let rules = {
        deviceToken: ['required']
    }
    let validate = await Validate(req.body, rules);

    if (validate) {
        return error(req, res, validate);
    }

    let device = await AppDevices.getOneByParams({ deviceToken: req.body.deviceToken });
    if (device) {
        return error(req, res, "Device token đã tồn tại");
    }
    let newDevices = await AppDevices.createData(req.body);
    return success(req, res, newDevices)
}

module.exports = {
    create
}