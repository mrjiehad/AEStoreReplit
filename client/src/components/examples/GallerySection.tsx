import { GallerySection } from "../GallerySection";
import car1Image from "@assets/stock_images/gta_5_sports_car_mus_ecdea8c8.jpg";
import car2Image from "@assets/stock_images/gta_5_sports_car_mus_07d7cbe9.jpg";
import bike1Image from "@assets/stock_images/gta_5_motorcycle_bik_bfe4c529.jpg";
import char1Image from "@assets/stock_images/gta_5_character_gang_408947e4.jpg";
import cityImage from "@assets/stock_images/gta_5_los_santos_cit_cb9a6b5e.jpg";

export default function GallerySectionExample() {
  const images = [car1Image, bike1Image, char1Image, cityImage, car2Image, bike1Image, char1Image, car1Image];

  return <GallerySection images={images} onCtaClick={() => console.log("Get AECOIN clicked")} />;
}
