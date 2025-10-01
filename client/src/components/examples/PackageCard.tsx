import { PackageCard } from "../PackageCard";
import coinImage from "@assets/generated_images/Golden_coins_package_visual_49569ac5.png";

export default function PackageCardExample() {
  const samplePackage = {
    id: "1",
    amount: 1000,
    price: 98,
    originalPrice: 110,
    image: coinImage,
    badge: "POPULAR",
  };

  return (
    <div className="max-w-sm">
      <PackageCard package={samplePackage} onAddToCart={(pkg) => console.log("Added to cart:", pkg)} />
    </div>
  );
}
