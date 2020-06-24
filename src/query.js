function boardQuery() {
  return `query {
      boards(ids: [591529840]) {
        columns {
            title
            id
        }
            
        items {
            id
        }
      }
    }`;
}

function getItemDetailQuery(ids) {
  return `query {
        items(ids: [${ids}]) {
            name
            assets {
                id
                public_url
            }
            column_values {
                id
                title
                text
                value
            }
        }
    }`;
}

function getUsersQuery() {
  return `query {
        users {
            id
            name
            photo_thumb
        }
    }`;
}

function getUserDetailQuery(ids) {
  return `query {
        users(ids: [${ids}]) {
            name
            photo_thumb
        }
    }`;
}

exports.boardQuery = boardQuery;
exports.getUsersQuery = getUsersQuery;
exports.getItemDetailQuery = getItemDetailQuery;
exports.getUserDetailQuery = getUserDetailQuery;
