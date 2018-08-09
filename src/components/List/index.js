import React, { Component } from 'react';
import { sortBy } from 'lodash'
import classNames from 'classnames'
import Btn from './../Button'
import './index.css';

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse(),
}

const Sort = ({sortKey, activeSortKey, onSort, children}) => {
  const sortClass = classNames(
    'btn-inline',
    {'btn-active':sortKey === activeSortKey}
  )
  return (
    <Btn className={sortClass} onClick={() => onSort(sortKey)}>{children}</Btn>
  )
}
class List extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isSortReverse: false,
      sortKey: 'NONE',
    }
    this.onSort = this.onSort.bind(this)
  }
  onSort (sortKey) {
    const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse
    this.setState({sortKey, isSortReverse})
  }
  render () {
    const {isSortReverse, sortKey} = this.state
    const {list, onDismiss} = this.props
    const sortList = SORTS[sortKey](list)
    const reverseSortList = isSortReverse ? sortList.reverse() : sortList
    return (
      <div>
        <div className="titles">
          <span style={{width:'40%'}}>
            <Sort sortKey={'TITLE'} activeSortKey={sortKey} onSort={this.onSort}>标题</Sort>
          </span>
          <span style={{width:'30%'}}>
            <Sort sortKey={'AUTHOR'} activeSortKey={sortKey} onSort={this.onSort}>作者</Sort>
          </span>
          <span style={{width:'10%'}}>
            <Sort sortKey={'COMMENTS'} activeSortKey={sortKey} onSort={this.onSort}>评论数</Sort>
          </span>
          <span style={{width:'10%'}}>
            <Sort sortKey={'POINTS'} activeSortKey={sortKey} onSort={this.onSort}>评论点</Sort>
          </span>
          <span style={{width:'10%'}}>
            操作
          </span>
        </div>
        { 
          reverseSortList.map(item => 
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
        }
      </div>
    )
  }
}
// 无状态组件的写法
// const List = ({list, isSortReverse, sortKey, onSort, onDismiss}) => {
//   const sortList = SORTS[sortKey](list)
//   const reverseSortList = isSortReverse ? sortList.reverse() : sortList
//   return (
//     <div>
//       <div className="titles">
//         <span style={{width:'40%'}}>
//           <Sort sortKey={'TITLE'} activeSortKey={sortKey} onSort={onSort}>标题</Sort>
//         </span>
//         <span style={{width:'30%'}}>
//           <Sort sortKey={'AUTHOR'} activeSortKey={sortKey} onSort={onSort}>作者</Sort>
//         </span>
//         <span style={{width:'10%'}}>
//           <Sort sortKey={'COMMENTS'} activeSortKey={sortKey} onSort={onSort}>评论数</Sort>
//         </span>
//         <span style={{width:'10%'}}>
//           <Sort sortKey={'POINTS'} activeSortKey={sortKey} onSort={onSort}>评论点</Sort>
//         </span>
//         <span style={{width:'10%'}}>
//           操作
//         </span>
//       </div>
//       { 
//         reverseSortList.map(item => 
//           <div key={item.objectID}>
//             <span>
//               <a href={item.url}>{item.title}</a>
//             </span>
//             <span>{item.author}</span>
//             <span>{item.num_comments}</span>
//             <span>{item.points}</span>
//             <span className="btn">
//               <Btn className="delete"
//                 onClick = {() => onDismiss(item.objectID)}
//               >dismiss</Btn>
//             </span>
//           </div>
//         )
//       }
//     </div>
//   )
// }
export default List;