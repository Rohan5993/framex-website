import html from "../sections/Marquee.txt?raw";

export default function Marquee() {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
