
export const mainnet = {
    lamden: {
        apiLink: "https://blocks.gammaphi.io",
        blockexplorer: "https://www.tauhq.com",
        blockexplorer_tx: "transactions",
        blockexplorer_address: "addresses",
        wallet_install_url: "https://chrome.google.com/webstore/detail/lamden-wallet-browser-ext/fhfffofbcgbjjojdnpcfompojdjjhdim",
        networkName: "Lamden Mainnet",
        network_symbol: "TAU",
        currentStampRatio: 65,
        networkType: "mainnet",
        lamnado_contracts: {
            currency: {
                100: 'con_lamnado_currency_100_v1',
                1000: 'con_lamnado_currency_1000_v1',
                10000: 'con_lamnado_currency_10000_v1',
                100000: 'con_lamnado_currency_100000_v1',
            },
            phi: {
                1000: 'con_lamnado_phi_1000_v1',
                10000: 'con_lamnado_phi_10000_v1',
                100000: 'con_lamnado_phi_100000_v1',
                1000000: 'con_lamnado_phi_1000000_v1',
            }
        },
        games: {
            coinFlip: {
                networkType: "mainnet",
                contractName: "con_gamma_phi_house_v2",
            },
            lottery: {
                networkType: "mainnet",
                contractName: "con_gamma_phi_lottery_v2",
            },
            wheelSpin: {
                networkType: "mainnet",
                contractName: "con_gamma_phi_house_v2",
            },
            diceRoll: {
                networkType: "mainnet",
                contractName: "con_gamma_phi_house_v2",
            },
            poker: {
                networkType: "mainnet",
                contractName: "con_poker_card_games_v4"
            },
            board: {
                networkType: "mainnet",
                contractName: "con_game_manager_v1"
            }
        },
        dao: {
            networkType: "mainnet",
            contractName: "con_gamma_phi_dao_v1",
            actions: {
                sports_betting: "con_sports_betting_event_action_v3"
            }
        },
        profile: {
            networkType: "mainnet",
            contractName: "con_gamma_phi_profile_v5",
        },
        messenger: {
            networkType: "mainnet",
            contractName: "con_gamma_phi_messenger_v1",
        },
        coins: {
            phi: {
                networkType: "mainnet",
                contractName: "con_phi_lst001",
            },
            phi_old: {
                networkType: "mainnet",
                contractName: "con_phi",
            }
        },
        redeem: {
            networkType: "mainnet",
            contractName: "con_gamma_phi_upgrade_v1",
        },
        purchase: {
            networkType: "mainnet",
            contractName: "con_gamma_phi_sales_v4",
        },
        app: {
            appName: "Gamma Phi", // Your DAPPS's name
            version: "1.0.2", // any version to start, increment later versions to update connection info
            logo: "/static/favicon.png", // or whatever the location of your logo
            background: "/static/wallet/background.jpg", // or whatever the location of your logo
            contractName: "con_gamma_phi_house_v2", // Will never change
            networkType: "mainnet", // other option is 'mainnet' 
        },
        stamps: {
            burn: 200,
            approval: 200,
            transfer: 500,
            coinFlip: 1000,
            wheelSpin: 1000,
            diceRoll: 1000,
            lottery: 1000,
            purchase: 500,
            redeem: 500,
            profile: 1000,
            poker: 2000,
            messenger: 1000,
            board: 2000,
            lamnado_deposit: 2000,
            add_event: 1000,
            place_bet: 1000,
        }
    }
}

export const testnet = {
    lamden: {
        apiLink: "https://testnet.lamden.io/api",
        blockexplorer: "https://testnet.lamden.io",
        blockexplorer_tx: "transactions",
        blockexplorer_address: "addresses",
        networkType: "testnet",
        wallet_install_url: "https://chrome.google.com/webstore/detail/lamden-wallet-browser-ext/fhfffofbcgbjjojdnpcfompojdjjhdim",
        lamnado_contracts: {
            currency: {
                100: 'con_lamnado_currency_100_v1',
                1000: 'con_lamnado_currency_1000_v1',
                10000: 'con_lamnado_currency_10000_v1',
                100000: 'con_lamnado_currency_100000_v1',
            },
            phi: {
                1000: 'con_lamnado_phi_1000_v1',
                10000: 'con_lamnado_phi_10000_v1',
                100000: 'con_lamnado_phi_100000_v1',
                1000000: 'con_lamnado_phi_1000000_v1',
            }
        },
        games: {
            coinFlip: {
                networkType: "testnet",
                contractName: "con_gamma_phi_house_v2",
            },
            lottery: {
                networkType: "testnet",
                contractName: "con_gamma_phi_lottery_v2",
            },
            wheelSpin: {
                networkType: "testnet",
                contractName: "con_gamma_phi_house_v2",
            },
            diceRoll: {
                networkType: "testnet",
                contractName: "con_gamma_phi_house_v2",
            },
            poker: {
                networkType: "testnet",
                contractName: "con_poker_card_games_v4"
            },
            board: {
                networkType: "testnet",
                contractName: "con_game_manager_v1"
            },
        },
        dao: {
            networkType: "testnet",
            contractName: "con_gamma_phi_dao"
        },
        profile: {
            networkType: "testnet",
            contractName: "con_gamma_phi_profile_v5",
        },
        messenger: {
            networkType: "testnet",
            contractName: "con_gamma_phi_messenger_v1",
        },
        purchase: {
            networkType: "testnet",
            contractName: "con_gamma_phi_sales_v4",
        },
        redeem: {
            networkType: "testnet",
            contractName: "con_gamma_phi_upgrade_v1",
        },
        coins: {
            phi: {
                networkType: "testnet",
                contractName: "con_phi_lst001",
            },
            phi_old: {
                networkType: "testnet",
                contractName: "con_phi",
            }
        },
        app: {
            appName: "Gamma Phi", // Your DAPPS's name
            version: "1.0.2", // any version to start, increment later versions to update connection info
            logo: "/static/favicon.png", // or whatever the location of your logo
            background: "/static/wallet/background.jpg", // or whatever the location of your logo
            contractName: "con_gamma_phi_house_v2", // Will never change
            networkType: "testnet", // other option is 'mainnet' 
        },
        networkName: "Lamden Testnet",
        network_symbol: "DTAU",
        currentStampRatio: 13,
        stamps: {
            burn: 200,
            approval: 200,
            coinFlip: 1000,
            wheelSpin: 1000,
            diceRoll: 1000,
            lottery: 1000,
            purchase: 500,
            redeem: 500,
            transfer: 500,
            profile: 1000,
            poker: 2000,
            messenger: 1000,
            board: 2000,
            lamnado_deposit: 2000,
            add_event: 1000,
            place_bet: 1000,
        }
    }
}