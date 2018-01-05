import React, { Component } from 'react'
import SortableTree, {
  toggleExpandedForAll,
  changeNodeAtPath,
  getVisibleNodeInfoAtIndex,
  getNodeAtPath
} from 'react-sortable-tree'
import QuestionTheme from './QuestionTheme'

const Scheme = ({ questions, handleQuestionTreeChange }) => {
  return (
    <SortableTree
      theme={QuestionTheme}
      treeData={questions}
      onChange={handleQuestionTreeChange}
      style={{ flex: '1 0 50%', padding: '0 0 0 15px' }}
      isVirtualized={true}
    />
  )
}


/*class Scheme extends Component {
  constructor (props) {
    super(props)

    this.state = {
      searchString: '',
      searchFocusIndex: 0,
      searchFoundCount: null,
      treeData: [
        { title: 'IT Manager' },
        {
          title: 'Regional Manager',
          expanded: true,
          children: [{ title: 'Branch Manager' }],
        },
      ],
    }

    this.updateTreeData = this.updateTreeData.bind(this)
    this.getNodeKey = this.getNodeKey.bind(this)
  }

  getNodeKey = ({ treeIndex }) => treeIndex

  updateTreeData (treeData) {
    this.setState({ treeData })
  }

  render () {
    const {
      treeData,
      searchString,
      searchFocusIndex,
      searchFoundCount
    } = this.state

    return (
      <SortableTree
        theme={QuestionTheme}
        treeData={treeData}
        onChange={this.updateTreeData}
        searchQuery={searchString}
        searchFocusOffset={searchFocusIndex}
        searchFinishCallback={matches =>
          this.setState({
            searchFoundCount: matches.length,
            searchFocusIndex:
              matches.length > 0 ? searchFocusIndex % matches.length : 0
          })}
        style={{ flex: '1 0 50%', padding: '0 0 0 15px' }}
        canDrag={({ node }) => true}
        canDrop={({ nextParent }) => true}
        isVirtualized={true}
      />
    )
  }
}*/

export default Scheme
