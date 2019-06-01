// Copyright (c) 2019, The TurtleCoin Developers
//
// Please see the included LICENSE file for more information.

'use strict'

const Self = function () {
  if (!(this instanceof Self)) return new Self()

  var isNode = false
  var isBrowser = false

  if (typeof module !== 'undefined' && module.exports && typeof window === 'undefined') {
    isNode = true
  }

  if (!isNode && typeof window !== 'undefined') {
    isBrowser = true
  }

  if (isNode) {
    this.crypto = loadNativeAddon()
    this.isNative = false
  }

  if (!this.crypto && isBrowser && typeof window.TurtleCoinCrypto !== 'undefined') {
    this.crypto = loadBrowserWASM()

    if (this.crypto) {
      this.isNative = true
      if (isBrowser) {
        console.log('Using TurtleCoinCrypto WASM')
      }
    }
  }

  if (!this.crypto) {
    this.crypto = loadNativeJS()
    this.isNative = true
    if (isBrowser) {
      console.log('Using TurtleCoinCrypto Native Javascript')
    }
  }
}

Self.prototype.cn_fast_hash = function (data) {
  if (!this.isNative) {
    return this.crypto.cn_fast_hash(data)
  } else {
    const result = this.crypto.cn_fast_hash(data)

    if (!result) {
      return [true, null]
    } else {
      return [null, result]
    }
  }
}

Self.prototype.underivePublicKey = function (derivation, outputIndex, outputKey) {
  if (!this.isNative) {
    return this.crypto.underivePublicKey(derivation, outputIndex, outputKey)
  } else {
    var result

    try {
      result = this.crypto.underivePublicKey(derivation, outputIndex, outputKey)
    } catch (e) {
      result = e
      result = false
    }

    if (!result) {
      return [true, null]
    } else {
      return [null, result]
    }
  }
}

Self.prototype.derivePublicKey = function (derivation, outputIndex, publicKey) {
  if (!this.isNative) {
    return this.crypto.derivePublicKey(derivation, outputIndex, publicKey)
  } else {
    var result

    try {
      result = this.crypto.derivePublicKey(derivation, outputIndex, publicKey)
    } catch (e) {
      result = e
      result = false
    }

    if (!result) {
      return [true, null]
    } else {
      return [null, result]
    }
  }
}

Self.prototype.deriveSecretKey = function (derivation, outputIndex, secretKey) {
  if (!this.isNative) {
    return this.crypto.deriveSecretKey(derivation, outputIndex, secretKey)
  } else {
    var result

    try {
      result = this.crypto.deriveSecretKey(derivation, outputIndex, secretKey)
    } catch (e) {
      result = e
      result = false
    }

    if (!result) {
      return [true, null]
    } else {
      return [null, result]
    }
  }
}

Self.prototype.generateKeyImage = function (publicKey, privateKey) {
  if (!this.isNative) {
    return this.crypto.generateKeyImage(publicKey, privateKey)
  } else {
    var result

    try {
      result = this.crypto.generateKeyImage(publicKey, privateKey)
    } catch (e) {
      result = e
      result = false
    }

    if (!result) {
      return [true, null]
    } else {
      return [null, result]
    }
  }
}

Self.prototype.secretKeyToPublicKey = function (privateKey) {
  if (!this.isNative) {
    return this.crypto.secretKeyToPublicKey(privateKey)
  } else {
    var result

    try {
      result = this.crypto.secretKeyToPublicKey(privateKey)
    } catch (e) {
      result = e
      result = false
    }

    if (!result) {
      return [true, null]
    } else {
      return [null, result]
    }
  }
}

Self.prototype.generateKeyDerivation = function (transactionPublicKey, privateViewKey) {
  if (!this.isNative) {
    return this.crypto.generateKeyDerivation(transactionPublicKey, privateViewKey)
  } else {
    var result

    try {
      result = this.crypto.generateKeyDerivation(transactionPublicKey, privateViewKey)
    } catch (e) {
      result = e
      result = false
    }

    if (!result) {
      return [true, null]
    } else {
      return [null, result]
    }
  }
}

Self.prototype.generateRingSignatures = function (transactionPrefixHash, keyImage, inputKeys, privateKey, realIndex) {
  if (!this.isNative) {
    return this.crypto.generateRingSignatures(transactionPrefixHash, keyImage, inputKeys, privateKey, realIndex)
  } else {
    var cSigs = new this.crypto.VectorString()
    const cInputKeys = new this.crypto.VectorString()

    inputKeys.forEach((key) => {
      cInputKeys.push_back(key)
    })

    try {
      cSigs = this.crypto.generateRingSignatures(transactionPrefixHash, keyImage, cInputKeys, privateKey, realIndex)
    } catch (e) {
      cSigs = e
      cSigs = false
    }

    if (!cSigs) return [true, null]

    const sigs = []

    for (var i = 0; i < cSigs.size(); i++) {
      sigs.push(cSigs.get(i))
    }

    return [null, sigs]
  }
}

Self.prototype.scReduce32 = function (data) {
  if (!this.isNative) {
    return this.crypto.scReduce32(data)
  } else {
    const result = this.crypto.scReduce32(data)

    if (!result) {
      return [true, null]
    } else {
      return [null, result]
    }
  }
}

function loadNativeAddon () {
  var Self = false

  try {
    Self = require('turtlecoin-crypto')
  } catch (e) {
    Self = e
    Self = false
  }

  return Self
}

function loadNativeJS () {
  var Self = false

  try {
    Self = require('./turtlecoin-crypto.js')()
  } catch (e) {
    Self = e
    Self = false
  }

  return Self
}

function loadBrowserWASM () {
  var Self = false

  try {
    Self = window.TurtleCoinCrypto()
  } catch (e) {
    Self = e
    Self = false
  }

  return Self
}

module.exports = Self