import App from 'next/app'
import axios from 'axios'
import { Provider } from 'react-redux'
import Router from 'next/router'
import Link from 'next/link'
import Layout from '../components/Layout'
import PageLoading from '../components/PageLoading'
import testHoc from '../lib/with-redux'
import 'antd/dist/antd.css'

class MyApp extends App {
  state = {
    loading: false
  }

  startLoading = () => {
    this.setState({
      loading: true
    })
  }

  stopLoading = () => {
    this.setState({
      loading: false
    })
  }

  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }
    return {
      pageProps
    }
  }

  componentDidMount() {
    Router.events.on('routeChangeStart', this.startLoading)
    Router.events.on('routeChangeComplete', this.stopLoading)
    Router.events.on('routeChangeError', this.stopLoading)
  }

  componentWillUnmount() {
    Router.events.off('routeChangeStart', this.startLoading)
    Router.events.off('routeChangeComplete', this.stopLoading)
    Router.events.off('routeChangeError', this.stopLoading)
  }

  render() {
    const { Component, pageProps, reduxStore } = this.props

    return (
      <Provider store={reduxStore}>
        {
          this.state.loading ? <PageLoading /> : null
        }
        <Layout>
          <Link href="/">
            <a>Index</a>
          </Link>
          <Link href="/detail">
            <a>Detail</a>
          </Link>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    )
  }
}

export default testHoc(MyApp)