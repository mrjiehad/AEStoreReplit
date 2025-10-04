import { db } from "./db";
import { packages, playerRankings, users } from "@shared/schema";
import { sql, eq } from "drizzle-orm";

async function seed() {
  console.log("Seeding database...");

  // Create AECOIN packages
  const packageData = [
    {
      name: "AECOIN 500",
      description: "Perfect starter package for new players in Los Santos",
      price: "60",
      aecoinAmount: 500,
      codesPerPackage: 1,
      featured: false,
      imageUrl: null,
    },
    {
      name: "AECOIN 1000",
      description: "Level up your game with this popular package",
      price: "98",
      aecoinAmount: 1000,
      codesPerPackage: 1,
      featured: true,
      imageUrl: null,
    },
    {
      name: "AECOIN 3000",
      description: "Become a major player with this premium package",
      price: "295",
      aecoinAmount: 3000,
      codesPerPackage: 1,
      featured: true,
      imageUrl: null,
    },
    {
      name: "AECOIN 5000",
      description: "Build your empire with this powerful package",
      price: "490",
      aecoinAmount: 5000,
      codesPerPackage: 1,
      featured: false,
      imageUrl: null,
    },
    {
      name: "AECOIN 10000",
      description: "The ultimate package for serious players",
      price: "980",
      aecoinAmount: 10000,
      codesPerPackage: 1,
      featured: true,
      imageUrl: null,
    },
  ];

  // Check for each specific package by name and only insert if it doesn't exist
  for (const pkg of packageData) {
    const existingPackage = await db.select().from(packages).where(eq(packages.name, pkg.name)).limit(1);
    if (existingPackage.length === 0) {
      await db.insert(packages).values(pkg);
      console.log(`Created package: ${pkg.name}`);
    } else {
      console.log(`Package ${pkg.name} already exists, skipping`);
    }
  }

  // Create sample users for rankings (check if they exist first)
  const sampleUsers = [
    { username: "Alex_Mercer", email: "alex@example.com", discordId: "123456789", avatar: null },
    { username: "Sam_Cole", email: "sam@example.com", discordId: "234567890", avatar: null },
    { username: "Dana_Ward", email: "dana@example.com", discordId: "345678901", avatar: null },
    { username: "Evan_Harris", email: "evan@example.com", discordId: "456789012", avatar: null },
    { username: "Jordan_Lee", email: "jordan@example.com", discordId: "567890123", avatar: null },
    { username: "Morgan_Price", email: "morgan@example.com", discordId: "678901234", avatar: null },
    { username: "Casey_Smith", email: "casey@example.com", discordId: "789012345", avatar: null },
    { username: "Riley_Jones", email: "riley@example.com", discordId: "890123456", avatar: null },
    { username: "Quinn_Baker", email: "quinn@example.com", discordId: "901234567", avatar: null },
    { username: "Taylor_Miller", email: "taylor@example.com", discordId: "012345678", avatar: null },
  ];

  // Check for each specific user by username and only insert if it doesn't exist
  const createdUsers = [];
  for (const user of sampleUsers) {
    const existingUser = await db.select().from(users).where(eq(users.username, user.username)).limit(1);
    if (existingUser.length === 0) {
      const [createdUser] = await db.insert(users).values(user).returning();
      createdUsers.push(createdUser);
      console.log(`Created user: ${user.username}`);
    } else {
      console.log(`User ${user.username} already exists, using existing user`);
      createdUsers.push(existingUser[0]);
    }
  }

  // Check for player rankings and only insert if they don't exist
  const existingRankings = await db.select().from(playerRankings);
  if (existingRankings.length === 0) {
    // Create sample player rankings
    const sampleRankings = [
      { userId: createdUsers[0].id, playerName: "Alex_Mercer", stars: 950, rank: 1 },
      { userId: createdUsers[1].id, playerName: "Sam_Cole", stars: 875, rank: 2 },
      { userId: createdUsers[2].id, playerName: "Dana_Ward", stars: 820, rank: 3 },
      { userId: createdUsers[3].id, playerName: "Evan_Harris", stars: 750, rank: 4 },
      { userId: createdUsers[4].id, playerName: "Jordan_Lee", stars: 680, rank: 5 },
      { userId: createdUsers[5].id, playerName: "Morgan_Price", stars: 620, rank: 6 },
      { userId: createdUsers[6].id, playerName: "Casey_Smith", stars: 550, rank: 7 },
      { userId: createdUsers[7].id, playerName: "Riley_Jones", stars: 480, rank: 8 },
      { userId: createdUsers[8].id, playerName: "Quinn_Baker", stars: 420, rank: 9 },
      { userId: createdUsers[9].id, playerName: "Taylor_Miller", stars: 350, rank: 10 },
    ];

    for (const ranking of sampleRankings) {
      await db.insert(playerRankings).values(ranking);
      console.log(`Created ranking for: ${ranking.playerName} with ${ranking.stars} stars`);
    }
  } else {
    console.log("Player rankings already exist, skipping ranking creation");
  }

  console.log("Seeding complete!");
}

seed().catch(console.error);