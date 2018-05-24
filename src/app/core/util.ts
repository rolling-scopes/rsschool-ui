import { AnyAction } from 'redux';

export interface Action<T> extends AnyAction {
    type: string;
    payload?: T;
}
