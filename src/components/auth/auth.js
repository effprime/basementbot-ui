import { Component } from 'react';
import axios from 'axios';

export class PasswordForm extends Component {
    constructor(props) {
      super(props);
      this.state = {
        password_input: "",
        invalid_password: false
      };
    }
  
    login() {
      console.log("hello")
      axios.post(`http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/auth/login`, {
        "password": this.state.password_input
      }).then(response => {
        if (response.status === 200) {
          this.setState({ invalid_password: false })
          localStorage.setItem('token', response.data.token);
          this.props.setState({ loggedIn: true })
        }
      }).catch(error => {
        if (error?.response?.status === 401) {
          this.setState({ invalid_password: true });
        }
      });
    }
  
    render() {
      return (
        <div className="passwordForm">
          <input
            type="password"
            placeholder="Enter password"
            onChange={e => this.setState({ password_input: e.target.value })}
          />
          <button className="passwordButton" type="button" onClick={this.login.bind(this)}>Login</button>
          {this.state.invalid_password === true ? <p>Invalid password</p> : null}
        </div>
      )
    }
  }