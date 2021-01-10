class ApiError extends Error {
    constructor(status, title, description, ...params) {
        super(...params);
        this.status = status;
        this.title = title;
        this.description = description;
    }
}

module.exports = ApiError;