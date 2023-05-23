<script>
	import { doc, getDoc, setDoc } from 'firebase/firestore';
	import { db } from '../lib/firebase/firebase';
	import { googleAuthPopup } from '$lib/firebase/auth';

	export let data;

	// Handle user stuff
	$: isLoggedIn = data.user?.isLoggedIn || false;
	$: username = data.user?.username || '' || null;
	$: email = data.user?.email || '' || null;
	$: userUID = data.uid || '' || null;
	let posts = data.posts || [];

	/**
	 * The user data on the database
	 * @type {{email: string | null; posts: string[]}}
	 */
	 let dataToStore = {
		email: email,
		posts: posts
	};

	// After logging in, take the data that the current user has, including their posts
	async function login() {
		const user = await googleAuthPopup();

		if (!user) return;

		isLoggedIn = user.isLoggedIn;
		email = user.email;
		username = user.username;
		userUID = user.uid;
		dataToStore.posts = user.posts;
	}

	/**
	 * The value from the input
	 * @type {string}
	 */
	let inputText;

	async function postBlog() {
		if (!userUID) {
			console.log('No user!');
			return;
		}

		console.log('Posting...');

		const docRef = doc(db, 'users', userUID);
		const docSnap = await getDoc(docRef);
		const userData = docSnap.data();

		dataToStore = JSON.parse(JSON.stringify(userData));

		// Only allow to push posts if there is an input
		if (!inputText) {
			console.log('Must input text!');
			return;
		}

		// This might seem too repetitive, I'm too lazy
		dataToStore.posts.push(inputText);

		// Store data to database
		await setDoc(docRef, dataToStore, { merge: true });

		console.log('Posted!');
	}


</script>

{#if isLoggedIn}
	<!-- <button class="text-white" on:click={getMyUserName}>What's my username</button> -->
	<div class="flex flex-col items-center justify-center">
		<p class="mb-10 text-5xl text-white">Hello {username}</p>
		<div class="mb-10">
			<form title="Post Blog">
				<input class="p-2" bind:value={inputText} />
				<button class="bg-blue-600 p-2 text-white" on:click={postBlog}>Post Test</button>
			</form>
		</div>
		<span class="text-3xl text-white">Posts</span>
		{#each dataToStore.posts as post, idx (idx)}
			<div>
				<p class="text-white">Post #{idx + 1}: {post}</p>
			</div>
		{/each}
		<a class="bg-neutral-700 p-2 text-white" type="button" href="/profile">Go to profile</a>
	</div>
{:else}
	<button class="bg-neutral-700 p-2 text-white" on:click={login}>Log In</button>
{/if}