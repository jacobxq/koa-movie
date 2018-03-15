import React, {Component} from 'react'
import Layout from '../../layouts/default'
import Content from './content'
import {request} from '../../lib'
import {
  Menu
} from 'antd'

export default class Home extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedKey: '0',
      years: ['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018'],
      type: this.props.match.params.type,
      year: this.props.match.params.year,
      movies: []
    }
  }

  componentDidMount() {
    this._getAllMovies()
  }

  _getAllMovies() {
    request(window.__LOADING__)({
      method: 'get',
      url: `/api/v0/movies/?type=${this.state.type || ''}&year=${this.state.year || ''}`
    }).then(res => {
      this.setState({
        movies: res
      })
    }).catch(() => {
      this.setState({
        movies: []
      })
    })
  }

  _selectedItem(key) {
    this.setState({
      selectedKey: key
    })
  }

  _renderContent () {
    const { movies } = this.state
    if (!movies || !movies.length) return null

    return (
      <Content 
        movies={movies}
      />
    )
  }

  render() {
    const { years, selectedKey } = this.state
    return (
      <Layout {...this.props}>
        <div style={{display: 'flex', height: '100%'}}>
          <Menu
            defaultSelectedKeys={[selectedKey]}
            mode="inline"
            style={{ height: '100%',  maxWidth: 230 }}
            onSelect={this._selectedItem}
            className='align-self-start'
          >
            {
              years.map((e, i) => (
                <Menu.Item key={i}>
                  <a href={`/year/${e}`}>{e} 年上映</a>
                </Menu.Item>
              ))
            }
          </Menu>
          <div className='flex-1 scroll-y align-self-start'>
            {this._renderContent()}
          </div>
        </div>
      </Layout>
    )
  }
}