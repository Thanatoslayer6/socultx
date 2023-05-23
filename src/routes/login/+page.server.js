import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ cookies }) => {
    console.log("Logging in, and now redirecting to homepage")
    throw redirect(302, '/')
  }
};