import * as fs from 'fs'
import * as handlebars from 'handlebars'
import fetch from 'node-fetch'

import {
    IEvent,
    IResponder,
    WrapHandler,
} from './utilities'

interface IRequestBody {
    key : string
    id : string
}

interface IPayload {
    link? : string
}

// interface IColor {
//     r : number
//     g : number
//     b : number
// }

// const rgbToHex = ({ r, g, b } : IColor) : string =>
//     `rgba(${r*255},${g*255},${b*255})`

// const encoding = 'utf8'

// interface IFigmaFill {
//     color? : IColor
// }

// interface IFigmaNode {
//     name : string
//     children : [IFigmaNode]
//     fills : [IFigmaFill]
//     characters? : string
//     absoluteBoundingBox : {
//         x : number
//         y : number
//     }
// }

// const buildHeader = (header : IFigmaNode) => {
//     const textEl = header.children.filter(child => child.name === 'text')[0];
//     const backgroundEl = header.children.filter(child => child.name === 'background')[0];
//     const bg = backgroundEl.fills[0].color
//     const textColor = textEl.fills[0].color

//     const promise = new Promise((resolve, reject) => {
//         const source = fs.readFileSync('components/header.html', { encoding })
//         const template = handlebars.compile(source)
//         const html =  template({
//             bg: rgbToHex(bg as IColor),
//             text : textEl.characters,
//             textColor: rgbToHex(textColor as IColor)
//         })
//         resolve(html)
//     });
//     return promise
//     }

// // Builds basic body component
// const buildBody = (body : IFigmaNode) => {
//     const textEl = body.children.filter(child => child.name === 'text')[0];
//     const backgroundEl = body.children.filter(child => child.name === 'background')[0];
//     const bg = backgroundEl.fills[0].color
//     const textColor = textEl.fills[0].color

//     const promise = new Promise((resolve, reject) => {
//         const source = fs.readFileSync('components/body.html', { encoding })
//         const template = handlebars.compile(source)
//         const html =  template({
//             bg: rgbToHex(bg as IColor),
//             text : textEl.characters,
//             textColor: rgbToHex(textColor as IColor)
//         })
//         resolve(html);
//     });
//     return promise
// }

// const convert = (doc : any) => {

//     const headFile = fs.readFileSync('components/head.html', { encoding })
//     const footFile = fs.readFileSync('components/footer.html', { encoding })

//     handlebars.registerPartial('head', headFile)
//     handlebars.registerPartial('foot', footFile);

//     const head = headFile
//     const footer = footFile

//     const content : [IFigmaNode] = doc.children[0].children.filter((child : any) => child.type === 'FRAME')[0].children

//     const promises = content
//     .sort((a, b) => a.absoluteBoundingBox.y - b.absoluteBoundingBox.y)
//     .map(a => {
//         switch (a.name) {
//         case 'header': return buildHeader(a)
//         case 'body': return buildBody(a)
//         }
//         return Promise.reject()
//     })

//     return Promise
//     .all(promises)
//     .then((values) => {
//         // Complete HTML email template by adding
//         // head and footer partials to content
//         const allComponents = head + values.join() + footer
//         // Write to email file
//         fs.writeFileSync('tmp/email.html', allComponents)
//         return allComponents
//     })
// }

exports.handler = WrapHandler(async (event : IEvent<IRequestBody>, context : any, response : IResponder<IPayload>) => {

    const {
        key,
        id
    } = event.body

    // let converted : any

    try {

        const figmaResponse = await fetch(`https://api.figma.com/v1/files/${key}?id=${id}`, {
            headers: { "x-figma-token": '4378-ec89dc8d-6301-4ee7-ae8f-8fa7341a0f43'},
            method: 'GET',
        })
        const { document } = await figmaResponse.json()
        // converted = await convert(document)

    } catch (error) {
        // console.log(error)
        return response.status(500)
    }

    return response.send({ link: 'hello' }) // converted
})
