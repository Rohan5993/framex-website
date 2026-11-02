import html from "../sections/LinkedInEvidence.txt?raw";

export default function LinkedInEvidence() {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
