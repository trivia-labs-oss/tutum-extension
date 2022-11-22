import browser from 'webextension-polyfill'
import { checkSign, checkSimulation, checkTransaction } from './api/security-check'
import { CheckResponse, CheckResult, MessageRequest, MessageType } from './types/messaging'
import { getLogger } from './utils/logger'

const logger = getLogger('background')

async function handleTransactionRequest(
  request: MessageRequest,
  sender: browser.Runtime.MessageSender,
): Promise<CheckResult> {
  const transactionRequest = request.data.request

  const response: CheckResult = {
    reqId: request.data.reqId,
    tabId: sender.tab?.id,
  }

  let promise: Promise<CheckResponse>
  let simulationPromise: ReturnType<typeof checkSimulation> | undefined = undefined
  if ('transaction' in transactionRequest) {
    promise = checkTransaction(transactionRequest)
    simulationPromise = checkSimulation(transactionRequest)
  } else {
    promise = checkSign(transactionRequest)
  }

  const [checkResult, simulationResult] = await Promise.allSettled([promise, simulationPromise])
  if (checkResult.status === 'fulfilled') {
    response.toAddressInfo = checkResult.value.toAddressInfo
    response.warnings = checkResult.value.warnings
  }
  if (simulationResult.status === 'fulfilled') {
    response.simulation = simulationResult.value
    if (!response.warnings) {
      response.warnings = []
    }
    response.warnings.push(...(response.simulation?.warnings || []))
  } else {
    response.simulation = {
      success: false,
      error: simulationResult.reason,
    }
  }

  return response
}

browser.runtime.onMessage.addListener(async (request: MessageRequest, sender) => {
  logger.info('tx request', request)
  if (request.type === MessageType.TransactionRequest) {
    browser.windows.create({
      url: `popup.html?reqId=${request.data.reqId}&tabId=${sender.tab?.id}`,
      type: 'popup',
      width: 360,
      height: 650,
    })
    return handleTransactionRequest(request, sender)
  }
})

async function injectScript() {
  await browser.scripting.unregisterContentScripts()
  await browser.scripting.registerContentScripts([
    {
      id: 'Tutum Script',
      matches: ['file://*/*', 'http://*/*', 'https://*/*'],
      js: ['injectedScript.js'],
      allFrames: true,
      runAt: 'document_start',
      world: 'MAIN',
    } as any,
  ])
}

injectScript().catch((err) => logger.error(err))

// log & clear history data on init
browser.storage.local.get().then((result) => {
  logger.info('storage values before clear', result)
  browser.storage.local.clear()
})
