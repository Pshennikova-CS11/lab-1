function toResourceResponseDto(resource) {
    return {
        id: resource.id,
        title: resource.title,
        url: resource.url,
        type: resource.type,
        description: resource.description,
        author: resource.author,
        createdAt: resource.createdAt
    };
}

module.exports = { toResourceResponseDto };