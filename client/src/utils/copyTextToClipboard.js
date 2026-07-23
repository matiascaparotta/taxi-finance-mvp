export async function copyTextToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.select();

  const wasCopied = document.execCommand("copy");
  document.body.removeChild(textArea);

  if (!wasCopied) {
    throw new Error("No se pudo copiar el texto");
  }
}
