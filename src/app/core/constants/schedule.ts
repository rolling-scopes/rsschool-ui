export enum SCHEDULE {
    LOADING = 'SCHEDULE_LOADING',
    FAIL = 'SCHEDULE_FAIL',
    FETCH_COURSE_EVENTS_AND_STAGES_OK = 'SCHEDULE_FETCH_COURSE_EVENTS_AND_STAGES_OK',
    ADD_COURSE_STAGE_OK = 'SCHEDULE_ADD_COURSE_STAGE_OK',
    UPDATE_COURSE_STAGE_OK = 'SCHEDULE_UPDATE_COURSE_STAGE_OK',
    DELETE_COURSE_STAGE_OK = 'SCHEDULE_DELETE_COURSE_STAGE_OK',
    ADD_COURSE_EVENT_OK = 'SCHEDULE_ADD_COURSE_EVENT_OK',
    UPDATE_COURSE_EVENT_OK = 'SCHEDULE_UPDATE_COURSE_EVENT_OK',
    DELETE_COURSE_EVENT_OK = 'SCHEDULE_DELETE_COURSE_EVENT_OK',
}

export const INPUT_DATE_FORMAT = 'YYYY-MM-DD';
export const INPUT_DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm';
export const STAGE_DATE_FORMAT = 'DD.MM.YYYY';
export const EVENT_DATE_FORMAT = 'MMMM DD, YYYY';
export const EVENT_DAY_FORMAT = 'ddd';
export const EVENT_TIME_FORMAT = 'HH:mm';

export const DELETE_STAGE_CONTEXT = {
    title: 'Delete a Stage?',
    body: 'Do you really want to delete this stage?',
    isError: false,
};

export const DELETE_STAGE_ERROR_CONTEXT = {
    title: 'Error',
    body: 'This Stage cannot be deleted because it is not empty.',
    isError: true,
};
