import Browser from 'webextension-polyfill'

export function shortenEthreumAddress(addr: string, len = 4): string {
  return (addr.substring(0, 2 + len) + '...' + addr.substring(addr.length - len)).toLowerCase()
}

export function getExtensionVersion() {
  return Browser.runtime.getManifest().version
}
