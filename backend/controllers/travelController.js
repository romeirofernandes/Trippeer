const axios = require("axios");

module.exports = {
  generateDestinations: async (req, res) => {
    try {
      const {
        location,
        budget,
        duration,
        mood,
        weather,
        tripType,
        maxTravelTime,
      } = req.body;

      const prompt = `Generate a travel plan in the following strict JSON format, nothing else:
      {
        "international": [
          {
            "name": "City, Country",
            "description": "Brief fun description",
            "cost": 1234,
            "currency": "USD",
            "coordinates": [latitude, longitude],
            "itinerary": ["Day 1: activity", "Day 2: activity"],
            "mood": "Mood with emoji",
            "travelTime": 5
          }
        ],
        "domestic": [
          {
            "name": "City, State",
            "description": "Brief fun description",
            "cost": 1234,
            "currency": "USD",
            "coordinates": [latitude, longitude],
            "itinerary": ["Day 1: activity", "Day 2: activity"],
            "mood": "Mood with emoji",
            "travelTime": 3
          }
        ]
      }

      User details:
      - Starting from: ${location}
      - Budget: ${budget} USD
      - Duration: ${duration} days
      - Mood: ${mood}
      - Weather preference: ${weather}
      - Trip type: ${tripType}
      - Max travel time: ${maxTravelTime} hours

      Generate 3 international and 3 domestic destinations that match these criteria.`;

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
            responseMimeType: "application/json",
          },
        }
      );

      let textContent = response.data.candidates[0].content.parts[0].text;

      // Clean up the response to ensure valid JSON
      textContent = textContent.replace(/```json\n|\n```/g, ""); // Remove markdown
      textContent = textContent.replace(/[\u201C\u201D]/g, '"'); // Replace smart quotes
      textContent = textContent.trim(); // Remove whitespace

      // Find the first { and last } to get the JSON object
      const start = textContent.indexOf("{");
      const end = textContent.lastIndexOf("}") + 1;
      const jsonStr = textContent.slice(start, end);

      try {
        const destinations = JSON.parse(jsonStr);
        res.json(destinations);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        console.log("Attempted to parse:", jsonStr);
        throw new Error("Invalid JSON response from AI");
      }
    } catch (error) {
      console.error("Error generating destinations:", error);
      res.status(500).json({
        error: "Failed to generate destinations",
        details: error.message,
        rawResponse: error.response?.data, // Include raw response for debugging
      });
    }
  },

  convertCurrency: async (req, res) => {
    try {
      const { amount, from, to = "USD" } = req.query;

      const response = await axios.get(
        `https://api.exchangerate-api.com/v4/latest/${from}`
      );

      const rate = response.data.rates[to];
      const converted = amount * rate;

      res.json({
        success: true,
        amount: converted,
        rate,
        from,
        to,
      });
    } catch (error) {
      console.error("Currency conversion error:", error);
      res.status(500).json({
        error: "Currency conversion failed",
        details: error.message,
      });
    }
  },
};
