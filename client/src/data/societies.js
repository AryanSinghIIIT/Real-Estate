// src/data/societies.js
const societiesData = {
    India: {
      Maharashtra: {
        Mumbai: [
          { id: 1, name: "Andheri West" },
          { id: 2, name: "Bandra" },
          { id: 3, name: "Powai" },
        ],
        Pune: [
          { id: 4, name: "Kalyani Nagar" },
          { id: 5, name: "Viman Nagar" },
        ],
      },
      Karnataka: {
        Bangalore: [
          { id: 6, name: "Koramangala" },
          { id: 7, name: "Whitefield" },
        ],
      },
    },
    USA: {
      California: {
        LosAngeles: [
          { id: 8, name: "Santa Monica" },
          { id: 9, name: "Venice Beach" },
        ],
        SanFrancisco: [
          { id: 10, name: "Mission District" },
          { id: 11, name: "Fisherman's Wharf" },
        ],
      },
      NewYork: {
        NewYorkCity: [
          { id: 12, name: "Brooklyn" },
          { id: 13, name: "Manhattan" },
        ],
      },
    },
    // Add more countries, states, cities, and societies as needed.
  };
  
  export default societiesData;
  