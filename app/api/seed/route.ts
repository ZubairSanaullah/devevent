import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Event from '@/database/event.model';

const seedEvents = [
  {
    title: "React Conf 2026",
    image: "/images/event1.png",
    slug: "react-conf-2026",
    location: "Las Vegas, NV",
    date: "2026-05-15",
    time: "09:00",
    description: "The premier conference for React developers to learn about the latest features and best practices.",
    overview: "Join thousands of developers for three days of talks, workshops, and networking. Discover the future of React and the web ecosystem.",
    venue: "Las Vegas Convention Center",
    mode: "offline",
    audience: "Web Developers, Tech Leads, UI/UX Designers",
    agenda: [
        "09:00 AM - Keynote: The Future of React",
        "11:00 AM - Concurrent Sessions: Server Components Deep Dive",
        "01:00 PM - Lunch & Networking",
        "02:00 PM - Workshop: Advanced State Management",
        "04:00 PM - Panel Discussion: React in Production"
    ],
    organizer: "React Core Team & Friends",
    tags: ["React", "JavaScript", "Frontend", "Web Development"]
  },
  {
    title: "Google I/O 2026",
    image: "/images/event2.png",
    slug: "google-io-2026",
    location: "Mountain View, CA",
    date: "2026-05-20",
    time: "10:00",
    description: "Google's annual developer conference featuring the latest innovations in AI, Android, and Cloud.",
    overview: "Experience the next wave of technology. From Gemini updates to the newest Android features, Google I/O is where the future happens.",
    venue: "Shoreline Amphitheatre",
    mode: "hybrid",
    audience: "Android Developers, Cloud Architects, AI Researchers",
    agenda: [
        "10:00 AM - Keynote: AI First World",
        "12:00 PM - What's New in Android 17",
        "02:00 PM - Building with Gemini 3",
        "04:00 PM - Cloud Computing at Scale"
    ],
    organizer: "Google Developers",
    tags: ["Google", "AI", "Android", "Cloud"]
  },
  {
    title: "Apple WWDC 2026",
    image: "/images/event3.png",
    slug: "apple-wwdc-2026",
    location: "Online",
    date: "2026-06-10",
    time: "10:00",
    description: "The Worldwide Developers Conference brings together developers from around the globe to explore the latest Apple platforms.",
    overview: "Get an in-depth look at the future of iOS, iPadOS, macOS, watchOS, and tvOS. Learn from Apple engineers and designers.",
    venue: "Apple Park / Online",
    mode: "online",
    audience: "iOS/macOS Developers, App Designers",
    agenda: [
        "10:00 AM - Platforms State of the Union",
        "01:00 PM - Swift & SwiftUI Enhancements",
        "03:00 PM - Spatial Computing with VisionOS 3",
        "05:00 PM - Developer Labs Open"
    ],
    organizer: "Apple Inc.",
    tags: ["Apple", "iOS", "Swift", "WWDC"]
  },
  {
    title: "Microsoft Build 2026",
    image: "/images/event4.png",
    slug: "microsoft-build-2026",
    location: "Seattle, WA",
    date: "2026-05-25",
    time: "08:00",
    description: "Explore the latest in cloud, AI, and developer tools from Microsoft.",
    overview: "Build tomorrow's software today. Deep dive into Azure, .NET, and the Windows developer ecosystem with Microsoft experts.",
    venue: "Seattle Convention Center",
    mode: "hybrid",
    audience: "Full Stack Developers, Azure Architects, Enterprise Devs",
    agenda: [
        "08:00 AM - Keynote: Empowering Every Developer",
        "10:00 AM - Azure OpenAI Service in Action",
        "01:00 PM - Modernizing .NET Applications",
        "03:00 PM - Windows 12 for Developers"
    ],
    organizer: "Microsoft",
    tags: ["Microsoft", "Azure", ".NET", "AI"]
  },
  {
    title: "PyCon US 2026",
    image: "/images/event5.png",
    slug: "pycon-us-2026",
    location: "Pittsburgh, PA",
    date: "2026-05-18",
    time: "09:00",
    description: "The largest annual gathering for the community using and developing the open-source Python programming language.",
    overview: "A community-driven conference featuring tutorials, talks, and development sprints. Perfect for Pythonistas of all levels.",
    venue: "David L. Lawrence Convention Center",
    mode: "offline",
    audience: "Data Scientists, Backend Developers, Academics",
    agenda: [
        "09:00 AM - Keynote: Python's Role in Modern Science",
        "11:00 AM - Data Processing with Polars & Pandas 3",
        "02:00 PM - Async Python: Patterns & Pitfalls",
        "04:00 PM - Community Lightning Talks"
    ],
    organizer: "Python Software Foundation",
    tags: ["Python", "Data Science", "Backend", "Open Source"]
  },
  {
    title: "JSConf EU 2026",
    image: "/images/event6.png",
    slug: "jsconf-eu-2026",
    location: "Berlin, Germany",
    date: "2026-06-01",
    time: "09:00",
    description: "The legendary JavaScript conference returns to Berlin with a focus on community and pushing the boundaries of JS.",
    overview: "Two days of high-quality talks and incredible community vibes. Explore the cutting edge of the Web.",
    venue: "Arena Berlin",
    mode: "offline",
    audience: "JavaScript Enthusiasts, Web Engineers",
    agenda: [
        "09:00 AM - Breakfast & Registration",
        "10:00 AM - Opening Keynote",
        "01:00 PM - Outdoor Lunch",
        "02:00 PM - Interactive Art & JS",
        "05:00 PM - Afterparty Prep"
    ],
    organizer: "JSConf Team",
    tags: ["JavaScript", "Web", "Community", "Open Source"]
  }
];

export async function GET() {
  try {
    await connectDB();
    
    // Clear existing events to avoid duplicates during seeding
    await Event.deleteMany({});
    
    // Insert seed events
    const createdEvents = await Event.insertMany(seedEvents);
    
    return NextResponse.json({ 
      message: 'Database seeded successfully', 
      count: createdEvents.length 
    }, { status: 200 });
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json({ 
      message: 'Seeding failed', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
