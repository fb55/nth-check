import nthCheck, { compile, generate, sequence } from ".";
import { valid } from "./__fixtures__/rules";

const valArray = new Array(...Array(2e3)).map((_, i) => i);

/**
 * Iterate through all possible values. This is adapted from qwery,
 * and uses a more intuitive way to process all elements.
 */
function slowNth([a, b]: [number, number]): number[] {
    if (a === 0 && b > 0) return [b - 1];

    return valArray.filter((val) => {
        for (let i = b; a > 0 ? i <= valArray.length : i >= 1; i += a) {
            if (val === valArray[i - 1]) return true;
        }
        return false;
    });
}

describe("parse", () => {
    it("compile & run all valid", () => {
        for (const [_, parsed] of valid) {
            const filtered = valArray.filter(compile(parsed));
            const iterated = slowNth(parsed);

            expect(filtered).toStrictEqual(iterated);
        }
    });

    it("parse, compile & run all valid", () => {
        for (const [rule, parsed] of valid) {
            const filtered = valArray.filter(nthCheck(rule));
            const iterated = slowNth(parsed);

            expect([filtered, rule]).toStrictEqual([iterated, rule]);
        }
    });
});

describe("generate", () => {
    it("should return a function", () => {
        expect(generate([1, 2])).toBeInstanceOf(Function);
    });

    it("should only return valid values", () => {
        for (const [_, parsed] of valid) {
            const gen = generate(parsed);
            const check = compile(parsed);
            let val = gen();

            for (let i = 0; i < 1e3; i++) {
                // Should pass the check iff `i` is the next value.
                expect(val === i).toBe(check(i));

                if (val === i) {
                    val = gen();
                }
            }
        }
    });

    it("should produce an increasing sequence", () => {
        const gen = generate([2, 2]);

        expect(gen()).toBe(1);
        expect(gen()).toBe(3);
        expect(gen()).toBe(5);
        expect(gen()).toBe(7);
        expect(gen()).toBe(9);
    });

    it("should produce an increasing sequence for a negative `n`", () => {
        const gen = generate([-1, 2]);

        expect(gen()).toBe(0);
        expect(gen()).toBe(1);
        expect(gen()).toBe(null);
    });

    it("should not produce any values for `-n`", () => {
        const gen = generate([-1, 0]);

        expect(gen()).toBe(null);
    });

    it("should parse selectors with `sequence`", () => {
        const gen = sequence("-2n+5");

        expect(gen()).toBe(0);
        expect(gen()).toBe(2);
        expect(gen()).toBe(4);
        expect(gen()).toBe(null);
    });
});
