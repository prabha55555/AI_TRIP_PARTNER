export const SelectTravelList = [
    {
        id: 1,
        mtitle: 'Just Me',
        desc: 'A sole travels in exploration',
        icon: '🧳', // Luggage emoji
        people: '1 people'
    },
    {
        id: 2,
        mtitle: 'Couple',
        desc: 'A romantic getaway for two',
        icon: '❤️', // Heart emoji
        people: '2 people'
    },
    {
        id: 3,
        mtitle: 'Family',
        desc: 'An all-inclusive family vacation',
        icon: '👨‍👩‍👧‍👦', // Family emoji
        people: '4 to 6 people'
    },
    {
        id: 4,
        mtitle: 'Friends',
        desc: 'An adventurous trip with friends',
        icon: '👫', // Friends emoji
        people: '3+ people'
    }
];

export const BudgetCategories = [
    {
        id: 1,
        mtitle: 'Low Budget',
        desc: 'A budget-friendly trip',
        icon: '💸', // Money with wings emoji
        budget: 'Low'
    },
    {
        id: 2,
        mtitle: 'Medium Budget',
        desc: 'A moderately priced trip',
        icon: '💵', // Dollar banknote emoji
        budget: 'Medium'
    },
    {
        id: 3,
        mtitle: 'High Budget',
        desc: 'A luxurious trip',
        icon: '💰', // Money bag emoji
        budget: 'High'
    }
];

export const AI_PROMPT = "Generate Travel Plan for Location: {destination}, for {DaysCount} days for {PeopleCount} with a {Budget}. Give me a Hotels options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates, ticket Pricing, rating, Time travel each of the location for  {DaysCount} days  with each day plan with best time to visit in JSON format."
