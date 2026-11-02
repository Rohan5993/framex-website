import html from "../sections/Benefits.txt?raw";

export default function Benefits() {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
