const appLinks = ["Услуги", "Цены", "О компании", "Контакты"];
import Navigation from "../components/Navigation.jsx";
import ProductBox from "../components/ProductBox.jsx";
import { Link } from "react-router-dom";
import React from "react";
const IndexPage = class extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            products: 0,
            status : "idle"
            
        };
    }
  
    componentDidMount () {
        this.setState({
                    status : 'pending'
                })
        fetch("/api/products")
            .then(function(response) {
                return response.json();
            })
            .then(function(json) {
                this.setState({
                    status: 'ready',
                    products: json
                });
            }.bind(this))
            .catch(error => {
                this.setState({
                    status : 'error'
                })
            });

    }
  
    renderReady (){
     return <div className="alert alert-primary" role="alert">
            Загрузка прошла успешно!
            </div>;
  }
  renderError (){
      return <div className="alert alert-danger" role="alert">
            Не удалось загрузить данные!
            </div>;
  }

  
      renderProducts() {
        if (!this.state.products) { return false; }
          return this.state.products.map( product => (
              <div className="card">
                <img className="card-img-top" src={product.img} alt="Card image cap" />
                <div className="card-body">
                  <h5 className="card-title" key={product.title}>{product.title}</h5>
                  <p className="card-text">{product.description}</p>
                  <p className="card-text">Цена: <b>{product.price} руб.</b></p>
                  <Link className="btn btn-primary" to={"/products/" + product.key + "-" + product.slug} role="button">Купить</Link>
                </div>
            </div>
              
              ));
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
      { this.state.status='ready' ? this.renderReady() : this.renderError() }
        <div className="card-columns">
            <div className="row">
                <div className="col-md-10 offset-md-4">
                    { this.state.products ? this.renderProducts() : false }
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


export default IndexPage;