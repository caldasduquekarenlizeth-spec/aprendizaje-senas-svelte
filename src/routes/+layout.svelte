<script>
	let { data, children } = $props();

	// Creamos un estado reactivo con $derived para saber si hay sesión activa
	let user = $derived(data.user);
</script>

<nav>
	
</nav>

{@render children()}