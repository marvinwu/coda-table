const { Coda } = require('coda-js')
const _ = require('lodash')
const url = require('url')

function getDocIdFromUrl(
  inputUrl = 'https://coda.io/d/test-fixture_dg1RKjd2wjA/Section-2_suo9J#test-simple_tu4bI/r1'
) {
  let docId = ''
  try {
    docId = url.parse(inputUrl).path.split('/')[2]
    const index = docId.search('_')
    docId = docId.substring(index + 2, docId.length)
  } catch (error) {
    throw new Error(`invalid coda url: ${inputUrl}, docId Parsing failed`)
  }
  return docId
}

async function getTable({ docId, tableName, docUrl = '', apiKey }) {
  if (docUrl) {
    docId = getDocIdFromUrl(docUrl)
  }
  const coda = new Coda(apiKey)
  const docs = await coda.getDoc(docId)
  const tableList = await docs.listTables()
  const tableId = _.get(_.find(tableList, { name: tableName }), 'id')
  if (!tableId) {
    console.error(`${tableName} not found in ${docId}`)
    throw Error('table not found')
  }
  const table = await docs.getTable(tableId)
  const data = await table.listRows({
    useColumnNames: true,
    valueFormat: 'simpleWithArrays'
  })
  return data.map((o) => o.values)
}

async function writeTable(
  data,
  { docId, tableName, docUrl = '', apiKey, keyColumns = [] }
) {
  let keyColumnIds = []
  const coda = new Coda(apiKey)
  const docs = await coda.getDoc(docId)
  const tableList = await docs.listTables()
  const tableId = _.get(_.find(tableList, { name: tableName }), 'id')
  if (!tableId) {
    console.error(`${tableName} not found in ${docId}`)
    throw Error('table not found')
  }
  const table = await docs.getTable(tableId)
  if (keyColumns) {
    const columnsInfo = await table.listColumns()
    if (typeof keyColumns === 'string') {
      keyColumns = [keyColumns]
    }
    keyColumnIds = keyColumns.map(
      (key) => _.find(columnsInfo, { name: key }).id
    )
  }
  await table.insertRows(data, keyColumnIds)
}

async function deleteAll({ docId, tableName, docUrl = '', apiKey }) {
  const coda = new Coda(apiKey)
  const docs = await coda.getDoc(docId)
  const tableList = await docs.listTables()
  const tableId = _.get(_.find(tableList, { name: tableName }), 'id')
  if (!tableId) {
    console.error(`${tableName} not found in ${docId}`)
    throw Error('table not found')
  }
  const table = await docs.getTable(tableId)
  const data1 = await table.listRows({
    useColumnNames: true
  })
  const rowIds = data1.map((o) => o.id)
  return table.deleteRows(rowIds)
}

module.exports = {
  getTable,
  writeTable,
  getDocIdFromUrl,
  deleteAll
}
