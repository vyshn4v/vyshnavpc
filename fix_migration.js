import mongoose from "mongoose";

async function run() {
  const devDb = await mongoose.createConnection(
    "mongodb+srv://vyshnavpcnaravoor_db_user:ae5tdGWalARjCKzJ@cluster0.fxarhun.mongodb.net/", 
    { dbName: "portfolio" }
  ).asPromise();

  const prodDb = await mongoose.createConnection(
    "mongodb+srv://vyshnavpcnaravoor_db_user:ae5tdGWalARjCKzJ@cluster0.fxarhun.mongodb.net/", 
    { dbName: "portfolio_local" }
  ).asPromise();

  const schema = new mongoose.Schema({ data: mongoose.Schema.Types.Mixed }, { strict: false });
  const DevLanding = devDb.model("landingpages", schema);
  const ProdLanding = prodDb.model("landingpages", schema);

  const allDevDocs = await DevLanding.find().lean();
  console.log(`Found ${allDevDocs.length} documents in dev DB.`);

  let correctDevDoc = null;
  for (const doc of allDevDocs) {
    if (doc.data && doc.data.mini_projects) {
      correctDevDoc = doc;
      break;
    }
  }

  if (!correctDevDoc) {
    console.log("Could not find any document with mini_projects in Dev DB!");
    // Check if it got deleted or overwritten
  } else {
    console.log("Found correct dev document with ID:", correctDevDoc._id);
    
    // Now push to prod
    const prodExisting = await ProdLanding.findOne().lean();
    if (prodExisting) {
      await ProdLanding.updateOne({ _id: prodExisting._id }, { $set: { data: correctDevDoc.data } });
      console.log("Updated prod document with correct data!");
    }
  }

  await devDb.close();
  await prodDb.close();
  
  // Also clear redis cache programmatically
  const { initializeRedis, getRedisClient } = await import('./src/config/initializeRedis.js');
  initializeRedis();
  setTimeout(async () => {
    try {
      await getRedisClient().del('Portfolio:landingPage');
      console.log('Redis cache cleared!');
    } catch (e) {
      console.error(e);
    }
    process.exit(0);
  }, 1000);
}

run().catch(console.error);
