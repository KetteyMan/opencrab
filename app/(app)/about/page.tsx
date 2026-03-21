import type { Metadata } from "next";
import { AboutScreen } from "@/components/about/about-screen";

export const metadata: Metadata = {
  title: "关于我们 | OpenCrab",
  description: "了解 OpenCrab 的产品定位、原则、迭代历史与后续方向。",
};

export default function AboutPage() {
  return <AboutScreen />;
}
