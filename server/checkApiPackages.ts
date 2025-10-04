async function checkApiPackages() {
  try {
    const response = await fetch('http://localhost:5000/api/packages');
    const packages = await response.json();
    console.log(`Found ${packages.length} packages via API:`);
    for (const pkg of packages) {
      console.log(`- ${pkg.name} (ID: ${pkg.id})`);
    }
    
    // Count packages by name
    const packageCounts: Record<string, number> = {};
    for (const pkg of packages) {
      packageCounts[pkg.name] = (packageCounts[pkg.name] || 0) + 1;
    }
    
    console.log("\nPackage counts by name:");
    for (const [name, count] of Object.entries(packageCounts)) {
      console.log(`- ${name}: ${count}`);
    }
  } catch (error) {
    console.error('Error checking packages:', error);
  }
}

checkApiPackages();