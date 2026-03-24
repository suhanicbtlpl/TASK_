const sendResponse = (res, statusCode, success, message, data = null, error = null) => {
    return res.status(statusCode).json({
        success,
        message,
        data,
        error
    });
};

const SuccessResponse = (res, message, data = null, statusCode = 200) => {
    return sendResponse(res, statusCode, true, message, data);
};

const ErrorResponse = (res, message, error = null, statusCode = 500) => {
    return sendResponse(res, statusCode, false, message, null, error);
};

module.exports = {
    SuccessResponse,
    ErrorResponse
};
