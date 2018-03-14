import React from 'react'
import {
  Route,
  Switch
} from 'react-router-dom'
import Routes from './routes'
import 'antd/dist/antd.css'
import './assets/common.sass'

class App extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <Switch>
        {
          Routes.map(({ name, path, exact = true, component }) => (
            <Route path={path} exact={exact} component={component} key={name} />
          ))
        }
      </Switch>
    )
  }
}

export default App