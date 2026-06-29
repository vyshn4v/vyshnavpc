require('dotenv').config({path: './src/.env'});
const mongoose = require('mongoose');
const { getLandingPageModel } = require('./src/schema/landingPage');
mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const model = getLandingPageModel();
  const page = await model.findOne();
  if (page && page.data) {
    if (page.data.hero) {
      page.data.hero.role_label = 'FREELANCE FULLSTACK DEVELOPER';
      page.data.hero.tagline = 'React JS & Node.js Expert';
      page.data.hero.sub = 'Engineer first, problem solver second, builder for life. I craft high-performance web applications as a freelance developer, specializing in MongoDB, Express, React, Node.js, and scalable cloud architectures.';
    }
    if (page.data.about && page.data.about.bio_paragraphs) {
      page.data.about.bio_paragraphs[0] = "I'm Vyshnav P C — a builder at heart and a passionate freelance fullstack developer. I don't just write code; I craft digital experiences. Specializing in the MERN stack (MongoDB, Express, React, Node.js), I help forward-thinking businesses build scalable, lightning-fast web applications.";
      page.data.about.bio_paragraphs[1] = "My philosophy is simple: clean architecture, exceptional user experience, and relentless innovation. With deep expertise in both frontend React JS development and robust Node.js backend architectures, I take ownership of projects from concept to deployment, delivering complete, end-to-end solutions as a dedicated freelancer.";
    }
    page.markModified('data');
    await page.save();
    console.log('DB updated');
  } else {
    console.log('No DB document found');
  }
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
