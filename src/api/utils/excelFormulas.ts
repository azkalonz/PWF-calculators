export function NPER(
  rate: number,
  payment: number,
  present: number,
  future: number = 0,
  type: number = 0
) {
  // Initialize type
  type = typeof type === 'undefined' ? 0 : type;

  // Initialize future value
  future = typeof future === 'undefined' ? 0 : future;

  // Return number of periods
  const num = payment * (1 + rate * type) - future * rate;
  const den = present * rate + payment * (1 + rate * type);
  return Math.log(num / den) / Math.log(1 + rate);
}

export function PMT(rate: number, nper: number, pv: number, fv: number = 0, type: number = 0) {
  if (!fv) {
    fv = 0;
  }
  if (!type) {
    type = 0;
  }

  if (rate == 0) {
    return -(pv + fv) / nper;
  }

  const pvif = Math.pow(1 + rate, nper);
  let pmt = (rate / (pvif - 1)) * -(pv * pvif + fv);

  if (type == 1) {
    pmt /= 1 + rate;
  }

  return pmt;
}
