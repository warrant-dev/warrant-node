export default class ApiError extends Error {
    private code: string;

    constructor(code: string, message: string) {
        super(message);
        this.code = code;
    }

    public toString(): string {
        return `Code: ${this.code}, Message: ${this.message}`;
    }
}
