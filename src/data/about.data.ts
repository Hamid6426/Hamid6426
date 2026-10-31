export interface AboutData {
  firstName: string;
  lastName: string;
  fullName: string;
  preferredName: string;
  role: string;
  oneLiner: string;
  shortSummary: string;
  longSummary: string;
  status: string;
  portrait: string;
  location: string;
  resume: string;
}

export const aboutData: AboutData = {
  firstName: "Mian Hamid",
  lastName: "Ur Rehman",
  fullName: "Mian Hamid Ur Rehman",
  preferredName: "Hamid",
  role: "Full Stack Developer & Team Lead",
  status: "Currently working at CodeSwift, developing Neptune EHSS & leading the team.",
  oneLiner: "Thoughtful code. Real-world impact.",
  shortSummary:
    "2+ years of experience building enterprise SaaS and SEO-focused web apps across the full stack, accelerated by AI agents.",
  longSummary:
    "Full Stack Developer with 2+ years of experience building enterprise SaaS applications and SEO-focused websites, including leading a team of 8. Proficient in frontend, backend, and deployments, with hands-on experience leveraging AI tools and agents workflows for accelerated development.",
  portrait: "/profile.jpg",
  location: "Islamabad, Pakistan",
  resume: "/Mian_Hamid_Ur_Rehman_CV.pdf",
};
