import React, {Component} from 'react'
import navRoutes from '../nav'
import {
  Menu,
  Spin,
  Icon
} from 'antd'

const getMenuContent = ({path, name}) => {
  return (
    <a href={path ? path : '/'} style={{color: '#fff2e8'}}>
      {name}
    </a>
  )
}

export default class LayoutDefault extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      tip: '天下第一吃大米'
    }
  }

  componentDidMount () {
    window.__LOADING__ = this.toggleLoading
  }

  componentWillUnmount () {
    window.__LOADING__ = null
  }

  matchRouteName = this.props.match
    ? navRoutes.find(e => e.name === this.props.match.params)
      ? navRoutes.find(e => e.name === this.props.match.params.type).name
      : '全部'
    : navRoutes[0].name

  toggleLoading = (status = false, tip = '天下第一吃大米') => {
    this.setState({
      loading: status,
      tip
    })
  }

  render () {
    const { children } = this.props
    const { loading, tip } = this.state

    return (
      <div className='flex-column' style={{width: '100%', height: '100%'}}>
       <Menu
        style={{ fontSize: 13.5, backgroundColor: '#000'}}
        mode='horizontal'
        defaultSelectedKeys={[this.matchRouteName]}
       >
        <Menu.Item
          style={{
            marginLeft: 24,
            marginRight: 30,
            fontSize: 18,
            textAlign: 'center',
            color: '#fff !important',
            float: 'left'
          }}
        >
          <a href='/' className='hover-scale logo-text' style={{color: '#fff2e8'}}>千寻预告片网站</a>
        </Menu.Item>
        {
          navRoutes.map((e, i) => (
            <Menu.Item key={e.name}>
              { getMenuContent({...e})}
            </Menu.Item>
          ))
        }
       </Menu>
       <Spin
         spinning={loading}
         wrapperClassName='content-spin full'
         tip={tip}
        >
          {children}
       </Spin>
      </div>
    )
  }
}