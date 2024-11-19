import AddNode from "./nodes/add.svelte"
import CommentNode from "./nodes/comment.svelte"
import DivideNode from "./nodes/divide.svelte"
import MultiplyNode from "./nodes/multiply.svelte"
import OneMinusNode from "./nodes/one-minus.svelte"
import OutputNode from "./nodes/output.svelte"
import SineNode from "./nodes/sine.svelte"
import SplitNode from "./nodes/split.svelte"
import SubtractNode from "./nodes/subtract.svelte"
import TimeNode from "./nodes/time.svelte"
import UvNode from "./nodes/uv.svelte"
import VecNode from "./nodes/vec.svelte"

export const nodeTypes = {
  add: AddNode,
  comment: CommentNode,
  divide: DivideNode,
  multiply: MultiplyNode,
  oneMinus: OneMinusNode,
  output: OutputNode,
  sine: SineNode,
  split: SplitNode,
  subtract: SubtractNode,
  time: TimeNode,
  uv: UvNode,
  vec: VecNode
}
