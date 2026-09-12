export const personalInfo = {
  name: "Shivakumar Channamallappa Gama",
  shortName: "Shivakumar Gama",
  title: "Computer Science Engineering Student",
  roles: [
    "Software Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Android Developer"
  ],
  phone: "9845981632",
  email: "shivakumargama276@gmail.com",
  location: "Bagalakot, Karnataka",
  linkedin: "https://www.linkedin.com/in/shivakumar-gama",
  github: "https://github.com/Shivakumar-code-dev",
  objective: "Motivated and detail-oriented Computer Science student with hands-on experience in building full-stack and computer vision based applications. Seeking an entry-level opportunity as a Software Developer / Backend Developer where I can apply my skills in Python, Flask, Android development to contribute to real-world projects and grow as a software engineer.",
  stats: [
    { label: "Full-Stack Projects", value: "5+" },
    { label: "Certifications", value: "11" },
    { label: "Hackathons", value: "3" },
    { label: "Current CGPA", value: "7.26" }
  ]
};

export const skillsData = {
  "Programming Languages": [
    { name: "Java", level: 88, category: "Programming Languages" },
    { name: "Python", level: 85, category: "Programming Languages" },
    { name: "Kotlin", level: 82, category: "Programming Languages" }
  ],
  "Web Technologies": [
    { name: "HTML", level: 92, category: "Web Technologies" },
    { name: "CSS", level: 90, category: "Web Technologies" },
    { name: "JavaScript", level: 88, category: "Web Technologies" },
    { name: "React", level: 86, category: "Web Technologies" },
    { name: "Node.js & Express.js", level: 88, category: "Web Technologies" },
    { name: "Bootstrap 5", level: 85, category: "Web Technologies" }
  ],
  "Databases": [
    { name: "MongoDB", level: 86, category: "Databases" },
    { name: "Firebase", level: 82, category: "Databases" }
  ],
  "Tools & Platforms": [
    { name: "VS Code", level: 95, category: "Tools & Platforms" },
    { name: "Git & GitHub", level: 90, category: "Tools & Platforms" },
    { name: "Eclipse", level: 78, category: "Tools & Platforms" },
    { name: "Android Studio", level: 84, category: "Tools & Platforms" }
  ],
  "Specializations & Other": [
    { name: "OpenCV", level: 80, category: "Other" },
    { name: "RESTful APIs", level: 90, category: "Other" },
    { name: "JWT Authentication", level: 88, category: "Other" }
  ]
};

export const featuredProjects = [
  {
    id: "campus-career",
    title: "Future of Campus Career",
    subtitle: "Student Career & Campus Portal",
    description: "Developed a full-stack web platform that helps students explore jobs/internships, access career guidance, and stay updated on campus events. Built using HTML, CSS, JavaScript, React, Node.js, Express.js, and MongoDB, with a responsive UI and secure backend.",
    tech: ["HTML", "CSS", "JavaScript", "React", "Node.js", "Express.js", "MongoDB"],
    liveUrl: "https://future-of-campus-career.onrender.com",
    githubUrl: "https://github.com/Shivakumar-code-dev/Future-of-Campus-Career",
    featured: true,
    badge: "Live Web App"
  },
  {
    id: "lifelink",
    title: "LifeLink",
    subtitle: "Blood Donation & Emergency Healthcare Platform",
    description: "Developed a full-stack web application connecting blood donors, hospitals, and emergency healthcare services. Built using HTML, CSS, JavaScript, React, Node.js, Express.js, and MongoDB with secure user authentication and database integration.",
    tech: ["HTML", "CSS", "JavaScript", "React", "Node.js", "Express.js", "MongoDB"],
    liveUrl: "https://life-link-1ci2.onrender.com",
    githubUrl: "https://github.com/Shivakumar-code-dev/Life-Link",
    featured: true,
    badge: "Live Web App"
  }
];

export const internshipProjects = [
  {
    id: "codealpha-ecommerce",
    title: "Full Stack E-Commerce Store",
    company: "CodeAlpha Internship",
    period: "CodeAlpha Internship Deliverable",
    description: "Built a production-ready e-commerce platform with product catalog, shopping cart, coupon-based pricing, and multi-step checkout with simulated payment. Implemented JWT/bcrypt authentication, order tracking with invoice generation, and a full admin dashboard with sales analytics. Designed a responsive, animated UI featuring dark/light mode and glassmorphism styling.",
    tech: ["React", "Node.js", "Express", "MongoDB", "JWT", "Bcrypt", "Glassmorphism"],
    githubUrl: "https://github.com/Shivakumar-code-dev/CodeAlpha_Nexora_Ecommerce"
  },
  {
    id: "codealpha-social",
    title: "Full Stack Social Media Platform",
    company: "CodeAlpha Internship",
    period: "CodeAlpha Internship Deliverable",
    description: "Built a full-stack social platform with authentication, real-time chat/notifications, post interactions (like/comment/share), follow system, and an admin moderation dashboard using MVC architecture and a RESTful API.",
    tech: ["Node.js", "Express", "MongoDB", "Socket.io", "JWT", "RESTful API"],
    githubUrl: "https://github.com/Shivakumar-code-dev/CodeAlpha_SocialMediaApp"
  },
  {
    id: "codealpha-project-mgmt",
    title: "Full Stack Project Management Tool",
    company: "CodeAlpha Internship",
    period: "CodeAlpha Internship Deliverable",
    description: "Built a full-stack Trello/Jira/Asana-inspired collaboration platform with JWT authentication, team & project management, drag-and-drop Kanban boards, task comments/attachments/subtasks, calendar scheduling, notification system, and an admin dashboard using MVC architecture and a RESTful API.",
    tech: ["Node.js", "Express", "MongoDB", "JWT", "Bootstrap 5", "MVC"],
    githubUrl: "https://github.com/Shivakumar-code-dev/CodeAlpha_ProjectManagementTool"
  }
];

export const certificationsData = [
  {
    id: "cert-deloitte-sim",
    title: "Technology Job Simulation",
    organization: "Deloitte",
    year: "2026",
    category: "Job Simulation",
    description: "Technology job simulation covering software consultation, solution architecture, and enterprise software principles."
  },
  {
    id: "cert-ms-azure-basics",
    title: "Introduction to the Basics of Azure Services",
    organization: "Microsoft",
    year: "2026",
    category: "Cloud Services",
    description: "Core Azure cloud concepts, cloud architecture, networking, security, and cloud deployment principles."
  },
  {
    id: "cert-google-genai",
    title: "Introduction to Generative AI",
    organization: "Google Cloud",
    year: "2026",
    category: "Artificial Intelligence",
    description: "Foundations of Generative AI, Large Language Models (LLMs), attention mechanisms, and prompt engineering."
  },
  {
    id: "cert-simplilearn-ml",
    title: "Machine Learning Using Python",
    organization: "Simplilearn Skillup",
    year: "2026",
    category: "Data Science & AI",
    description: "Supervised and unsupervised learning, regression, classification, Scikit-learn pipelines, and model evaluation."
  },
  {
    id: "cert-iit-bootstrap",
    title: "Bootstrap Training",
    organization: "EduPyramids, SINE, IIT Bombay",
    year: "2026",
    category: "Web Development",
    description: "Responsive web design, grid system, utility classes, dynamic component styling, and UI frameworks."
  },
  {
    id: "cert-ms-azure-fund",
    title: "Azure Fundamentals",
    organization: "Microsoft",
    year: "2025",
    category: "Cloud Services",
    description: "Comprehensive understanding of cloud governance, pricing, security, compliance, and core Azure services."
  },
  {
    id: "cert-iit-kotlin",
    title: "Android App using Kotlin Training",
    organization: "EduPyramids, SINE, IIT Bombay",
    year: "2025",
    category: "Mobile Development",
    description: "Mobile app engineering, Kotlin syntax, Activity lifecycle, UI layouts, intent handling, and API integration."
  },
  {
    id: "cert-iit-linux",
    title: "Linux Training",
    organization: "EduPyramids, SINE, IIT Bombay",
    year: "2025",
    category: "Operating Systems",
    description: "Linux shell command line tools, bash scripting, process management, file permissions, and system administration."
  },
  {
    id: "cert-glowlogics-ambassador",
    title: "Campus Ambassador",
    organization: "GlowLogics Solutions",
    year: "2025",
    category: "Leadership",
    description: "Leadership, event management, technical workshop coordination, and campus community engagement."
  },
  {
    id: "cert-ibm-ai",
    title: "Rapid Development for AI Services",
    organization: "IBM Developer Skills Network",
    year: "2024",
    category: "AI & Cloud",
    description: "Integrating IBM Watson AI APIs, speech-to-text, visual recognition, and rapid cloud prototyping."
  },
  {
    id: "cert-iit-java",
    title: "Java Training",
    organization: "Spoken Tutorial Project, IIT Bombay",
    year: "2024",
    category: "Core Programming",
    description: "Object-oriented programming in Java, multithreading, exception handling, data structures, and OOP design."
  }
];

export const educationData = [
  {
    degree: "B.E. in Computer Science and Engineering",
    institution: "Yenepoya Institute of technology",
    year: "Year of Passing: 2027",
    scoreLabel: "CGPA",
    score: "7.26",
    status: "Currently Pursuing",
    highlight: "Focusing on Software Development, Backend Engineering, Full-Stack Web, and Computer Vision."
  },
  {
    degree: "Pre-University / 12th Standard",
    institution: "Y.B.Annigeri Dharwad",
    year: "Year: 2023",
    scoreLabel: "Percentage",
    score: "76.33%",
    status: "Completed",
    highlight: "Pre-University Education in Dharwad."
  },
  {
    degree: "SSLC / 10th Standard",
    institution: "Swami Vivekanand School Bilagi",
    year: "Year: 2021",
    scoreLabel: "Percentage",
    score: "77.76%",
    status: "Completed",
    highlight: "SSLC / 10th Standard Education in Bilagi."
  }
];

export const achievementsData = [
  {
    title: "Solve-A-Thon 1.0 (2026)",
    role: "National Level 24-Hour Hackathon Participant",
    venue: "Srinivas Institute of Technology",
    year: "2026",
    desc: "National Level 24-Hour Hackathon Participant — Solve-A-Thon 1.0 at Srinivas Institute of Technology.",
    badge: "National Level"
  },
  {
    title: "GCEM Hacks 3.0 (2025)",
    role: "24-Hour Hackathon Participant",
    venue: "Gopalan College of Engineering & Management",
    year: "2025",
    desc: "24-Hour Hackathon Participant — GCEM Hacks 3.0 at Gopalan College of Engineering & Management.",
    badge: "24-Hour Hackathon"
  },
  {
    title: "HackToFuture 3.0 (2025)",
    role: "Hackathon Participant",
    venue: "St. Joseph Engineering College",
    year: "2025",
    desc: "HackToFuture 3.0 Participant at St. Joseph Engineering College.",
    badge: "Hackathon Participant"
  }
];
