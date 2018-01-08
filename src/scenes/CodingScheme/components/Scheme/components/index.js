import QuestionNode from './QuestionNode'
import TreeNode from './TreeNode'

export const QuestionTheme = {
  nodeContentRenderer: QuestionNode,
  treeNodeRenderer: TreeNode,
  scaffoldBlockPxWidth: 100,
  slideRegionSize: 50,
  rowHeight: 75,
  reactVirtualizedListProps: {
    overscanRowCount: 10,
  }
}
