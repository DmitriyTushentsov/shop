import React from "react";
const ProductBox = class extends React.Component {
 render() {
 	return <div className="plashka">
         <h1>{ this.props.title }</h1>
         { this.props.children }
         </div>;
 }
}
export default ProductBox;