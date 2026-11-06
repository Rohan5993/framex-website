import html from "../sections/OneLine.txt?raw";

export default function OneLine() {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
