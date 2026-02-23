import nthCheck, { compile, generate, sequence } from ".";
import { valid } from "./__fixtures__/rules";

const valueArray = Array.from({ length: 2e3 }, (_, index) => index);

/**
 * Iterate through all possible values. This is adapted from qwery,
 * and uses a more intuitive way to process all elements.
 * @param rule A tuple [a, b] representing an nth-rule, as returned by `parse`.
 * @param rule."0" The `a` value from the tuple.
 * @param rule."1" The `b` value from the tuple.
 */
function slowNth([a, b]: [number, number]): number[] {
    if (a === 0 && b > 0) return [b - 1];

    return valueArray.filter((value) => {
        for (
            let index = b;
            a > 0 ? index <= valueArray.length : index >= 1;
            index += a
        ) {
            if (value === valueArray[index - 1]) return true;
        }
        return false;
    });
}

describe("parse", () => {
    it("compile & run all valid", () => {
        for (const [, parsed] of valid) {
            const filtered = valueArray.filter(compile(parsed));
            const iterated = slowNth(parsed);

            expect(filtered).toStrictEqual(iterated);
        }
    });

    it("parse, compile & run all valid", () => {
        for (const [rule, parsed] of valid) {
            const filtered = valueArray.filter(nthCheck(rule));
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
        for (const [, parsed] of valid) {
            const gen = generate(parsed);
            const check = compile(parsed);
            let value = gen();

            for (let index = 0; index < 1e3; index++) {
                // Should pass the check iff `i` is the next value.
                expect(value === index).toBe(check(index));

                if (value === index) {
                    value = gen();
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
