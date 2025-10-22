'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { Trip } from '@/lib/types';
import { trips as mockTrips, routes, buses } from '@/lib/data';

const tripSchema = z.object({
  tripNumber: z.string().min(1, 'Trip number is required'),
  startTime: z.string().min(1, 'Start time is required'),
  routeId: z.string().min(1, 'Route is required'),
  busId: z.string().min(1, 'Bus is required'),
  departureTime: z.string().min(1, 'Departure time is required'),
  arrivalTime: z.string().min(1, 'Arrival time is required'),
});

export default function TripsPage() {
  const { toast } = useToast();
  const [trips, setTrips] = useState<Trip[]>(mockTrips);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);

  const form = useForm<z.infer<typeof tripSchema>>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      tripNumber: '',
      startTime: '',
      routeId: '',
      busId: '',
      departureTime: '',
      arrivalTime: '',
    },
  });
  
  const onSubmit = (data: z.infer<typeof tripSchema>) => {
    if (editingTrip) {
      setTrips(trips.map(t => t.id === editingTrip.id ? { ...editingTrip, ...data } : t));
      toast({ title: 'Success', description: 'Trip updated successfully.' });
    } else {
      const newTrip: Trip = { id: `T${trips.length + 1}`, ...data };
      setTrips([...trips, newTrip]);
      toast({ title: 'Success', description: 'Trip added successfully.' });
    }
    setIsDialogOpen(false);
    setEditingTrip(null);
    form.reset();
  };

  const handleEdit = (trip: Trip) => {
    setEditingTrip(trip);
    form.reset(trip);
    setIsDialogOpen(true);
  };
  
  const handleDelete = (id: string) => {
    setTrips(trips.filter(t => t.id !== id));
    toast({ title: 'Success', description: 'Trip deleted successfully.' });
  }

  const openNewTripDialog = () => {
    setEditingTrip(null);
    form.reset({ tripNumber: '', startTime: '', routeId: '', busId: '', departureTime: '', arrivalTime: '' });
    setIsDialogOpen(true);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline text-2xl">Trip Management</CardTitle>
        <Button onClick={openNewTripDialog}>Add New Trip</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Trip No.</TableHead>
              <TableHead>Route No.</TableHead>
              <TableHead>Bus No.</TableHead>
              <TableHead>Departure</TableHead>
              <TableHead>Arrival</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trips.map((trip) => {
              const route = routes.find(r => r.id === trip.routeId);
              const bus = buses.find(b => b.id === trip.busId);
              return (
                <TableRow key={trip.id}>
                  <TableCell className="font-medium">{trip.tripNumber}</TableCell>
                  <TableCell>{route?.routeNumber || 'N/A'}</TableCell>
                  <TableCell>{bus?.busNumber || 'N/A'}</TableCell>
                  <TableCell>{trip.departureTime}</TableCell>
                  <TableCell>{trip.arrivalTime}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(trip)}>Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(trip.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingTrip ? 'Edit Trip' : 'Add New Trip'}</DialogTitle></DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="tripNumber" render={({ field }) => <FormItem><FormLabel>Trip Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
              <FormField control={form.control} name="startTime" render={({ field }) => <FormItem><FormLabel>Start Time</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>} />
              <FormField control={form.control} name="departureTime" render={({ field }) => <FormItem><FormLabel>Departure Time</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>} />
              <FormField control={form.control} name="arrivalTime" render={({ field }) => <FormItem><FormLabel>Arrival Time</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>} />
              <FormField control={form.control} name="routeId" render={({ field }) => <FormItem><FormLabel>Route</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a route" /></SelectTrigger></FormControl><SelectContent>{routes.map(r => <SelectItem key={r.id} value={r.id}>{r.routeNumber} ({r.source} - {r.destination})</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>} />
              <FormField control={form.control} name="busId" render={({ field }) => <FormItem><FormLabel>Bus</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a bus" /></SelectTrigger></FormControl><SelectContent>{buses.map(b => <SelectItem key={b.id} value={b.id}>{b.busNumber} ({b.type})</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>} />
              <DialogFooter><Button type="submit">Save</Button></DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
