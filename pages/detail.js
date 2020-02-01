

const Detail = () => {
  return (
    <div>detail</div>
  )
}

Detail.getInitialProps = (ctx) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({})
    }, 1000)
  })
}

export default Detail