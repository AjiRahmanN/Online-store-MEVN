function errorHandler(err, req, res, next) {
  req.status = err.status || 500;
  req.message = err.message || "Something went wrong, try again later";
  console.log(err);
  res.status(req.status).json({ message: req.message });
}

module.exports = errorHandler;
