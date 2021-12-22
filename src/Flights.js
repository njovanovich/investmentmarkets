import React from "react";

// class Flights
export default class Flights extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }
  componentDidMount() {
    const data = this.LoadFlightData();
    // load the data into the state
    this.setState({
      data: data
    });
  }
  // loads the flight data into the state
  LoadFlightData() {
    // set the data
    const data = [
      { source: "SYD", destination: "BNE", price: 220 },
      { source: "BNE", destination: "DAR", price: 315 },
      { source: "BNE", destination: "MEL", price: 320 },
      { source: "MEL", destination: "SYD", price: 115 },
      { source: "SYD", destination: "PER", price: 217 },
      { source: "DAR", destination: "PER", price: 150 },
      { source: "PER", destination: "ALC", price: 58 },
      { source: "ALC", destination: "SYD", price: 986 },
      { source: "ALC", destination: "MEL", price: 228 }
    ];
    return data;
  }
  GetCheapestFlight(source, destination, maximumStops) {
    let itinerary = []; // array of indexes for flights
    let stops = 0; // flights counting first flight
    // get the source flights
    let sourceFlights = this.GetIndexBySource(source);
    for (let index in sourceFlights) {
      const flight = sourceFlights[index];
      itinerary.push([flight]);
    }
    // follow each flight to its conclusion, stopping at
    // desiination if applicable
    while (stops < maximumStops) {
      // loop throuhgh each of the itinerary items
      for (let index in itinerary) {
        // the itinerary list
        const itineraryList = itinerary[index];
        const lastFlightIndex = itineraryList[itineraryList.length - 1];
        const lastFLight = this.state.data[lastFlightIndex];
        // if not the destination, fly on!
        if (lastFLight.destination !== destination) {
          // get the next stops for the last itinerary stop
          const destinationFlights = this.GetIndexBySource(
            lastFLight.destination
          );
          // if theres more than one destination for this flight
          if (destinationFlights.length > 1) {
            for (let index2 in destinationFlights) {
              let destinationFlight = destinationFlights[index2];
              if (index2 === 0) {
                itinerary[index].push(destinationFlight);
              } else {
                // make a clone of the itinerary and add the destination flight
                const newItneraryItems = itinerary[index];
                newItneraryItems.push(destinationFlight);
                itinerary.push(newItneraryItems);
              }
            }
          } else if (destinationFlights.length === 1) {
            // if just one stop, just add it to the inerarry
            itinerary[index].push(destinationFlights[0]);
          }
        }
      }
      stops++;
    }
    // cleanup itinerary
    let finalItinerary = [];
    for (let index in itinerary) {
      const itineraryItem = itinerary[index];
      console.log(itineraryItem);
      const lastFlight = this.state.data[
        itineraryItem[itineraryItem.length - 1]
      ];
      if (lastFlight.destination === destination) {
        itineraryItem.map((item, index) => {
          finalItinerary.push(this.state.data[item]);
        });
      }
    }
    // get price
    let price = 0;
    console.log(finalItinerary);
    finalItinerary.map((item) => {
      price += item.price;
      return null;
    });
    return { itinerary: finalItinerary, price: price };
  }
  // gets the index of a flight by its source
  GetIndexBySource(source) {
    let returnArray = [];
    this.state.data.map((item, index) => {
      if (item.source === source) {
        returnArray.push(index);
      }
      return null;
    });
    return returnArray;
  }
  render() {
    let result = this.GetCheapestFlight("BNE", "ALC", 2);
    const price = result.price;
    const itinerary = result.itinerary;
    return (
      <div>
        <span>Itinerary</span>
        <div>
          {itinerary.map((item, index) => (
            <div key={index}>
              {item.source}-&gt;{item.destination}
            </div>
          ))}
        </div>
        <div>Price: ${price}</div>
      </div>
    );
  }
}
