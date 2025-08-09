// Minimal fallback types for @barba/core so the TypeScript compiler stops
// complaining. If you need richer typings later, replace `any` with more
// specific interfaces.

declare module '@barba/core' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const barba: any;
  export default barba;
}

declare module '@barba/prefetch' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const prefetch: any;
  export default prefetch;
}
