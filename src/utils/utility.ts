class ErrorHandler extends Error {
	constructor(public statusCode: number, public message: string) {
		super(message);
		this.message = message;
		this.statusCode = statusCode;
	}
}

export default ErrorHandler;
