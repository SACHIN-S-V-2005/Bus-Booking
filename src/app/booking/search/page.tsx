import Link from 'next/link';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { trips, routes, buses } from '@/lib/data';
import { Clock, Route as RouteIcon, Bus, ArrowRight } from 'lucide-react';

type SearchParams = {
  from?: string;
  to?: string;
  date?: string;
};

function SearchResults({ searchParams }: { searchParams: SearchParams }) {
  const { from, to, date } = searchParams;

  // Filter routes that match the source and destination
  const matchingRouteIds = routes
    .filter(r => r.source === from && r.destination === to)
    .map(r => r.id);

  // Filter trips based on the matching routes
  const availableTrips = trips.filter(t => matchingRouteIds.includes(t.routeId));

  if (!from || !to || !date) {
    return (
      <div className="text-center py-16">
        <h2 className="font-headline text-2xl font-semibold">Invalid Search</h2>
        <p className="text-muted-foreground mt-2">Please go back to the homepage and start a new search.</p>
        <Link href="/">
          <Button className="mt-4">Go to Homepage</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-headline text-3xl md:text-4xl font-bold">Available Trips</h1>
        <p className="text-lg text-muted-foreground flex items-center gap-2 mt-2">
          <span>{from}</span> <ArrowRight className="h-5 w-5" /> <span>{to}</span>
          <span className="text-sm font-semibold ml-4">on {new Date(date).toDateString()}</span>
        </p>
      </div>

      {availableTrips.length > 0 ? (
        <div className="grid gap-6">
          {availableTrips.map(trip => {
            const route = routes.find(r => r.id === trip.routeId);
            const bus = buses.find(b => b.id === trip.busId);
            if (!route || !bus) return null;

            return (
              <Card key={trip.id} className="flex flex-col md:flex-row">
                <div className="p-6 flex-grow">
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="flex items-center justify-between">
                      <span className="font-headline text-2xl">{trip.tripNumber}</span>
                      <span className="text-xl font-semibold text-primary">Rs{bus.minFare.toFixed(2)}+</span>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 pt-1">
                      <Bus className="h-4 w-4" /> {bus.busNumber} ({bus.type})
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-2xl font-bold">{trip.departureTime}</p>
                        <p className="text-muted-foreground">{route.source}</p>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{route.travelTime}</span>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-right">{trip.arrivalTime}</p>
                        <p className="text-muted-foreground text-right">{route.destination}</p>
                      </div>
                    </div>
                  </CardContent>
                </div>
                <CardFooter className="p-6 bg-secondary/50 flex items-center justify-center md:w-56">
                  <Link href={`/booking/seats?tripId=${trip.id}`} className="w-full">
                    <Button size="lg" className="w-full">Select Seats</Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h2 className="font-headline text-2xl font-semibold">No Trips Found</h2>
          <p className="text-muted-foreground mt-2">Sorry, we couldn't find any trips for the selected route and date.</p>
           <Link href="/">
            <Button variant="outline" className="mt-4">Try another search</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <div className="container py-12">
        <Suspense fallback={<div>Loading...</div>}>
            <SearchResults searchParams={searchParams} />
        </Suspense>
    </div>
  );
}
