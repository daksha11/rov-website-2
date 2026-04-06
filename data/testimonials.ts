export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  impactStat: string;
  socialUrl?: string;
  image?: string;
}

export type ServiceVariant = "web" | "sound" | "video" | "ai";

export const webTestimonials: Testimonial[] = [
  {
    quote:
      "If you can add this effect, I'll send you a million clients. Everything finally looks like it came from one brain. The website, the branding, the content, it all tells the same story now.",
    name: "Aysegul Ikna",
    role: "Founder, Aysegul Ikna",
    impactStat: "+30% Sales",
    socialUrl: "https://www.instagram.com/aysegulikna/",
    image: "/clients/ikna2.webp",
  },
  {
    quote:
      "Our website didn't match the energy of our Instagram or what people experience in-store. ROV brought our brand to life online. Now the site finally feels like us.",
    name: "Terry",
    role: "Founder & Owner, The Bando",
    impactStat: "#1 Google Ranking",
    socialUrl: "https://www.instagram.com/thebandoatl/",
    image: "/clients/terry.png",
  },
  {
    quote:
      "ROV Studios is really fast and gave me a premium brand look I deserve.",
    name: "DKM Corp",
    role: "Global Operations",
    impactStat: "Global Infrastructure",
    socialUrl: "https://www.instagram.com/dkmcorp/",
  },
  {
    quote:
      "The site launched and the community started growing right away. It finally feels like the product it actually is.",
    name: "Pursue Networking",
    role: "Platform Founder",
    impactStat: "Platform Launch",
  },
];

export const soundTestimonials: Testimonial[] = [
  {
    quote:
      "Basu is one of the fastest engineers ever, what he was doing with this setup back then amused me. My biggest songs are mixed by Basu.",
    name: "DDK",
    role: "Recording Artist",
    impactStat: "Fastest Engineer",
    image: "/clients/ddk.jpg",
  },
  {
    quote:
      "ROV always sends files, stems, and deliverables in a well organized manner, which is so rare in the music industry these days. Tired of getting back final_maybe.mp3",
    name: "Dre Howard",
    role: "Recording Artist",
    impactStat: "Organized Delivery",
  },
  {
    quote:
      "Never seen such a smooth system setup. I sent the stems to them and got them back within a day, perfectly mixed. They were also super kind and quick about revisions.",
    name: "Sophie Said",
    role: "Recording Artist",
    impactStat: "24hr Turnaround",
    image: "/clients/sophie.webp",
  },
  {
    quote:
      "I sent Basu my track at night and woke up to a finished mix. Fastest turnaround I've ever had from any engineer, and the quality didn't suffer at all. He just locks in and delivers.",
    name: "Pedro",
    role: "Recording Artist",
    impactStat: "Overnight Delivery",
    image: "/clients/pedro.png",
  },
];

export const videoTestimonials: Testimonial[] = [
  {
    quote:
      "ROV filmed my event with a drone flying inside the venue. It became my most viewed video ever. They captured the energy in a way no one else could.",
    name: "Aysegul Ikna",
    role: "Founder, Aysegul Ikna",
    impactStat: "Most Viewed Video",
    socialUrl: "https://www.instagram.com/aysegulikna/",
    image: "/clients/ikna2.webp",
  },
  {
    quote:
      "ROV filmed a home I had to sell using drone and ground camera work. The listing video was so strong the property sold quickly.",
    name: "Chase",
    role: "Real Estate",
    impactStat: "Property Sold",
  },
];

export const aiTestimonials: Testimonial[] = [
  {
    quote:
      "ROV built AI systems that streamlined our workflow and cut manual tasks by 60%. We're running leaner and faster than ever.",
    name: "Pursue Networking",
    role: "Platform Founder",
    impactStat: "60% Tasks Cut",
  },
  {
    quote:
      "ROV automated our internal processes and integrated AI tools that saved us 15+ hours a week. It changed how we operate.",
    name: "DKM Corp",
    role: "Global Operations",
    impactStat: "15+ hrs/wk Saved",
    socialUrl: "https://www.instagram.com/dkmcorp/",
  },
];
