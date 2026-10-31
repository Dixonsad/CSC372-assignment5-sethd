export function stripHTML(htmlString) {
  if (!htmlString) return "Not available";
  let plainText = "";
  let insideTag = false;
  
  for (let i = 0; i < htmlString.length; i++) {
    let char = htmlString[i];
    if (char === "<") {
      insideTag = true;
    } else if (char === ">") {
      insideTag = false;
    } else if (insideTag === false) {
      plainText += char;
    }
  }
  return plainText;
}