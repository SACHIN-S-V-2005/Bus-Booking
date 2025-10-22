'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { trips, buses, routes } from '@/lib/data';
import { CheckCircle, Download, Bus, Armchair, Ticket } from 'lucide-react';

function Confirmation() {
    const searchParams = useSearchParams();
    const bookingId = searchParams.get('bookingId');
    const tripId = searchParams.get('tripId');
    const selectedSeats = searchParams.get('seats')?.split(',') || [];

    const trip = trips.find(t => t.id === tripId);
    const bus = buses.find(b => b.id === trip?.busId);
    const route = routes.find(r => r.id === trip?.routeId);

    if (!bookingId || !trip || !bus || !route) {
        return (
             <div className="text-center py-16">
                <h2 className="font-headline text-2xl font-semibold">Booking Not Found</h2>
                <p className="text-muted-foreground mt-2">The requested booking could not be found.</p>
                <Link href="/">
                <Button variant="outline" className="mt-4">Go to Homepage</Button>
                </Link>
            </div>
        );
    }
    
    const totalFare = selectedSeats.length * bus.minFare;

    return (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
                <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
                <h1 className="font-headline text-3xl md:text-4xl font-bold">Booking Confirmed!</h1>
                <p className="text-muted-foreground mt-2">Your ticket is ready. Thank you for choosing BusEZ.</p>
            </div>

            <div className="border-2 border-dashed rounded-xl overflow-hidden">
                <div className="p-6 bg-primary text-primary-foreground flex items-center justify-between">
                    <h2 className="font-headline text-2xl">Your Ticket</h2>
                    <Ticket className="h-8 w-8" />
                </div>
                <div className="p-6 grid gap-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Booking ID</p>
                        <p className="font-mono font-semibold">{bookingId}</p>
                    </div>
                    
                    <Separator />

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                             <p className="text-sm text-muted-foreground">Route</p>
                             <p className="font-semibold">{route.source} to {route.destination}</p>
                             <p className="text-xs">Route No. {route.routeNumber}</p>
                        </div>
                        <div>
                             <p className="text-sm text-muted-foreground">Trip</p>
                             <p className="font-semibold">{trip.tripNumber}</p>
                             <p className="text-xs">{new Date().toDateString()}</p>
                        </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                         <div>
                             <p className="text-sm text-muted-foreground">Departure</p>
                             <p className="font-bold text-lg">{trip.departureTime}</p>
                        </div>
                         <div className="text-right md:text-left">
                             <p className="text-sm text-muted-foreground">Arrival</p>
                             <p className="font-bold text-lg">{trip.arrivalTime}</p>
                        </div>
                    </div>

                    <Separator />
                    
                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Bus</p>
                            <p className="font-semibold flex items-center gap-2"><Bus className="h-4 w-4"/> {bus.busNumber}</p>
                        </div>
                         <div>
                            <p className="text-sm text-muted-foreground">Seats</p>
                            <p className="font-semibold flex items-center gap-2"><Armchair className="h-4 w-4"/> {selectedSeats.join(', ')}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Fare</p>
                            <p className="font-bold text-lg text-primary">Rs{totalFare.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={() => window.print()}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Ticket
                </Button>
                <Link href="/">
                    <Button size="lg" variant="outline" className="w-full">Book Another Trip</Button>
                </Link>
            </div>
        </div>
    );
}


export default function ConfirmationPage() {
  return (
    <div className="container py-12 md:py-16">
        <Suspense fallback={<div>Loading Confirmation...</div>}>
            <Confirmation />
        </Suspense>
    </div>
  );
}
