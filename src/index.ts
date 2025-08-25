import './styles/index.css';

import { initBarba } from '$features/global/barba/barba';
import { barbaConfig } from '$features/global/barba/config';
import { lenisConfig } from '$features/global/lenis/config';
import { initLenis } from '$features/global/lenis/lenis';
import { greetUser } from '$utils/greet';

window.Webflow ||= [];
window.Webflow.push(() => {
  greetUser('John Doe');
  initLenis(lenisConfig);
  initBarba(barbaConfig);
});
