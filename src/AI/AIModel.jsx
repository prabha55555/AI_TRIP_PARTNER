import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
};

export const chatSession = model.startChat({
    generationConfig,
    history: [
        {
            role: "user",
            parts: [
                { text: "Generate Travel Plan for Location: Las Vegas, for 3 Days for Couple with a Cheap budget. Give me a Hotels options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates, ticket Pricing, rating, Time travel each of the location for 3 days with each day plan with best time to visit in JSON format.\n\n" },
            ],
        },
        {
            role: "model",
            parts: [
                { text: "Okay, here's a JSON formatted travel plan for Las Vegas for a couple on a budget for 3 days. I'll include hotel options, a detailed itinerary with timings, costs, and everything you requested. This is tailored to prioritize free or low-cost activities.\n\n```json\n{\n  \"tripDetails\": {\n    \"location\": \"Las Vegas, Nevada\",\n    \"duration\": \"3 Days\",\n    \"budget\": \"Cheap\",\n    \"travelers\": \"Couple\"\n  },\n  \"hotelOptions\": [\n    {\n      \"hotelName\": \"Circus Circus Hotel\",\n      \"hotelAddress\": \"2880 S Las Vegas Blvd, Las Vegas, NV 89109\",\n      \"price\": \"$40 - $80/night (depending on the season and deals)\",\n      \"hotelImageUrl\": \"https://www.circuscircus.com/wp-content/uploads/2023/10/CCLV_Exterior_RGB.jpg\",\n      \"geoCoordinates\": {\n        \"latitude\": 36.1355,\n        \"longitude\": -115.1657\n      },\n      \"rating\": 3.5,\n      \"description\": \"Budget-friendly option on the Strip. Features the Adventuredome indoor theme park (extra cost) and free circus acts. Rooms are basic, but clean and functional.\"\n    },\n    {\n      \"hotelName\": \"Excalibur Hotel & Casino\",\n      \"hotelAddress\": \"3850 S Las Vegas Blvd, Las Vegas, NV 89109\",\n      \"price\": \"$50 - $90/night (depending on the season and deals)\",\n      \"hotelImageUrl\": \"https://www.excalibur.com/content/dam/eclv/page-headers/excalibur-hotel-casino-exterior-4000x1000.jpg\",\n      \"geoCoordinates\": {\n        \"latitude\": 36.0984,\n        \"longitude\": -115.1745\n      },\n      \"rating\": 4.0,\n      \"description\": \"Medieval-themed hotel on the south end of the Strip. More affordable than some of its neighbors. Features a pool area and various dining options.\"\n    },\n    {\n      \"hotelName\": \"Stratosphere Hotel, Casino & Tower\",\n      \"hotelAddress\": \"2000 S Las Vegas Blvd, Las Vegas, NV 89104\",\n      \"price\": \"$45 - $85/night\",\n      \"hotelImageUrl\": \"https://media.cntraveler.com/photos/6131406d6c012f203e600a3b/16:9/w_2560,c_limit/Las%2520Vegas_The%2520Strat_View.jpg\",\n      \"geoCoordinates\": {\n        \"latitude\": 36.1471,\n        \"longitude\": -115.1555\n      },\n      \"rating\": 3.7,\n      \"description\": \"Located at the north end of the Strip. Offers amazing views from the tower (separate ticket required). Rooms are decent and prices are competitive. A bit further from the main action, but easily accessible by bus or rideshare.\"\n    }\n  ],\n  \"itinerary\": {\n    \"day1\": {\n      \"theme\": \"Exploring the Strip (South End)\",\n      \"bestTimeToVisit\": \"Morning to Evening\",\n      \"plan\": [\n        {\n          \"placeName\": \"Welcome to Las Vegas Sign\",\n          \"placeDetails\": \"Iconic photo opportunity. Arrive early to avoid crowds.\",\n          \"placeImageUrl\": \"https://media.cntraveler.com/photos/5b59e153049547223e2af7c5/16:9/w_2560,c_limit/GettyImages-686490251.jpg\",\n          \"geoCoordinates\": {\n            \"latitude\": 36.0828,\n            \"longitude\": -115.1732\n          },\n          \"ticketPricing\": \"Free\",\n          \"rating\": 4.5,\n          \"timeTravel\": \"30 minutes (including time for photos)\"\n        },\n        {\n          \"placeName\": \"Luxor Hotel & Casino\",\n          \"placeDetails\": \"Walk through the Egyptian-themed hotel. See the Sphinx and the pyramid.\",\n          \"placeImageUrl\": \"https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Luxor_Hotel_%28side_view%29.jpg/1200px-Luxor_Hotel_%28side_view%29.jpg\",\n          \"geoCoordinates\": {\n            \"latitude\": 36.0955,\n            \"longitude\": -115.1759\n          },\n          \"ticketPricing\": \"Free (unless you visit specific attractions inside)\",\n          \"rating\": 4.0,\n          \"timeTravel\": \"1 hour\"\n        },\n        {\n          \"placeName\": \"Excalibur Hotel & Casino\",\n          \"placeDetails\": \"Medieval themed hotel, walk around and enjoy the atmosphere\",\n          \"placeImageUrl\": \"https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Excalibur_Casino_%26_Hotel.jpg/1280px-Excalibur_Casino_%26_Hotel.jpg\",\n          \"geoCoordinates\": {\n            \"latitude\": 36.0984,\n            \"longitude\": -115.1745\n          },\n          \"ticketPricing\": \"Free\",\n          \"rating\": 3.8,\n          \"timeTravel\": \"1 hour\"\n        },\n        {\n          \"placeName\": \"Mandalay Bay\",\n          \"placeDetails\": \"Visit the casino and walk through the Shoppes at Mandalay Place.\",\n          \"placeImageUrl\": \"https://assets.mandalaybay.com/content/dam/MGM/mandalay-bay/property-details/mandalay-bay-exterior-night.tif\",\n          \"geoCoordinates\": {\n            \"latitude\": 36.0923,\n            \"longitude\": -115.1745\n          },\n          \"ticketPricing\": \"Free (Shark Reef Aquarium is an extra cost)\",\n          \"rating\": 4.2,\n          \"timeTravel\": \"1.5 hours\"\n        },\n        {\n          \"placeName\": \"Bellagio Conservatory & Botanical Garden\",\n          \"placeDetails\": \"Stunning floral displays that change seasonally. Completely free.\",\n          \"placeImageUrl\": \"https://www.bellagio.com/content/dam/MGM/bellagio/entertainment/conservatory-botanical-garden/bellagio-conservatory-and-botanical-garden-chinese-new-year-2024-hero.jpg\",\n          \"geoCoordinates\": {\n            \"latitude\": 36.1127,\n            \"longitude\": -115.1744\n          },\n          \"ticketPricing\": \"Free\",\n          \"rating\": 4.8,\n          \"timeTravel\": \"1 hour\"\n        },\n        {\n          \"placeName\": \"Fountains of Bellagio\",\n          \"placeDetails\": \"Iconic water show set to music. Runs every 30 minutes in the afternoon and every 15 minutes in the evening.\",\n          \"placeImageUrl\": \"https://assets.mgmresorts.com/content/dam/MGM/bellagio/entertainment/fountains-of-bellagio/bellagio-fountains-at-night-tablet.jpg\",\n          \"geoCoordinates\": {\n            \"latitude\": 36.1126,\n            \"longitude\": -115.1762\n          },\n          \"ticketPricing\": \"Free\",\n          \"rating\": 4.9,\n          \"timeTravel\": \"30 minutes (watch at least one show)\"\n        }\n      ]\n    },\n    \"day2\": {\n      \"theme\": \"Downtown & Free Attractions\",\n      \"bestTimeToVisit\": \"Afternoon to Night\",\n      \"plan\": [\n        {\n          \"placeName\": \"Fremont Street Experience\",\n          \"placeDetails\": \"Light and sound show on a pedestrian mall in Downtown Las Vegas. Viva Vision light shows are free.\",\n          \"placeImageUrl\": \"https://fremontstreetexperience.com/wp-content/uploads/2018/07/FSE_Homepage_Hero_Night_1600x720.jpg\",\n          \"geoCoordinates\": {\n            \"latitude\": 36.1703,\n            \"longitude\": -115.1420\n          },\n          \"ticketPricing\": \"Free (for Viva Vision shows)\",\n          \"rating\": 4.6,\n          \"timeTravel\": \"2 hours (explore and watch a show)\"\n        },\n        {\n          \"placeName\": \"Downtown Container Park\",\n          \"placeDetails\": \"Unique shopping and entertainment area made from repurposed shipping containers. Has a playground and live entertainment.\",\n          \"placeImageUrl\": \"https://downtowncontainerpark.com/wp-content/uploads/2023/04/DCP_Homepage_Hero_2023-1.jpg\",\n          \"geoCoordinates\": {\n            \"latitude\": 36.1688,\n            \"longitude\": -115.1404\n          },\n          \"ticketPricing\": \"Free to enter, costs for attractions/food inside.\",\n          \"rating\": 4.3,\n          \"timeTravel\": \"1.5 hours\"\n        },\n        {\n          \"placeName\": \"Gold and Silver Pawn Shop (Pawn Stars)\",\n          \"placeDetails\": \"Famous pawn shop featured on the TV show 'Pawn Stars'. Can be crowded.\",\n          \"placeImageUrl\": \"https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Gold_and_Silver_Pawn_Shop_%283801670733%29.jpg/1280px-Gold_and_Silver_Pawn_Shop_%283801670733%29.jpg\",\n          \"geoCoordinates\": {\n            \"latitude\": 36.1578,\n            \"longitude\": -115.1547\n          },\n          \"ticketPricing\": \"Free to enter\",\n          \"rating\": 3.9,\n          \"timeTravel\": \"1 hour\"\n        },\n        {\n          \"placeName\": \"Arts District\",\n          \"placeDetails\": \"Explore the murals and art galleries of the Arts District.\",\n          \"placeImageUrl\": \"https://www.vegas.com/wp/wp-content/uploads/2022/04/arts-district-main-street-night-2.jpg\",\n          \"geoCoordinates\": {\n            \"latitude\": 36.1547,\n            \"longitude\": -115.1508\n          },\n          \"ticketPricing\": \"Free\",\n          \"rating\": 4.4,\n          \"timeTravel\": \"1.5 hours\"\n        }\n      ]\n    },\n    \"day3\": {\n      \"theme\": \"Strip Exploration & Departure\",\n      \"bestTimeToVisit\": \"Morning to Afternoon\",\n      \"plan\": [\n         {\n          \"placeName\": \"The Venetian & The Palazzo\",\n          \"placeDetails\": \"Walk through the Grand Canal Shoppes, see the canals and gondolas (gondola rides cost extra). Watch the street performers.\",\n          \"placeImageUrl\": \"https://www.venetianlasvegas.com/content/dam/venetian/master/main/home/vlv-home-masthead-v6-1920x620.jpg\",\n          \"geoCoordinates\": {\n            \"latitude\": 36.1215,\n            \"longitude\": -115.1715\n          },\n          \"ticketPricing\": \"Free (gondola rides extra)\",\n          \"rating\": 4.7,\n          \"timeTravel\": \"2 hours\"\n        },\n        {\n          \"placeName\": \"Paris Las Vegas\",\n          \"placeDetails\": \"See the replica Eiffel Tower (observation deck costs extra) and the Arc de Triomphe.\",\n          \"placeImageUrl\": \"https://media.cntraveler.com/photos/5b59e1537a2b9447b98eb1e1/16:9/w_2560,c_limit/GettyImages-182780266.jpg\",\n          \"geoCoordinates\": {\n            \"latitude\": 36.1124,\n            \"longitude\": -115.1704\n          },\n          \"ticketPricing\": \"Free (Eiffel Tower Viewing Deck is extra)\",\n          \"rating\": 4.3,\n          \"timeTravel\": \"1 hour\"\n        },\n        {\n          \"placeName\": \"High Roller Observation Wheel (Optional)\",\n          \"placeDetails\": \"If budget allows, ride the High Roller for amazing views of the Strip. Consider a daytime ride for cheaper tickets.\",\n          \"placeImageUrl\": \"https://www.caesars.com/content/dam/clv/amenity/high-roller/clv-high-roller-exterior-day-4x3.jpg\",\n          \"geoCoordinates\": {\n            \"latitude\": 36.1159,\n            \"longitude\": -115.1693\n          },\n          \"ticketPricing\": \"$25 - $40 per person (depending on time of day and deals)\",\n          \"rating\": 4.6,\n          \"timeTravel\": \"1.5 hours (including ride time)\"\n        },\n        {\n          \"placeName\": \"Explore LINQ Promenade\",\n          \"placeDetails\": \"Walk through the LINQ Promenade. Lots of shops, restaurants and entertainment.\",\n          \"placeImageUrl\": \"https://media.cntraveler.com/photos/5b59e154049547223e2af7c9/16:9/w_2560,c_limit/GettyImages-473331743.jpg\",\n          \"geoCoordinates\": {\n            \"latitude\": 36.1164,\n            \"longitude\": -115.1696\n          },\n          \"ticketPricing\": \"Free to enter, costs for attractions/food inside.\",\n          \"rating\": 4.2,\n          \"timeTravel\": \"1 hour\"\n        },\n        {\n          \"placeName\": \"Departure\",\n          \"placeDetails\": \"Head to the airport or your next destination.\",\n          \"placeImageUrl\": null,\n          \"geoCoordinates\": null,\n          \"ticketPricing\": null,\n          \"rating\": null,\n          \"timeTravel\": \"Variable (allow sufficient time)\"\n        }\n      ]\n    }\n  },\n  \"notes\": [\n    \"Prices are estimates and can vary based on season, day of the week, and availability.\",\n    \"Consider purchasing a day pass for the Deuce bus for easy and affordable transportation along the Strip.\",\n    \"Take advantage of free activities like people-watching, exploring hotels, and watching free shows.\",\n    \"Pack comfortable shoes, sunscreen, and a hat.\",\n    \"Stay hydrated by drinking plenty of water.\",\n    \"Look for happy hour deals for cheaper drinks and appetizers.\",\n    \"Ridesharing (Uber/Lyft) is a convenient way to get around, but can surge during peak hours. The bus is generally cheaper.\",\n    \"Always be aware of your surroundings and keep your belongings safe.\"\n  ]\n}\n```\n\n**Key Budget Saving Tips Integrated:**\n\n*   **Free Activities Focus:** The itinerary is heavily weighted towards free attractions and experiences.\n*   **Hotel Choice:** I've included hotels known for being budget-friendly on the Strip. Check for deals and promotions when booking.\n*   **Transportation:** Mentioned the Deuce bus as a cost-effective option. Walking is also emphasized.\n*   **Food:** Suggested happy hour deals. Packing snacks and drinks can also save money.\n*   **Flexibility:** The itinerary can be adjusted based on personal preferences and spontaneous discoveries.\n\n**Important Considerations:**\n\n*   **Booking:** Book your hotel well in advance, especially if traveling during peak season or holidays.\n*   **Walking:** Las Vegas involves a lot of walking. Be prepared!\n*   **Weather:** Las Vegas can be very hot, especially in the summer. Pack accordingly.\n*   **Deals:** Check websites like Groupon, Travelzoo, and Vegas.com for deals on shows, attractions, and dining.\n*   **Tipping:** Remember to factor in tips for service staff.\n\nThis JSON provides a solid starting point for planning a budget-friendly Las Vegas trip for a couple. Have a great time!\n"},
            ],
        },
    ],
});

