Attribute Animator (global)

- Add `data-animate="true"` to elements you want to animate.
- Choose kinds via `data-animation-type` (comma-separated):
  - text-words, fade-in (more coming: text-lines, text-chars, slide-in)
- Optional attributes: `data-prevent-flicker`, `data-duration`, `data-delay`, `data-stagger`, `data-opacity`, `data-x`, `data-y`, `data-once`, `data-ease`, `data-start`, `data-end`.
- Text animations wait for fonts and use SplitText with masks: `line-mask`, `word-mask`, `char-mask`.
- Animator mounts as a global module on Barba `onEnter` and cleans up on `beforeLeave`.
