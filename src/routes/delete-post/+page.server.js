import { db } from '$lib/firebase/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ url, locals }) => {
    const userUID = locals.userUID;
    const postId = url.searchParams.get('id');
   // console.log(postId);

    if (!userUID) {
			console.log('No user!');
			return;
		}

		console.log(`Deleting post... ${postId}`);

		const docRef = doc(db, 'users', userUID);
		const docSnap = await getDoc(docRef);
		const userData = docSnap.data();

		let dataToStore = JSON.parse(JSON.stringify(userData));

		// Find the index of the post with the specified ID
		const index = dataToStore.posts.findIndex(
			(/** @type {{ id: string; }} */ post) => post.id === postId
		);
		// dataToStore.posts

		// Remove the post from the array
		if (index !== -1) {
			dataToStore.posts.splice(index, 1);
		}

		// Store data to database
		await setDoc(docRef, dataToStore, { merge: true });

		console.log('Deleted!');
  }
};