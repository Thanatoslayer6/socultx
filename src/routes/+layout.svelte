<script>
	import '../app.css';	
</script>

<nav class="bg-black h-20 flex py-5 px-20">
	<!-- Log out button -->
	<form action="/logout" method="post">
		<button class="bg-white p-2">Log Out</button>
	</form>
</nav>

<main class="py-5 px-20">
	<slot />
</main>
