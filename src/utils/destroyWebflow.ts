/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Destroys and re-initializes Webflow components.
 * @param data - The data object containing the HTML content of the next page
 */
export function resetWebflow(data: any): void {
  // Parse HTML and extract data-wf-page attribute
  const parser = new DOMParser();
  const doc = parser.parseFromString(data.next.html, 'text/html');
  const htmlElement = doc.querySelector('html');
  const wfPageAttr = htmlElement?.getAttribute('data-wf-page');

  // Set data-wf-page on current document
  if (wfPageAttr) {
    document.documentElement.setAttribute('data-wf-page', wfPageAttr);
  }

  // Handle Webflow destroy and ready
  if (window.Webflow && typeof (window.Webflow as any).destroy === 'function') {
    (window.Webflow as any).destroy();
  }
  if (window.Webflow && typeof (window.Webflow as any).ready === 'function') {
    (window.Webflow as any).ready();
  }

  // Initialize commerce if available
  if (window.Webflow && typeof (window.Webflow as any).require === 'function') {
    try {
      (window.Webflow as any).require('commerce').init({ siteId: '66ab792d0f543339239f7b1d' });
    } catch (e) {
      // Commerce module not available
    }
  }

  // Initialize ix2 if available
  if (window.Webflow && typeof (window.Webflow as any).require === 'function') {
    try {
      (window.Webflow as any).require('ix2').init();
    } catch (e) {
      // ix2 module not available
    }
  }

  // Reset w--current class
  const currentElements = document.querySelectorAll('.w--current');
  currentElements.forEach((el) => el.classList.remove('w--current'));

  // Add w--current class to matching links
  const links = document.querySelectorAll('a');
  links.forEach((link) => {
    if (link.getAttribute('href') === window.location.pathname) {
      link.classList.add('w--current');
    }
  });
}
