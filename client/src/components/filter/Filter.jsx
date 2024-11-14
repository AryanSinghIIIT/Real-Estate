import { useState, useEffect } from "react";
import { Country, State, City } from "country-state-city";
import { useSearchParams } from "react-router-dom";
import "./filter.scss";

// Child component for adding a second landmark
function LandmarkChild({ onLandmarkChange }) {
  return (
    <div className="item">
      <label htmlFor="additionalLandmark">Additional Landmark</label>
      <input
        type="text"
        id="additionalLandmark"
        name="additionalLandmark"
        placeholder="Enter an additional landmark"
        onChange={(e) => onLandmarkChange(e.target.value)}
      />
    </div>
  );
}

function Filter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState({
    type: searchParams.get("type") || "",
    city: searchParams.get("city") || "",
    property: searchParams.get("property") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    bedroom: searchParams.get("bedroom") || "",
    country: searchParams.get("country") || "",
    state: searchParams.get("state") || "",
    landmark: searchParams.get("landmark") || "", // Added landmark to query state
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [landmarkInput, setLandmarkInput] = useState(""); // To store custom landmark input
  const [additionalLandmarkInput, setAdditionalLandmarkInput] = useState(""); // To store optional additional landmark

  // Fetch all countries on component mount
  useEffect(() => {
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);
  }, []);

  // Update states when country changes
  useEffect(() => {
    if (query.country) {
      const allStates = State.getStatesOfCountry(query.country);
      setStates(allStates);
      setQuery((prev) => ({
        ...prev,
        state: "", // Reset state when country changes
        city: "", // Reset city when state changes
        landmark: "", // Reset landmark when state changes
      }));
      setCities([]); // Clear cities on country change
    }
  }, [query.country]);

  // Update cities when state changes
  useEffect(() => {
    if (query.state) {
      const allCities = City.getCitiesOfState(query.country, query.state);
      setCities(allCities);
    }
  }, [query.state, query.country]);

  // Handle change in any input
  const handleChange = (e) => {
    setQuery({
      ...query,
      [e.target.name]: e.target.value,
    });
  };

  // Handle custom landmark input change
  const handleLandmarkChange = (e) => {
    setLandmarkInput(e.target.value);
  };

  // Handle additional landmark input change
  const handleAdditionalLandmarkChange = (value) => {
    setAdditionalLandmarkInput(value);
  };

  // Handle filter button click (update search params)
  const handleFilter = () => {
    // If custom landmark is entered, update the query
    if (landmarkInput) {
      setQuery({
        ...query,
        landmark: landmarkInput,
      });
    }
    // If additional landmark is entered, update the query
    if (additionalLandmarkInput) {
      setQuery({
        ...query,
        additionalLandmark: additionalLandmarkInput,
      });
    }
    setSearchParams(query);
  };

  return (
    <div className="filter">
      <h1>
        Search results for <b>{searchParams.get("city")}</b>
      </h1>
      <div className="top">
        {/* Top section */}
      </div>
      <div className="bottom">
        <div className="item">
          <label htmlFor="country">Country</label>
          <select
            name="country"
            id="country"
            onChange={handleChange}
            value={query.country}
          >
            <option value="">Any</option>
            {countries.map((country) => (
              <option key={country.isoCode} value={country.isoCode}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        {query.country && (
          <div className="item">
            <label htmlFor="state">State</label>
            <select
              name="state"
              id="state"
              onChange={handleChange}
              value={query.state}
            >
              <option value="">Any</option>
              {states.map((state) => (
                <option key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {query.state && (
          <div className="item">
            <label htmlFor="city">City</label>
            <select
              name="city"
              id="city"
              onChange={handleChange}
              value={query.city}
            >
              <option value="">Any</option>
              {cities.map((city) => (
                <option key={city.id} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Landmark/Society Input - Only show if a city is selected */}
        {query.city && (
          <div className="item">
            <label htmlFor="landmark">Landmark/Society</label>
            <input
              type="text"
              id="landmark"
              name="landmark"
              placeholder="Enter Landmark/Society"
              onChange={handleLandmarkChange}
              value={landmarkInput}
            />
          </div>
        )}

        {/* Child Landmark Component - Only show if landmark is filled */}
        {landmarkInput && (
          <LandmarkChild onLandmarkChange={handleAdditionalLandmarkChange} />
        )}

        <div className="item">
          <label htmlFor="type">Type</label>
          <select
            name="type"
            id="type"
            onChange={handleChange}
            value={query.type}
          >
            <option value="">Any</option>
            <option value="buy">Buy</option>
            <option value="rent">Rent</option>
          </select>
        </div>

        <div className="item">
          <label htmlFor="property">Property</label>
          <select
            name="property"
            id="property"
            onChange={handleChange}
            value={query.property}
          >
            <option value="">Any</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="condo">Condo</option>
            <option value="land">Land</option>
          </select>
        </div>

        <div className="price-container">
          <div className="item">
            <label htmlFor="minPrice">Min Price</label>
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              placeholder="Min Price"
              onChange={handleChange}
              value={query.minPrice}
            />
          </div>

          <div className="item">
            <label htmlFor="maxPrice">Max Price</label>
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              placeholder="Max Price"
              onChange={handleChange}
              value={query.maxPrice}
            />
          </div>
        </div>

        <div className="item">
          <label htmlFor="bedroom">Bedroom</label>
          <input
            type="text"
            id="bedroom"
            name="bedroom"
            placeholder="Any"
            onChange={handleChange}
            value={query.bedroom}
          />
        </div>

        <button onClick={handleFilter}>
          <img src="/search.png" alt="Search" />
        </button>
      </div>
    </div>
  );
}

export default Filter;
