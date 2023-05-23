import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ cookies }) => {
	console.log("Logging out, deleting cookies now, and redirecting to homepage")
	cookies.delete('userStuff');
	cookies.delete('userUID');
	throw redirect(302, '/')
  }
};