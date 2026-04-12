// data/portfolio.js
// All dynamic data for the portfolio — pass this object to your HBS render call.

module.exports = {
  /* ── META ─────────────────────────────────────────────────────────── */
  meta: {
    title: "Vyshnav P C · Node.js Developer | Backend Engineer, Kerala",
    description:
      "Vyshnav P C – Backend-focused Node.js developer from Kannur, Kerala with ~2 years building scalable REST APIs, auth systems, and Kubernetes deployments. Open to work.",
    keywords:
      "Vyshnav PC, Node.js developer, backend engineer, Kerala, Kannur, REST API, Kubernetes, DevOps, JavaScript, TypeScript",
    author: "Vyshnav P C",
    canonical: "https://vyshnavpc.dev/",
    ogTitle: "Vyshnav P C · Node.js Developer",
    ogDescription:
      "Backend engineer from Kerala specializing in Node.js, REST APIs & cloud-native deployments. Open to work.",
    siteName: "Vyshnav P C Portfolio",
    themeColor: "#06060e",
    schemaJSON: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Vyshnav P C",
      jobTitle: "Node.js Developer",
      description:
        "Backend-focused software engineer specializing in Node.js, REST APIs, and Kubernetes deployments",
      url: "https://vyshnavpc.dev",
      email: "vyshnavpcnaravoor@gmail.com",
      telephone: "+918086064478",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kannur",
        addressRegion: "Kerala",
        addressCountry: "IN",
      },
      sameAs: [
        "https://github.com/vyshn4v",
        "https://www.linkedin.com/in/vyshnav-pc-5567ba242/",
      ],
      knowsAbout: [
        "Node.js",
        "JavaScript",
        "TypeScript",
        "REST APIs",
        "Kubernetes",
        "Docker",
        "AWS",
        "MongoDB",
        "MySQL",
        "React",
      ],
    }),
  },

  /* ── PERSONAL ─────────────────────────────────────────────────────── */
  personal: {
    name: "Vyshnav P C",
    username: "vyshnav",
    location: "Kannur, Kerala",
    email: "vyshnavpcnaravoor@gmail.com",
    phone: "+91 8086064478",
  },

  /* ── NAV ──────────────────────────────────────────────────────────── */
  nav: {
    brand: { text: "vyshnav", accent: ".P C" },
    links: [
      { href: "#about", label: "About" },
      { href: "#experience", label: "Experience" },
      { href: "#education", label: "Education" },
      { href: "#skills", label: "Skills" },
      { href: "#contact", label: "Contact" },
      { href: "/blogs", label: "Blogs" },
    ],
    status: "Open to work",
  },

  /* ── FOOTER ───────────────────────────────────────────────────────── */
  footer: {
    year: 2026,
  },

  /* ── HERO ─────────────────────────────────────────────────────────── */
  hero: {
    tag: "Node.js / JavaScript Developer",
    subtitle: "Backend Engineer",
    accentText: "Cloud Native Builder",
    description:
      "Backend-focused software engineer from Kannur, Kerala with ~2 years of experience building scalable web applications. Specializing in Node.js, REST APIs, authentication systems, and Kubernetes-based deployments.",
    ctaPrimary: "Hire Me",
    ctaSecondary: "View Profile",
    meta: [
      { value: "~2 Years", label: "Experience" },
      { value: "Kannur, Kerala", label: "Location" },
      { value: "SDE 1", label: "Current Role" },
    ],
    terminalRole: "Node.js Developer",
    terminalExp: "~2 years",
    terminalFocus: ["APIs", "DevOps", "Cloud"],
    terminalStatus: "open_to_work",
  },

  /* ── ABOUT ────────────────────────────────────────────────────────── */
  about: {
    heading: "Hello There!",
    paragraphs: [
      "I'm Vyshnav P C, a backend-focused software engineer from Kannur district, Kerala. I have around 2 years of experience building scalable and reliable web applications using modern JavaScript technologies.",
      "I specialize in Node.js development and have strong experience designing backend architectures, building REST APIs, and implementing secure authentication systems. Over the past two years, I've also worked with Kubernetes and DevOps tools, gaining hands-on exposure to deploying and managing applications in production environments.",
      "I'm passionate about building cloud-native applications, working with distributed systems, and continuously improving system performance and reliability.",
    ],
    contact: [
      { label: "Phone", href: "tel:+918086064478", value: "+91 8086064478" },
      {
        label: "Email",
        href: "mailto:vyshnavpcnaravoor@gmail.com",
        value: "vyshnavpcnaravoor@gmail.com",
      },
      { label: "Address", href: null, value: "Kannur, Kerala" },
    ],
    achievements: [
      {
        icon: "🏆",
        title: "Team Player Award",
        description:
          "Recognized for strong collaboration and consistent contribution to project deliverables at Neutrinos.",
      },
      {
        icon: "⭐",
        title: "Beyond the Call of Duty Award",
        description:
          "Recognized for taking additional responsibilities and resolving critical production issues beyond assigned tasks.",
      },
    ],
  },

  /* ── EXPERIENCE ───────────────────────────────────────────────────── */
  experience: {
    heading: "Work Experience",
    subheading:
      "Building backend systems, REST APIs, and DevOps infrastructure in production environments.",
    jobs: [
      {
        startDatetime: "2024-03",
        startLabel: "Mar 2024",
        endDatetime: "2026-03",
        endLabel: "Mar 2026",
        company: "Neutrinos",
        role: "SDE 1 — Junior Software Engineer",
        bullets: [
          "Worked in a presales engineering environment, contributing to product capabilities and client solution implementations.",
          "Developed and maintained backend services and REST APIs using Node.js for insurance workflow applications.",
          "Contributed to policy lifecycle automation systems supporting underwriting and policy processing workflows.",
          "Implemented secure authentication flows and handled API integrations between frontend and backend services.",
          "Collaborated with cross-functional teams to resolve production issues and ensure system stability.",
          "Participated in application deployment, release management, and environment configuration.",
          "Optimized API performance and debugged complex issues across distributed systems in production.",
        ],
      },
    ],
  },

  /* ── EDUCATION ────────────────────────────────────────────────────── */
  education: {
    heading: "Education",
    entries: [
      {
        degree: "MERN Stack Development",
        name: "Full-Stack Bootcamp",
        institution: "Packapeer Academy",
        startDatetime: "2022-12",
        startLabel: "Dec 2022",
        endDatetime: "2023-11",
        endLabel: "Nov 2023",
        tags: ["React", "Node.js", "MongoDB", "Express.js", "DevOps"],
      },
      {
        degree: "DGD",
        name: "Diploma in Graphic Design",
        institution: "Sree Sankaracharya Institute",
        startDatetime: "2018-12",
        startLabel: "Dec 2018",
        endDatetime: "2020-11",
        endLabel: "Nov 2020",
        tags: ["Photoshop", "Illustrator", "InDesign"],
      },
      {
        degree: "EET",
        name: "Electrical & Electronics Technology",
        institution: "GVHSS Kadirur",
        startDatetime: "2017",
        startLabel: "2017",
        endDatetime: "2018",
        endLabel: "2018",
        tags: ["Circuits", "Electronics", "Troubleshooting"],
      },
    ],
  },

  /* ── SKILLS ───────────────────────────────────────────────────────── */
  skills: {
    heading: "Tech Stack",
    subheading:
      "Technologies I use to build, deploy, and maintain production-grade applications.",
    categories: [
      {
        id: "backend",
        label: "Backend & APIs",
        reverse: true,
        pills: [
          { t: "Node.js", c: "g" },
          { t: "Express.js", c: "g" },
          { t: "NestJS", c: "g" },
          { t: "JWT Auth", c: "g" },
          { t: "TypeScript", c: "g" },
          { t: "REST APIs", c: "g" },
          { t: "Middleware", c: "g" },
          { t: "Webhooks", c: "g" },
          { t: "Socket.io", c: "g" },
        ],
      },
      {
        id: "db",
        label: "Databases",
        reverse: true,
        pills: [
          { t: "MySQL", c: "b" },
          { t: "MongoDB", c: "b" },
          { t: "Redis", c: "b" },
          { t: "Mongoose", c: "b" },
          { t: "Sequelize", c: "b" },
          { t: "PostgreSQL", c: "b" },
        ],
      },
      {
        id: "fe",
        label: "Frontend",
        reverse: false,
        pills: [
          { t: "React", c: "p" },
          { t: "Redux Toolkit", c: "p" },
          { t: "CSS / SCSS", c: "p" },
          { t: "HTML5", c: "p" },
          { t: "Tailwind CSS", c: "p" },
          { t: "Axios", c: "p" },
        ],
      },
      {
        id: "devops",
        label: "DevOps & Cloud",
        reverse: true,
        pills: [
          { t: "Kubernetes", c: "y" },
          { t: "Docker", c: "y" },
          { t: "AWS", c: "y" },
          { t: "Jenkins", c: "y" },
          { t: "Terraform", c: "y" },
          { t: "Ansible", c: "y" },
          { t: "Nginx", c: "y" },
          { t: "Git", c: "y" },
          { t: "GitHub", c: "y" },
          { t: "CI/CD", c: "y" },
          { t: "Linux", c: "y" },
        ],
      },
    ],
  },

  /* ── CONTACT ──────────────────────────────────────────────────────── */
  contact: {
    heading: "Hire Me!",
    paragraphs: [
      "I'm a Node.js developer who can handle everything from building solid backend APIs to clean UIs and full deployments. Got a project? Let's ship it together!",
      "Feel free to reach out — I'd love to connect and discuss how I can contribute to your team or project.",
    ],
    ctaLabel: "Send a Message",
    links: [
      {
        href: "https://github.com/vyshn4v",
        external: true,
        ariaLabel: "GitHub – @vyshn4v",
        iconKey: "gh",
        name: "GitHub",
        handle: "@vyshn4v",
        iconSVG: `<svg width="16" height="16" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>`,
      },
      {
        href: "https://www.linkedin.com/in/vyshnav-pc-5567ba242/",
        external: true,
        ariaLabel: "LinkedIn profile",
        iconKey: "li",
        name: "LinkedIn",
        handle: "vyshnav-pc-5567ba242",
        iconSVG: `<svg width="16" height="16" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
      },
      {
        href: "https://wa.me/918086064478",
        external: true,
        ariaLabel: "WhatsApp – +91 8086064478",
        iconKey: "wa",
        name: "WhatsApp",
        handle: "+91 8086064478",
        iconSVG: `<svg width="16" height="16" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>`,
      },
      {
        href: "mailto:vyshnavpcnaravoor@gmail.com",
        external: false,
        ariaLabel: "Email – vyshnavpcnaravoor@gmail.com",
        iconKey: "em",
        name: "Email",
        handle: "vyshnavpcnaravoor@gmail.com",
        iconSVG: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
      },
      {
        href: "https://namastedev.com",
        external: true,
        ariaLabel: "NamasteDev",
        iconKey: "nd",
        name: "NamasteDev",
        handle: "namastedev.com",
        iconSVG: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
      },
      {
        href: "https://leetcode.com",
        external: true,
        ariaLabel: "LeetCode",
        iconKey: "lc",
        name: "LeetCode",
        handle: "leetcode.com",
        iconSVG: `<svg width="16" height="16" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/></svg>`,
      },
    ],
    terminalHire: [
      "Ready for new challenges",
      "~2 yrs production experience",
      "Node.js + DevOps + Cloud",
      "Full-time / contract available",
    ],
    terminalAwaiting: "Awaiting your message...",
    terminalJSON: [
      { key: "name", color: "g", value: "Vyshnav P C" },
      { key: "phone", color: "g", value: "+91 8086064478" },
      { key: "email", color: "g", value: "vyshnavpcnaravoor@gmail.com" },
      { key: "location", color: "g", value: "Kannur, Kerala, India" },
      { key: "github", color: "b", value: "github.com/vyshn4v" },
      {
        key: "linkedin",
        color: "b",
        value: "linkedin.com/in/vyshnav-pc-5567ba242",
      },
      { key: "whatsapp", color: "b", value: "wa.me/918086064478" },
      { key: "leetcode", color: "b", value: "leetcode.com/vyshnav" },
      { key: "namastedev", color: "b", value: "namastedev.com" },
      { key: "status", color: "g", value: "open_to_work" },
    ],
  },

  /* ── MODAL ────────────────────────────────────────────────────────── */
  modal: {
    heading: "Let's work together",
    subheading: "Fill in the details and I'll get back to you within 24 hours.",
    placeholderFirst: "John",
    placeholderLast: "Doe",
    placeholderEmail: "you@company.com",
    placeholderSubject: "Job opportunity / Project / Collaboration",
    placeholderMessage: "Tell me about your project or opportunity...",
    successTitle: "Message sent!",
    successMessage:
      "Thanks for reaching out. Vyshnav will reply within 24 hours.",
  },
};
