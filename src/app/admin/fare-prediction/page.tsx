'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DollarSign, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { predictFare, FarePredictionInput, FarePredictionOutput } from '@/ai/flows/fare-prediction';
import { routes } from '@/lib/data';
import { Separator } from '@/components/ui/separator';

const predictionSchema = z.object({
  routeNumber: z.string({ required_error: 'Please select a route.' }),
  timeOfDay: z.enum(['Morning', 'Afternoon', 'Evening', 'Night']),
  demand: z.enum(['Low', 'Medium', 'High']),
  competitorPricing: z.coerce.number().min(0, 'Competitor price must be a positive number.'),
});

export default function FarePredictionPage() {
  const [prediction, setPrediction] = useState<FarePredictionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof predictionSchema>>({
    resolver: zodResolver(predictionSchema),
    defaultValues: {
      timeOfDay: 'Afternoon',
      demand: 'Medium',
    },
  });

  async function onSubmit(data: z.infer<typeof predictionSchema>) {
    setIsLoading(true);
    setPrediction(null);
    try {
      const result = await predictFare(data);
      setPrediction(result);
    } catch (error) {
      console.error('Fare prediction failed:', error);
      // You could show a toast notification here
    }
    setIsLoading(false);
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Fare Prediction</CardTitle>
          <CardDescription>Use AI to predict the optimal fare for a trip.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="routeNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Route</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select a route" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {routes.map(r => <SelectItem key={r.id} value={r.routeNumber}>{r.routeNumber}: {r.source} to {r.destination}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="timeOfDay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time of Day</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select time of day" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {['Morning', 'Afternoon', 'Evening', 'Night'].map(time => <SelectItem key={time} value={time}>{time}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="demand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Demand Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select demand level" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {['Low', 'Medium', 'High'].map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="competitorPricing"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Average Competitor Price</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="e.g., 15.50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <DollarSign className="mr-2 h-4 w-4" />}
                Predict Fare
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <div className="flex items-center justify-center">
        {isLoading && (
            <div className="flex flex-col items-center gap-4 text-muted-foreground">
                <Loader2 className="h-12 w-12 animate-spin text-primary"/>
                <p className="font-semibold">Predicting optimal fare...</p>
            </div>
        )}
        {prediction && (
          <Card className="w-full bg-accent/20 border-accent">
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center gap-2">
                <DollarSign className="h-8 w-8 text-primary" />
                Prediction Result
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Predicted Optimal Fare</p>
                <p className="text-4xl font-bold text-primary">Rs{prediction.predictedFare.toFixed(2)}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Reasoning</p>
                <p className="mt-1">{prediction.reasoning}</p>
              </div>
            </CardContent>
          </Card>
        )}
        {!isLoading && !prediction && (
             <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
                <p className="font-semibold">Your prediction will appear here.</p>
                <p className="text-sm mt-1">Fill out the form to get started.</p>
             </div>
        )}
      </div>
    </div>
  );
}
