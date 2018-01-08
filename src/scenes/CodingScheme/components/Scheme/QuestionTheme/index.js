import nodeContentRenderer from './node-content-renderer'
import treeNodeRenderer from './tree-node-renderer'

export default {
  nodeContentRenderer,
  treeNodeRenderer,
  scaffoldBlockPxWidth: 100,
  slideRegionSize: 50,
  rowHeight: 75,
  reactVirtualizedListProps: {
    overscanRowCount: 10,
  }
}
