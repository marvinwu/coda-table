require('dotenv').config({ path: require('find-config')('.env') }) // eslint-disable-line
const { Coda } = require('coda-js')
const coda = new Coda(process.env.CODA_API_TOKEN) // insert your token
const codaUtil = require('../lib/index')
jest.setTimeout(60000)

test('coda basic-who am i ', async () => {
  const docs = await coda.whoAmI()
  console.log(docs)
  // console.log(JSON.stringify(firstDoc, null, 2))
  // const table = await firstDoc.getTable('grid-Os_DAPdJJg')
  // const rows = await table.listRows({
  //     useColumnNames: true,
  // })
  // console.log(JSON.stringify(rows, null, 2))
})

test('coda basic', async () => {
  const docs = await coda.listDocs()
  const firstDoc = docs[0]

  // console.log(JSON.stringify(firstDoc, null, 2))
  const firstDocTables = await firstDoc.listTables()
  console.log(JSON.stringify(firstDocTables, null, 2))
  // const table = await firstDoc.getTable('grid-Os_DAPdJJg')
  // const rows = await table.listRows({
  //     useColumnNames: true,
  // })
  // console.log(JSON.stringify(rows, null, 2))
})

// test('rich text test coda', async () => {
//     const setting = {
//         docId: 'g1RKjd2wjA',
//         tableName: 'hello'
//     }
//     const codaParam = {
//         apiKey: process.env.CODA_API_TOKEN
//     }
//     let output = await codaUtil.getTable(setting, codaParam)
//     console.log(JSON.stringify(output, null, 2))
// })

test('codaUtil getTableDataView', async () => {
  const docs = await coda.getDoc('g1RKjd2wjA')

  const setting = {
    docId: 'g1RKjd2wjA',
    tableName: 'test simple'
  }
  const result = await docs.listTables(setting, {
    apiKey: process.env.CODA_API_TOKEN
  })
  console.log(JSON.stringify(result, null, 2))
})

test('coda-doc-id-resolver', () => {
  // const docs = await coda.getDoc('g1RKjd2wjA')

  const codaUrl = `https://coda.io/d/Expense_dp2y9lb-efh/Expense_suN__#Expense_tutna/r1
   
   `
  const result = codaUtil.getDocIdFromUrl(codaUrl)
  expect(result).toEqual(`p2y9lb-efh`)
})

test('coda-doc-id-resolver', () => {
  // test when id contains underscore
  // const docs = await coda.getDoc('g1RKjd2wjA')

  const codaUrl = `https://coda.io/d/Test-NPM-Coda-Get-Table_dxBIxyQWgP_/Untitled_suBkG#_luL2l
   
   `
  const result = codaUtil.getDocIdFromUrl(codaUrl)
  expect(result).toEqual(`xBIxyQWgP_`)
})

test('coda-doc-id-resolver', () => {
  // const docs = await coda.getDoc('g1RKjd2wjA')

  const codaUrl = `https://coda.io/d/Income-School_dFaV1tHMTCU
   
   `
  const result = codaUtil.getDocIdFromUrl(codaUrl)
  expect(result).toEqual(`FaV1tHMTCU`)
})

test('codaUtil-getTableData-docName', async () => {
  // const docs = await coda.getDoc('g1RKjd2wjA')

  const setting = {
    docUrl:
      'https://coda.io/d/test-fixture_dg1RKjd2wjA/Section-2_suo9J#test-simple_tu4bI/r1',
    tableName: 'test_simple',
    apiKey: process.env.CODA_API_TOKEN
  }
  const result = await codaUtil.getTable(setting)
  expect(result).toEqual([
    {
      name: 'a',
      value: 1,
      hello: 'test',
      world: 'fixture'
    },
    {
      name: 'b',
      value: 2,
      hello: 'foo',
      world: 'bar'
    }
  ])
})

test('codaUtil-getTableData-docId', async () => {
  // const docs = await coda.getDoc('g1RKjd2wjA')

  const setting = {
    docId: 'g1RKjd2wjA',
    tableName: 'test_simple',
    apiKey: process.env.CODA_API_TOKEN
  }
  const result = await codaUtil.getTable(setting)
  expect(result).toEqual([
    {
      name: 'a',
      value: 1,
      hello: 'test',
      world: 'fixture'
    },
    {
      name: 'b',
      value: 2,
      hello: 'foo',
      world: 'bar'
    }
  ])
})

test('deleteAll', async () => {
  // const docs = await coda.getDoc('g1RKjd2wjA')

  const setting = {
    docId: 'g1RKjd2wjA',
    tableName: 'write',
    apiKey: process.env.CODA_API_TOKEN
  }

  const result = await codaUtil.deleteAll(setting)
})

test('putdata', async () => {
  const setting = {
    docId: 'g1RKjd2wjA',
    tableName: 'write',
    apiKey: process.env.CODA_API_TOKEN
  }
  const data = [
    {
      Name: 'test1',
      Action: 'hello world1'
    }
  ]
  await codaUtil.deleteAll(setting)
  await codaUtil.writeTable(data, setting)
  const result = await codaUtil.getTable(setting)
  console.log(result)
  expect(result).toEqual(data)
})

test('putdata', async () => {
  const setting = {
    docId: 'g1RKjd2wjA',
    tableName: 'write',
    apiKey: process.env.CODA_API_TOKEN
  }
  const data = [
    {
      Name: 'test1',
      Action: 'hello world1'
    }
  ]
  await codaUtil.deleteAll(setting)
  await codaUtil.writeTable(data, setting)
  const result = await codaUtil.getTable(setting)
  console.log(result)
  expect(result).toEqual(data)
})

test('putdata upsert', async () => {
  const setting = {
    docId: 'g1RKjd2wjA',
    tableName: 'write',
    apiKey: process.env.CODA_API_TOKEN,
    keyColumns: ['Name']
  }
  const data = [
    {
      Name: 'test1',
      Action: 'hello world1'
    }
  ]
  await codaUtil.deleteAll(setting)
  await codaUtil.writeTable(data, setting)
  await codaUtil.writeTable(
    [
      {
        Name: 'test1',
        Action: 'hello world2'
      },
      {
        Name: 'test2',
        Action: 'hello world3'
      }
    ],
    setting
  )
  await new Promise((r) => setTimeout(r, 12000))
  const result = await codaUtil.getTable(setting)
  expect(result).toEqual([
    { Name: 'test2', Action: 'hello world3' },
    { Name: 'test1', Action: 'hello world2' }
  ])
})

test('putdata upsert', async () => {
  const setting = {
    docId: 'g1RKjd2wjA',
    tableName: 'write',
    apiKey: process.env.CODA_API_TOKEN,
    keyColumns: 'Name'
  }
  const data = [
    {
      Name: 'test1',
      Action: 'hello world1'
    }
  ]
  await codaUtil.deleteAll(setting)
  await codaUtil.writeTable(data, setting)
  await codaUtil.writeTable(
    [
      {
        Name: 'test1',
        Action: 'hello world2'
      },
      {
        Name: 'test2',
        Action: 'hello world3'
      }
    ],
    setting
  )
  await new Promise((r) => setTimeout(r, 12000))
  const result = await codaUtil.getTable(setting)
  expect(result).toEqual([
    { Name: 'test2', Action: 'hello world3' },
    { Name: 'test1', Action: 'hello world2' }
  ])
})
