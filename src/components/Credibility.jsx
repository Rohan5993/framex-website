import html from "../sections/Credibility.txt?raw";

export default function Credibility() {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
