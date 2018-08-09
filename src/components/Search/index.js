import React, { Component } from 'react';
class Search extends Component {
  componentDidMount () {
    if (this.input) {
      this.input.focus()
    }
  }
  render () {
    const {value, onChange, onSubmit, children} = this.props
    return ( 
      <form onSubmit={onSubmit}>
        {children}
        <input placeholder="请输入姓名" type="text" 
          value={value} 
          onChange={onChange} 
          ref={(node) => {
            this.input = node
          }}
        />
        <button type="submit">查询</button>
      </form>
    )
  }
}
// 无状态组件
// let input
// const Search = ({value, onChange, onSubmit, children}) => 
//     <form onSubmit={onSubmit}>
//       {children}
//       <input placeholder="请输入姓名" type="text" 
//         value={value} 
//         onChange={onChange} 
//         ref={(node) => {input = node}}
//       />
//       <button type="submit">查询</button>
//     </form>
export default Search;