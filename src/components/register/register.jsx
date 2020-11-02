import React, { Component } from 'react';
import logo from "../../assets/logo.png"

class Register extends Component {

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
                            <input type="text"  placeholder="Pick an username" className="form-control" 
                            value={this.state.username} onChange={this.onUsernameChange.bind(this)}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="passwordField">Password</label>
                            <input type="password" placeholder="Pick a password" className="form-control" 
                            value={this.state.password} onChange={this.onPasswordChange.bind(this)}/>
                        </div>
                        <input type="submit" value="Sign Up" className="btn btn-dark" />
                    </form>
                </div>
            </div>
            <div className="footer">
                <button type="button" className="btn btn-link">Already have an account? Click here to login.</button>
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
    event.preventDefault();
    const data = { username:this.state.username, password:this.state.password }
    //use fetch api
    fetch("/users", { 
      method: "POST",
      body: JSON.stringify(data), // the data we're sending
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
    // .then(response => response.json()) -> this wouldn't work right now, response is empty
    .then(response => response.text()).then(console.log)
    .then(response => {
        // handles the response we get from the back end

        console.log(response? response.error: {});
        
        // raise alert that display the error
        //alert(response.error);
    })
  }
}
 
export default Register;