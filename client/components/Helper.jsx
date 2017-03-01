export function getAuthorNames(authors) {
    let authorNames = _.reduce(authors,
        function (res, author) {
            return `${res}${author.name}, `;
        }, '');

    authorNames = authorNames.substr(0, authorNames.lastIndexOf(', '));

    return authorNames;
}