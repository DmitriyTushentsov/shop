import React from "react";
class Navigation extends React.Component {
constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0
    };
  }

render() { 
    const items = this.props.links.map((text, index) => 
    <li className = "nav-item">
    <a data-index={index} onClick={ this.onClick.bind(this)} className={ index === this.state.activeIndex ? "nav-link active" : "nav-link" }>
    { text }
    </a>
    </li>
    );
    return  <div>
    <ul className = {this.props.navClass}>{ items }</ul>
    { Array.isArray(this.props.children) ? this.props.children[this.state.activeIndex] : ""}
    </div> ;
    
}
onClick(event) {
  	const indexString = event.target.getAttribute("data-index");
  	const index = Number(indexString);
  	this.setState({ activeIndex: index });
  }
}

export default Navigation;