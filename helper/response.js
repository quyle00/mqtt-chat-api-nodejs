module.exports = {
  success: success,
  error: error,
};
function success(req, res, data, message = "success") {
  const response = {
    name: "MqttChat API v1",
    code: 200,
    error: false,
    message: message,
    data: data,
  };
  res.status(200).send(response);
}

function error(req, res, message, code = 422) {
  const response = {
    name: "MqttChat API v1",
    code: code,
    error: true,
    message: message,
    data: null,
  };
  res.status(code).send(response);
}
