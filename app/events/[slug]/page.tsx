const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailsPage = async({params}: {params: Promise<{ slug: string } >}) => {
  const {slug} = await params;
  const response = await fetch(`${BASE_URL}/api/events/${slug}`);
  const {event} = await response.json();

  return (
    <section>
      <h1>Event Details: <br /> {event.title}</h1>
      
    </section>
  )
}

export default EventDetailsPage