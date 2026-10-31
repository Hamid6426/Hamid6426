export interface ExperienceItem {
  id: number;
  company: string;
  location?: string;
  role: string;
  dates: string;
  points: string[];
  current?: boolean;
}

export const experienceData: ExperienceItem[] = [
  {
    id: 1,
    company: "CodeSwift",
    location: "Rawalpindi",
    role: "Full Stack Developer",
    dates: "February 2026 - Present",
    points: [
      "Led a cross-functional team of 8, defining business requirements, coding guidelines, PR policies, and code reviews.",
      "Shipped 3 SEO-focused Next.js applications generating active leads, along with an internal enterprise SaaS platform.",
      "Developed .NET Core backend services for a multi-tenant enterprise EHS platform with 5 integrated web applications.",
      "Managed end-to-end CI/CD and deployment pipelines across cloud VPS infrastructure and Oracle Cloud production servers.",
    ],
    current: true,
  },
  {
    id: 2,
    company: "LitGrey Technologies",
    location: "Remote",
    role: "Frontend Developer",
    dates: "August 2025 - January 2026",
    points: [
      "Built frontend features with Angular for Optician Dynamics, an optical ERP and POS for eyewear retailers.",
      "Refactored core POS, warehouse, and purchasing workflows to improve UX and cross-device responsiveness.",
      "Maintained delivery in an RDP setup, consistently scoring 90% productivity while working without AI tools.",
    ],
    current: false,
  },
  {
    id: 3,
    company: "BixForge Solutions",
    location: "Remote",
    role: "Backend Developer",
    dates: "March 2025 - June 2025",
    points: [
      "Built backend services with secure authentication and RESTful API endpoints.",
      "Worked with UX designers, frontend developers and a product manager on a remote team.",
    ],
    current: false,
  },
  {
    id: 4,
    company: "Vocsena",
    location: "Remote",
    role: "Full Stack Developer",
    dates: "September 2024 - December 2024",
    points: [
      "Built responsive pages and complex routing in React and Tailwind CSS from Figma designs.",
      "Added authentication, metadata upload and database setup on a Node.js/Express backend, and documented the APIs.",
    ],
    current: false,
  },
  {
    id: 5,
    company: "Freelance",
    location: "Remote",
    role: "Full Stack Developer",
    dates: "July 2024 - Present",
    points: [
      "Turned client ideas into web apps with the MERN stack, Angular and Next.js with a 100% satisfaction and perfect rating.",
      "Fixed buggy, vibe-coded and unfinished projects, including a complex full-stack application and 3D web project.",
    ],
    current: true,
  },
];
