export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Default values
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV !== "production" && { stack: err.stack })
    }
  });
};
