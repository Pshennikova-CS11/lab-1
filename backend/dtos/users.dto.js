/* контролює, які саме поля повертаються у відповіді API */
function toUserResponseDto(user) {
    return {
        id: user.id,
        name: user.name,
        email: user.email
    };
}

module.exports = { toUserResponseDto };