AST or no ART

The end goal of the flowchart is to construct a frag string. I see two ways to do this;

1. As-you-go
- Each node is responsible for transforming and appending to the frag string.

- For example, all a sine node will do is `"sine(" + previousValue + ")"`


2. AST + JIT
