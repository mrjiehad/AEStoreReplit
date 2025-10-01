import { HeroSection } from "../HeroSection";

export default function HeroSectionExample() {
  return (
    <HeroSection
      onShopClick={() => console.log("Shop now clicked")}
      onGalleryClick={() => console.log("View gallery clicked")}
    />
  );
}
