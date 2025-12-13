class ApiResponse {
  constructor(success, message, data = null, statusCode = 200, errors = null) {
    this.success = success;
    this.message = message;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
    
    if (data !== null) {
      this.data = data;
    }
    
    if (errors !== null) {
      this.errors = errors;
    }
  }

  static success(message, data = null, statusCode = 200) {
    return new ApiResponse(true, message, data, statusCode);
  }

  static error(message, errors = null, statusCode = 500) {
    return new ApiResponse(false, message, null, statusCode, errors);
  }

  static created(message, data = null) {
    return new ApiResponse(true, message, data, 201);
  }

  static noContent(message = 'No content') {
    return new ApiResponse(true, message, null, 204);
  }

  static badRequest(message, errors = null) {
    return new ApiResponse(false, message, null, 400, errors);
  }

  static unauthorized(message = 'Unauthorized') {
    return new ApiResponse(false, message, null, 401);
  }

  static forbidden(message = 'Forbidden') {
    return new ApiResponse(false, message, null, 403);
  }

  static notFound(message = 'Resource not found') {
    return new ApiResponse(false, message, null, 404);
  }

  static conflict(message, errors = null) {
    return new ApiResponse(false, message, null, 409, errors);
  }

  static validationError(message, errors) {
    return new ApiResponse(false, message, null, 422, errors);
  }

  static tooManyRequests(message = 'Too many requests') {
    return new ApiResponse(false, message, null, 429);
  }

  static internalServerError(message = 'Internal server error') {
    return new ApiResponse(false, message, null, 500);
  }

  static serviceUnavailable(message = 'Service unavailable') {
    return new ApiResponse(false, message, null, 503);
  }

  // Pagination response
  static paginated(message, data, pagination) {
    const response = new ApiResponse(true, message, data, 200);
    response.pagination = {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: pagination.totalPages,
      hasNextPage: pagination.hasNextPage,
      hasPrevPage: pagination.hasPrevPage,
      nextPage: pagination.nextPage,
      prevPage: pagination.prevPage
    };
    return response;
  }

  // List response with metadata
  static list(message, items, metadata = {}) {
    const response = new ApiResponse(true, message, items, 200);
    response.metadata = {
      count: items.length,
      ...metadata
    };
    return response;
  }

  // File response
  static file(message, fileData) {
    const response = new ApiResponse(true, message, null, 200);
    response.file = {
      name: fileData.name,
      size: fileData.size,
      type: fileData.type,
      url: fileData.url,
      downloadUrl: fileData.downloadUrl
    };
    return response;
  }

  // Bulk operation response
  static bulk(message, results) {
    const response = new ApiResponse(true, message, results.data, 200);
    response.bulk = {
      total: results.total,
      successful: results.successful,
      failed: results.failed,
      errors: results.errors
    };
    return response;
  }

  // Statistics response
  static stats(message, statistics) {
    const response = new ApiResponse(true, message, statistics, 200);
    response.generatedAt = new Date().toISOString();
    return response;
  }

  // Health check response
  static health(status, checks = {}) {
    const response = new ApiResponse(
      status === 'healthy',
      `System is ${status}`,
      null,
      status === 'healthy' ? 200 : 503
    );
    response.health = {
      status,
      checks,
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    };
    return response;
  }

  // Authentication response
  static auth(message, user, tokens) {
    const response = new ApiResponse(true, message, user, 200);
    response.tokens = tokens;
    return response;
  }

  // Custom response with additional fields
  static custom(success, message, data, statusCode, additionalFields = {}) {
    const response = new ApiResponse(success, message, data, statusCode);
    Object.assign(response, additionalFields);
    return response;
  }

  // Convert to JSON (for Express res.json())
  toJSON() {
    const response = {
      success: this.success,
      message: this.message,
      statusCode: this.statusCode,
      timestamp: this.timestamp
    };

    if (this.data !== undefined) {
      response.data = this.data;
    }

    if (this.errors !== undefined) {
      response.errors = this.errors;
    }

    if (this.pagination !== undefined) {
      response.pagination = this.pagination;
    }

    if (this.metadata !== undefined) {
      response.metadata = this.metadata;
    }

    if (this.file !== undefined) {
      response.file = this.file;
    }

    if (this.bulk !== undefined) {
      response.bulk = this.bulk;
    }

    if (this.health !== undefined) {
      response.health = this.health;
    }

    if (this.tokens !== undefined) {
      response.tokens = this.tokens;
    }

    return response;
  }
}

module.exports = ApiResponse;