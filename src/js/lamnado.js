
import { sendTransaction } from '../js/lamden-utils'
import { lamdenNetwork } from '../stores/globalStores'
//import circomlib from 'circomlib'
import { get } from 'svelte/store'
import * as forge from 'node-forge';
import BN from 'bignumber.js'


export const DEFAULT_RELAYER_URL = 'https://relayer.gammaphi.io' //'http://localhost:5000' //


/** Generate random number of specified byte length */
const rbigint = (nbytes) => forge.util.createBuffer(forge.random.getBytesSync(nbytes));

/** BigNumber to hex string of specified length */
export const toHex = (number) => number.toHex()

/**
 * Create deposit object from secret and nullifier
 */
function createDeposit(nullifier, secret) {
    let deposit = { nullifier, secret }
    deposit.nullifierHex = deposit.nullifier.toHex()
    deposit.secretHex = deposit.secret.toHex()
    deposit.preimage = forge.util.createBuffer(forge.util.hexToBytes(deposit.nullifier.toHex() + deposit.secret.toHex()))
    if (deposit.preimage.toHex() !== deposit.nullifierHex+deposit.secretHex) {
        console.log(deposit.nullifierHex+deposit.secretHex)
        console.log(deposit.preimage.toHex())
        throw Error('Invalid preimage')
    }
    deposit.commitment = pedersenHash(deposit.preimage)
    deposit.nullifierHash = pedersenHash(deposit.nullifier)
    return deposit
}


/**
 * Create a random deposit object
 */
export function createRandomDeposit() {
    return createDeposit(rbigint(31), rbigint(31))
}


/** 
 * Return note from given data
 */
export function createNote(amount, token, deposit) {
    return `lamnado-${token}-${amount}-${toHex(deposit.preimage)}`
}


/**
 * Callback is called with a note and the result of the lamden transaction
 */
export function lamnadoDeposit(amount, token, deposit, resultsTracker, callback) {
    const lamdenNetworkInfo = get(lamdenNetwork)
    const contract = lamdenNetworkInfo.lamnado_contracts[token][amount];

    // make sure contract is valid
    if (!contract) {
        throw Error(`No contract exists for ${token} with denomination ${amount}`)
    }

    // prepare transaction
    const commitment = toHex(deposit.commitment)
    const txInfo = {
        networkType: lamdenNetworkInfo.networkType,
        contractName: contract,
        methodName: 'deposit',
        kwargs: {
            commitment: commitment,
        },
        stampLimit: lamdenNetworkInfo.stamps.lamnado_deposit,
    }

    sendTransaction(txInfo, resultsTracker, (result) => {
        // create private note for user
        const note = createNote(amount, token, deposit)
        callback({
            result: result,
            note: note
        })  
    })    
}


/**
 * Send an async request to a relayer to withdraw funds
 */
export async function lamnadoWithdraw(note, recipient, relayer_url=DEFAULT_RELAYER_URL) {
    // extract data from note
    const noteSplit = note.split('-')
    if (noteSplit.length != 4) {
        alert('Invalid note.')
        return
    }
    // prepare POST
    const body = {
        token: noteSplit[1],
        denomination: noteSplit[2],
        note: noteSplit[3],
        recipient: recipient,
    }
    console.log(body)

    // check if nullifier has already been spent
    // TODO

    // send request to relayer
    const res = await fetch(
        `${relayer_url}/relay`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        },
    )
    if (res.status === 200) {
        let json = await res.json()
        return json
    } else {
        throw Error("Withdraw request returned a non 200 status code.")
    }
}


/**
 * Get the pedersen hash
 */
/**
 * Send an async request to a relayer to withdraw funds
 */
 export async function pedersenHash(data, relayer_url=DEFAULT_RELAYER_URL) {
    // prepare POST
    const body = {
        data: toHex(data)
    }

    // send request to relayer
    const res = await fetch(
        `${relayer_url}/hash`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        },
    )
    if (res.status === 200) {
        let json = await res.json()
        return json.hash
    } else {
        throw Error("Withdraw request returned a non 200 status code.")
    }
}

/**
 * Utility function to approve a token contract
 */
 export function sendTokenApproval (amount, tokenContract, lamnadoContract, resultsTracker, callback) {
    let lamdenNetworkInfo = get(lamdenNetwork)
    console.log('Amount: '+amount.toString())
    console.log('Token Contract: '+tokenContract)
    console.log('Lamnado Contract: '+lamnadoContract)
    const txInfo = {
        networkType: lamdenNetworkInfo.networkType,
        contractName: tokenContract,
        methodName: 'approve',
        kwargs: {
            amount: { __fixed__: amount.toString() },
            to: lamnadoContract,
        },
        stampLimit: lamdenNetworkInfo.stamps.approval,
    }

    sendTransaction(txInfo, resultsTracker, callback)
}


/** Return state for smart contract */
export async function checkContractState(contract, variableName, keys, default_value) {
    let lamdenNetworkInfo = get(lamdenNetwork)
    try {
        let url = `${lamdenNetworkInfo.apiLink}/current/one/${contract}/${variableName}`;
        if (keys.length > 0) {
            url = `${url}?key=${keys.join(':')}`
        }
        const res = await fetch(
            url, {
                method: 'GET',
            },
        )
        if (res.status === 200) {
            let json = await res.json()
            let value = json.value
            if (value) {
                if (value.__fixed__) return new BN(value.__fixed__)
                else return value
            } else {
                return default_value
            }
        } else {
            return default_value
        }
    } catch (error) {
        return default_value;
    }
}