const globalErrorHandler = (error, request, response, next) => {
  let status = error?.status ? error?.status : "failed";

  const message = error?.message
    ? error?.message
    : "An unexpected error occurred while processing your request. Please try again later.";

  const responseStatusCode = error?.responseStatusCode
    ? error.responseStatusCode
    : 500;

  if (responseStatusCode === 500) {
    status = "error";
  }

  response.status(responseStatusCode).json({
    status,
    message,
  });
};

const notFound = (request, response, next) => {
  const error = new Error(`Cannot find ${request?.originalUrl} on the server`);
  next(error);
};

module.exports = {
  notFound,
  globalErrorHandler,
};
