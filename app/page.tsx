import EventCard from "@/components/EventCard"
import ExploreBtn from "@/components/ExploreBtn"
import { cacheLife } from "next/cache";
import { events } from '@/lib/constants'

const page = async () => {
  'use cache';
  cacheLife('hours');

  return (
    <section>
      <h1 className="text-center">The Ultimate AI-Powered Event Platform <br /> You Can&apos;t Miss</h1>
      <p className="text-center mt-5">Hackathons, conferences, and meetups all in one place.</p>

      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>

        <ul className="events">
          {events && events.length > 0 && events.map((event) => (
            <li key={event.title} >
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default page