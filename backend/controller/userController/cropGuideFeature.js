const axios = require('axios');
require('dotenv').config();

exports.getCropGuide = async (req, res) => {
    try {
        const response = await axios.post('http://127.0.0.1:5000/predict', req.body);

        if (!response.data) {
            return res.status(404).json({ error: "No prediction data returned" });
        }

        const recommendedFruit = response.data.recommended_fruit;

        const googleApiKey = process.env.GOOGLE_API_KEY;  // From .env file
        const cx = process.env.ENGINE_ID;   // From .env file

        const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${googleApiKey}&cx=${cx}&q=${encodeURIComponent(recommendedFruit)}`;

        const searchResult = await axios.get(searchUrl);

        if (searchResult.data.items && searchResult.data.items.length > 1) {
            const link1 = searchResult.data.items[0].link;
            const link2 = searchResult.data.items[3].link;
            res.status(200).json({
                success: true,
                recommended_fruit: recommendedFruit,
                links: [link1, link2],
                
                WHOLE_DATA: searchResult.data.items
            });
        } else {
            res.status(404).json({ error: "Not enough results found on Google" });
        }

    } catch (error) {
        console.error("Error connecting to Python model or Google API:", error);
        res.status(500).json({ error: "Error fetching crop information" });
    }
};
