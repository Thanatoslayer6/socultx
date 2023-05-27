import { db } from '$lib/firebase/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { uid } from 'uid';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, params }) {
	const userStuff = locals.userStuff;

	console.log(params.chatId);

	return {
		user: userStuff,
    user2: params.chatId,
	};
}

/** @type {import('./$types').Actions} */
export const actions = {
	add: async ({ request, locals, params, url }) => {
		const formData = await request.formData();
		const inputText = formData.get('content');
		const userUID = locals.userUID;
		const username = locals.userStuff.username;
		const email = locals.userStuff.email;
		const photoURL = locals.userStuff.photoURL;

		if (!userUID) {
			console.log('No user!');
			return;
		}

		console.log('Sending...');

		// const chatID = uid(32);
		const messageID = uid(64);
		const chatRef = doc(db, `chats/${userUID}`);
		const messageRef = doc(db, `chats/${userUID}/messages/${params.chatId}`);
		const date = new Date();

    console.log(params.chatId)

		let messageData = {
			content: inputText,
			userUID: userUID,
			user: username || '',
			photoURL: photoURL,
			email: email,
			timestamp: date,
			id: messageID
		};

		let participantsData = {
			participants: [
				{
					userUID: userUID
				},
				{
					userUID: params.chatId
				}
			]
		};

		// Only allow to push posts if there is an input
		if (!inputText) {
			console.log('Must input text!');
			return;
		}

		// Store data to database
		await setDoc(chatRef, participantsData, { merge: true });
		await setDoc(messageRef, messageData, { merge: true });

		console.log('Sent!');
	}
};
