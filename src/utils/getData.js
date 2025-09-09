import axios from 'axios';

export const getData = async (endPoint) => {
	try {
		const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
		const result = await axios.get(`${apiBaseUrl}/${endPoint}`);
		return {
			myItems: result?.data
		};
	} catch (error) {
		return {
			myItems: []
		};
	}
};
