import { deserialize, deserializeArray } from "class-transformer"

export const safeFetch = (url: string) : Promise<Response> => {
    return fetch(url, {
        credentials: 'same-origin'
    })
}

export function objUrl (url: string, obj: object) {
    const params = Object.keys (obj).map (k => k + "=" + encodeURIComponent (obj[k]))
    return url + "?" + params.join ("&")
}

// https://stackoverflow.com/a/5158301
export function urlParameter (name: string) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

export async function queryToObject<T> (cons: new () => T, url: string)
{
    var result = await safeFetch (url)
    return result.ok ? deserialize (cons, await result.text()) : undefined
}

export async function queryToObjectArray<T> (cons: new () => T, url: string)
{
    var result = await safeFetch (url)
    return result.ok ? deserializeArray (cons, await result.text()) : undefined
}