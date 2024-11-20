const errorHandler = (err, req, res, next) => {
	let statusCode = err.status || 500;
	let errorMessage = err.message || "An unexpected error occurred";

	return res.status(statusCode).json({
		success: false,
		message: errorMessage,
	});
};

export default errorHandler;
