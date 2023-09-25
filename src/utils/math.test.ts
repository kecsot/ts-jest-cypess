import {generateDifferentValueBetween} from "./math.ts";

describe('generateDifferentValueBetween', () => {
    test('max should be more than min', () => {
        expect(() => {
            return generateDifferentValueBetween(0, 1, 0)
        }).toThrow('Max should be greater than min')

        expect(() => {
            return generateDifferentValueBetween(0, 1, 1)
        }).toThrow('Max should be greater than min')
    })

    test('value should be between min and max', () => {
        expect(() => {
            return generateDifferentValueBetween(0, 1, 2)
        }).toThrow('The value should be between min and max')
    })

    test('should be generate the exact number', () => {
        const exceptedItems = [
            {value: 1, min: 1, max: 2, excepted: 2},
            {value: 0, min: 0, max: 1, excepted: 1},
            {value: 65, min: 64, max: 65, excepted: 64},
            {value: 64, min: 64, max: 65, excepted: 65},
        ]

        for (const {value, min, max, excepted} of exceptedItems) {
            expect(generateDifferentValueBetween(value, min, max)).toBe(excepted)
        }
    })
})