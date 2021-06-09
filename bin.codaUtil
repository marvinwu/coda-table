#!/usr/bin/env node
const program = require('commander')
const {getDocIdFromUrl,getTable} = require('../lib/index')
program
  .command('getTable <docUrl> <tableName>')
  .option('-a, --apiKey [apiKey]', 'api key, default will try to read CODA_API from env')
  .action(async (docUrl,tableName,args) => {
    const { apiKey=process.env.CODA_API_TOKEN } = args
    const docId = await getDocIdFromUrl(docUrl)
    const result = await getTable({docId,tableName,apiKey})
    console.log(JSON.stringify(result))

  })

program.on('command:*', () => {
  console.error(
    'Invalid command: %s\nSee --help for a list of available commands.',
    program.args.join(' ')
  )
  process.exit(1)
})

program.parse(process.argv)
