class CustomJwtError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
    this.name = "JwtError";
  }
}

module.exports = CustomJwtError;
