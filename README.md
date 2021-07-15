# purpose

a simple utility to get coda tables in JSON format

# how to install

```
npm install -g coda-table

```

or local install

```json
# package.json
  "scripts": {
    "coda-table": "coda-table",
  },

```

```bash
npm run coda-table --silent -- get <coda_doc_url> <table_name> --apiKey <your_coda_api_key>
```

# cli

by default it will try to read CODA_API_TOKEN env variable

## Usage: codaTable get [options] <docUrl> <tableName>

```
Usage: codaTable get [options] <docUrl> <tableName>

Options:
  -a, --apiKey [apiKey]  api key, default will try to read CODA_API from env
  -h, --help             display help for command
```

## Usage: codaTable write [options] <jsonFilePath> <docUrl> <tableName>

```
Options:
  -a, --apiKey [apiKey]          api key, default will try to read CODA_API from env
  -k, --keyColumns [keyColumns]  key columns, if provided will upsert data
  -h, --help                     display help for command
```

eg.

```bash
node bin/codaTable write tmp/test.json https://coda.io/d/test-fixture_dg1RKjd2wjA/writeTest_sugIu\#_lus2t write -k Name,Action
```
