export const nodes = [
	{
		id: "output-1",
		type: "output",
		data: {
			dim: 1,
			out: {
				frag: {}
			}
		},
		position: {
			x: 380,
			y: 660
		},
		measured: {
			width: 150,
			height: 117
		},
		selected: false,
		dragging: false
	},
	{
		id: "sine-1",
		type: "sine",
		data: {
			out: {
				sin: "sin((iTime + vec3(uv.x, uv.y, uv.x) + vec3(0., 2., 4.)))"
			}
		},
		position: {
			x: -20,
			y: 520
		},
		measured: {
			width: 80,
			height: 59
		},
		selected: false,
		dragging: false
	},
	{
		id: "time-2",
		type: "time",
		data: {
			dim: 1,
			out: {
				time: "iTime",
				sinTime: "sin(iTime)",
				cosTime: "cos(iTime)"
			}
		},
		position: {
			x: -360,
			y: 340
		},
		measured: {
			width: 116,
			height: 131
		},
		selected: false,
		dragging: false
	},
	{
		id: "add-3",
		type: "add",
		data: {
			dim: 1,
			out: {
				sum: "(iTime + vec3(uv.x, uv.y, uv.x) + vec3(0., 2., 4.))"
			}
		},
		position: {
			x: -160,
			y: 520
		},
		measured: {
			width: 80,
			height: 59
		},
		selected: false,
		dragging: false
	},
	{
		id: "uv-4",
		type: "uv",
		data: {
			dim: 2,
			out: {
				uv: "uv"
			}
		},
		position: {
			x: -680,
			y: 560
		},
		measured: {
			width: 80,
			height: 83
		},
		selected: false,
		dragging: false
	},
	{
		id: "split-5",
		type: "split",
		data: {
			dim: 1,
			out: {
				x: "uv.x",
				y: "uv.y"
			}
		},
		position: {
			x: -560,
			y: 540
		},
		measured: {
			width: 80,
			height: 107
		},
		selected: false,
		dragging: false
	},
	{
		id: "vec-6",
		type: "vec",
		data: {
			dim: 3,
			out: {
				x: 0,
				y: 2,
				z: 4,
				w: 0,
				outVec: "vec3(0., 2., 4.)",
				dim: 3
			}
		},
		position: {
			x: -400,
			y: 700
		},
		measured: {
			width: 203,
			height: 145
		},
		selected: false,
		dragging: false
	},
	{
		id: "multiply-7",
		type: "multiply",
		data: {
			dim: 1,
			out: {
				product: "(0.5 * sin((iTime + vec3(uv.x, uv.y, uv.x) + vec3(0., 2., 4.))))"
			}
		},
		position: {
			x: 140,
			y: 580
		},
		measured: {
			width: 80,
			height: 59
		},
		selected: false,
		dragging: false
	},
	{
		id: "vec-8",
		type: "vec",
		data: {
			dim: 1,
			out: {
				x: 0.5,
				y: 0,
				z: 0,
				w: 0,
				outVec: "0.5",
				dim: 1
			}
		},
		position: {
			x: -120,
			y: 640
		},
		measured: {
			width: 203,
			height: 93
		},
		selected: false,
		dragging: false
	},
	{
		id: "vec-9",
		type: "vec",
		data: {
			dim: 1,
			out: {
				x: 0.5,
				y: 0,
				z: 0,
				w: 0,
				outVec: "0.5",
				dim: 1
			}
		},
		position: {
			x: 0,
			y: 780
		},
		measured: {
			width: 203,
			height: 93
		},
		selected: false,
		dragging: false
	},
	{
		id: "add-10",
		type: "add",
		data: {
			dim: 1,
			out: {
				sum: "(0.5 + (0.5 * sin((iTime + vec3(uv.x, uv.y, uv.x) + vec3(0., 2., 4.)))))"
			}
		},
		position: {
			x: 260,
			y: 700
		},
		measured: {
			width: 80,
			height: 59
		},
		selected: false,
		dragging: false
	},
	{
		id: "vec-11",
		type: "vec",
		data: {
			dim: 3,
			out: {
				x: 0,
				y: 0,
				z: 0,
				w: 0,
				outVec: "vec3(uv.x, uv.y, uv.x)",
				dim: 3
			}
		},
		position: {
			x: -440,
			y: 520
		},
		measured: {
			width: 143,
			height: 139
		},
		selected: false,
		dragging: false
	}
];

export const edges = [
	{
		source: "time-2",
		sourceHandle: "time",
		target: "add-3",
		id: "xy-edge__time-2time-add-3",
		selected: false
	},
	{
		id: "time-2-sine-1",
		source: "sine-1",
		target: "time-2",
		class: "",
		selected: false
	},
	{
		source: "uv-4",
		sourceHandle: "uv",
		target: "split-5",
		id: "xy-edge__uv-4uv-split-5",
		selected: false
	},
	{
		source: "add-3",
		sourceHandle: "sum",
		target: "sine-1",
		id: "xy-edge__add-3sum-sine-1",
		selected: false
	},
	{
		source: "vec-8",
		sourceHandle: "outVec",
		target: "multiply-7",
		id: "xy-edge__vec-8outVec-multiply-7",
		selected: false
	},
	{
		source: "sine-1",
		sourceHandle: "sin",
		target: "multiply-7",
		id: "xy-edge__sine-1sin-multiply-7",
		selected: false
	},
	{
		source: "vec-9",
		sourceHandle: "outVec",
		target: "add-10",
		id: "xy-edge__vec-9outVec-add-10",
		selected: false
	},
	{
		source: "vec-11",
		sourceHandle: "outVec",
		target: "add-3",
		id: "xy-edge__vec-11outVec-add-3",
		selected: false
	},
	{
		source: "add-10",
		sourceHandle: "sum",
		target: "output-1",
		id: "xy-edge__add-10sum-output-1",
		selected: false
	},
	{
		source: "multiply-7",
		sourceHandle: "product",
		target: "add-10",
		id: "xy-edge__multiply-7product-add-10",
		selected: false
	},
	{
		source: "split-5",
		sourceHandle: "x",
		target: "vec-11",
		targetHandle: "x",
		id: "xy-edge__split-5x-vec-11x",
		selected: false
	},
	{
		source: "split-5",
		sourceHandle: "y",
		target: "vec-11",
		targetHandle: "y",
		id: "xy-edge__split-5y-vec-11y",
		selected: false
	},
	{
		source: "split-5",
		sourceHandle: "x",
		target: "vec-11",
		targetHandle: "z",
		id: "xy-edge__split-5x-vec-11z",
		selected: false
	},
	{
		source: "vec-6",
		sourceHandle: "outVec",
		target: "add-3",
		id: "xy-edge__vec-6outVec-add-3"
	}
];

export const viewport = {
	x: 292.6651857974066,
	y: -16.160222303522346,
	zoom: 0.7290046894082893
};
