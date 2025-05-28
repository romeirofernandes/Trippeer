
import React from "react";
import SectionTitle from "./SectionTitle";
import { BentoFeatures } from "../../components/BentoFeatures";

const Features = () => {
  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#080808] to-[#080808] z-0" />

      <div className="container mx-auto px-6 relative z-10 max-w-5xl">
        <SectionTitle>Powerful Features</SectionTitle>

        <div className="mt-12">
          <BentoFeatures />
        </div>
      </div>
    </section>
  );
};

export default Features;
