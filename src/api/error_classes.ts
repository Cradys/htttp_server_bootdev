// 400 Bad Request
export class BadRequest extends Error {
  constructor(message: string) {
    super(message)
  }
}

//401 Unauthorized
export class Unauthorized extends Error {
  constructor(message: string) {
    super(message)
  }
}

//403 Forbidden
export class Forbidden extends Error {
  constructor(message: string) {
    super(message)
  }
}

//404 Not Found
export class NotFound extends Error {
  constructor(message: string) {
    super(message)
  }
}