import { db } from '$lib/firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';

/** @type {import('./$types').PageServerLoad} */

export async function load({ locals }) {
	const userStuff = locals.userStuff;
	const userUID = locals.userUID;

	if (!userUID) {
		return;
	}

	const docRef = doc(db, 'users', userUID);
	const docSnap = await getDoc(docRef);
	const userData = docSnap.data();

	/**
	 * The user data to store
	 * @type {{email: string | null; posts: string[]}}
	 */
	let dataToStore = JSON.parse(JSON.stringify(userData));

	// console.log('User UID Cookie: ' + userUID);
	// console.log('User Stuff Cookie: ' + userStuff);
	console.log('User posts: ' + dataToStore.posts);

	return {
		user: userStuff,
		uid: userUID,
    	posts: dataToStore.posts
	};
}