import { createContext, useEffect, useState } from "react";
import apiRequest from "../lib/apiRequest";

export const LocationContext = createContext();

export const LocationContextProvider = ({ children }) => {
    const [locationData, setLocationData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedLocations, setSelectedLocations] = useState([]);
    const [addPostLocation, setAddPostLocation] = useState(null)
    const [searchedPosts, setSearchedPost] = useState([])
    
    useEffect(()=>{
        const fetchLocationData = async () => {
            try {
                setLoading(true);
                console.log("fetching Data....")
                const response = await apiRequest.get('/fillData'); // Replace with your actual API endpoint
                setLocationData(response.data.hierarchy);
              } catch (err) {
                console.error('Error fetching location data:', err);
                setError(err);
              } finally {
                setLoading(false);
              }
        }
        fetchLocationData();
    },[])

    const handleAddPostLocations = (id) => {
        setAddPostLocation(id)
    }
    const handleLocationSelection = (id) => {
        setSelectedLocations((prevSelected) =>
          prevSelected.includes(id)
            ? prevSelected.filter((locationId) => locationId !== id)
            : [...prevSelected, id]
        );
      };
    
      const sendSelectedLocations = async () => {
        try {
            const resp = await apiRequest.post("/posts/", { locationIds: selectedLocations });
            console.log(resp.data)
            setSearchedPost(resp.data)
        } catch (error) {
          console.error("Error updating locations:", error);
        }
      };
    
      return (
        <LocationContext.Provider
          value={{ locationData, loading, selectedLocations, searchedPosts, handleLocationSelection, sendSelectedLocations, addPostLocation, handleAddPostLocations }}
        >
          {children}
        </LocationContext.Provider>
      );
    };
