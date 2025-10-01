import { HeroSlider } from "../HeroSlider";

export default function HeroSliderExample() {
  return (
    <HeroSlider
      onShopClick={() => console.log("Shop clicked")}
      onGalleryClick={() => console.log("Gallery clicked")}
    />
  );
}
