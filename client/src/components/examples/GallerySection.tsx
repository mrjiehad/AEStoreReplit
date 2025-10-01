import { GallerySection } from "../GallerySection";
import controllerImage from "@assets/generated_images/Neon_gaming_controller_c2d9ebdc.png";
import pcImage from "@assets/generated_images/Gaming_PC_setup_f3d4ef1a.png";
import arcadeImage from "@assets/generated_images/Neon_arcade_machine_755a81ea.png";
import carImage from "@assets/generated_images/GTA_style_sports_car_7f8331d4.png";
import coinImage from "@assets/generated_images/Golden_coins_package_visual_49569ac5.png";
import chestImage from "@assets/generated_images/Treasure_chest_with_coins_e01577f1.png";

export default function GallerySectionExample() {
  const images = [controllerImage, pcImage, arcadeImage, carImage, coinImage, chestImage, controllerImage, pcImage];

  return <GallerySection images={images} onCtaClick={() => console.log("Get AECOIN clicked")} />;
}
