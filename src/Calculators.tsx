import { Link } from 'react-router-dom';

export default function Calculators() {
  const calculators = ['mortgage-crusher', 'capital-gains'];
  return (
    <>
      <ul>
        {calculators.map((calculator) => (
          <li key={calculator}>
            <Link
              to={calculator}
              style={{
                textTransform: 'capitalize',
              }}
            >
              {calculator.replace('-', ' ')} Calculator
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
