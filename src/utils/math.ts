const generateDifferentValueBetween = (value: number, min: number, max: number): number => {
    if (min >= max) throw new Error('Max should be greater than min');
    if (min > value || value > max) throw new Error('The value should be between min and max')

    const exceptedResult = Math.floor(Math.random() * (max - min + 1)) + min;

    if (exceptedResult === value) return generateDifferentValueBetween(value, min, max);
    return exceptedResult;
}

export {
    generateDifferentValueBetween
}