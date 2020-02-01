const Koa = require('koa')
const Router = require('koa-router')
const session = require('koa-session')
const koaBody = require('koa-body')
const next = require('next')
const Redis = require('ioredis')

const auth = require('./server/auth')
const api = require('./server/api')
const RedisSessionStore = require('./server/session-store')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const redis = new Redis()

app.prepare().then(() => {
  const server = new Koa()
  const router = new Router()

  server.keys = ['next github app']

  server.use(koaBody())
  
  const SESSION_CONFIG = {
    key: 'next',
    // maxAge: 10*1000,
    store: new RedisSessionStore(redis)
  }

  server.use(session(SESSION_CONFIG, server))
  auth(server)
  api(server)

  router.get('/api/user/info', (ctx, next) => {
    const user = ctx.session.userInfo
    if (!user) {
      ctx.status = 401
      ctx.body = 'Need login'
    } else {
      ctx.body = user
      ctx.set('Content-Type', 'application/json')
    }
  })

  server.use(router.routes())

  server.use(async (ctx, next) => {
    ctx.req.session = ctx.session
    await handle(ctx.req, ctx.res)
    ctx.respond = false
  })

  server.listen(3000, () => {
    console.log('server start on 3000')
  })
})