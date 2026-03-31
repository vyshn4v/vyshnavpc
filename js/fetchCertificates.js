const certGrid = document.getElementById("cert-grid");
const certificatesData = [
  {
    title: "Learn DevOps: Docker, Kubernetes, Terraform and Azure DevOps",
    platform: "Udemy",
    certificateLink:
      "https://www.udemy.com/certificate/UC-933697a4-c053-41f7-8f42-93b9907ce4e3/",
  },
  {
    title: "Namaste Javascript",
    platform: "Namaste Dev",
    certificateLink:
      "https://namastedev.com/vyshnavpcnaravoor/certificates/namaste-javascript",
  },
  {
    title: "Claude Code in Action",
    platform: "Anthropic",
    certificateLink: "https://verify.skilljar.com/c/9a6yubtowdsk",
  },
];

const certificateCards = certificatesData.reduce((acc, cert) => {
  return (
    acc +
    `<div class="cert-card">
						<div class="cert-icon">
							<svg viewBox="0 0 24 24">
								<circle cx="12" cy="8" r="6" />
								<path
									d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32" />
							</svg>
						</div>
						<div class="cert-info">
							<h3>${cert.title}</h3>
							<p>${cert.platform}</p>
							<a href="${cert.certificateLink}" target="_blank" class="cert-link">Certificate</a>
						</div>
					</div>`
  );
}, "");

certGrid.innerHTML = certificateCards;
