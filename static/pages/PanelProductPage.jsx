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
                if (response.status == '401' || response.status == '403') {
                    window.location = "/panel/login";
                }
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
  
  onSave () {
      event.preventDefault();
        fetch(`/api/products/${this.props.match.params.id.toString()}`, {
        method: "put",
        credentials: "same-origin",
        body: JSON.stringify(this.state.product),
        headers: {
            "Content-Type": "application/json"
        }
        })
        .then(function(response) {
           if (response.status == '401' || response.status == '403') {
                    window.location = "/panel/login";
                }     
        })
        .catch(error => {
                
            });
  }
  
  
    
    onChange (event) {
        const name = event.target.name;
        this.state.product[name] = event.target.value;
        this.forceUpdate();
  }
    
    renderForm () {
        if (!this.state.product) { return false; }
       return <div className="row">
            <div className="col-md-8 offset-md-2 plashka">
            <form>
                <div className="form-group row">
                    <label htmlFor="prodTitle" className="col-sm-3 col-form-label col-form-label-sm">Наименование товара:</label>
                        <div className="col-sm-9">
                            <input 
                                name="title" 
                                value={ this.state.product.title } 
                                onChange={ this.onChange.bind(this) }
                            />
                        </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="prodTitle" className="col-sm-3 col-form-label col-form-label-sm">Новое наименование:</label>
                        <div className="col-sm-9">
                            <label htmlFor="prodTitle" >{this.state.product.title}</label>
                        </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="prodTitle" className="col-sm-3 col-form-label col-form-label-sm">Описание description:</label>
                        <div className="col-sm-9">
                            <input 
                                name="description" 
                                value={ this.state.product.description } 
                                onChange={ this.onChange.bind(this) }
                            />
                        </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="prodTitle" className="col-sm-3 col-form-label col-form-label-sm">Ключ key:</label>
                        <div className="col-sm-9">
                            <input 
                                name="key" 
                                value={ this.state.product.key } 
                                onChange={ this.onChange.bind(this) }
                            />
                        </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="prodTitle" className="col-sm-3 col-form-label col-form-label-sm">Слаг slug:</label>
                        <div className="col-sm-9">
                            <input 
                                name="slug" 
                                value={ this.state.product.slug } 
                                onChange={ this.onChange.bind(this) }
                            />
                        </div>
                </div>
                <button type="submit" className="btn btn-primary" onClick={this.onSave.bind(this)} >Сохранить</button>
                </form>
            </div>
        </div>; 
        
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
        { this.state.product && this.renderForm() }
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