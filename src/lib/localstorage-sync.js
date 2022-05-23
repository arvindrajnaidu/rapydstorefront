
export const db = () => {
    return {
        getItem: async function (key) {
            let val = window.localStorage.getItem(key)
            return val ? JSON.parse(val) : null;
        },
        setItem: async function (key, val) {
            return window.localStorage.setItem(key,JSON.stringify(val));
        },
    }
}
