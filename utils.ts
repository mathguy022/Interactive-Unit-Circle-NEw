
// Greatest common divisor function
function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

// Formats a radian value into a simplified string with π
export function formatRadiansSimple(rad: number): string {
    const tolerance = 1e-10;
    if (Math.abs(rad) < tolerance) return '0';
    if (Math.abs(rad - Math.PI) < tolerance) return 'π';
    if (Math.abs(rad - 2 * Math.PI) < tolerance) return '2π';

    const piFraction = rad / Math.PI;
    let numerator = Math.round(piFraction * 12); // Use a common denominator base
    let denominator = 12;
    
    if(Math.abs(numerator/denominator - piFraction) > tolerance){
       return rad.toFixed(3);
    }
    
    const commonDivisor = gcd(numerator, denominator);
    numerator /= commonDivisor;
    denominator /= commonDivisor;

    if (denominator === 1) {
        return numerator === 1 ? 'π' : `${numerator}π`;
    }
    if (numerator === 0) return '0';
    if (numerator === 1) return `π/${denominator}`;
    
    return `${numerator}π/${denominator}`;
}
