
export class ErrorException extends Error {
    constructor(status, message) {
        super()
        this.status = status,
            this.message = message
    }
}


export class UnauthorizedError extends Error {
    constructor(status, message,name) {
        super(message)
        this.status = status
        this.name = " Unauthorized"
    }
}


