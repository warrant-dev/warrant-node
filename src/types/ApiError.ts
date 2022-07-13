export default class ApiError extends Error {
    public code: string;
    public message: string;
    public name: string;

    constructor(code: string, message: string) {
        super(message);
        this.code = code;
        this.message = message;
        this.name = ApiError.codeToName(code);
    }

    public toString(): string {
        return `${this.name} [${this.code}]: ${this.message}`;
    }

    private static codeToName(code: string): string {
        switch (code) {
            case "duplicate_record":
                return "DuplicateRecordError";
            case "internal_error":
                return "InternalError";
            case "invalid_request":
                return "InvalidRequestError";
            case "invalid_parameter":
                return "InvalidParameterError";
            case "missing_required_parameter":
                return "MissingRequiredParameterError";
            case "not_found":
                return "NotFoundError";
            case "unauthorized":
                return "UnauthorizedError";
            case "unknown_origin":
                return "UnknownOriginError";
            default:
                return "ApiError";
        }
    }
}
