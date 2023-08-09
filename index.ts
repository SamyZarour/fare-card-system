// Types

type Station = {
  name: String;
  zones: number[];
}

type Journey = {
  station: Station;
  date: Date;
}

type Card = {
  balance: number;
  journeys: Journey[];
}

// Constants

const ZONE_1 = 1;
const ZONE_2 = 2;
const ZONE_3 = 3;

const FARE_BASE = 3.2;
const FARE_ANYWHERE_IN_ZONE_1 = 2.50;
const FARE_ANY_ONE_ZONE_OUTSIDE_ZONE_1 = 2.00;
const FARE_ANY_TWO_ZONES_INCLUDING_ZONE_1 = 3.00;
const FARE_ANY_TWO_ZONES_EXCLUDING_ZONE_1 = 2.25;
const FARE_ANY_BUS_JOURNEY = 1.8;

const STATION_HOLBURN = {
  name: "Holburn",
  zones: [ZONE_1]
}
const STATION_CHEALSEA = {
  name: "Chelsea",
  zones: [ZONE_1]
}
const STATION_EARL_S_COURT = {
  name: "Earl’s Court",
  zones: [ZONE_1, ZONE_2]
}
const STATION_WIMBLEDON = {
  name: "Wimbledon",
  zones: [ZONE_3]
}
const STATION_HAMMERSMITH = {
  name: "Hammersmith",
  zones: [ZONE_2]
}

const STATIONS = [
  STATION_HOLBURN,
  STATION_CHEALSEA,
  STATION_EARL_S_COURT,
  STATION_WIMBLEDON,
  STATION_HAMMERSMITH
];

// Services

// Get fare based on the zones of the two stations transitioned from
const getFare = (station1: Station, station2: Station, isBus: boolean) => {
  let fare = FARE_BASE;

  if (isBus) {
    fare = FARE_ANY_BUS_JOURNEY;
  }
  else if (
    station1.zones.every(z => z !== ZONE_1) &&
    station2.zones.every(z => z !== ZONE_1) &&
    station1.zones.some(z => station2.zones.includes(z))
  ) {
    fare = FARE_ANY_ONE_ZONE_OUTSIDE_ZONE_1;
  }
  else if (
    station1.zones.every(z => z !== ZONE_1) &&
    station2.zones.every(z => z !== ZONE_1)
  ) {
    fare = FARE_ANY_TWO_ZONES_EXCLUDING_ZONE_1;
  }
  else if (station1.zones.includes(ZONE_1) && station2.zones.includes(ZONE_1)) {
    fare = FARE_ANYWHERE_IN_ZONE_1;
  } 
  else if (
    (station1.zones.includes(ZONE_1) && station2.zones.includes(ZONE_2)) ||
    (station1.zones.includes(ZONE_2) && station2.zones.includes(ZONE_1))
  ) {
    fare = FARE_ANY_TWO_ZONES_INCLUDING_ZONE_1;;
  }
  
  return fare;
}

const tapCard = (card: Card, station: Station, isBus: boolean) => {
  // Only consider journeys of the past 2 hours
  const twoHoursAgo = new Date();
  twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);
  const journeyLastTwoHours = card.journeys.filter(item => item.date >= twoHoursAgo);

  // If it's the first fare in the past 2 hours charge the full amount
  // If it's the second retract the default fare
  if (journeyLastTwoHours.length === 0) {
    card.balance -= FARE_BASE;
  }
  else if (journeyLastTwoHours.length === 1) {
    card.balance += FARE_BASE;
  }

  // If it's not the first fare calculate the right fare to charge
  if (journeyLastTwoHours.length > 0) {
    const fee = getFare(journeyLastTwoHours[0].station, station, isBus);
    card.balance -= fee;
  }

  // Add the journey to the journey history with a timestamp
  card.journeys = [
    {
      station,
      date: new Date()
    },
    ...card.journeys
  ];
}

// Scenario

const card: Card = {
  balance: 30,
  journeys: []
};

console.log(`User Balance: ${card.balance}\n`);

console.log("Tube Holborn to Earl’s Court");
tapCard(card, STATION_HOLBURN, false);
tapCard(card, STATION_EARL_S_COURT, false);
console.log(`User Balance: ${card.balance}\n`);

console.log("328 bus from Earl’s Court to Chelsea");
tapCard(card, STATION_CHEALSEA, true);
console.log(`User Balance: ${card.balance}\n`);

console.log("Tube Chelsea to Wimbledon");
tapCard(card, STATION_WIMBLEDON, false);
console.log(`User Balance: ${card.balance}\n`);