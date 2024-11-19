export class ShaderCanvas {
	constructor(canvas) {
		this.canvas = canvas;
		this.gl = canvas.getContext("webgl");
		if (!this.gl) throw new Error("WebGL not supported");

		this.uniforms = {
			iTime: 0,
			iResolution: [canvas.width, canvas.height],
			iMouse: [0, 0]
		};

		// Store vertex shader source for reuse
		this.vertexShaderSource = `attribute vec2 position;
varying vec2 vUv;
void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
}
`;

		this.initWebGL();
		this.setupEventListeners();
		this.startTime = Date.now();
	}

	initWebGL(frag) {
		// Vertex shader - renders a fullscreen quad
		const vertexShader = this.compileShader(this.gl.VERTEX_SHADER, this.vertexShaderSource);

		// Default fragment shader
		const fragmentShader = this.compileShader(
			this.gl.FRAGMENT_SHADER,
			`precision highp float; void main() { gl_FragColor = vec4(1., 0., 1., 1.); }`
		);

		// Create shader program
		this.program = this.createProgram(vertexShader, fragmentShader);

		// Create fullscreen quad
		const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
		const buffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);

		// Setup attributes and uniforms
		const position = this.gl.getAttribLocation(this.program, "position");
		this.gl.enableVertexAttribArray(position);
		this.gl.vertexAttribPointer(position, 2, this.gl.FLOAT, false, 0, 0);

		// Store uniform locations
		this.uniformLocations = {
			iTime: this.gl.getUniformLocation(this.program, "iTime"),
			iResolution: this.gl.getUniformLocation(this.program, "iResolution"),
			iMouse: this.gl.getUniformLocation(this.program, "iMouse")
		};
	}

	createProgram(vertexShader, fragmentShader) {
		const program = this.gl.createProgram();
		this.gl.attachShader(program, vertexShader);
		this.gl.attachShader(program, fragmentShader);
		this.gl.linkProgram(program);

		if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
			throw new Error("Unable to initialize shader program: " + this.gl.getProgramInfoLog(program));
		}

		return program;
	}

	compileShader(type, source) {
		const shader = this.gl.createShader(type);
		this.gl.shaderSource(shader, source);
		this.gl.compileShader(shader);

		if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
			throw new Error("Shader compile error: " + this.gl.getShaderInfoLog(shader));
		}

		return shader;
	}

	setupEventListeners() {
		this.canvas.addEventListener("mousemove", (e) => {
			const rect = this.canvas.getBoundingClientRect();
			this.uniforms.iMouse[0] = e.clientX - rect.left;
			this.uniforms.iMouse[1] = this.canvas.height - (e.clientY - rect.top);
		});

		window.addEventListener("resize", () => {
			this.resize();
		});
	}

	resize() {
		const pixelRatio = window.devicePixelRatio || 1;
		const rect = this.canvas.getBoundingClientRect();

		// Set the canvas size in pixels
		this.canvas.width = rect.width * pixelRatio;
		this.canvas.height = rect.height * pixelRatio;

		// Update uniforms with the new dimensions
		this.uniforms.iResolution = [this.canvas.width, this.canvas.height];

		// Update the viewport
		this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
	}

	setFragmentShader(frag) {
		const source = `
      precision highp float;
      uniform float iTime;
      uniform vec2 iResolution;
      uniform vec2 iMouse;
      varying vec2 vUv;

      ${frag}

      void main() {
        mainImage(gl_FragColor, gl_FragCoord.xy);
      }
    `;

		try {
			// Compile new fragment shader
			const fragmentShader = this.compileShader(this.gl.FRAGMENT_SHADER, source);
			// Compile fresh vertex shader (since we can't reuse the old one)
			const vertexShader = this.compileShader(this.gl.VERTEX_SHADER, this.vertexShaderSource);

			// Create new program
			const newProgram = this.createProgram(vertexShader, fragmentShader);

			// Clean up old program
			if (this.program) {
				this.gl.deleteProgram(this.program);
			}

			// Switch to new program
			this.program = newProgram;

			// Update uniform locations
			this.uniformLocations = {
				iTime: this.gl.getUniformLocation(this.program, "iTime"),
				iResolution: this.gl.getUniformLocation(this.program, "iResolution"),
				iMouse: this.gl.getUniformLocation(this.program, "iMouse")
			};

			// Re-setup attributes
			const position = this.gl.getAttribLocation(this.program, "position");
			this.gl.enableVertexAttribArray(position);
			this.gl.vertexAttribPointer(position, 2, this.gl.FLOAT, false, 0, 0);
		} catch (e) {
			console.warn(source);
			console.error("Shader compilation error:", e);
		}
	}

	render() {
		this.uniforms.iTime = (Date.now() - this.startTime) / 1000;

		this.gl.useProgram(this.program);

		// Update uniforms
		this.gl.uniform1f(this.uniformLocations.iTime, this.uniforms.iTime);
		this.gl.uniform2fv(this.uniformLocations.iResolution, this.uniforms.iResolution);
		this.gl.uniform2fv(this.uniformLocations.iMouse, this.uniforms.iMouse);

		// Draw
		this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

		requestAnimationFrame(() => this.render());
	}
}
