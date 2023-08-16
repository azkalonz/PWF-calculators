export function clamp(num: number, min: number, max: number) {
  return num <= min ? min : num >= max ? max : num;
}

// Create our number formatter.
export const dollarFormat = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});
