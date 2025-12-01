export function setButtonText(btn, isLoading, defaultText, loadingText) {
  if (!btn) return;
  btn.textContent = isLoading ? loadingText : defaultText;

}