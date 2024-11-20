EARLY ALPHA 🐺


AST or no ART

The end goal of the flowchart is to construct a frag string. I see two ways to do this;

1. As-you-go
- Each node is responsible for transforming and appending to the frag string.
- For example, all a sine node will do is `"sine(" + previousValue + ")"`


2. AST + JIT


### Node schema
`nodeData`
  - `dim` (int) - the dimensionality of the outputs. this means all the outputs are of the same dimensionality (i.e. the outputs of the `Time` node are all `vec1`s).
  - `out` (object) - arbitary source data. target nodes look at the id of the source handle and then do `out[sourceHandleId]` to get the data. So really you can have anything in here but it'll only be able to be used if there's a corresponding source handle.
