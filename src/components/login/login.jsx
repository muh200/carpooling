import React, { Component } from 'react';
import './login.css'
import logo from "../../assets/logo.png"

class Login extends Component {

    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: ''
        }
    }

    render() { 
        return(
        <div className="base-container" >
            <div className="content">
                <div className="logo">
                    <img src={logo} alt="Pool logo"/>
                </div>
                <div className="form">
                    <form id="login-form" onSubmit={this.handleSubmit.bind(this)} method="POST">
                        <div className="form-group">
                            <label htmlFor="usernameField">Username</label>
                            <input type="text"  placeholder="username" className="form-control" 
                            value={this.state.username} onChange={this.onUsernameChange.bind(this)}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="passwordField">Password</label>
                            <input type="password" placeholder="password" className="form-control" 
                            value={this.state.password} onChange={this.onPasswordChange.bind(this)}/>
                        </div>
                        <input type="submit" value="Login" className="btn btn-dark" />
                    </form>
                </div>
            </div>
            <div className="footer">
                <button type="button" className="btn btn-link">Create An Account</button>
            </div>

        </div>
        ); // return
    }

    onUsernameChange(event) {
    this.setState({username: event.target.value})
  }

  onPasswordChange(event) {
    this.setState({password: event.target.value})
  }

  handleSubmit(event) {
    // idrk what this does, apparently it prevents it from submitting to a file ??
    event.preventDefault();
    const data = { username:this.state.username, password:this.state.password }
    //use fetch api
    fetch("/login", { 
      method: "POST",
      body: JSON.stringify(data), // the data we're sending
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
    .then(response => response.json())
    .then(response => {
        console.log(response); // print out the response
    })
  }
}
 
export default Login;