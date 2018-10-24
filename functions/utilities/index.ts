export const headers = {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin" : "*",
    "Content-Type": "application/json; charset=utf-8",
}

export interface IEvent<T> {
    body : T
}

type Handler<T> = (
    event : IEvent<T>,
    context : any,
    response : any,
) => any

type Callback = (
    error : any,
    body : {
        statusCode : number,
        body : any,
        headers : any,
    }
) => void

export interface IResponder<T> {
    status : (statusCode : number) => (body : T) => any,
    send : (body : T) => any,
}

const callbackWrapper = <O>(callback : Callback) : IResponder<O> => ({
    send: (object : O) => callback(null, { statusCode: 200, body: JSON.stringify(object), headers, }),
    status: (statusCode : number) => (object : O) => callback(null, { statusCode, body: JSON.stringify(object), headers, }),
})

export const WrapHandler = <I,O>(handler : Handler<I>) =>
    (event : any, context : any, callback : Callback) =>
        handler({ ...event, body: JSON.parse(event.body) as I }, context, callbackWrapper<O>(callback))
