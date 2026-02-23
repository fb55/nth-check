import { invalid, valid } from "./__fixtures__/rules";
import { parse } from "./parse";

describe("parse", () => {
    it("parse invalid", () => {
        for (const formula of invalid) {
            expect(() => parse(formula)).toThrowError(Error);
        }
    });

    it("parse valid", () => {
        for (const [formula, result] of valid) {
            expect(parse(formula)).toStrictEqual(result);
        }
    });
});
