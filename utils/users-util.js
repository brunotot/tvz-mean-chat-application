function convertResultToDto(users) {
    if (Array.isArray(users)) {
        return users.map(u => {
            return {
                _id: u["_id"],
                username: u.username,
                firstName: u.firstName,
                lastName: u.lastName,
                role: u.role
            }
        });
    } else {
        return {
            _id: users["_id"],
            username: users.username,
            firstName: users.firstName,
            lastName: users.lastName,
            role: users.role
        };
    }
}

module.exports = {
    convertResultToDto: convertResultToDto
}