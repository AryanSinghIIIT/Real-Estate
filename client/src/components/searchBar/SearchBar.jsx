import React, { useContext, useState } from "react";
import { LocationContext } from "../../context/LocationContext";
import { Country, State, City } from 'country-state-city';
import "./searchBar.scss";

const SearchBar = () => {
  const { locationData, selectedLocations, handleLocationSelection, sendSelectedLocations } = useContext(LocationContext);

  const renderLocations = (parent_id, locations) => {
    console.log( "here is parent",parent_id, locations)
    const handleCheckboxChange = (location_id) => {
      // if(parent_id)
        // handleLocationSelection(parent_id)
      handleLocationSelection(location_id)
    };

    return locations?.map((location) => (
      <div key={location._id} className="location-item">
        <label>
          <input
            type="checkbox"
            checked={selectedLocations.includes(location._id)}
            onChange={() => handleCheckboxChange(location._id)}
          />
          {location.name=="IN" ? "INDIA" : (location.name.length == 2 ? State.getStateByCodeAndCountry(location.name, "IN").name: location.name)}
        </label>
        {selectedLocations.includes(location._id) && location.children && location.children.length > 0 && (
          <div className="nested-locations">
            {renderLocations(location._id, location.children)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="searchbar-container">
      <h3>Select Locations</h3>
      {renderLocations(null,locationData)}
      <button className="submit-button" onClick={sendSelectedLocations}>
        Update Selected Locations
      </button>
    </div>
  );
};

export default SearchBar;
