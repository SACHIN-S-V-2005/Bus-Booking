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
import { useToast } from '@/hooks/use-toast';
import type { Route } from '@/lib/types';
import { routes as mockRoutes } from '@/lib/data';

const routeSchema = z.object({
  routeNumber: z.string().min(1, 'Route number is required'),
  source: z.string().min(1, 'Source is required'),
  destination: z.string().min(1, 'Destination is required'),
  stops: z.coerce.number().min(0, 'Stops must be a positive number'),
  fareStages: z.coerce.number().min(1, 'Fare stages must be at least 1'),
  travelTime: z.string().min(1, 'Travel time is required'),
});

export default function RoutesPage() {
  const { toast } = useToast();
  const [routes, setRoutes] = useState<Route[]>(mockRoutes);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);

  const form = useForm<z.infer<typeof routeSchema>>({
    resolver: zodResolver(routeSchema),
  });

  const onSubmit = (data: z.infer<typeof routeSchema>) => {
    if (editingRoute) {
      setRoutes(routes.map(r => r.id === editingRoute.id ? { ...editingRoute, ...data } : r));
      toast({ title: 'Success', description: 'Route updated successfully.' });
    } else {
      const newRoute: Route = { id: `R${routes.length + 1}`, ...data };
      setRoutes([...routes, newRoute]);
      toast({ title: 'Success', description: 'Route added successfully.' });
    }
    setIsDialogOpen(false);
    setEditingRoute(null);
    form.reset();
  };
  
  const handleEdit = (route: Route) => {
    setEditingRoute(route);
    form.reset(route);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setRoutes(routes.filter(r => r.id !== id));
    toast({ title: 'Success', description: 'Route deleted successfully.' });
  }

  const openNewRouteDialog = () => {
    setEditingRoute(null);
    form.reset({ routeNumber: '', source: '', destination: '', stops: 0, fareStages: 1, travelTime: ''});
    setIsDialogOpen(true);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline text-2xl">Route Management</CardTitle>
        <Button onClick={openNewRouteDialog}>Add New Route</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Route No.</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Stops</TableHead>
              <TableHead>Travel Time</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {routes.map((route) => (
              <TableRow key={route.id}>
                <TableCell className="font-medium">{route.routeNumber}</TableCell>
                <TableCell>{route.source}</TableCell>
                <TableCell>{route.destination}</TableCell>
                <TableCell>{route.stops}</TableCell>
                <TableCell>{route.travelTime}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(route)}>Edit</Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(route.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingRoute ? 'Edit Route' : 'Add New Route'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="routeNumber" render={({ field }) => (
                  <FormItem><FormLabel>Route Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="source" render={({ field }) => (
                  <FormItem><FormLabel>Source</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="destination" render={({ field }) => (
                  <FormItem><FormLabel>Destination</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="stops" render={({ field }) => (
                  <FormItem><FormLabel>Stops</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="fareStages" render={({ field }) => (
                  <FormItem><FormLabel>Fare Stages</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="travelTime" render={({ field }) => (
                  <FormItem><FormLabel>Travel Time</FormLabel><FormControl><Input placeholder="e.g., 1h 30m" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <DialogFooter>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
