import React, { useEffect } from 'react'
import axios from 'axios'
import Head from 'next/head'
import getConfig from 'next/config'
import styled from 'styled-components'
import { Button } from 'antd'

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()
console.log(serverRuntimeConfig, publicRuntimeConfig)

const Title = styled.h1`
  color: yellow;
  font-size: 40px;
`

const Home = () => {
  useEffect(() => {
    axios.get('/api/user/info').then(res => {
      console.log(res)
    })
  }, [])

  return (
    <div>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
  
      <div className="hero">
        <Title>hhh</Title>
        sss
        <Button type="primary">click</Button>
        <a href={publicRuntimeConfig.OAUTH_URL}>去登录</a>
      </div>
    </div>
  )
}

export default Home
