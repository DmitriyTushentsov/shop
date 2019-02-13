const appLinks = ["Услуги", "Цены", "О компании", "Контакты"];
import Navigation from "../components/Navigation.jsx";
import React from "react";
const Cookie = require('cookie');
const jwt = require('jsonwebtoken');
const LoginPage = class extends React.Component {
    constructor(props) {
        super(props);
        try {
            const cookies = Cookie.parse(document.cookie);
            const payload = jwt.decode(cookies.token);
            const timestampInMilliseconds = new Date().getTime();
            this.state = {
                status : "idle",
                credentials: {
                login: "test@yandex.ru",
                password: "1234"
                }
            };
            payload.exp > timestampInMilliseconds/1000 ? this.state.status = "logged" : this.state.status = "idle";
        }
        catch (err) {
            this.state = {
                status : "idle",
                credentials: {
                login: "test@yandex.ru",
                password: "1234"
                }
            };
            
        }
    }
  
    renderReady (){
        if (this.state.status!=="logged") { return false; }
     return <div className="alert alert-primary" role="alert">
           Авторизация прошла успешно!
            </div>;
  }
  renderError (){
      if (this.state.status!=="error") { return false; }
      return <div className="alert alert-danger" role="alert">
            Неверное имя пользователя или пароль!
            </div>;
  }
  
  renderLogout (){
      if (this.state.status!=="logged") { return false; }
        return <div className="row">
            <div className="col-sm-4 offset-sm-4 plashka">
             <form className="form-signin">
                <h4 className="form-signin-heading">Please log out</h4>
                <button className="btn btn-lg btn-primary btn-block" onClick={this.onLogout.bind(this)} type="submit">Log out</button>
            </form>
            </div>
        </div>; 
  }

  renderForm () {

       return <div className="row">
            <div className="col-sm-4 offset-sm-4 plashka">
             <form className="form-signin">
        <h2 className="form-signin-heading">Please sign in</h2>
        <label htmlFor="inputEmail" className="sr-only">Email address</label>
        <input type="email" onChange={ this.onChange.bind(this) } name = "login" id="inputEmail" className="form-control" placeholder="Email address" required autoFocus />
        <label htmlFor="inputPassword" className="sr-only">Password</label>
        <input type="password" onChange={ this.onChange.bind(this) } name = "password" id="inputPassword" className="form-control" placeholder="Password" required />
        <button className="btn btn-lg btn-primary btn-block" onClick={this.onSave.bind(this)} type="submit">Sign in</button>
      </form>
            </div>
        </div>; 
        
    }
  
   onChange (event) {
        const name = event.target.name;
        this.state.credentials[name] = event.target.value;
        this.forceUpdate();
  }
  
   onLogout (event) {
       
       document.cookie = 'token=; Path=/; Max-Age=0;';
       this.setState({
            status : 'idle'
        });
        this.forceUpdate();
  }
  
   onSave () {
      event.preventDefault();
        this.setState({
            status : 'pending'
        });
        fetch(`/api/login`, {
        method: "post",
        credentials: "same-origin",
        body: JSON.stringify(this.state.credentials),
        headers: {
            "Content-Type": "application/json"
        }
        })
        .then(function(response) {
                return response.json();
            })
        .then(function (json) {
            console.log(json);
            this.setState({
                status : 'logged'
            });
            this.forceUpdate();
        }.bind(this))
        .catch(error => {
            this.setState({
                status : 'error'
            });
            this.forceUpdate();
        });       
            
  }
  
    render() { 
        return <div className="container">
            <header>
            <div className="row">
            <div className="col-sm-8 offset-sm-2 panel">
              <Navigation links={ appLinks } navClass="nav"></Navigation>
            </div> 
        </div>
    </header>
   <main>
   
   { this.state.status == "logged" && this.renderReady() }
   { this.state.status == "error" && this.renderError() }
     { this.state.status !== "logged" && this.renderForm() }
     { this.state.status == "logged" && this.renderLogout() }
    </main>
    <footer>
        <div className="row">
            <div className="col-sm-8 plashka offset-sm-2">
                &copy; Сайт интернет-магазина 2018
            </div>
        </div>
    </footer>
    </div>;
     }
};


export default LoginPage;