import Global from "./Global";

const Number2Currency = (number, currency = 'en-US') => {
  return (Number(number) || 0)
    .toLocaleString(currency, {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    })
}

export const CurrencySymbol = () => {
  switch (Global.currency) {
    case 'usd':
      return '$';
    default:
      return 'S/. ';
  }
}

export default Number2Currency