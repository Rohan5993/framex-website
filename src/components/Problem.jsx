import html from "../sections/Problem.txt?raw";

export default function Problem() {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
