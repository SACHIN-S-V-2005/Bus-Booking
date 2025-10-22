import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { BookingForm } from '@/components/booking-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-bus');

  return (
    <div className="flex flex-col items-center">
      <section className="relative w-full h-[50vh] md:h-[60vh] flex items-center justify-center text-center text-white">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            data-ai-hint={heroImage.imageHint}
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 px-4">
          <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-4">
            Your Journey, Simplified
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-primary-foreground/90">
            Book your bus tickets with BusEZ – fast, easy, and reliable.
          </p>
        </div>
      </section>
      
      <div className="-mt-24 md:-mt-32 z-20 w-full max-w-4xl px-4">
        <Card className="shadow-2xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl md:text-3xl">Book Your Trip</CardTitle>
          </CardHeader>
          <CardContent>
            <BookingForm />
          </CardContent>
        </Card>
      </div>

      <section className="w-full max-w-6xl mx-auto py-16 md:py-24 px-4">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">Why Choose BusEZ?</h2>
          <p className="text-muted-foreground mt-2 text-lg">Travel with confidence and comfort.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="p-4 bg-primary/10 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M5 18a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4h14a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H5.73a2 2 0 0 0-1.74 1.05l-1.4 3.05A4 4 0 0 0 5 18Z"/><path d="M19 18h.01"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>
            </div>
            <h3 className="font-headline text-xl font-semibold">Easy Booking</h3>
            <p className="text-muted-foreground mt-1">Find and book your ideal trip in just a few clicks.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="p-4 bg-primary/10 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m14.5 9-5.5 5.5"/><path d="m9.5 9 5.5 5.5"/></svg>
            </div>
            <h3 className="font-headline text-xl font-semibold">AI-Powered Fares</h3>
            <p className="text-muted-foreground mt-1">Get the best prices with our smart fare prediction system.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="p-4 bg-primary/10 rounded-full mb-4">
             <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M8 2v4"/><path d="M16 2v4"/><path d="M3 10h18"/><path d="m9 16 2 2 4-4"/></svg>
            </div>
            <h3 className="font-headline text-xl font-semibold">Reliable Service</h3>
            <p className="text-muted-foreground mt-1">Travel on time, every time, with our trusted network.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
