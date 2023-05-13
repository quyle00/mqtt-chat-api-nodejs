const { success, error } = require('../../helper/response')
const {UserNotifications } = require('../../models')
const PushNotification = require('../../helper/push-notification');
const Validate = require('../../helper/get-errors-messages-validate');

async function pushNotification(req, res) {
    let rules = {
        deviceToken: ['required'],
        title: ['required'],
        body: ['required']
    }
    let validate = await Validate(req.body, rules);
    if (validate) {
        return error(req, res, validate);
    }

    await PushNotification.sendPushNotification({
        notification: {
            title: req.body.title,
            body: req.body.body,
            data: {
                test : "test"
            }
        },
        data: {
            test : "test"
        },
        // deviceToken: 'dSEfuUoiTxCuykFhZY-NP_:APA91bHjxIFnyPe8UxNZXNwNVzdawfo-yYbPFgAamLO7u1pXEkL7wBrMycIqT8ICdyawj_oSsqujigigwd-zniwsqBdSEAwsQb1UGzCOJ3E6LYswRQSNZNdhhladfCXpeEMFvT5mGL9m',
        deviceToken : req.body.deviceToken
    });
    return success(req, res, {}, "Push notification successfully");
}

async function getAll(req, res) {
    let userNotifications = await UserNotifications.getAll(req.query);
    return success(req, res, userNotifications);
}

async function getByUser(req, res) {
    let userNotifications = await UserNotifications.getAll({user : req.user.id});
    return success(req, res, userNotifications);
}

async function getOne(req, res) {
    let userNotification = await UserNotifications.getByID(req.params.id);
    if (!userNotification) {
        return error(req, res, "Không tìm thấy thông báo");
    }
    return success(req, res, userNotification);
}

async function markRead(req, res) {
    let userNotification = await UserNotifications.getByID(req.params.id);
    if (!userNotification) {
        return error(req, res, "Không tìm thấy thông báo");
    }

    const result = await UserNotifications.updateData(req.params.id, { status: true });
    return success(req, res, result);
}

async function markAllRead(req, res) {
    let userId = req.user.id;
    let userNotifications = await UserNotifications.getAll({ user: userId, status: false });
    if (!userNotifications) {
        return error(req, res, "Không tìm thấy thông báo");
    }
    let ids = userNotifications.map(item => item._id);
    const result = await UserNotifications
        .updateMany({ _id: { $in: ids } }, { status: true });
    return success(req, res, {});
}

async function deleteOne(req, res) {
   let userNotification = await UserNotifications.getByID(req.params.id);
    if (!userNotification) {
        return error(req, res, "Không tìm thấy thông báo");
    }
    await UserNotifications.deleteOne(req.params.id);
    return success(req, res, {}, "Xóa thông báo thành công");
}

module.exports = {
    pushNotification,
    getAll,
    getByUser,
    getOne,
    markRead,
    markAllRead,
    deleteOne
}