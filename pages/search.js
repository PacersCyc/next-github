import { memo, isValidElement } from 'react'
import Router, { withRouter } from 'next/router'
import Link from 'next/link'
import { Row, Col, List, Pagination } from 'antd'
import api from '../lib/api'
import Repo from '../components/Repo'

const LANGUAGES = ['JavaScript', 'HTML', 'CSS', 'TypeScript', 'Java', 'Rust']
const SORT_TYPES = [
  {
    name: 'Best Match'
  },
  {
    name: 'Most Starts',
    value: 'stars',
    order: 'desc'
  },
  {
    name: 'Fewest Stars',
    value: 'stars',
    order: 'asc'
  },
  {
    name: 'Most Forks',
    value: 'fork',
    order: 'desc'
  },
  {
    name: 'Fewest Forks',
    value: 'fork',
    order: 'asc'
  }
]

const per_page = 20

function noop() {

}

const selectedItemStyle = {
  borderLeft: '2px solid #e36209',
  fontWeight: 100
}

const FilterLink = memo(({ name, query, lang, sort, order, page }) => {
  // const doSearch = (config) => {
  //   Router.push({
  //     pathname: '/search',
  //     query: {
  //       lang,
  //       query,
  //       sort,
  //       order
  //     }
  //   })
  // }

  let queryString = `?query=${query}`
  if (lang) {
    queryString += `&lang=${lang}`
  }
  if (sort) {
    queryString += `&sort=${sort}&order=${order || 'desc'}`
  }
  if (page) {
    queryString += `&page=${page}`
  }
  queryString += `&per_page=${per_page}`

  return (
    <Link href={`/search${queryString}`}>
      {
        isValidElement(name) ? name : <a>{name}</a>
      }  
    </Link>
  )
})

const Search = ({ router, repos }) => {
  const { ...querys } = router.query
  const { lang, sort, order, page } = router.query

  return (
    <div className="root">
      <Row gutter={20}>
        <Col span={6}>
          <List
            bordered
            header={<span className="list-header">语言</span>}
            style={{ marginBottom: 20 }}
            dataSource={LANGUAGES}
            renderItem={item => {
              const selected = lang === item
              return (
                <List.Item style={selected ? selectedItemStyle : null}>
                  {
                    selected ? <span>{item}</span> : (
                      <FilterLink
                        {...querys}
                        name={item}
                        lang={item}
                      />
                    )
                  }
                </List.Item>
              )
            }}
          />
          <List
            bordered
            header={<span className="list-header">排序</span>}
            dataSource={SORT_TYPES}
            renderItem={item => {
              let selected = false
              if (item.name === 'Best Match' && !sort) {
                selected = true
              } else if (item.value === sort && item.order === order) {
                selected = true
              } else {
                selected = false
              }
              return (
                <List.Item style={selected ? selectedItemStyle : null}>
                  {
                    selected ? <span>{item.name}</span> : (
                      <FilterLink
                        {...querys}
                        name={item.name}
                        sort={item.value}
                        order={item.order}
                      />
                    )
                  }
                </List.Item>
              )
            }}
          />
        </Col>

        <Col span={18}>
          <h3 className="repos-title">{repos.total_count}个仓库</h3>
          {
            repos.items.map(repo => (
              <Repo key={repo.id} repo={repo}/>
            ))
          }
          <div className="pagination">
            <Pagination 
              pageSize={per_page}
              current={Number(page) || 1}
              total={1000} // github api限制返回数量不超过1000
              onChange={noop}
              itemRender={(page, type, ol) => {
                // const p = type === 'page' ? page : (type === 'prev' ? page - 1 : page + 1)
                const name = type === 'page' ? page : ol
                console.log(type, page)
                return (
                  <FilterLink 
                    {...querys}
                    page={page}
                    name={name}
                  />
                )
              }}
            />
          </div>
        </Col>
      </Row>

      <style jsx>{`
        .root {
          padding: 20px 0;
        }
        .list-header {
          font-weight: 800;
          font-size: 16px;
        }
        .repos-title {
          border-bottom: 1px solid #eee;
          font-size: 24px;
          line-height: 50px;
        }
        .pagination {
          padding: 20px;
          text-align: center;
        }
      `}</style>
    </div>
  )
}

Search.getInitialProps = async ({ ctx }) => {
  const { query, sort, order, lang, page } = ctx.query

  if (!query) {
    return {
      repos: {
        total_count: 0
      }
    }
  }

  let queryString = `?q=${query}`
  if (lang) {
    queryString += `+language:${lang}`
  }
  if (sort) {
    queryString += `&sort=${sort}&order=${order || 'desc'}`
  }
  if (page) {
    queryString += `&page=${page}`
  }
  queryString += `&per_page=${per_page}`

  const result = await api.request({
    url: `/search/repositories${queryString}`
  }, ctx.req, ctx.res)

  return {
    repos: result.data
  }
}

export default withRouter(Search)