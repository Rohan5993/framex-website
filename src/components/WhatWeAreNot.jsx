import html from "../sections/WhatWeAreNot.txt?raw";

export default function WhatWeAreNot() {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
