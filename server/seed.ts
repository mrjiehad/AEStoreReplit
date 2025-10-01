import { db } from "./db";
import { packages } from "@shared/schema";

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

  for (const pkg of packageData) {
    await db.insert(packages).values(pkg);
    console.log(`Created package: ${pkg.name}`);
  }

  console.log("Seeding complete!");
}

seed().catch(console.error);
