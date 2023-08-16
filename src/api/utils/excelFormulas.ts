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

export function IPMT(
  rate: number,
  period: number,
  periods: number,
  present: number,
  future: number = 0,
  type: number = 0
) {
  // Credits: algorithm inspired by Apache OpenOffice

  // Initialize type
  var type = typeof type === 'undefined' ? 0 : type;

  // Evaluate rate and periods (TODO: replace with secure expression evaluator)
  rate = rate;
  periods = periods;

  // Compute payment
  var payment = PMT(rate, periods, present, future, type);

  // Compute interest
  var interest;
  if (period === 1) {
    if (type === 1) {
      interest = 0;
    } else {
      interest = -present;
    }
  } else {
    if (type === 1) {
      interest = FV(rate, period - 2, payment, present, 1) - payment;
    } else {
      interest = FV(rate, period - 1, payment, present, 0);
    }
  }

  // Return interest
  return interest * rate;
}

export function FV(rate: number, nper: number, pmt: number, pv: number, type: number) {
  var pow = Math.pow(1 + rate, nper),
    fv;

  pv = pv || 0;
  type = type || 0;

  if (rate) {
    fv = (pmt * (1 + rate * type) * (1 - pow)) / rate - pv * pow;
  } else {
    fv = -1 * (pv + pmt * nper);
  }
  return fv;
}

export function CUMIPMT(
  rate: number,
  periods: number,
  value: number,
  start: number,
  end: number,
  type: number
) {
  rate = rate;
  periods = periods;
  value = value;

  var payment = PMT(rate, periods, value, 0, type);
  var interest = 0;

  if (start === 1) {
    if (type === 0) {
      interest = -value;
      start++;
    }
  }

  for (var i = start; i <= end; i++) {
    if (type === 1) {
      interest += FV(rate, i - 2, payment, value, 1) - payment;
    } else {
      interest += FV(rate, i - 1, payment, value, 0);
    }
  }
  interest *= rate;
  return interest;
}
