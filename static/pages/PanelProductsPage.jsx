const appLinks = ["Услуги", "Цены", "О компании", "Контакты"];
import Navigation from "../components/Navigation.jsx";
import ProductBox from "../components/ProductBox.jsx";
import { Link } from "react-router-dom";
import React from "react";
const PanelProductsPage = class extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            products: 0,
            status : "idle",
            newProduct : { title : "", 
                            key : "",
                            slug : "",
                            description : "",
                            price : ""
            }
        };
    }
  
    componentDidMount () {
        this.setState({
                    status : 'pending'
                });
        fetch("/api/products")
            .then(function(response) {
                 if (response.status == '401' || response.status == '403') {
                    window.location = "/panel/login";
                }    
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

  renderForm () {
        if (!this.state.newProduct) { return false; }
       return <div className="row">
            <div className="col-sm-8 offset-sm-2 plashka">
            <form>
                <div className="form-group row">
                    <label htmlFor="prodTitle" className="col-sm-3 col-form-label col-form-label-sm">Наименование товара:</label>
                        <div className="col-sm-9">
                            <input 
                                name="title" 
                                value={ this.state.newProduct.title } 
                                onChange={ this.onChange.bind(this) }
                            />
                        </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="prodTitle" className="col-sm-3 col-form-label col-form-label-sm">Краткое описание:</label>
                        <div className="col-sm-9">
                            <input 
                                name="description" 
                                value={ this.state.newProduct.description } 
                                onChange={ this.onChange.bind(this) }
                            />
                        </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="prodTitle" className="col-sm-3 col-form-label col-form-label-sm">Цена товара:</label>
                        <div className="col-sm-9">
                            <input 
                                name="price" 
                                value={ this.state.newProduct.price } 
                                onChange={ this.onChange.bind(this) }
                            />
                        </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="prodTitle" className="col-sm-3 col-form-label col-form-label-sm">Ключ key:</label>
                        <div className="col-sm-9">
                            <input 
                                name="key" 
                                value={ this.state.newProduct.key } 
                                onChange={ this.onChange.bind(this) }
                            />
                        </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="prodTitle" className="col-sm-3 col-form-label col-form-label-sm">Слаг slug:</label>
                        <div className="col-sm-9">
                            <input 
                                name="slug" 
                                value={ this.state.newProduct.slug } 
                                onChange={ this.onChange.bind(this) }
                            />
                        </div>
                </div>
                <button type="submit" className="btn btn-primary" onClick={this.onSave.bind(this)} >Добавить товар</button>
                </form>
            </div>
        </div>; 
        
    }
  
   onSave () {
      event.preventDefault();
        fetch(`/api/products/`, {
        method: "post",
        credentials: "same-origin",
        body: JSON.stringify(this.state.newProduct),
        headers: {
            "Content-Type": "application/json"
        }
        })
        .then(function(response) {
                 if (response.status == '401' || response.status == '403') {
                    window.location = "/panel/login";
                }    
                return response.json();
            })
        .then(function(json) {
                this.state.products.push(json);
                this.forceUpdate();
                 this.setState({
                    newProduct : { title : "", 
                            key : "",
                            slug : "",
                            description : "",
                            price : "" }
                });
        })
        .catch(error => {
                
            });
  }
  
  
    
    onChange (event) {
        const name = event.target.name;
        this.state.newProduct[name] = event.target.value;
        this.forceUpdate();
  }
  
      renderProducts() {
        if (!this.state.products) { return false; }
          return this.state.products.map( product => (
              <div className="card" >
                <img className="card-img-top" src={product.img} alt="Card image cap" height="230px" />
                <div className="card-body">
                  <h5 className="card-title" key={product.title}>{product.title}</h5>
                  <p className="card-text">{product.description}</p>
                  <p className="card-text">Цена: <b>{product.price} руб.</b></p>
                  <Link className="btn btn-primary" to={"/panel/product/" + product._id} role="button">Изменить</Link>
                </div>
            </div>
              
              ));
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
      { this.state.newProduct && this.renderForm() }
      
        
            <div className="row">
                <div className="col-sm-8 offset-sm-2">
                <div className="card-columns">
                    { this.state.products ? this.renderProducts() : false }
                </div>
            </div>
        </div>
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


export default PanelProductsPage;