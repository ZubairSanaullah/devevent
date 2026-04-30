'use client'

import { useState } from "react"
import { createBooking } from "@/lib/actions/booking.actions";
import posthog from "posthog-js";

const BookEvent = ({eventId, slug}: {eventId: string, slug: string}) => {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const {success} = await createBooking({eventId, slug, email});

        if(success) {
            setSubmitted(true)
            posthog.capture('event_booked', {
                eventId, slug, email
            })
        } else {
            console.log('Booking failed...');
            posthog.captureException('Booking failed...');
        }
        e.preventDefault();
        
        // Validate email
        if (!email || !email.includes('@')) {
            setError('Please enter a valid email address');
            return;
        }
        
        setError("");
    };

  return (
    <div id="book-event" style={{ position: 'relative', zIndex: 10 }}>
        {submitted ? (
            <p className="text-sm">Thank you for signing up!</p>
        ): (
            <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
                <div>
                    <label htmlFor="email">Email Address</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setError("");
                        }}
                        onFocus={() => setError("")}
                        id="email"
                        placeholder="Enter your Email Address"
                        required
                        style={{ position: 'relative', zIndex: 11 }}
                    />
                    {error && <p className="text-red-500 text-xs">{error}</p>}
                </div>

                <button 
                    type="submit" 
                    className="button-submit"
                    style={{ position: 'relative', zIndex: 11 }}
                >
                    Submit
                </button>
            </form>
        )}
    </div>
  )
}

export default BookEvent