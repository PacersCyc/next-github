import dynamic from 'next/dynamic'
import withRepoBasic from '../../components/with-repo-basic'
import api from '../../lib/api'

const MDRenderer = dynamic(
  () => import('../../components/MarkdownRenderer'),
  {
    loading: () => <p>loading</p>
  }
)

const Detail = ({ readme }) => {
  // const content = b64_to_utf8(readme.content)
  // const html = md.render(content)

  return (
    <MDRenderer 
      content={readme.content} 
      isBase64={true} 
    />
  )
}

Detail.getInitialProps = async ({ ctx }) => {
  const { owner, name } = ctx.query
  const readmeResp = await api.request({
    url: `/repos/${owner}/${name}/readme`
  }, ctx.req, ctx.res)

  console.log(readmeResp.data)

  return {
    readme: readmeResp.data
  }
}

export default withRepoBasic(Detail, 'index')