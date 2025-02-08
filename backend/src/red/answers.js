exports.success = function (req, res, msg, status){
    const statusCode = status || 200;
    const msgOk = msg || '';
    res.status(statusCode).send({
        error: false,
        status: statusCode,
        body: msgOk
    })
}

exports.error = function (req, res, msg, status){
    const statusError = status || 500;
    const msgError = msg || '';
    res.status(statusCode).send({
        error: false,
        status: statusError,
        body: msgError
    })
}