const Koa = require('koa')
const Router = require('koa-router')
const session = require('koa-session')
const next = require('next')
const Redis = require('ioredis')

const auth = require('./server/auth')
const RedisSessionStore = require('./server/session-store')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const redis = new Redis()

app.prepare().then(() => {
  const server = new Koa()
  const router = new Router()

  server.keys = ['next github app']
  const SESSION_CONFIG = {
    key: 'next',
    // maxAge: 10*1000,
    store: new RedisSessionStore(redis)
  }

  server.use(session(SESSION_CONFIG, server))
  auth(server)

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

  router.get('/set/user', (ctx, next) => {
    ctx.session.user = {
      name: 'cyc',
      age: 18
    }
    ctx.body = 'set session success'
  })

  router.get('/delete/user', (ctx, next) => {
    ctx.session = null
    ctx.body = 'delete session success'
  })

  router.get('/test', (ctx) => {
    ctx.body = '<p>request /test</p>'
  })

  server.use(router.routes())

  server.use(async (ctx, next) => {
    await handle(ctx.req, ctx.res)
    ctx.respond = false
  })

  server.listen(3000, () => {
    console.log('server start on 3000')
  })
})