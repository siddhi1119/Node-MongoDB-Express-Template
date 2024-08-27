
export const sendSuccessResponse = (req, res, data, count, other) => {
    return res.status(200).send({
       _object: "/api/response",
       self:req.originalUrl.replace(/\?.*$/, ''),
      //  version:config.version,
       count: count,
       data,
       error:null,
       other
      }
       )
  }

  export const sendError = function (data, req, res, statusCode) {
    /*if (typeof data === 'object' && data.hasOwnProperty('statusCode') && data.hasOwnProperty('customMessage')) {
      var errorToSend = Boom.create(data.statusCode, data.customMessage);
      errorToSend.output.payload.responseType = data.type;
      return errorToSend;
    }*/
    var errorToSend = '';
    if (typeof data === 'object') {
      if (data.name == 'MongoServerError') {
        // errorToSend += config.STATUS_MSG.ERROR.DB_ERROR.customMessage;
        if (data.code = 11000) {
          let duplicateValue = data.errmsg && data.errmsg.substr(data.errmsg.lastIndexOf('{ : "') + 5);
          if (duplicateValue) {
            duplicateValue = duplicateValue.replace('}', '');
            // errorToSend += `${config.STATUS_MSG.ERROR.DUPLICATE.customMessage} : ${duplicateValue}`;
          }
          if (data.message.indexOf('customer_1_streetAddress_1_city_1_state_1_country_1_zip_1') > -1) {
            // errorToSend = config.STATUS_MSG.ERROR.DUPLICATE_ADDRESS.customMessage;
          }
        }
      } else if (data.name == 'ApplicationError') {
        // errorToSend += `${config.STATUS_MSG.ERROR.APP_ERROR.customMessage} : `;
      } else if (data.name == 'ValidationError') {
        // errorToSend += config.STATUS_MSG.ERROR.APP_ERROR.customMessage + " " + data.message;
      } else if (data.name == 'CastError') {
        // errorToSend += config.STATUS_MSG.ERROR.DB_ERROR.customMessage + config.STATUS_MSG.ERROR.INVALID_ID.customMessage + data.value;
      } else if (data.name == 'ReferenceError') {
        // errorToSend += config.STATUS_MSG.ERROR.APP_ERROR.customMessage + " " + data.message;
      } else {
        errorToSend += data.message;
      }
    } else {
      errorToSend = data;
    }
    let customErrorMessage = errorToSend;
    // if (typeof customErrorMessage === 'string') {
    //   if (errorToSend.indexOf('[') > -1) {
    //     customErrorMessage = errorToSend.substr(errorToSend.indexOf('['));
    //   }
    //   customErrorMessage = customErrorMessage && customErrorMessage.replace(/"/g, '');
    //   customErrorMessage = customErrorMessage && customErrorMessage.replace('[', '');
    //   customErrorMessage = customErrorMessage && customErrorMessage.replace(']', '');
    // }
    if (statusCode == 400 && data && req) {
      let userPayload = {
        errorMessage: customErrorMessage
      }
      // newrelic.addCustomAttributes(userPayload)
      console.error(userPayload);
    }
    if (res && statusCode) {
      return res.status(statusCode).send({
        _object: "/api/error",
        self: req.originalUrl.replace(/\?.*$/, ''),
        // version: config.version,
        status: statusCode,
        message: customErrorMessage
      }
      )
    } else {
      return { statusCode: 400, message: customErrorMessage };
    }
  };