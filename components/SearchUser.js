import { useState, useCallback, useRef } from 'react'
import { Select, Spin } from 'antd'
import debounce from 'lodash/debounce'
import api from '../lib/api'

const Option = Select.Option

const SearchUser = ({ onChange, value }) => {
  const lastFetchIdRef = useRef(0)
  const [fetching, setFetching] = useState(false)
  const [options, setOptions] = useState([])

  const fetchUser = useCallback(debounce(value => {
    console.log(value)
    lastFetchIdRef.current += 1
    const fetchId = lastFetchIdRef.current
    setFetching(true)
    setOptions([])

    api.request({
      url: `/search/users?q=${value}`
    }).then(res => {
      console.log(res)
      if (fetchId !== lastFetchIdRef.current) {
        return
      }
      const data = res.data.items.map(user => ({
        value: user.login,
        text: user.login
      }))

      setFetching(false)
      setOptions(data)
    })
  }, 300), [])

  const handleChange = (value) => {
    setOptions([])
    setFetching(false)

    onChange(value)
  }

  return (
    <Select
      style={{
        width: 200
      }}
      showSearch={true}
      notFoundContent={fetching ? <Spin size="small" /> : <span>nothing</span>}
      filterOption={false}
      placeholder="创建者"
      allowClear={true}
      value={value}
      onSearch={fetchUser}
      onChange={handleChange}
    >
      {
        options.map(op => (
          <Option value={op.value} key={op.value}>{op.text}</Option>
        ))
      }
    </Select>
  )
}

export default SearchUser