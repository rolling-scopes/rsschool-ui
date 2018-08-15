export function isAnyPartLoaded({ router, ...state }: any) {
    for (const key in state) {
        if (!!state[key].isLoading) {
            return true;
        }
    }
    return false;
}
