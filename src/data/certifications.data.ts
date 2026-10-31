export interface CertificationItem {
  id: number;
  title: string;
  issuer: string;
  issuedAt: string;
  url?: string;
}

export const certificationsData: CertificationItem[] = [
  {
    id: 1,
    title: "Front-End Developer Certification",
    issuer: "IBM (Coursera)",
    issuedAt: "September 2026",
  },
  {
    id: 2,
    title: "Quality Assurance Certification",
    issuer: "freeCodeCamp",
    issuedAt: "February 22, 2025",
  },
  {
    id: 3,
    title: "Back-End Development Certification",
    issuer: "freeCodeCamp",
    issuedAt: "July 20, 2024",
  },
  {
    id: 4,
    title: "Relational Database Certification",
    issuer: "freeCodeCamp",
    issuedAt: "June 20, 2024",
  },
  {
    id: 5,
    title: "Front-End Development Libraries Certification",
    issuer: "freeCodeCamp",
    issuedAt: "June 9, 2024",
  },
  {
    id: 6,
    title: "Data Visualization Certification",
    issuer: "freeCodeCamp",
    issuedAt: "June 9, 2024",
  },
  {
    id: 7,
    title: "JavaScript Algorithms and Data Structures Certification",
    issuer: "freeCodeCamp",
    issuedAt: "June 5, 2024",
  },
  {
    id: 8,
    title: "Responsive Web Design Certification",
    issuer: "freeCodeCamp",
    issuedAt: "April 19, 2024",
  },
];
