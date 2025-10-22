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
import type { Bus } from '@/lib/types';
import { buses as mockBuses } from '@/lib/data';

const busSchema = z.object({
  busNumber: z.string().min(1, 'Bus number is required'),
  type: z.enum(['AC', 'Non-AC', 'Sleeper']),
  minFare: z.coerce.number().min(0, 'Minimum fare must be positive'),
  fareIncrement: z.coerce.number().min(0, 'Fare increment must be positive'),
  depot: z.string().min(1, 'Depot is required'),
  totalSeats: z.coerce.number().min(1, 'Total seats must be at least 1'),
});

export default function BusesPage() {
  const { toast } = useToast();
  const [buses, setBuses] = useState<Bus[]>(mockBuses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBus, setEditingBus] = useState<Bus | null>(null);

  const form = useForm<z.infer<typeof busSchema>>({
    resolver: zodResolver(busSchema),
  });

  const onSubmit = (data: z.infer<typeof busSchema>) => {
    if (editingBus) {
      setBuses(buses.map(b => b.id === editingBus.id ? { ...editingBus, ...data } : b));
      toast({ title: 'Success', description: 'Bus updated successfully.' });
    } else {
      const newBus: Bus = { id: `B${buses.length + 1}`, ...data, bookedSeats: [] };
      setBuses([...buses, newBus]);
      toast({ title: 'Success', description: 'Bus added successfully.' });
    }
    setIsDialogOpen(false);
    setEditingBus(null);
    form.reset();
  };

  const handleEdit = (bus: Bus) => {
    setEditingBus(bus);
    form.reset(bus);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setBuses(buses.filter(b => b.id !== id));
    toast({ title: 'Success', description: 'Bus deleted successfully.' });
  }

  const openNewBusDialog = () => {
    setEditingBus(null);
    form.reset({ busNumber: '', type: 'AC', minFare: 0, fareIncrement: 0, depot: '', totalSeats: 40 });
    setIsDialogOpen(true);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline text-2xl">Bus Management</CardTitle>
        <Button onClick={openNewBusDialog}>Add New Bus</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bus No.</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Min Fare</TableHead>
              <TableHead>Depot</TableHead>
              <TableHead>Seats</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {buses.map((bus) => (
              <TableRow key={bus.id}>
                <TableCell className="font-medium">{bus.busNumber}</TableCell>
                <TableCell>{bus.type}</TableCell>
                <TableCell>Rs{bus.minFare.toFixed(2)}</TableCell>
                <TableCell>{bus.depot}</TableCell>
                <TableCell>{bus.totalSeats}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(bus)}>Edit</Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(bus.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingBus ? 'Edit Bus' : 'Add New Bus'}</DialogTitle></DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="busNumber" render={({ field }) => <FormItem><FormLabel>Bus Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
              <FormField control={form.control} name="type" render={({ field }) => <FormItem><FormLabel>Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl><SelectContent><SelectItem value="AC">AC</SelectItem><SelectItem value="Non-AC">Non-AC</SelectItem><SelectItem value="Sleeper">Sleeper</SelectItem></SelectContent></Select><FormMessage /></FormItem>} />
              <FormField control={form.control} name="minFare" render={({ field }) => <FormItem><FormLabel>Minimum Fare</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>} />
              <FormField control={form.control} name="fareIncrement" render={({ field }) => <FormItem><FormLabel>Fare Increment</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>} />
              <FormField control={form.control} name="depot" render={({ field }) => <FormItem><FormLabel>Depot</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
              <FormField control={form.control} name="totalSeats" render={({ field }) => <FormItem><FormLabel>Total Seats</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>} />
              <DialogFooter><Button type="submit">Save</Button></DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
