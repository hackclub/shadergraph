<script>
	import { driver } from "driver.js";
	import { onMount } from "svelte";
	import "driver.js/dist/driver.css";

	onMount(() => {
		return;
		const driverObj = driver({
			showProgress: true,
			steps: [
				{
					element: "#shadergraph-flowview",
					popover: {
						title: "This is where you build your shader",
						description:
							"Drag nodes together to change the output. The data flows through nodes left to right.",
						side: "bottom",
						align: "start"
					}
				},
				{
					element: "#shadergraph-canvas",
					popover: {
						title: "This is the output",
						description: "Here you will see the output of your shader.",
						side: "left",
						align: "start"
					}
				},
				{
					element: "#shadergraph-codeview",
					popover: {
						title: "View the code",
						description:
							"The generated GLSL code will appear here. It's completely compatible with <a class='text-blue-500' href='https://shadertoy.com'>Shadertoy</a>. Looking at how this code changes in response do different node configurations can help you learn GLSL quicker!",
						side: "bottom",
						align: "start"
					}
				},
				{
					element: "#shader-save",
					popover: {
						title: "Save & publish",
						description:
							"Give your shader a name, then hit <code>Save</code> to pubish it! You can always edit it later.",
						side: "bottom",
						align: "start"
					}
				}
			],
			onDestroyStarted: () => {
				if (!driverObj.hasNextStep() || confirm("Are you sure?")) {
					driverObj.destroy();

					// Save in DB
				}
			}
		});

		driverObj.drive();

		return () => driverObj.destroy();
	});
</script>
