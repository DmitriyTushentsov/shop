import React from "react";
const Cookie = require('cookie');
const jwt = require('jsonwebtoken');
import { Router, Route, Switch, Redirect } from "react-router-dom";
const ProtectedRoute = class extends React.Component {
    constructor(props) {
        super(props);
        try {
            const cookies = Cookie.parse(document.cookie);
            const payload = jwt.decode(cookies.token);
            const timestampInMilliseconds = new Date().getTime();
            this.state = {
                isAuthorized : "false"
            };
            payload.exp > timestampInMilliseconds/1000 ? this.state.isAuthorized = "true" : this.state.isAuthorized = "false";
        }
        catch (err) {
            this.state = {
                isAuthorized : "false"
            };
            
        }
    }
 
 renderTrue (){
      return <Route { ...this.props  } />;
  }
  renderFalse (){
      return <Redirect to="/panel/login" from={ this.props.path } />;
  }
 
    render() { 
        return  <React.Fragment> 
                    { this.state.isAuthorized == "true" && this.renderTrue() }
                    { this.state.isAuthorized == "false" && this.renderFalse() }
                </React.Fragment>;
    }
};

export default ProtectedRoute;