import React, { Component } from 'react';
import './login.css'
import logo from "../../assets/logo.png"

class Login extends Component {
    // state = {  }


    render() { 
        return(
        <div className="base-container" >
            <div className="content">
                <div className="logo">
                    <img src={logo} />
                </div>
                <div className="form">
                    <form>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input type="text" name="username" placeholder="username" className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input type="text" name="password" placeholder="password" className="form-control"/>
                        </div>
                    </form>
                </div>
            </div>
            <div className="footer">
                <button type="button" className="btn btn-primary">Login</button>
            </div>

        </div>
        ); // return
    }
}
 
export default Login;