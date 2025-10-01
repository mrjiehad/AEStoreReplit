import { ModernHero } from "../ModernHero";

export default function ModernHeroExample() {
  return (
    <ModernHero
      onShopClick={() => console.log("Shop clicked")}
      onGalleryClick={() => console.log("Gallery clicked")}
    />
  );
}
