const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize'
const SCOPE = 'user'

const client_id = 'b012d80a11e2d319f5cc'

module.exports = {
  github: {
    client_id,
    client_secret: '947302237b5fde33cba1f1ee6f7bcd5a47d16089',
    request_token_url: 'https://github.com/login/oauth/access_token'
  },
  GITHUB_OAUTH_URL,
  OAUTH_URL: `${GITHUB_OAUTH_URL}?client_id=${client_id}&scope=${SCOPE}`
}