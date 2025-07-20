<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<div class="bg-gray-100 rounded-md p-2 my-2">
	{@render children()}
</div>
