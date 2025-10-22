export type Route = {
  id: string;
  routeNumber: string;
  source: string;
  destination: string;
  stops: number;
  fareStages: number;
  travelTime: string;
};

export type Trip = {
  id: string;
  tripNumber: string;
  startTime: string;
  routeId: string;
  departureTime: string;
  arrivalTime: string;
  busId: string;
};

export type Bus = {
  id: string;
  busNumber: string;
  type: 'AC' | 'Non-AC' | 'Sleeper';
  minFare: number;
  fareIncrement: number;
  depot: string;
  totalSeats: number;
  bookedSeats: string[];
};

export type Booking = {
  id: string;
  tripId: string;
  passengerName: string;
  seats: string[];
  totalFare: number;
  bookingTime: Date;
};
