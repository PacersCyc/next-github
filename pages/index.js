import React, { useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import LRU from 'lru-cache'
import Router, { withRouter } from 'next/router'
import getConfig from 'next/config'
import styled from 'styled-components'
import { Button, Icon, Tabs } from 'antd'
import api from '../lib/api'
import Repo from '../components/Repo'
import { cacheArray } from '../lib/repo-basic-cache'

// 单独实现数据缓存
const cache = new LRU({
  maxAge: 1000 * 60 * 10
})

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()
console.log(serverRuntimeConfig, publicRuntimeConfig)
const isServer = typeof window === 'undefined'

let cachedUserRepos, cachedUserStarredRepos

const Home = ({ user, userRepos, userStarredRepos, router }) => {
  console.log(user, userRepos, userStarredRepos)

  const tabKey = router.query.key || '1'

  const handleTabChange = useCallback((activeKey) => {
    Router.push(`/?key=${activeKey}`)
  }, [])

  useEffect(() => {
    if (!isServer) {
      // cachedUserRepos = userRepos
      // cachedUserStarredRepos = userStarredRepos
      userRepos && cache.set('userRepos', userRepos)
      userStarredRepos && cache.set('userStarredRepos', userStarredRepos)
    }
  }, [userRepos, userStarredRepos])

  useEffect(() => {
    if (!isServer) {
      cacheArray(userRepos)
      cacheArray(userStarredRepos)
    }
  })

  if (!user || !user.id) {
    return (
      <div className="root">
        <p>您还未登录</p>
        <Button type="primary" href={publicRuntimeConfig.OAUTH_URL}>点击登录</Button>

        <style jsx>{`
          .root {
            height: 400px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }

        `}</style>
      </div>
    )
  }

  return (
    <div className="root">
      <div className="user-info">
        <img src={user.avatar_url} className="avatar" alt="avatar_url" />
        <span className="login">{user.login}</span>
        <span className="name">{user.name}</span>
        <span className="bio">{user.bio}</span>
        <p className="email">
          <Icon type="mail" style={{ marginRight: 10 }} />
          <a href={`mailto:${user.email}`}>{user.email}</a>
        </p>
      </div>
      <div className="user-repos">
        <Tabs
          activeKey={tabKey}
          animated={false}
          onChange={handleTabChange}
        >
          <Tabs.TabPane tab="你的仓库" key="1">
            {
              userRepos.map(repo => (
                <Repo key={repo.id} repo={repo} />
              ))
            }
          </Tabs.TabPane>
          <Tabs.TabPane tab="你关注的仓库" key="2">
            {
              userStarredRepos.map(repo => (
                <Repo key={repo.id} repo={repo} />
              ))
            }
          </Tabs.TabPane>
        </Tabs>

      </div>

      <style jsx>{`
        .root {
          display: flex;
          align-items: flex-start;
          padding: 20px 0;
        }
        .user-info {
          width: 200px;
          margin-right: 40px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
        }
        .login {
          font-weight: 800;
          font-size: 20px;
          margin-top: 20px;
        }
        .name {
          font-size: 16px;
          color: #777;
        }
        .bio {
          margin-top: 20px;
          color: #333;
        }
        .avatar {
          width: 100%;
          border-radius: 5px;
        }
        .user-repos {
          flex-grow: 1;
        }
      `}</style>
    </div>
  )
}

Home.getInitialProps = async ({ ctx, reduxStore }) => {
  // console.log(reduxStore)
  const user = reduxStore.getState().user
  if (!user || !user.id) {
    return {
      isLogin: false
    }
  }

  // 服务端渲染不允许使用tab数据缓存
  if (!isServer) {
    if (cache.get('userRepos') && cache.get('userStarredRepos')) {
      return {
        userRepos: cache.get('userRepos'),
        userStarredRepos: cache.get('userStarredRepos')
      }
    }
  }

  const userRepos = await api.request({
    url: '/user/repos'
  }, ctx.req, ctx.res)

  const userStarredRepos = await api.request({
    url: '/user/starred'
  }, ctx.req, ctx.res)

  // if (!isServer) {
  //   cachedUserRepos = userRepos.data
  //   cachedUserStarredRepos = userStarredRepos.data
  // }

  return {
    isLogin: true,
    userRepos: userRepos.data,
    userStarredRepos: userStarredRepos.data
  }
}

export default withRouter(connect(
  function mapStateToProps(state) {
    return {
      user: state.user
    }
  }
)(Home))
