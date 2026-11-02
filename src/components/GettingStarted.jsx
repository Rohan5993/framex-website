import html from "../sections/GettingStarted.txt?raw";

export default function GettingStarted() {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
