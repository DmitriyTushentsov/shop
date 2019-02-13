import React from "react";
import ReactDOM from "react-dom";
import ProductPage from "./pages/ProductPage.jsx";
import IndexPage from "./pages/IndexPage.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PanelProductPage from "./pages/PanelProductPage.jsx";
import PanelProductsPage from "./pages/PanelProductsPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import { Router, Route, Switch, Redirect} from "react-router-dom";
import { createBrowserHistory } from "history";
const history = createBrowserHistory();
class App extends React.Component {
  render() {
    return <Router history={ history }>
      <Switch>
        <Route exact path="/" component={ IndexPage } />
        <Route exact path="/products/:product" component={ ProductPage } />
        <Route exact path="/panel" component={ PanelProductsPage } />
        <ProtectedRoute exact path="/panel/product" component={ PanelProductsPage } />
        <Route exact path="/panel/product/:id" component={ PanelProductPage } />
        <Route exact path="/panel/login" component={ LoginPage } />
        <Route path="*" component={ErrorPage}/>
      </Switch>
    </Router>;
  }
}
const instance = <App></App>;
ReactDOM.render(instance, document.getElementById("target"));