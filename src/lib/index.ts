// #!/usr/bin/env node
// import { expressions as exp, Helper } from 'js-expressions'
// import path from 'path'
// const { program, Option } = require('commander')
// const yaml = require('js-yaml')

// const run = async (expression:string, source:string, options:any) => {
// let data:any = {}
// let extension = ''
// if ((source.startsWith('[') || source.startsWith('{'))) {
// data = Helper.tryParse(source)
// } else {
// extension = path.extname(source)
// if (!['.json', '.yaml', 'yml'].includes(extension)) {
// throw Error(`extension ${extension} not supported `)
// }
// const content = await Helper.readFile(source)
// if (!content) {
// throw Error(`can not read file ${source}`)
// }
// if (extension === 'json') {
// data = Helper.tryParse(content)
// } else {
// data = yaml.load(content)
// }
// }
// if (data === null || data === undefined) {
// throw Error(`can not parse content of ${source}`)
// }
// const result = exp.eval(expression, { '.': data })
// const forceJson = options.output === 'json'
// const forceYaml = options.output === 'yaml'
// if (forceYaml || (!forceJson && extension && ['.yaml', 'yml'].includes(extension))) {
// console.log(yaml.dump(result))
// } else {
// const formatted = options.beautiful ? JSON.stringify(result, null, 2) : JSON.stringify(result)
// console.log(formatted)
// }
// }

// const getInput = async () => {
// // https://wellingguzman.com/notes/node-pipe-input
// return new Promise(function (resolve, reject) {
// const stdin = process.stdin
// let data = ''
// stdin.setEncoding('utf8')
// stdin.on('data', function (chunk) {
// data += chunk
// })
// stdin.on('end', function () {
// resolve(data)
// })
// stdin.on('error', reject)
// })
// }

// async function main () {
// program
// .argument('<expression>')
// .argument('[source]')
// .addOption(new Option('-o, --output <format>', 'Force output').choices(['json', 'yaml']))
// .option('-b, --beautiful', 'Beautiful output', false)
// .option('-q, --query-file <path>', 'query file')
// .action(async (expression:string, source:any, options:any) => {
// try {
// const data = (source !== undefined) ? source : await getInput() as any
// await run(expression, data, options)
// } catch (error:any) {
// console.error(error.message)
// }
// })
// await program.parseAsync(process.argv)
// }
// main()
