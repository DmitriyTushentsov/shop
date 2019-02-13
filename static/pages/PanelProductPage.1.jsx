const appLinks = ["Услуги", "Цены", "О компании", "Контакты"];
const tabLinks = ["Фотографии", "Описание", "Отзывы"];
const URL = require("url");
import Navigation from "../components/Navigation.jsx";
import ProductBox from "../components/ProductBox.jsx";
import React from "react";

const PanelProductPage = class extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            product: 0,
            status : 'idle'
            
        };
    }
    
    componentDidMount () {
        this.setState({
                    status : 'pending'
                })
                const id = this.props.match.params.id.toString() ;
        fetch(`/api/products/${id}`)
            .then(function(response) {
                return response.json();
            })
            .then(function(json) {
                this.setState({
                    product: json,
                    status : 'ready'
                });
            }.bind(this))
            .catch(error => {
                this.setState({
                    status : 'error'
                })
            });
    }
    
     renderError (){
      return <div className="alert alert-danger" role="alert">
            Product not found!
            </div>;
  }
    
    renderProducts() {
        if (!this.state.product) { return false; }
        let items = <div>
            <div className="row">
            <div className="col-md-4 image">
            <img src={this.state.product.img} width="100%"></img>
            </div>
            <div className="col-md-8 product">
                <table className="table table-sm">
                    <tbody>
                        <tr>
                            <td>Цена</td>
                            <td>{this.state.product.price} руб.</td>
                        </tr>
                        <tr>
                            <td>Масса</td>
                            <td>2.5 кг.</td>
                        </tr>
                        <tr>
                            <td>Габариты</td>
                            <td>20 х 50 х 50</td>
                        </tr>
                    </tbody>
                </table>    
            </div>
        </div>
        <div className="row">
            <div className="col-md-12 image">
              <Navigation links={ tabLinks } navClass="nav nav-tabs">
                <div><h2>Фотографии</h2></div> 
                <div><h2>Описание</h2></div> 
                <div><h2>Отзывы</h2></div> 
              </Navigation>
            </div>
        </div>
          <div className="row">
            <div className="col-md-12">
                <p>{this.state.product.description}</p>
            </div>
        </div>
</div>;

return <ProductBox title={this.state.product.title}>{ items }</ProductBox>;

    }
    
    render() { 
   
 return <div className="container">
    <header>
        <div className="row">
            <div className="col-md-8 offset-md-2 panel">
              <Navigation links={ appLinks } navClass="nav"></Navigation>
            </div> 
        </div>
    </header>
    <main>
        <div className="row">
            <div className="col-md-8 offset-md-2">
                { this.state.product ? this.renderProducts() : this.renderError() }
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


export default PanelProductPage;