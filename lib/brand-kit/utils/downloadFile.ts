export function downloadFile(
  contents: string,
  filename: string,
  mimeType: string = "text/plain;charset=utf-8"
): void {
  if (typeof window === "undefined") return;

  const blob = new Blob([contents], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
