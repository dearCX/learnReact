import React, { Component } from 'react';
import logo from './logo.svg';
import { Table, Button, Input, Modal, Form, message} from 'antd'
import './App.css';

const DEFAULT_QUERY = 'redux'
const DEFAULT_HPP = 100
const PATH_BASE = 'https://hn.algolia.com/api/v1'
// const PATH_BASE = 'https://hn.foo.bar.com/api/v1'
const PATH_SEARCH = '/search'
const PARAM_SEARCH = 'query='
const PARAM_PAGE = 'page='
const PARAM_HPP = 'hitsPerPage='
const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}`
const list = [
  {
    title: 'React',
    url: 'https://facebook.github.io/react/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://github.com/reactjs/redux',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];
const dataSource = [{
  key: 0,
  title: '胡彦斌',
  age: 32,
  address: '西湖区湖底公园1号'
}, {
  key: 1,
  title: '胡彦祖',
  age: 42,
  address: '西湖区湖底公园1号'
}];
// isSearched函数三种写法
//方法一
// const isSearched = searchItem => item =>
//   item.name.toLowerCase().includes(searchItem.toLowerCase());
//方法二
// function isSearched (searchItem) {
//   return function(item){
//     return item.name.toLowerCase().includes(searchItem.toLowerCase());
//   }
// }
//方法三
function isSearched (searchItem) {
  return item => {
    if (item.title !== null) {
      return item.title.toLowerCase().includes(searchItem.toLowerCase());
    }
  }
}
//函数式无状态组件
// function Search(props) {
//   const { value, onChange, children } = props
//   return (
//     <form>
//       {children}<input placeholder="请输入姓名" type="text" value={value} onChange={onChange}/>
//     </form>
//   )
// }
//改写成es6
const Search = ({value, onChange, onSubmit, children}) => 
    <form onSubmit={onSubmit}>
      {children}<input placeholder="请输入姓名" type="text" value={value} onChange={onChange}/>
      <button type="submit">查询</button>
    </form>
const List = ({list, onDismiss}) =>
  list.map(item => 
    <div key={item.objectID}>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
      <span className="btn">
        <Btn className="delete"
          onClick = {() => onDismiss(item.objectID)}
        >dismiss</Btn>
      </span>
    </div>
  )
  // list.filter(isSearched(textValue)).map(item => 
  //   <div key={item.objectID}>
  //     <span>
  //       <a href={item.url}>{item.title}</a>
  //     </span>
  //     <span>{item.author}</span>
  //     <span>{item.num_comments}</span>
  //     <span>{item.points}</span>
  //     <span className="btn">
  //       <Btn className="delete"
  //         onClick = {() => onDismiss(item.objectID)}
  //       >dismiss</Btn>
  //     </span>
  //   </div>
  // )
const Btn = ({className = '', onClick, children}) => 
  <button
    className={className}
    onClick={onClick}
    type="button"
    >{children}</button>
// function List(props) {
//   const {list, textValue, onDismiss} = props
//   return (
//     list.filter(isSearched(textValue)).map(item => 
//       <div key={item.objectID}>
//       <span>
//         <a href={item.url}>{item.name}</a>
//       </span>
//       <span>{item.author}</span>
//       <span>{item.num_comments}</span>
//       <span>{item.points}</span>
//       <span className="btn">
//         <Btn className="delete"
//           onClick = {() => onDismiss(item.objectID)}
//         >dismiss</Btn>
//       </span>
//     </div>
//     )
//   )
// }
// function Btn(props) {
//   const {className = '', onClick, children} = props
//   return (
//     <button
//       className={className}
//       onClick={onClick}
//       type="button"
//     >{children}</button>
//   )
// }
//es类组件
class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      error: null,
      textKey: '', //客户端缓存
      results: null, //客户端缓存
      textValue: DEFAULT_QUERY,
      list,
      dataSource,
      visible: false,
      title: '',
      age: '',
      address: '',
      searchItem: ''
    }
    this.deleteOne = this.deleteOne.bind(this)
    this.showModal = this.showModal.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleOk = this.handleOk.bind(this)
    this.handleChangeName = this.handleChangeName.bind(this)
    this.handleChangeAge = this.handleChangeAge.bind(this)
    this.handleChangeAddress = this.handleChangeAddress.bind(this)
    this.searchChange = this.searchChange.bind(this)
    this.onDismiss = this.onDismiss.bind(this)
    this.textSearch = this.textSearch.bind(this)
    this.setTopSearchStories = this.setTopSearchStories.bind(this)
    this.fetchTopSearchStories = this.fetchTopSearchStories.bind(this)
    this.onSearchSubmit = this.onSearchSubmit.bind(this)
    this.needToSearchTopStories = this.needToSearchTopStories.bind(this)
  }
  needToSearchTopStories (textValue) {
    return !this.state.results[textValue]
  }
  onSearchSubmit (e) {
    const {textValue} = this.state
    this.setState({textKey:textValue})
    if (this.needToSearchTopStories(textValue)) {
      this.fetchTopSearchStories(textValue)
    }
    e.preventDefault()
  }
  setTopSearchStories (result) {
    const {hits , page} = result
    const {textKey, results} = this.state
    const oldHits = results && results[textKey]? results[textKey].hits : []
    const undateHits = [...hits, ...oldHits]
    this.setState({
      results: {
        ...results,
        [textKey]: {
          hits: undateHits,
          page
        }
      }
    })
  }
  fetchTopSearchStories (textValue, page=0) {
    // https://hn.algolia.com/api/v1/search?query=redux
    // fetch(`/api${PATH_SEARCH}?${PARAM_SEARCH}${textValue}`).then(response => response.json())
    fetch(url + textValue + '&' + PARAM_PAGE + page + '&' + PARAM_HPP + DEFAULT_HPP).then(response => response.json())
      .then(result => this.setTopSearchStories(result))
      .catch(e => this.setState({error:e}))
  }
  searchChange (e) {
    this.setState({
      searchItem: e.target.value
    })
  }
  deleteOne (id) {
    let data = this.state.dataSource.filter((d, index) => index !== id)
    this.setState({dataSource : data})
  }
  showModal () {
    this.setState({visible: true})
  }
  handleCancel (e) {
    this.setState({
      title: '',
      age: '',
      address: '',
      visible: false
    })
  }
  handleOk (e) {
    const arr = this.state.dataSource
    const key = this.state.dataSource[this.state.dataSource.length-1].key
    arr.push({
      key:key+1,
      title:this.state.title,
      age:this.state.age,
      address:this.state.address
    })
    this.setState({
      visible: false,
      dataSource: arr,
      title:'',
      age:'',
      address:''
    })
  }
  handleChangeName (e) {
    this.setState({
      title: e.target.value
    })
  }
  handleChangeAge (e) {
    this.setState({
      age: e.target.value
    })
  }
  handleChangeAddress (e) {
    this.setState({
      address: e.target.value
    })
  }
  onDismiss(id) {
    const {textKey, results} = this.state
    const {hits, page} = results[textKey]
    const updatedList = hits.filter(item => item.objectID !== id)
    this.setState({
      // result: Object.assign({}, this.state.result, {hits: updatedList})
      // 改写
      results: {
        ...results, 
        [textKey]:{hits: updatedList, page}
      }
    })
  }
  textSearch (e) {
    this.setState({
      textValue:e.target.value
    })
  }
  componentDidMount () {
    const {textValue} = this.state
    this.setState({textKey:textValue})
    this.fetchTopSearchStories(textValue)
  }
  render() {
    const {error, textKey, textValue, list, title, age, address, dataSource, searchItem, results} = this.state
    const page = (results && results[textKey] && results[textKey].page) || 0
    const data = (results&&results[textKey] && results[textKey].hits) || []
    if (error) {
      return message.warning('请求错误，请重试！');
    }
    const columns = [{
      title: '姓名',
      dataIndex: 'title',
      key: 'title',
    }, {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    }, {
      title: '住址',
      dataIndex: 'address',
      key: 'address',
    }, {
      title: '操作',
      key: 'action',
      render: (text, record, index) => (
        <a href="javascript:;" onClick={() => {
          Modal.confirm({
            title:'删除提示',
            content:`确定删除${record.title}吗？`,
            cancelText: '取消',
            okText: '确定',
            maskClosable: true,
            onOk:() => {
              this.deleteOne(index)
            }
          })
        }}>删除</a>
      )
    }];
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <button>测试</button><br/>
        <button>元素</button><br/>
        {list.map(l => {
          return <div key={l.objectID}>{l.title}</div>
        })}
        <Search value={textValue} onChange={this.textSearch} onSubmit={this.onSearchSubmit}>查询：</Search>
        { error 
          ? <div>暂无数据</div>
          :<List 
            list={data}
            textValue={textValue}
            onDismiss={this.onDismiss}
          ></List> }
        <div>
          <Btn className="largeBtn" onClick = {() => this.fetchTopSearchStories(textKey, page+1)}
            >更多</Btn>
        </div>
        <Input placeholder="请输入姓名" type="text" onChange={this.searchChange}/>
        <Button type="primary" onClick={this.showModal}>添加</Button>
        <Table dataSource={dataSource.filter(isSearched(searchItem))} columns={columns} />
        <Modal
          title="添加角色"
          visible={this.state.visible}
          cancelText='取消'
          okText='确定'
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form>
            <Input placeholder="请输入姓名" value={title} onChange={this.handleChangeName}/>
            <Input placeholder="请输入年龄" value={age} onChange={this.handleChangeAge}/>
            <Input placeholder="请输入地址" value={address} onChange={this.handleChangeAddress}/>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default App;
