import { PackagesSection } from "../PackagesSection";
import coinImage from "@assets/stock_images/gold_coins_money_cas_b3778293.jpg";

export default function PackagesSectionExample() {
  const packages = [
    { id: "1", amount: 500, price: 60, originalPrice: 65, image: coinImage },
    { id: "2", amount: 1000, price: 98, originalPrice: 110, image: coinImage, badge: "POPULAR" },
    { id: "3", amount: 3000, price: 295, originalPrice: 310, image: coinImage },
    { id: "4", amount: 5000, price: 490, originalPrice: 510, image: coinImage, badge: "BEST VALUE" },
    { id: "5", amount: 10000, price: 980, originalPrice: 1000, image: coinImage },
  ];

  return <PackagesSection packages={packages} onAddToCart={(pkg) => console.log("Added:", pkg)} />;
}
