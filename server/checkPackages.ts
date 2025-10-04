import { db } from "./db";
import { packages } from "@shared/schema";

async function checkPackages() {
  console.log("Checking packages in database...");
  
  const allPackages = await db.select().from(packages);
  console.log(`Found ${allPackages.length} packages in database:`);
  
  for (const pkg of allPackages) {
    console.log(`- ${pkg.name} (ID: ${pkg.id})`);
  }
  
  // Group packages by name to see duplicates
  const packageCounts: Record<string, number> = {};
  for (const pkg of allPackages) {
    packageCounts[pkg.name] = (packageCounts[pkg.name] || 0) + 1;
  }
  
  console.log("\nPackage counts by name:");
  for (const [name, count] of Object.entries(packageCounts)) {
    console.log(`- ${name}: ${count}`);
  }
}

checkPackages().catch(console.error);