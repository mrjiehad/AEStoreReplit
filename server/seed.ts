import { db } from "./db";
import { packages } from "@shared/schema";

async function seed() {
  console.log("Seeding database...");

  // Create AECOIN packages
  const packageData = [
    {
      name: "Criminal Starter",
      description: "Perfect for newcomers to Los Santos. Get your first taste of power.",
      price: "9.99",
      aecoinAmount: 100000,
      codesPerPackage: 1,
      featured: false,
      imageUrl: null,
    },
    {
      name: "Street Boss",
      description: "Level up your game with mid-tier wealth. Buy that first supercar.",
      price: "24.99",
      aecoinAmount: 500000,
      codesPerPackage: 1,
      featured: true,
      imageUrl: null,
    },
    {
      name: "Kingpin Package",
      description: "Become a major player. Own properties, businesses, and luxury vehicles.",
      price: "49.99",
      aecoinAmount: 1500000,
      codesPerPackage: 1,
      featured: true,
      imageUrl: null,
    },
    {
      name: "Empire Builder",
      description: "Build your criminal empire from the ground up. Maximum firepower included.",
      price: "99.99",
      aecoinAmount: 5000000,
      codesPerPackage: 1,
      featured: false,
      imageUrl: null,
    },
    {
      name: "Luxury Elite",
      description: "The ultimate package. Live like royalty in Los Santos with unlimited resources.",
      price: "199.99",
      aecoinAmount: 15000000,
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
