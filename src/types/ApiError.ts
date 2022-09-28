export enum ErrorCode {
    GenericError = "generic_error",
    InternalError = "internal_error",
    InvalidArgument = "invalid_argument",
    InvalidParameter = "invalid_parameter",
    InvalidRequest = "invalid_request",
    MissingParameter = "missing_parameter",
    NotFound = "not_found",
    DuplicateRecord = "duplicate_record",
    Unauthorized = "unauthorized",
}

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
            case ErrorCode.DuplicateRecord:
                return "DuplicateRecordError";
            case ErrorCode.InternalError:
                return "InternalError";
            case ErrorCode.InvalidRequest:
                return "InvalidRequestError";
            case ErrorCode.InvalidParameter:
                return "InvalidParameterError";
            case ErrorCode.MissingParameter:
                return "MissingRequiredParameterError";
            case ErrorCode.NotFound:
                return "NotFoundError";
            case ErrorCode.Unauthorized:
                return "UnauthorizedError";
            default:
                return "ApiError";
        }
    }
}
