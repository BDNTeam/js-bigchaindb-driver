import test from 'ava'
import sinon from 'sinon'

import * as request from '../../src/request' // eslint-disable-line
import { Connection } from '../../src'

const API_PATH = 'http://localhost:9984/api/v1/'
const conn = new Connection(API_PATH)


test('generate API URLS', t => {
    const endpoints = {
        'blocks': 'blocks',
        'blocksDetail': 'blocks/%(blockId)s',
        'outputs': 'outputs',
        'statuses': 'statuses',
        'transactions': 'transactions',
        'transactionsDetail': 'transactions/%(transactionId)s',
        'assets': 'assets',
    }
    Object.keys(endpoints).forEach((endpointName) => {
        const url = conn.getApiUrls(endpointName)
        const expected = API_PATH + endpoints[endpointName]
        t.is(url, expected)
    })
})


test('Request with custom headers', t => {
    const testConn = new Connection(API_PATH, { hello: 'world' })
    const expectedOptions = {
        headers: {
            hello: 'world',
            custom: 'headers'
        }
    }

    // request is read only, cannot be mocked?
    sinon.spy(request, 'default')
    testConn._req(API_PATH, { headers: { custom: 'headers' } })

    t.truthy(request.default.calledWith(API_PATH, expectedOptions))
    request.default.restore()
})


test('Get block for a block id', t => {
    const expectedPath = 'path'
    const blockId = 'abc'

    conn._req = sinon.spy()
    conn.getApiUrls = sinon.stub().returns(expectedPath)

    conn.getBlock(blockId)
    t.truthy(conn._req.calledWith(
        expectedPath,
        { urlTemplateSpec: { blockId } }
    ))
})


test('Get status for a transaction id', t => {
    const expectedPath = 'path'
    const transactionId = 'abc'

    conn._req = sinon.spy()
    conn.getApiUrls = sinon.stub().returns(expectedPath)

    conn.getStatus(transactionId)
    t.truthy(conn._req.calledWith(
        expectedPath,
        { query: { transaction_id: transactionId } }
    ))
})


test('Get transaction for a transaction id', t => {
    const expectedPath = 'path'
    const transactionId = 'abc'

    conn._req = sinon.spy()
    conn.getApiUrls = sinon.stub().returns(expectedPath)

    conn.getTransaction(transactionId)
    t.truthy(conn._req.calledWith(
        expectedPath,
        { urlTemplateSpec: { transactionId } }
    ))
})


test('Get list of blocks for a transaction id', t => {
    const expectedPath = 'path'
    const transactionId = 'abc'
    const status = 'status'

    conn._req = sinon.spy()
    conn.getApiUrls = sinon.stub().returns(expectedPath)

    conn.listBlocks(transactionId, status)
    t.truthy(conn._req.calledWith(
        expectedPath,
        {
            query: {
                transaction_id: transactionId,
                status
            }
        }
    ))
})


test('Get list of transactions for an asset id', t => {
    const expectedPath = 'path'
    const assetId = 'abc'
    const operation = 'operation'

    conn._req = sinon.spy()
    conn.getApiUrls = sinon.stub().returns(expectedPath)

    conn.listTransactions(assetId, operation)
    t.truthy(conn._req.calledWith(
        expectedPath,
        {
            query: {
                asset_id: assetId,
                operation
            }
        }
    ))
})


test('Get outputs for a public key and no spent flag', t => {
    const expectedPath = 'path'
    const publicKey = 'publicKey'

    conn._req = sinon.spy()
    conn.getApiUrls = sinon.stub().returns(expectedPath)

    conn.listOutputs(publicKey)
    t.truthy(conn._req.calledWith(
        expectedPath,
        { query: { public_key: publicKey } }
    ))
})


test('Get outputs for a public key and spent=false', t => {
    const expectedPath = 'path'
    const publicKey = 'publicKey'
    const spent = false

    conn._req = sinon.spy()
    conn.getApiUrls = sinon.stub().returns(expectedPath)

    conn.listOutputs(publicKey, spent)
    t.truthy(conn._req.calledWith(
        expectedPath,
        { query: { public_key: publicKey, spent: 'false' } }
    ))
})


test('Get outputs for a public key and spent=true', t => {
    const expectedPath = 'path'
    const publicKey = 'publicKey'
    const spent = true

    conn._req = sinon.spy()
    conn.getApiUrls = sinon.stub().returns(expectedPath)

    conn.listOutputs(publicKey, spent)
    t.truthy(conn._req.calledWith(
        expectedPath,
        { query: { public_key: publicKey, spent: 'true' } }
    ))
})


test('Get votes for a block id', t => {
    const expectedPath = 'path'
    const blockId = 'abc'

    conn._req = sinon.spy()
    conn.getApiUrls = sinon.stub().returns(expectedPath)

    conn.listVotes(blockId)
    t.truthy(conn._req.calledWith(
        expectedPath,
        { query: { block_id: blockId } }
    ))
})


test('Get asset for text', t => {
    const expectedPath = 'path'
    const search = 'abc'

    conn._req = sinon.spy()
    conn.getApiUrls = sinon.stub().returns(expectedPath)

    conn.searchAssets(search)
    t.truthy(conn._req.calledWith(
        expectedPath,
        { query: { search } }
    ))
})
