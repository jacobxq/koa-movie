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


moment.locale('zh-cn')

export default class Content extends Component {
  state = { visible: false }

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
                  cover={<img alt="example" src={it.poster} />}>
                  <Meta
                    style={{height: '202px', overflow: 'hidden'}}
                    title={<Link to={`/detail/${it._id}`}>{it.title}</Link>}
                    onClick={this._jumeToDetail}
                    description={<Link to={`/detail/${it._id}`}>{it.summary}</Link>} />
                </Card>
              </Col>
            ))
          }
        </Row>
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
