import type { Route, Bus, Trip } from './types';

export const routes: Route[] = [
  { id: 'R1', routeNumber: '101', source: 'Downtown', destination: 'Uptown', stops: 10, fareStages: 5, travelTime: '1h 15m' },
  { id: 'R2', routeNumber: '202', source: 'Airport', destination: 'Central Station', stops: 5, fareStages: 3, travelTime: '45m' },
  { id: 'R3', routeNumber: '303', source: 'West Suburbs', destination: 'Eastside', stops: 15, fareStages: 8, travelTime: '2h 0m' },
];

export const buses: Bus[] = [
  { id: 'B1', busNumber: 'BN-001', type: 'AC', minFare: 2.50, fareIncrement: 0.50, depot: 'Main Depot', totalSeats: 40, bookedSeats: ['A1', 'A2', 'C4'] },
  { id: 'B2', busNumber: 'BN-002', type: 'Non-AC', minFare: 1.50, fareIncrement: 0.25, depot: 'Main Depot', totalSeats: 50, bookedSeats: ['B3', 'D1', 'E5', 'F2'] },
  { id: 'B3', busNumber: 'BN-003', type: 'Sleeper', minFare: 5.00, fareIncrement: 1.00, depot: 'West Depot', totalSeats: 30, bookedSeats: ['S1', 'S5', 'S10'] },
];

export const trips: Trip[] = [
  { id: 'T1', tripNumber: 'TR-101A', startTime: '08:00', routeId: 'R1', busId: 'B1', departureTime: '08:00', arrivalTime: '09:15' },
  { id: 'T2', tripNumber: 'TR-101B', startTime: '12:00', routeId: 'R1', busId: 'B2', departureTime: '12:00', arrivalTime: '13:15' },
  { id: 'T3', tripNumber: 'TR-202A', startTime: '09:30', routeId: 'R2', busId: 'B1', departureTime: '09:30', arrivalTime: '10:15' },
  { id: 'T4', tripNumber: 'TR-303A', startTime: '07:00', routeId: 'R3', busId: 'B3', departureTime: '07:00', arrivalTime: '09:00' },
];
