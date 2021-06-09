const { Coda } = require('coda-js')
const _ = require('lodash')
const url = require('url')

function getDocIdFromUrl(inputUrl = 'https://coda.io/d/test-fixture_dg1RKjd2wjA/Section-2_suo9J#test-simple_tu4bI/r1') {
  let docId = ''
  try {
    docId = url
      .parse(inputUrl)
      .path.split('/')[2]
      .split('_')[1]
      .slice(1)
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
  })
  return data.map(o => o.values)
}

async function writeTable() {
  // const coda = new Coda(apiKey)
  // const docs = await coda.getDoc(docId)
  // const tableList = await docs.listTables()
  // const tableId = _.get(_.find(tableList, { name: tableName }), 'id')
  // if (!tableId) {
  //   console.error(`${tableName} not found in ${docId}`)
  //   throw Error('table not found')
  // }
  // const table = await docs.getTable(tableId)
  // const data1 = await table.listRows({
  //   useColumnNames: true,
  // })
  // table
  //   .insertRows([
  //     [{ column: 'Name', value: 'Alexis' }, { column: 'Action', value: 'Do the dishes' }],
  //     [
  //       { column: 'Name', value: 'Parker' },
  //       { column: 'Action', value: 'Make dinner' },
  //       { column: 'Completed', value: true },
  //     ],
  //   ])
  //   .then((res, rej) => {
  //     console.log(res)
  //     console.log(rej)
  //   })
  //   .catch(rej => console.error(rej))
}

module.exports = {
  getTable,
  writeTable,
  getDocIdFromUrl,
}
