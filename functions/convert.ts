import * as fs from 'fs'
import * as handlebars from 'handlebars'
import fetch from 'node-fetch'

import {
    IEvent,
    IResponder,
    WrapHandler,
} from './utilities'

interface IRequestBody {
    fileKey : string
    nodeId : string
}

interface IPayload {
    link? : string
}

interface IColor {
    r : number
    g : number
    b : number
}

const rgbToHex = ({ r, g, b } : IColor) : string =>
    `rgba(${r*255},${g*255},${b*255})`

const encoding = 'utf8'

interface IFigmaFill {
    color? : IColor
}

interface IFigmaNode {
    name : string
    children : [IFigmaNode]
    fills : [IFigmaFill]
    characters? : string
    absoluteBoundingBox : {
        x : number
        y : number
    }
}

const buildHeader = (header : IFigmaNode) => {
    const textEl = header.children.filter(child => child.name === 'text')[0];
    const backgroundEl = header.children.filter(child => child.name === 'background')[0];
    const bg = backgroundEl.fills[0].color
    const textColor = textEl.fills[0].color

    const source = fs.readFileSync('components/header.html', { encoding })
    const template = handlebars.compile(source)
    return template({
        bg: rgbToHex(bg as IColor),
        text : textEl.characters,
        textColor: rgbToHex(textColor as IColor)
    })
}

// Builds basic body component
const buildBody = (body : IFigmaNode) => {
    const textEl = body.children.filter(child => child.name === 'text')[0];
    const backgroundEl = body.children.filter(child => child.name === 'background')[0];
    const bg = backgroundEl.fills[0].color
    const textColor = textEl.fills[0].color

    const source = fs.readFileSync('components/body.html', { encoding })
    const template = handlebars.compile(source)
    return template({
        bg: rgbToHex(bg as IColor),
        text : textEl.characters,
        textColor: rgbToHex(textColor as IColor)
    })
}

const convert = (doc : any) => {

    const headFile = fs.readFileSync('components/head.html', { encoding })
    const footFile = fs.readFileSync('components/footer.html', { encoding })

    handlebars.registerPartial('head', headFile)
    handlebars.registerPartial('foot', footFile);

    const head = headFile
    const footer = footFile

    const nodes : [IFigmaNode] = doc.children[0].children.filter((child : any) => child.type === 'FRAME')[0].children

    const contents = nodes
    .sort((a, b) => a.absoluteBoundingBox.y - b.absoluteBoundingBox.y)
    .map(a => {
        switch (a.name) {
        case 'header': return buildHeader(a)
        case 'body': return buildBody(a)
        }
        return ''
    })
    .join()

    const allComponents = head + contents + footer
    fs.writeFileSync('tmp/email.html', allComponents)

    return allComponents
}

const FIGMA_TOKEN = '4378-ec89dc8d-6301-4ee7-ae8f-8fa7341a0f43'

exports.handler = WrapHandler(async (event : IEvent<IRequestBody>, context : any, response : IResponder<IPayload>) => {

    const {
        fileKey,
        nodeId
    } = event.body

    // let converted : any

    console.error('I TREID')
    try {


        const figmaResponse = await fetch(`https://api.figma.com/v1/files/${fileKey}?id=${nodeId}`, {
            headers: { 'x-figma-token': FIGMA_TOKEN },
            method: 'GET'
        })
        console.log('FIGMA RESPONSE', figmaResponse)
        const json = await figmaResponse.json() // { document }
        console.log(json)
        // converted = await convert(document)

    } catch (error) {
        console.log(error)
        return response.status(500)
    }

    return response.send({ link: 'HELLsssO'})
})
