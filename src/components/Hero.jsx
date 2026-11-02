import html from "../sections/Hero.txt?raw";

export default function Hero() {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
