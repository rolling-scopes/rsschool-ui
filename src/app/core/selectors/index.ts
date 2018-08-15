import { mapValues, mapKeys, isObject } from 'lodash';

import { RootState } from 'core/reducers';

export function isAnyPartLoaded({ router, ...state }: RootState) {
    let isLoading = false;

    function traverseState(obj: any, cb: any) {
        mapValues(mapKeys(obj, cb), (val: any) => {
            if (isLoading) {
                return;
            }
            return isObject(val) ? traverseState(val, cb) : val;
        });
    }

    traverseState(state, (value: any, key: any) => {
        if (key === 'isLoading' && value) {
            isLoading = true;
        }
    });

    return isLoading;
}
