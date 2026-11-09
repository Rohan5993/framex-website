import html from "../sections/Oneline.txt?raw";

export default function Oneline() {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
