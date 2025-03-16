export const AddAFewMonthsFromNow = (numberOfMounths: number): number => {
    const dateNow = new Date();
    dateNow.setMonth(dateNow.getMonth() + numberOfMounths);
    const unixTimeAfterXMonth = Math.floor(dateNow.getTime() / 1000);

    return unixTimeAfterXMonth;
};

export const addAFewYearsFromNow = (numberOfYears: number): number => {
    const dateNow = new Date();
    dateNow.setFullYear(dateNow.getFullYear() + numberOfYears);
    const unixTimeAfterXYear = Math.floor(dateNow.getTime() / 1000);

    return unixTimeAfterXYear;
};
