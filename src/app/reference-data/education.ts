export const EMPTY_UNIVERSITY = {
    id: '',
    name: '(Empty)',
};

export const EMPTY_FACULTY = {
    id: '',
    name: '(Empty)',
};

export const UNIVERSITIES = [
    {
        id: 'bsuir',
        name: 'BSUIR',
        faculties: [
            EMPTY_FACULTY,
            {
                id: 'ksis',
                name: 'KSIS',
            },
        ],
    },
    {
        id: 'bntu',
        name: 'BNTU',
        faculties: [
            EMPTY_FACULTY,
            {
                id: '123',
                name: '1234',
            },
        ],
    },
];

const range = (start: number, count: number): number[] => {
    return Array.apply(0, Array(count)).map((_: number, index: number) => {
        return index + start;
    });
};
const graduationOffset = 20;
const startYear = new Date().getFullYear() - graduationOffset;
export const EDUCATION_YEARS = range(startYear, graduationOffset + 6).map((year: number) => ({
    id: year.toString(),
    name: year.toString(),
}));
