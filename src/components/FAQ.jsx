import html from "../sections/FaqIntro.txt?raw";
import { faqItems } from "../data/faq";

export default function FAQ() {
  return (
    <section id="faq" className="fx-sec" style={{ paddingTop: "clamp(48px, 6vw, 88px)" }}>
      <div className="fx-wrap fx-split fx-faq-wrap">
        <div dangerouslySetInnerHTML={{ __html: html }} />
        <div className="fx-faq fx-faq-r" style={{ minWidth: 0 }}>
          {faqItems.map((item, i) => (
            <details key={i} style={{ borderBottom: "1px solid #D9D3C7" }}>
              <summary>{item.q}</summary>
              <p
                className="fx-faq-a"
                style={{ margin: "0 0 24px", maxWidth: "64ch", fontSize: 17, lineHeight: 1.65, color: "#3F3C36" }}
              >
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
