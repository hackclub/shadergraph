<script>
	import { onMount } from "svelte";
	import { goto, preloadData } from "$app/navigation";
	import { ShaderCanvas } from "$lib/shader-canvas";
	import DissolveButton from "$lib/components/dissolve-button.svelte";
	import * as m from "$lib/paraglide/messages";

	const { data } = $props();
	console.log({ data });

	const frag = `
vec4 permute(vec4 i) {
     vec4 im = mod(i, 289.0);
     return mod(((im*34.0)+10.0)*im, 289.0);
}

float psrdnoise(vec3 x, vec3 period, float alpha, out vec3 gradient)
{
  const mat3 M = mat3(0.0, 1.0, 1.0, 1.0, 0.0, 1.0,  1.0, 1.0, 0.0);
  const mat3 Mi = mat3(-0.5, 0.5, 0.5, 0.5,-0.5, 0.5, 0.5, 0.5,-0.5);
  vec3 uvw = M * x;
  vec3 i0 = floor(uvw), f0 = fract(uvw);
  vec3 g_ = step(f0.xyx, f0.yzz), l_ = 1.0 - g_;
  vec3 g = vec3(l_.z, g_.xy), l = vec3(l_.xy, g_.z);
  vec3 o1 = min( g, l ), o2 = max( g, l );
  vec3 i1 = i0 + o1, i2 = i0 + o2, i3 = i0 + vec3(1.0);
  vec3 v0 = Mi * i0, v1 = Mi * i1, v2 = Mi * i2, v3 = Mi * i3;
  vec3 x0 = x - v0, x1 = x - v1, x2 = x - v2, x3 = x - v3;
  if(any(greaterThan(period, vec3(0.0)))) {
    vec4 vx = vec4(v0.x, v1.x, v2.x, v3.x);
    vec4 vy = vec4(v0.y, v1.y, v2.y, v3.y);
    vec4 vz = vec4(v0.z, v1.z, v2.z, v3.z);
    if(period.x > 0.0) vx = mod(vx, period.x);
    if(period.y > 0.0) vy = mod(vy, period.y);
    if(period.z > 0.0) vz = mod(vz, period.z);
    i0 = floor(M * vec3(vx.x, vy.x, vz.x) + 0.5);
    i1 = floor(M * vec3(vx.y, vy.y, vz.y) + 0.5);
    i2 = floor(M * vec3(vx.z, vy.z, vz.z) + 0.5);
    i3 = floor(M * vec3(vx.w, vy.w, vz.w) + 0.5);
  }
  vec4 hash = permute( permute( permute(
              vec4(i0.z, i1.z, i2.z, i3.z ))
            + vec4(i0.y, i1.y, i2.y, i3.y ))
            + vec4(i0.x, i1.x, i2.x, i3.x ));
  vec4 theta = hash * 3.883222077;
  vec4 sz = hash * -0.006920415 + 0.996539792;
  vec4 psi = hash * 0.108705628;
  vec4 Ct = cos(theta), St = sin(theta);
  vec4 sz_prime = sqrt( 1.0 - sz*sz );
  vec4 gx, gy, gz;
  if(alpha != 0.0) {
    vec4 px = Ct * sz_prime, py = St * sz_prime, pz = sz;
    vec4 Sp = sin(psi), Cp = cos(psi), Ctp = St*Sp - Ct*Cp;
    vec4 qx = mix( Ctp*St, Sp, sz), qy = mix(-Ctp*Ct, Cp, sz);
    vec4 qz = -(py*Cp + px*Sp);
    vec4 Sa = vec4(sin(alpha)), Ca = vec4(cos(alpha));
    gx = Ca*px + Sa*qx; gy = Ca*py + Sa*qy; gz = Ca*pz + Sa*qz;
  }
  else {
    gx = Ct * sz_prime; gy = St * sz_prime; gz = sz;
  }
  vec3 g0 = vec3(gx.x, gy.x, gz.x), g1 = vec3(gx.y, gy.y, gz.y);
  vec3 g2 = vec3(gx.z, gy.z, gz.z), g3 = vec3(gx.w, gy.w, gz.w);
  vec4 w = 0.5-vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3));
  w = max(w, 0.0); vec4 w2 = w * w, w3 = w2 * w;
  vec4 gdotx = vec4(dot(g0,x0), dot(g1,x1), dot(g2,x2), dot(g3,x3));
  float n = dot(w3, gdotx);
  vec4 dw = -6.0 * w2 * gdotx;
  vec3 dn0 = w3.x * g0 + dw.x * x0;
  vec3 dn1 = w3.y * g1 + dw.y * x1;
  vec3 dn2 = w3.z * g2 + dw.z * x2;
  vec3 dn3 = w3.w * g3 + dw.w * x3;
  gradient = 39.5 * (dn0 + dn1 + dn2 + dn3);
  return 39.5 * n;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 uv = gl_FragCoord.xy/iResolution.xy / vec2(0.8, 1.);

    vec3 pos = vec3(uv * 5.0, iTime * .05);

    vec3 period = vec3(4.0, 4.0, 8.0);

    float alpha = iTime * 0.;

    vec3 gradient;

    float noise = psrdnoise(pos, period, alpha, gradient);

    noise = noise * .5 + .5;

    float numLines = 6.;
    float lines = fract(noise * numLines);

    float lineWidth = .05;
    float contour = smoothstep(0.055, lineWidth, lines);
    contour = pow(contour, 2.);

    float grey = mix(.0, .2, noise) + contour * .1;

    fragColor = vec4(vec3(grey), 1.0);
}`;

	let canvas, shaderCanvas;

	let recentShaders = $state([{ canvas: null }, { canvas: null }, { canvas: null }]);

	onMount(() => {
		shaderCanvas = new ShaderCanvas(canvas);
		// Make sure to resize immediately after creation
		window.requestAnimationFrame(() => {
			shaderCanvas.resize();
			shaderCanvas.setFragmentShader(frag);
			shaderCanvas.render();
		});

		recentShaders.forEach((rs, idx) => {
			recentShaders[idx].shaderCanvas = new ShaderCanvas(recentShaders[idx].canvas);
			recentShaders[idx].shaderCanvas.resize();
			recentShaders[idx].shaderCanvas.setFragmentShader(data.recentShaders[idx].shader.glsl);
			recentShaders[idx].shaderCanvas.render();
		});
	});

	// $effect(() => {
	// 	if (recentShaders[0].canvas /* && recentShaders[1].canvas && recentShaders[2].canvas*/) {
	// 		console.log("pushing");
	// 		recentShaders[0].shaderCanvas = new ShaderCanvas(recentShaders[0].canvas);
	// 		// recentShaders[1].shaderCanvas = new ShaderCanvas(recentShaders[1].canvas);
	// 		// recentShaders[2].shaderCanvas = new ShaderCanvas(recentShaders[2].canvas);

	// 		recentShaders.forEach((rs, idx) => {
	// 			rs.shaderCanvas.resize();
	// 			rs.shaderCanvas.setFragmentShader(data.recentShaders[idx].glsl);
	// 			rs.shaderCanvas.render();
	// 		});
	// 	}
	// });

	function resize() {
		shaderCanvas.resize();
	}
</script>

<svelte:window onresize={resize} />

<div class="h-full">
	<canvas class="absolute inset-0 -z-10 h-full w-full" bind:this={canvas}></canvas>

	<div class="flex h-full w-full flex-col items-center justify-between py-24">
		<img src="/logo.svg" alt="shader graph logo" class="h-44" />

		<DissolveButton
			class="font-yuruka rounded-full bg-white/80 px-8 py-4 text-3xl"
			onclick={() => {
				setTimeout(() => goto("/shader/new"), 1_000);
				preloadData("/shader/new");
			}}>{m.get_started()}</DissolveButton
		>

		<div class="flex gap-4 bg-black text-white">
			{#each data.recentShaders as rs, idx}
				<a href={`/shader/${rs.shader.id}`}>
					<div class="rounded-lg border-2 border-white/50 p-1">
						<canvas class="w-64 rounded" bind:this={recentShaders[idx].canvas}></canvas>
						<p class="inline-flex">
							<b>{rs.shader.title}&nbsp;</b>
							by {rs.user.name}
							<img
								class="h-6 w-6 rounded-full"
								src={rs.user.avatarUrl}
								alt="avatar for shader author"
							/>
						</p>
					</div>
				</a>
			{/each}
		</div>
	</div>
</div>
