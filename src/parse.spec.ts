import { describe, expect, it } from "vitest";
import { invalid, valid } from "./__fixtures__/rules.js";
import { parse } from "./parse.js";

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
