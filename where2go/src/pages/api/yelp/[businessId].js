
export default async (req, res) => {
    const {
        query: { businessId },
    } = req;

    const url = `https://api.yelp.com/v3/businesses/${businessId}`;
    const API_KEY = process.env.YELP_API_KEY;

    try {
        const yelpResponse = await fetch(url, {
            headers: {
                Authorization: `Bearer ${API_KEY}`,
            },
        });

        if (!yelpResponse.ok) {
            throw new Error(`Error from Yelp API: ${yelpResponse.statusText}`);
        }

        const data = await yelpResponse.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
