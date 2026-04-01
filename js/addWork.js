const worksData = [
  {
    title: "Daily Dev Doubts",
    description: `DailyDevDoubts is a question and answer platform, it’s like a community where everyone helps
each other, user can add their question and other users can answer for the question. This platform
aims to provide a supportive environment for knowledge sharing.`,
    techStack: ["React", "Node.js", "MongoDB", "express"],
    githubLink: [
      {
        name: "Frontend",
        url: "https://github.com/vyshn4v/dailydevdoubtsfrontend",
      },
      {
        name: "Backend",
        url: "https://github.com/vyshn4v/dailydevdoubts",
      },
    ],
    liveLink: "#",
  },
  {
    title: "Food Zone",
    description: `FoodZone is a dine booking platform designed to simplify the process of reserving table and food
in restaurants. Users can easily book tables and preorder their favorite foods, this platform aim to
provide better dining experience to the users.`,
    techStack: ["Hbs", "Node.js", "MongoDB", "express.js"],
    githubLink: [
      {
        name: "Backend",
        url: "https://github.com/vyshnavpc/fooodZone",
      },
    ],
    liveLink: "#",
  },
  {
    title: "fitpeo dashboard",
    description: `A simple admin dashboard with Chart.js graph and tables. Customize Chart.js for creating
complex UI and dynamic data visualization.`,
    techStack: ["React", "Chart.js", "CSS"],
    githubLink: [
      {
        name: "frontend",
        url: "https://github.com/vyshn4v/fitpeo-dashboard",
      },
    ],
    liveLink: "#",
  },
  {
    title: "password generator",
    description: `Password Generator app with OTP validation. Implemented login with Phone Number
feature for better accessibility with Twilio.`,
    techStack: ["React", "Chart.js", "CSS"],
    githubLink: [
      {
        name: "frontend",
        url: "https://github.com/vyshn4v/passwordGenerator",
      },
      {
        name: "backend",
        url: "https://github.com/vyshn4v/password_generator_backend",
      },
    ],
    liveLink: "#",
  },
  {
    title: "Netflix clone",
    description: `Movie list app using TMDB API. Implemented Netflix UI using sass CSS compiler.`,
    techStack: ["React", "Chart.js", "CSS"],
    githubLink: [
      {
        name: "frontend",
        url: "https://github.com/vyshn4v/Netflix-clone",
      },
    ],
    liveLink: "#",
  },
  {
    title: "Covid status app",
    description: `Covid status list app using Central Government’s API, list all state covid data and visualize
it based on death and active case.`,
    techStack: ["React", "Chart.js", "CSS"],
    githubLink: [
      {
        name: "frontend",
        url: "https://github.com/vyshn4v/covid-status/",
      },
    ],
    liveLink: "#",
  },
];
const iconCode = `<div class="work-icon">
							<svg viewBox="0 0 24 24">
								<rect x="3" y="3" width="18" height="18" rx="2" />
								<path d="M3 9h18" />
								<path d="M9 21V9" />
							</svg>
						</div>`;
// 353.58
const workGrid = document.getElementById("work-grid");

const template = worksData.reduce((acc, work) => {
  return (
    acc +
    `<div class="work-card">
						${iconCode}
						<h3>${work.title}</h3>
						<p>${work.description}</p>
						<div class="tech-stack">
                        ${work.techStack
                          .map(
                            (tech) => `<span class="tech-tag">${tech}</span>`,
                          )
                          .join("")}
      
						</div>
						<div class="work-links">
    ${work.githubLink
      .map((link) => {
        return `<a href="${link.url}" class="work-link link-git" target="_blank">
								<svg viewBox="0 0 24 24">
									<path
										d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                                </svg>
                                ${link.name}
                            </a>`;
      })
      .join("")}
      ${
        work?.liveLink != "#"
          ? `<a href="${work.liveLink}" class="work-link link-live">
            <svg viewBox="0 0 24 24">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Live
          </a>`
          : ""
      }
						</div>
					</div>`
  );
}, "");

workGrid.innerHTML = template;
