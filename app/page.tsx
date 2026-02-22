import { Metadata } from "next";
import { LandingContent } from "./components/landing/LandingContent";

export const metadata: Metadata = {
  title:
    "PT. Graha Paramita Konsultan - Property Appraisal & Business Consulting",
  description:
    "Leading the way in business excellence through reliable property appraisal, feasibility studies, and consulting services. Driven by accuracy, Guided by integrity.",
};

export default function Home() {
  return (
    <div className="font-inter">
      <LandingContent />
    </div>
  );
}
