import type { Metadata } from "next";
import FarmDefense from "@/components/games/FarmDefense";

export const metadata: Metadata = {
  title: "Farm Defense - Protect the Coop!",
  description:
    "A tower defense mini-game: place guardian dogs, barn cats, geese, and roosters to protect the chicken coop from waves of foxes!",
};

export default function FarmDefensePage() {
  return <FarmDefense />;
}
