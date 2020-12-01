// Following http://www.w3.org/TR/css3-selectors/#nth-child-pseudo

// [ ['-'|'+']? INTEGER? {N} [ S* ['-'|'+'] S* INTEGER ]?
const RE_NTH_ELEMENT = /^([+-]?\d*n)?\s*(?:([+-]?)\s*(\d+))?$/;

/**
 * Parses an expression.
 *
 * @throws An `Error` if parsing fails.
 * @returns An array containing the integer step size and the integer offset of the nth rule.
 * @example nthCheck.parse("2n+3"); // returns [2, 3]
 */
export function parse(formula: string): [a: number, b: number] {
    formula = formula.trim().toLowerCase();

    if (formula === "even") {
        return [2, 0];
    } else if (formula === "odd") {
        return [2, 1];
    }

    const parsed = formula.match(RE_NTH_ELEMENT);

    if (!parsed) {
        throw new Error(`n-th rule couldn't be parsed ('${formula}')`);
    }

    let a;

    if (parsed[1]) {
        a = parseInt(parsed[1], 10);
        if (isNaN(a)) {
            a = parsed[1].startsWith("-") ? -1 : 1;
        }
    } else a = 0;

    const b =
        (parsed[2] === "-" ? -1 : 1) *
        (parsed[3] ? parseInt(parsed[3], 10) : 0);

    return [a, b];
}
