import { DateTime, Interval } from 'luxon';

import { IEventDocument, EventType, IStageDocument } from '../models';

type INormalizeEvent = {
    isEndTask: boolean;
    event: IEventDocument;
};

export type NormalizeScheduleData = {
    stage: IStageDocument | null;
    events: INormalizeEvent[];
};

export const getNormalizeScheduleData = (
    events: IEventDocument[],
    stages: IStageDocument[],
): NormalizeScheduleData[] => {
    const sortedEvents = events
        .reduce<INormalizeEvent[]>((res, event) => {
            if (event.type === EventType.Task && event.endDateTime && event.startDateTime !== event.endDateTime) {
                res.push({ event, isEndTask: true });
            }
            res.push({ event, isEndTask: false });
            return res;
        }, [])
        .sort((eventA, eventB) => {
            const a = eventA.isEndTask ? eventA.event.endDateTime! : eventA.event.startDateTime;
            const b = eventB.isEndTask ? eventB.event.endDateTime! : eventB.event.startDateTime;
            return a - b;
        });

    const sortedStages = [...stages].sort((a, b) => {
        return a.startDate - b.startDate;
    });

    const initialData = sortedStages.reduce<NormalizeScheduleData[]>(
        (res, stage) => {
            res.push({
                stage,
                events: [],
            });
            res.push({
                stage: null,
                events: [],
            });
            return res;
        },
        [{ stage: null, events: [] }],
    );

    const data = sortedEvents.reduce<NormalizeScheduleData[]>((res, normalizeEvent) => {
        for (let index = 0; index < res.length; index++) {
            const item = res[index];
            const dateTime: number = normalizeEvent.isEndTask
                ? normalizeEvent.event.endDateTime!
                : normalizeEvent.event.startDateTime;
            if (item.stage) {
                if (
                    Interval.fromDateTimes(
                        DateTime.fromMillis(item.stage.startDate),
                        DateTime.fromMillis(item.stage.endDate).endOf('day'),
                    ).contains(DateTime.fromMillis(dateTime))
                ) {
                    item.events.push(normalizeEvent);
                    break;
                }
            } else {
                const nextItem = res[index + 1];
                if (
                    nextItem &&
                    nextItem.stage &&
                    DateTime.fromMillis(dateTime) < DateTime.fromMillis(nextItem.stage.startDate)
                ) {
                    item.events.push(normalizeEvent);
                    break;
                }
                if (index === res.length - 1) {
                    item.events.push(normalizeEvent);
                    break;
                }
            }
        }
        return res;
    }, initialData);

    return data;
};
