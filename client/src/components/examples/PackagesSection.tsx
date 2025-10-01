import { PackagesSection } from "../PackagesSection";
import coinImage from "@assets/generated_images/Golden_coins_package_visual_49569ac5.png";
import chestImage from "@assets/generated_images/Treasure_chest_with_coins_e01577f1.png";
import vipImage from "@assets/generated_images/Premium_VIP_card_df8b7c42.png";

export default function PackagesSectionExample() {
  const packages = [
    { id: "1", amount: 500, price: 60, originalPrice: 65, image: coinImage },
    { id: "2", amount: 1000, price: 98, originalPrice: 110, image: coinImage, badge: "POPULAR" },
    { id: "3", amount: 3000, price: 295, originalPrice: 310, image: chestImage },
    { id: "4", amount: 5000, price: 490, originalPrice: 510, image: chestImage, badge: "BEST VALUE" },
    { id: "5", amount: 10000, price: 980, originalPrice: 1000, image: vipImage },
  ];

  return <PackagesSection packages={packages} onAddToCart={(pkg) => console.log("Added:", pkg)} />;
}
