'use server';
/**
 * @fileOverview AI-powered fare prediction flow.
 *
 * - predictFare - A function that predicts the optimal fare price.
 * - FarePredictionInput - The input type for the predictFare function.
 * - FarePredictionOutput - The return type for the predictFare function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FarePredictionInputSchema = z.object({
  routeNumber: z.string().describe('The route number for the bus trip.'),
  timeOfDay: z.string().describe('The time of day for the trip (e.g., morning, afternoon, evening).'),
  demand: z.string().describe('The current demand level (e.g., low, medium, high).'),
  competitorPricing: z.number().describe('The average fare price of competitors for the same route.'),
});
export type FarePredictionInput = z.infer<typeof FarePredictionInputSchema>;

const FarePredictionOutputSchema = z.object({
  predictedFare: z.number().describe('The predicted optimal fare price.'),
  reasoning: z.string().describe('The reasoning behind the predicted fare price.'),
});
export type FarePredictionOutput = z.infer<typeof FarePredictionOutputSchema>;

export async function predictFare(input: FarePredictionInput): Promise<FarePredictionOutput> {
  return farePredictionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'farePredictionPrompt',
  input: {schema: FarePredictionInputSchema},
  output: {schema: FarePredictionOutputSchema},
  prompt: `You are an AI-powered fare prediction system for a bus company. Based on the route number,
time of day, demand, and competitor pricing, predict the optimal fare price to maximize revenue while remaining competitive.

Route Number: {{{routeNumber}}}
Time of Day: {{{timeOfDay}}}
Demand: {{{demand}}}
Competitor Pricing: {{{competitorPricing}}}

Consider the following factors when predicting the fare:
* Higher demand should result in a higher fare.
* If competitor pricing is lower, the fare should be competitive but still profitable.
* Time of day can influence demand and therefore the fare.

Provide a predicted fare price and a brief explanation of your reasoning.
`,
});

const farePredictionFlow = ai.defineFlow(
  {
    name: 'farePredictionFlow',
    inputSchema: FarePredictionInputSchema,
    outputSchema: FarePredictionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
