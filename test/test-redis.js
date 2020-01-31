const Redis = require('ioredis')

async function init() {
  const redis = new Redis()

  await redis.set('c', 123)
  const keys = await redis.keys('*')
  
  console.log(keys)
}

init()