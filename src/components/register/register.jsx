import React, { Component } from 'react';
import logo from "../../assets/logo.png"
import {
    Redirect,
    Link
} from "react-router-dom"

class Register extends Component {

    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: '',
            error: '',
            loggedIn: false
        }
    }

    render() {
        if (this.state.loggedIn) {
            return <Redirect to="/home" />;
        }
        return(
        <div className="base-container" >
            <div className="content">
                <div className="logo">
                    <img src={logo} alt="Pool logo"/>
                </div>
                {this.state.error &&
                    <div className="alert alert-danger">
                        {this.state.error}
                    </div>
                }
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
                <Link to="/">Already have an account? Click here to login.</Link>
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
    this.setState({error: ''}) // clear the error if we already had one before
    //use fetch api
    fetch("/users", { 
      method: "POST",
      body: JSON.stringify(data), // the data we're sending
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(data.error);
            });
        } else {
            this.setState({ loggedIn: true });
        }
    })
    .catch(error => {
        console.error(error);
        this.setState({error: error.toString()});
    })
  }
}
 
export default Register;
