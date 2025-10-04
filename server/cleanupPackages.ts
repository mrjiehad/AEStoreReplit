import { db } from "./db";
import { packages } from "@shared/schema";
import { eq, sql } from "drizzle-orm";

async function cleanupPackages() {
  console.log("Cleaning up duplicate packages...");
  
  // Get all packages
  const allPackages = await db.select().from(packages);
  console.log(`Found ${allPackages.length} packages in database`);
  
  // Group packages by name and keep only the first one
  const packageGroups: Record<string, any[]> = {};
  for (const pkg of allPackages) {
    if (!packageGroups[pkg.name]) {
      packageGroups[pkg.name] = [];
    }
    packageGroups[pkg.name].push(pkg);
  }
  
  // For each group, delete all except the first one
  for (const [name, pkgGroup] of Object.entries(packageGroups)) {
    if (pkgGroup.length > 1) {
      console.log(`Found ${pkgGroup.length} duplicates for ${name}. Keeping only the first one.`);
      
      // Keep the first package and delete the rest
      const packagesToDelete = pkgGroup.slice(1);
      for (const pkg of packagesToDelete) {
        console.log(`Deleting package ${pkg.name} with ID: ${pkg.id}`);
        await db.delete(packages).where(eq(packages.id, pkg.id));
      }
    }
  }
  
  // Verify the cleanup
  const remainingPackages = await db.select().from(packages);
  console.log(`\nAfter cleanup, found ${remainingPackages.length} packages:`);
  for (const pkg of remainingPackages) {
    console.log(`- ${pkg.name} (ID: ${pkg.id})`);
  }
}

cleanupPackages().catch(console.error);