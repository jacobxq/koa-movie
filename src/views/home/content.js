import React, { Component } from 'react'
import {
  Button,
  Card,
  Tag,
  Row,
  Col,
  Spin,
  Modal,
  Badge,
  Icon
} from 'antd'
import { Link } from 'react-router-dom'
import moment from 'moment'
const { Meta } = Card
import 'moment/locale/zh-cn'

const base = 'http://static.huangzhh.com/'

moment.locale('zh-cn')

export default class Content extends Component {
  state = { visible: false }

  _handleClose = (e) => {
    if (this.player && this.player.pause) {
      this.player.pause()
    }
  }

  _handleCancle = (e) => {
    this.setState({
      visible: false
    })
  }

  _showModal = (movie) => {
    this.setState({
      visible: true
    })

    const video = base + movie.videoKey
    const pic = base + movie.coverKey

    if (!this.player) {
      setTimeout(() => {
        this.player = new DPlayer({
          container: document.getElementsByClassName('videoModal')[0],
          screenshot: true,
          autoplayer: true,
          video: {
            url: video,
            pic: pic,
            thumbnails: pic
          }
        })
        this.player.play()
      }, 500)
    } else {
      if (this.player.video.currentSrc !== video) {
        this.player.switchVideo({
          url: video,
          pic: pic,
          autoplayer: true,
          type: 'auto'
        })
      }
      this.player.play()
    }
  }

  _renderContent = () => {
    const { movies } = this.props
    
    return (
      <div style={{ padding: '30px' }}>
        <Row>
          {
            movies.map((it, i) => (
              <Col key={i} xl={{span: 6}} lg={{span: 8}} md={{span: 12}} sm={{span: 24}} style={{ marginBottom: '8px' }}>
                <Card bordered={false}
                  hoverable
                  style={{ width: '100%' }}
                  actions={[
                    <Badge>
                      <Icon style={{marginRight: '2px'}} type="clock-circle" />
                      {moment(it.meta.createdAt).fromNow(true)}前更新
                    </Badge>,
                    <Badge>
                      <Icon style={{marginRight: '2px'}} type="star" />
                      {it.rate} 分
                    </Badge>
                  ]}
                  cover={<img onClick={() => this._showModal(it)} alt="example" src={base + it.posterKey + '/koa_movie'} />}>
                  <Meta
                    style={{height: '202px', overflow: 'hidden'}}
                    title={<Link to={`/detail/${it._id}`}>{it.title}</Link>}
                    description={<Link to={`/detail/${it._id}`}>{it.summary}</Link>} />
                </Card>
              </Col>
            ))
          }
        </Row>
        <Modal
          className='videoModal'
          footer={null}
          visible={this.state.visible}
          afterClose={this._handleClose}
          onCancel={this._handleCancle}
        >
        </Modal>
      </div>
    )
  }

  render () {
    return (
      <div style={{ padding: 10 }}>
        {this._renderContent()}
      </div>
    )
  }
}
