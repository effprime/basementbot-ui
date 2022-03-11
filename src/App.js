import { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import { Container } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { StatusDisplay } from './components/status/status'
import { PluginDisplay } from './components/plugins/plugin'
import { GuildDisplay } from './components/guilds/guilds'
import { EchoDisplay } from './components/echo/echo'
import { PasswordForm } from './components/auth/auth'
import { NavigationPanel } from './components/navigation/navigation'

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      isHoriziontal: true
    };
    this.handleResize = this.handleResize.bind(this)
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
    
    const token = localStorage.getItem("token");
    if (!token) {
      return
    }

    this.setState({loggedIn: true})
  }

  handleResize(_) {
    const isHoriziontal = this.isHoriziontal()
    this.setState({isHoriziontal})
  }

  isHoriziontal() {
    if (window.innerWidth < window.innerHeight) {
      return false;
    }
    return true;
  }

  render() {
    return (
      <Container className="mainContainer" fluid>
      {this.state.loggedIn ? 
        <Router>
          <NavigationPanel></NavigationPanel>
          <Switch>
            <Route
              exact
              path="/"
              render={() => {
                return (
                  <Redirect to="/status"/>
                )
              }}
            />
            <Route path="/status">
              <StatusDisplay setState={this.setState.bind(this)}></StatusDisplay>
            </Route>
            <Route path="/echo">
              <EchoDisplay setState={this.setState.bind(this)}></EchoDisplay>
            </Route>
            <Route path="/plugins">
              <PluginDisplay setState={this.setState.bind(this)}></PluginDisplay>
            </Route>
            <Route path="/guilds">
              <GuildDisplay setState={this.setState.bind(this)}></GuildDisplay>
            </Route>
          </Switch>
        </Router> :
      <PasswordForm setState={this.setState.bind(this)}></PasswordForm> }
      </Container> 
    )
  }
}

export default App;
