import { aboutData } from "../data/about.data";
import Section from "./Section";
import { Slide } from "./Motion";

export default function About() {
  return (
    <Section id="about" title="About Me">
      <Slide inView animation="slide-up-long-summary" className="block">
        <p className="t4">{aboutData.longSummary}</p>
      </Slide>
    </Section>
  );
}
