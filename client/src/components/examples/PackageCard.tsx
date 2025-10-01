import { PackageCard } from "../PackageCard";
import coinImage from "@assets/stock_images/gold_coins_money_cas_b3778293.jpg";

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
