const appLinks = ["Услуги", "Цены", "О компании", "Контакты"];
import Navigation from "../components/Navigation.jsx";
import React from "react";
const ErrorPage = class extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            products: 0,
            status : "idle"
            
        };
    }
  
    render() { 
        return <div className="container">
            <header>
            <div className="row">
            <div className="col-md-8 offset-md-2">
              <Navigation links={ appLinks } navClass="nav"></Navigation>
            </div> 
        </div>
    </header>
   <main>
        <div className="card-columns">
            <div className="row">
                <div className="col-md-6 offset-md-2">
                    <p>Not found</p>
                </div>
            </div>
        </div>
</main>
    <footer>
        <div className="row">
            <div className="col-md-8 plashka offset-md-2">
                &copy; Сайт интернет-магазина 2018
            </div>
        </div>
    </footer>
    </div>;
     }
};


export default ErrorPage;