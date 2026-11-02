import html from "../sections/Contact.txt?raw";

export default function Contact() {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
