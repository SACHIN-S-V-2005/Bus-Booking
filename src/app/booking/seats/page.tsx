'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { Armchair, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { trips, buses, routes } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

function SeatSelection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const tripId = searchParams.get('tripId');
  
  const trip = trips.find(t => t.id === tripId);
  const bus = buses.find(b => b.id === trip?.busId);
  const route = routes.find(r => r.id === trip?.routeId);
  
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  if (!trip || !bus || !route) {
    return (
      <div className="text-center py-16">
        <h2 className="font-headline text-2xl font-semibold">Trip Not Found</h2>
        <p className="text-muted-foreground mt-2">The requested trip could not be found.</p>
        <Link href="/">
          <Button variant="outline" className="mt-4">Go to Homepage</Button>
        </Link>
      </div>
    );
  }

  const toggleSeat = (seatId: string) => {
    if (bus.bookedSeats.includes(seatId)) return;
    
    setSelectedSeats(prev => 
      prev.includes(seatId) 
        ? prev.filter(s => s !== seatId)
        : [...prev, seatId]
    );
  };
  
  const totalFare = selectedSeats.length * bus.minFare;

  const handleBooking = () => {
    if (selectedSeats.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No seats selected',
        description: 'Please select at least one seat to proceed.',
      });
      return;
    }
    
    const bookingId = `BK-${Date.now()}`;
    const query = new URLSearchParams({
      bookingId,
      tripId: trip.id,
      seats: selectedSeats.join(','),
    });
    router.push(`/booking/confirmation?${query.toString()}`);
  }

  const renderSeats = () => {
    let seatRows = [];
    for (let i = 0; i < bus.totalSeats / 4; i++) {
      let rowSeats = [];
      const rowLetter = String.fromCharCode(65 + i);
      for (let j = 1; j <= 4; j++) {
        const seatId = `${rowLetter}${j}`;
        rowSeats.push(
          <div
            key={seatId}
            onClick={() => toggleSeat(seatId)}
            className={cn(
              "flex items-center justify-center p-1 rounded-md transition-colors",
              bus.bookedSeats.includes(seatId)
                ? "text-muted-foreground/50 cursor-not-allowed"
                : "cursor-pointer hover:bg-accent/50",
              selectedSeats.includes(seatId) && "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            <Armchair className="w-8 h-8" />
          </div>
        );
        if (j === 2) {
            rowSeats.push(<div key={`aisle-${i}`} className="w-8"></div>);
        }
      }
      seatRows.push(<div key={`row-${i}`} className="flex gap-1">{rowSeats}</div>);
    }
    return seatRows;
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
             <div className="flex items-center gap-4">
               <Link href="/booking/search">
                 <Button variant="outline" size="icon"><ArrowLeft /></Button>
               </Link>
                <div>
                    <CardTitle className="font-headline text-2xl">Select Your Seats</CardTitle>
                    <CardDescription>{route.source} to {route.destination}</CardDescription>
                </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="border rounded-lg p-4 md:p-6 space-y-2 bg-background">
              {renderSeats()}
            </div>
            <div className="flex gap-6 mt-6 text-sm">
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full border"></div> Available</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-primary"></div> Selected</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-muted-foreground/50"></div> Booked</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-semibold">{trip.tripNumber}</p>
              <p className="text-sm text-muted-foreground">{route.source} - {route.destination}</p>
            </div>
            <div>
              <p className="font-semibold">Selected Seats</p>
              <p className="text-sm text-primary font-bold">
                {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
              </p>
            </div>
            <div className="border-t pt-4">
              <p className="font-semibold">Total Fare</p>
              <p className="text-3xl font-bold text-primary">Rs{totalFare.toFixed(2)}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" size="lg" onClick={handleBooking}>
              Book Now
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default function SeatsPage() {
    return (
        <div className="container py-12">
            <Suspense fallback={<div>Loading...</div>}>
                <SeatSelection />
            </Suspense>
        </div>
    )
}
