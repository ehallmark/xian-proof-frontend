import BN from 'bignumber.js'
import { get } from "svelte/store";
import { lamdenNetwork  } from '../stores/globalStores'
import { lamden_vk, walletSelector, lamdenCurrencyBalance, lwc, lamdenTokenApprovalAmount } from '../stores/lamdenStores'
import { TransactionResultHandler } from '../js/lamdenTxResultsHandler'

export const LAMDEN_MOBILE_WALLET_URL = "https://lamdenwallet.com";


export async function checkPokerContractState(variableName, keys, default_value) {
    let lamdenNetworkInfo = get(lamdenNetwork)
    let contract = lamdenNetworkInfo.games.poker.contractName;
    if (get(lamden_vk)===null) {
        return default_value;
    }
    try {
        const res = await fetch(
            `${lamdenNetworkInfo.apiLink}/current/one/${contract}/${variableName}/${keys.join(':')}`, {
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

export async function checkMessageContractState(variableName, keys, default_value) {
    let lamdenNetworkInfo = get(lamdenNetwork)
    let contract = lamdenNetworkInfo.messenger.contractName;
    try {
        const res = await fetch(
            `${lamdenNetworkInfo.apiLink}/current/one/${contract}/${variableName}/${keys.join(':')}`, {
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

export async function checkBoardGameContractState(variableName, keys, default_value) {
    let lamdenNetworkInfo = get(lamdenNetwork)
    let contract = lamdenNetworkInfo.games.board.contractName;
    try {
        const res = await fetch(
            `${lamdenNetworkInfo.apiLink}/current/one/${contract}/${variableName}/${keys.join(':')}`, {
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

export async function checkContractVariable(contract, variableName) {
    let lamdenNetworkInfo = get(lamdenNetwork)
    try {
        const res = await fetch(
            `${lamdenNetworkInfo.apiLink}/current/one/${contract}/${variableName}`, {
                method: 'GET',
            },
        )
        return await getValueFromResponse(res)
    } catch (error) {
        return new BN(0)
    }
}

export async function checkLotteryTotal() {
    let lamdenNetworkInfo = get(lamdenNetwork)
    try {
        const res = await fetch(
            `${lamdenNetworkInfo.apiLink}/current/one/${lamdenNetworkInfo.games.lottery.contractName}/total`, {
                method: 'GET',
            },
        )
        return await getValueFromResponse(res)
    } catch (error) {
        return new BN(0)
    }
}

export async function getLotteryBalance() {
    let lamdenNetworkInfo = get(lamdenNetwork)
    let vk = get(lamden_vk)
    try {
        const res = await fetch(
            `${lamdenNetworkInfo.apiLink}/current/one/${lamdenNetworkInfo.games.lottery.contractName}/balances/${vk}`, {
                method: 'GET',
            },
        )
        return await getValueFromResponse(res)
    } catch (error) {
        return new BN(0)
    }
}

export async function checkTokenBalance(token) {
    let lamdenNetworkInfo = get(lamdenNetwork)
    let vk = get(lamden_vk)
    try {
        const res = await fetch(
            `${lamdenNetworkInfo.apiLink}/current/one/${lamdenNetworkInfo.coins[token].contractName}/balances/${vk}`, {
                method: 'GET',
            },
        )
        return await getValueFromResponse(res)
    } catch (error) {
        return new BN(0)
    }
}

export async function checkTokenApprovedBalance(token, contract) {
    let lamdenNetworkInfo = get(lamdenNetwork)
    let contractName = lamdenNetworkInfo.games[contract].contractName;
    let vk = get(lamden_vk)
    try {
        const res = await fetch(
            `${lamdenNetworkInfo.apiLink}/current/one/${lamdenNetworkInfo.coins[token].contractName}/balances/${vk}:${contractName}`, {
                method: 'GET',
            },
        )
        return await getValueFromResponse(res)
    } catch (error) {
        return new BN(0)
    }
}

export async function checkHousePHIBalance() {
    let lamdenNetworkInfo = get(lamdenNetwork)
    try {
        const res = await fetch(
            `${lamdenNetworkInfo.apiLink}/current/one/${lamdenNetworkInfo.coins.phi.contractName}/balances/${lamdenNetworkInfo.games.coinFlip.contractName}`, {
                method: 'GET',
            },
        )
        return await getValueFromResponse(res)
    } catch (error) {
        return new BN(0)
    }
}

export async function checkLamdenBalance() {
    let lamdenNetworkInfo = get(lamdenNetwork)
    let vk = get(lamden_vk)
    try {
        const res = await fetch(
            `${lamdenNetworkInfo.apiLink}/current/one/currency/balances/${vk}`, {
                method: 'GET',
            },
        )
        return await getValueFromResponse(res)
    } catch (error) {
        console.log({error})
        return new BN(0)
    }
}

export function sendTransaction(txInfo, resultsTracker, callback) {
    let walletController = get(lwc)
    walletController.sendTransaction(
        txInfo, 
        (txResults) => handleTxResults(txResults, resultsTracker, callback)
    )
}

export function sendPhiPurchaseApproval (amount, resultsTracker, callback){
    let lamdenNetworkInfo = get(lamdenNetwork)
    const txInfo = {
        networkType: lamdenNetworkInfo.purchase.networkType,
        contractName: 'currency',
        methodName: 'approve',
        kwargs: {
            amount: { __fixed__: amount.toString() },
            to: lamdenNetworkInfo.purchase.contractName,
        },
        stampLimit: lamdenNetworkInfo.stamps.approval,
    }

    sendTransaction(txInfo, resultsTracker, callback)
}

export function sendPhiPurchase (amount, round, resultsTracker, callback){
    let lamdenNetworkInfo = get(lamdenNetwork)
    let method = (round === 1) ? 'purchase_round_1' : 'purchase_round_2';
    const txInfo = {
        networkType: lamdenNetworkInfo.purchase.networkType,
        contractName: lamdenNetworkInfo.purchase.contractName,
        methodName: method,
        kwargs: {
            amount_tau: { __fixed__: amount.toString() }
        },
        stampLimit: lamdenNetworkInfo.stamps.purchase,
    }

    sendTransaction(txInfo, resultsTracker, callback)
}


export function sendCoinFlip (amount, odds, resultsTracker, callback){
    let lamdenNetworkInfo = get(lamdenNetwork)

    const txInfo = {
        networkType: lamdenNetworkInfo.games.coinFlip.networkType,
        contractName: lamdenNetworkInfo.games.coinFlip.contractName,
        methodName: 'flip_phi',
        kwargs: {
            amount: { __fixed__: amount.toString() },
            odds: { __fixed__: odds.toString() },
        },
        stampLimit: lamdenNetworkInfo.stamps.coinFlip,
    }

    sendTransaction(txInfo, resultsTracker, callback)
}

export function sendPokerTransaction (method, kwargs, resultsTracker, callback){
    let lamdenNetworkInfo = get(lamdenNetwork)

    const txInfo = {
        networkType: lamdenNetworkInfo.games.poker.networkType,
        contractName: lamdenNetworkInfo.games.poker.contractName,
        methodName: method,
        kwargs: kwargs,
        stampLimit: lamdenNetworkInfo.stamps.poker,
    }

    sendTransaction(txInfo, resultsTracker, callback)
}

export function sendBoardGameTransaction (action, payload, resultsTracker, callback){
    let lamdenNetworkInfo = get(lamdenNetwork)

    const txInfo = {
        networkType: lamdenNetworkInfo.games.board.networkType,
        contractName: lamdenNetworkInfo.games.board.contractName,
        methodName: 'interact',
        kwargs: {
            action: action,
            payload: payload
        },
        stampLimit: lamdenNetworkInfo.stamps.board,
    }

    sendTransaction(txInfo, resultsTracker, callback)
}

export function sendProfileAction (action, payload, resultsTracker, callback) {
    let lamdenNetworkInfo = get(lamdenNetwork)

    const txInfo = {
        networkType: lamdenNetworkInfo.profile.networkType,
        contractName: lamdenNetworkInfo.profile.contractName,
        methodName: 'interact',
        kwargs: {
            action: action,
            payload: payload
        },
        stampLimit: lamdenNetworkInfo.stamps.profile,
    }

    sendTransaction(txInfo, resultsTracker, callback)
}


export function sendDaoAction (action, payload, resultsTracker, callback) {
    let lamdenNetworkInfo = get(lamdenNetwork)

    const txInfo = {
        networkType: lamdenNetworkInfo.dao.networkType,
        contractName: lamdenNetworkInfo.dao.contractName,
        methodName: 'interact',
        kwargs: {
            action: action,
            payload: payload
        },
        stampLimit: lamdenNetworkInfo.stamps[payload.function],
    }
    console.log("Sending action "+action);
    sendTransaction(txInfo, resultsTracker, callback)
}


export async function getSportsBettingContract() {
    let lamdenNetworkInfo = get(lamdenNetwork)
    return await checkContractState(
        lamdenNetworkInfo.dao.contractName, 'actions', ['sports_betting'], lamdenNetworkInfo.dao.actions.sports_betting
    )
}


export function sendTokenApproval (amount, tokenContract, contract, resultsTracker, callback) {
    let lamdenNetworkInfo = get(lamdenNetwork)
    console.log('Amount: '+amount.toString())
    console.log('Token Contract: '+tokenContract)
    console.log('Contract: '+contract)
    const txInfo = {
        networkType: lamdenNetworkInfo.networkType,
        contractName: tokenContract,
        methodName: 'approve',
        kwargs: {
            amount: { __fixed__: amount.toString() },
            to: contract,
        },
        stampLimit: lamdenNetworkInfo.stamps.approval,
    }

    sendTransaction(txInfo, resultsTracker, callback)
}


export function sendMessageTo (message, to, resultsTracker, callback){
    let lamdenNetworkInfo = get(lamdenNetwork)

    const txInfo = {
        networkType: lamdenNetworkInfo.messenger.networkType,
        contractName: lamdenNetworkInfo.messenger.contractName,
        methodName: 'send_message',
        kwargs: {
            to: to,
            message: message
        },
        stampLimit: lamdenNetworkInfo.stamps.messenger,
    }

    sendTransaction(txInfo, resultsTracker, callback)
}

export async function getChannelUsers (channelName, default_value=null) {
    let lamdenNetworkInfo = get(lamdenNetwork)
    try {
        const res = await fetch(
            `${lamdenNetworkInfo.apiLink}/current/one/${lamdenNetworkInfo.profile.contractName}/channels/${channelName}:users`, {
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

export async function hydrateProfile (key, default_value=null) {
    let vk = get(lamden_vk)
    let lamdenNetworkInfo = get(lamdenNetwork)
    try {
        const res = await fetch(
            `${lamdenNetworkInfo.apiLink}/current/one/${lamdenNetworkInfo.profile.contractName}/metadata/${vk}:${key}`, {
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


export async function hydrateProfileForAddress(vk, key, default_value=null) {
    let lamdenNetworkInfo = get(lamdenNetwork)
    try {
        const res = await fetch(
            `${lamdenNetworkInfo.apiLink}/current/one/${lamdenNetworkInfo.profile.contractName}/metadata/${vk}:${key}`, {
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

export async function getAddressForUsername(username, default_value=null) {
    let lamdenNetworkInfo = get(lamdenNetwork)
    try {
        const res = await fetch(
            `${lamdenNetworkInfo.apiLink}/current/one/${lamdenNetworkInfo.profile.contractName}/usernames/${username}`, {
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

export function sendRedeemApproval (amount, resultsTracker, callback){
    let lamdenNetworkInfo = get(lamdenNetwork)

    const txInfo = {
        networkType: lamdenNetworkInfo.redeem.networkType,
        contractName: lamdenNetworkInfo.coins.phi_old.contractName,
        methodName: 'approve',
        kwargs: {
            amount: { __fixed__: amount.toString() },
            to: lamdenNetworkInfo.redeem.contractName,
        },
        stampLimit: lamdenNetworkInfo.stamps.approval,
    }

    sendTransaction(txInfo, resultsTracker, callback)
}

export function sendRedeem (resultsTracker, callback){
    let lamdenNetworkInfo = get(lamdenNetwork)

    const txInfo = {
        networkType: lamdenNetworkInfo.redeem.networkType,
        contractName: lamdenNetworkInfo.redeem.contractName,
        methodName: 'redeem_phi',
        kwargs: {},
        stampLimit: lamdenNetworkInfo.stamps.redeem,
    }

    sendTransaction(txInfo, resultsTracker, callback)
}


export function sendDiceRoll (amount, resultsTracker, callback){
    let lamdenNetworkInfo = get(lamdenNetwork)

    const txInfo = {
        networkType: lamdenNetworkInfo.games.diceRoll.networkType,
        contractName: lamdenNetworkInfo.games.diceRoll.contractName,
        methodName: 'roll_dice',
        kwargs: {
            amount: { __fixed__: amount.toString() },
        },
        stampLimit: lamdenNetworkInfo.stamps.diceRoll,
    }

    sendTransaction(txInfo, resultsTracker, callback)
}

export function sendLotteryApproval (amount, resultsTracker, callback){
    let lamdenNetworkInfo = get(lamdenNetwork)

    const txInfo = {
        networkType: lamdenNetworkInfo.games.lottery.networkType,
        contractName: lamdenNetworkInfo.coins.phi.contractName,
        methodName: 'approve',
        kwargs: {
            amount: { __fixed__: amount.toString() },
            to: lamdenNetworkInfo.games.lottery.contractName,
        },
        stampLimit: lamdenNetworkInfo.stamps.approval,
    }

    sendTransaction(txInfo, resultsTracker, callback)
}

export function sendLottery (amount, resultsTracker, callback){
    let lamdenNetworkInfo = get(lamdenNetwork)

    const txInfo = {
        networkType: lamdenNetworkInfo.games.lottery.networkType,
        contractName: lamdenNetworkInfo.games.lottery.contractName,
        methodName: 'deposit_phi',
        kwargs: {
            amount: parseInt(amount, 10)
        },
        stampLimit: lamdenNetworkInfo.stamps.lottery,
    }

    sendTransaction(txInfo, resultsTracker, callback)
}

export function sendHouseApproval (amount, resultsTracker, callback){
    let lamdenNetworkInfo = get(lamdenNetwork)

    const txInfo = {
        networkType: lamdenNetworkInfo.app.networkType,
        contractName: lamdenNetworkInfo.coins.phi.contractName,
        methodName: 'approve',
        kwargs: {
            amount: { __fixed__: amount.toString() },
            to: lamdenNetworkInfo.app.contractName,
        },
        stampLimit: lamdenNetworkInfo.stamps.approval,
    }

    sendTransaction(txInfo, resultsTracker, callback)
}

export function sendPokerPHIApproval (amount, resultsTracker, callback){
    let lamdenNetworkInfo = get(lamdenNetwork)

    const txInfo = {
        networkType: lamdenNetworkInfo.app.networkType,
        contractName: lamdenNetworkInfo.coins.phi.contractName,
        methodName: 'approve',
        kwargs: {
            amount: { __fixed__: amount.toString() },
            to: lamdenNetworkInfo.games.poker.contractName,
        },
        stampLimit: lamdenNetworkInfo.stamps.approval,
    }

    sendTransaction(txInfo, resultsTracker, callback)
}

export function sendBoardGameApproval (amount, resultsTracker, callback){
    let lamdenNetworkInfo = get(lamdenNetwork)

    const txInfo = {
        networkType: lamdenNetworkInfo.app.networkType,
        contractName: lamdenNetworkInfo.coins.phi.contractName,
        methodName: 'approve',
        kwargs: {
            amount: { __fixed__: amount.toString() },
            to: lamdenNetworkInfo.games.board.contractName,
        },
        stampLimit: lamdenNetworkInfo.stamps.approval,
    }

    sendTransaction(txInfo, resultsTracker, callback)
}

export function sendPHI (amount, to, resultsTracker, callback){
    let lamdenNetworkInfo = get(lamdenNetwork)

    const txInfo = {
        networkType: lamdenNetworkInfo.app.networkType,
        contractName: lamdenNetworkInfo.coins.phi.contractName,
        methodName: 'transfer',
        kwargs: {
            amount: { __fixed__: amount.toString() },
            to: to,
        },
        stampLimit: lamdenNetworkInfo.stamps.transfer,
    }

    sendTransaction(txInfo, resultsTracker, callback)
}

export function sendWheelSpin (amount, resultsTracker, callback){
    let lamdenNetworkInfo = get(lamdenNetwork)

    const txInfo = {
        networkType: lamdenNetworkInfo.games.wheelSpin.networkType,
        contractName: lamdenNetworkInfo.games.wheelSpin.contractName,
        methodName: 'spin_wheel',
        kwargs: {
            amount: { __fixed__: amount.toString() },
        },
        stampLimit: lamdenNetworkInfo.stamps.wheelSpin,
    }

    sendTransaction(txInfo, resultsTracker, callback)
}

function handleTxResults(txResults, resultsTracker, callback){
    if (!txResults.data) 
        resultsTracker.set({loading:false, errors: ["Transaction result unavailable."]})
    else {
        console.log('raw transaction')
        console.log(txResults)
        txResults = txResults.data
        let lamdenTxResultsHandler = TransactionResultHandler()
        lamdenTxResultsHandler.parseTxResult(txResults, resultsTracker, callback)
    }
}


async function getValueFromResponse(res){
    if (res.status === 200) {
        let json = await res.json()
        let value = json.value
        if (value) {
            if (value.__fixed__) return new BN(value.__fixed__)
            else return new BN(value)
        } else {
            return new BN(0)
        }
    } else {
        return new BN(0)
    }
}


function hasEnoughTauToSendTx(txName){
    let lamdenNetworkInfo = get(lamdenNetwork)
    let currencyBalance = get(lamdenCurrencyBalance)
    return currencyBalance.isGreaterThan(lamdenNetworkInfo.stamps[txName] / lamdenNetworkInfo.currentStampRatio)
}


/** Return state for smart contract */
export async function checkContractState(contract, variableName, keys, default_value) {
    let lamdenNetworkInfo = get(lamdenNetwork)
    try {
        let url = `${lamdenNetworkInfo.apiLink}/current/one/${contract}/${variableName}`;
        if (keys.length > 0) {
            url = `${url}/${keys.join(':')}`
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