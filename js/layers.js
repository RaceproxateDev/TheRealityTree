addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new ExpantaNum(0),
    }},
    color: "#00fbff",
    requires: new ExpantaNum(10), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        if (hasUpgrade("p", 16)) mult = mult.times(2)
        if (hasUpgrade("p", 17)) mult = mult.times(10)
        if (hasUpgrade("p", 19)) mult = mult.pow(1.1)
        if (hasUpgrade("pos", 14)) mult = mult.times(tmp.pos.effect)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new ExpantaNum(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},

    upgrades: {
        11: {
            title: "Initiating",
            description: "1.5x Points",
            cost: new ExpantaNum(1),
        },

        12: {
            title: "Better Points!",
            description: "2x Points!",
            cost: new ExpantaNum(3),
            unlocked() { return hasUpgrade("p", 11) },
        },

        13: {
            title: "Expansion",
            description: "Unlock Prestige buyables",
            cost: new ExpantaNum(5),
            unlocked() { return hasUpgrade("p", 12) },
        },

        14: {
            title: "Pointy",
            description: "5x Points",
            cost: new ExpantaNum(10),
            unlocked() { return hasUpgrade("p", 13) },
        },

        15: {
            title: "Synergial I",
            description: "Points boost themselves",
            cost: new ExpantaNum(20),
            unlocked() { return hasUpgrade("p", 14) },

            effect() {
                return player.points.add(1).pow(0.15)
            },

            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id))+"x"
            }
        },

        16: {
            title: "Helping...",
            description: "2x Prestige points",
            cost: new ExpantaNum(40),
            unlocked() { return hasUpgrade("p", 15) },
        },

        17: {
            title: "getting there",
            description: "10x Points and Prestige points",
            cost: new ExpantaNum(100),
            unlocked() { return hasUpgrade("p", 16) },
        },

        18: {
            title: "almost.",
            description: "Prestige Points boost point gain",
            cost: new ExpantaNum(10000),
            unlocked() { return hasUpgrade("p", 17) },

            effect() {
                return player[this.layer].points.add(1).pow(0.2)
            },

            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id))+"x"
            }
        },

        19: {
            title: "More prestige",
            description: "^1.1 Prestige Points",
            cost: new ExpantaNum(20000),
            unlocked() {return hasUpgrade("p", 18)},
        },

        21: {
            title: "Something new!^2",
            description: "Unlock Positivity",
            cost: new ExpantaNum(50000),
            unlocked() {return hasUpgrade("p", 19)},
        }
    },

    tabFormat: {
        "Main": {
            content: ["main-display", "prestige-button", "blank", [
                "display-text", function() {
                  return `You have ${format(player.points)} Points`
                }
            ],"blank","upgrades"]
        },

        "Buyables": {
            content: ["main-display", "buyables"],
            unlocked() { return hasUpgrade("p", 13) }
        }
    },

    buyables: {
        11: {
            title: "Points booster",
            cost(x) { return new ExpantaNum(10).pow(ExpantaNum.add(1, x))},
            display() { return `1.5x Points <br> Level: ${format(getBuyableAmount(this.layer, this.id))} <br> Cost: ${format(this.cost())} Prestige Points` },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
               player[this.layer].points = player[this.layer].points.sub(this.cost())
               setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },

            purchaseLimit: new ExpantaNum(999),
        }
    }
})

addLayer("pos", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new ExpantaNum(0),             // "points" is the internal name for the main resource of the layer.
    }},

    color: "#00aaff",                       // The color for this layer, which affects many elements.
    resource: "positivity points",            // The name of this layer's main prestige resource.
    row: 0,                                 // The row this layer is on (0 is the first row).
    symbol: "Pos",

    baseResource: "points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.

    requires: new ExpantaNum(10),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        let mult = new ExpantaNum(1)               // Factor in any bonuses multiplying gain here.
        if (hasUpgrade("pos", 11)) mult = mult.times(1.5)
        if (hasUpgrade("pos", 12)) mult = mult.times(3)
        if (hasUpgrade("pos", 13)) mult = mult.times(2)
        if (hasUpgrade("pos", 15)) mult = mult.times(upgradeEffect("pos", 15))
        if (hasUpgrade("pos", 17)) mult = mult.times(5)
        if (hasUpgrade("pos", 17)) mult = mult.times(tmp.pos.effect)
        if (hasUpgrade("pos", 18)) mult = mult.times(4)
        return mult
    },
    gainExp() {                             // Returns your exponent to your gain of the prestige resource.
        return new ExpantaNum(1)
    },

    layerShown() { return hasUpgrade("p", 21) },          // Returns a bool for if this layer's node should be visible in the tree.

    tabFormat: {
        "Main": {
            content: [
                "main-display", "upgrades",
            ]
        }
    },

    branches: ["p"],

    passiveGeneration() {
        let p = new ExpantaNum(0)
        if (hasUpgrade("p", 21)) p = p.add(1)
        return p
    },

    effect() {
        let base = new ExpantaNum(1)
        let exp = new ExpantaNum(0.25)
        if (hasUpgrade("pos", 13)) exp = exp.add(0.05)
        if (hasUpgrade("pos", 16)) exp = exp.add(0.1)
        if (hasUpgrade("pos", 17)) exp = exp.sub(0.05)
        return player[this.layer].points.add(base).pow(exp)
    },

    effectDescription() {
        return `wich are boosting your point gain by ${format(tmp[this.layer].effect)}`
    },

    upgrades: {
        11: {
            title: "Feeling fine",
            description: "1.5x Positivity and Points",
            cost: new ExpantaNum(20),
        },

        12: {
            title: "Getting good",
            description: "3x Positivity",
            cost: new ExpantaNum(50),
            unlocked() {return hasUpgrade("pos", 11)}
        },

        13: {
            title: "Great Positivity",
            description: "2x Positivity and +^0.05 positivity effect",
            cost: new ExpantaNum(100),
            unlocked() {return hasUpgrade("pos", 12)}
        },

        14: {
            title: "Great Day",
            description: "Prestige is affected by positivity boost too",
            cost: new ExpantaNum(300),
            unlocked() {return hasUpgrade("pos", 13)},
        },

        15: {
            title: "Synergism II",
            description: "Positivity boosts itself",
            cost: new ExpantaNum(400),
            unlocked() {return hasUpgrade("pos", 14)},

            effect() {
                return player[this.layer].points.add(1).pow(0.2)
            },

            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id))+"x"
            },
        },

        16: {
            title: "Great Points",
            description: "3x Points also +^0.1 to positivity effect",
            cost: new ExpantaNum(1000),
            unlocked() {return hasUpgrade("pos", 15)},
        },

        17: {
            title: "not enough",
            description: "5x Positivity, also positivity is affected by his boost but -^0.05 positivity effect",
            cost: new ExpantaNum(1300),
            unlocked() {return hasUpgrade("pos", 16)},
        },

        18: {
            title: "Excited",
            description: "4x Positivity and ^1.1 Points",
            cost: new ExpantaNum(1e6),
            unlocked() {return hasUpgrade("pos", 17)},
        },

        19: {
            title: ":(",
            description: "Unlock Negativity",
            cost: new ExpantaNum(1e8),
            unlocked() {return hasUpgrade("pos", 18)},
        }
    }
})

addLayer("neg", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new ExpantaNum(0),             // "points" is the internal name for the main resource of the layer.
        cap: new ExpantaNum(1e6),
    }},

    color: "#ff0000",                       // The color for this layer, which affects many elements.
    resource: "negativity points",            // The name of this layer's main prestige resource.
    row: 0,                                 // The row this layer is on (0 is the first row).

    baseResource: "points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.

    requires: new ExpantaNum(10),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        let mult = new ExpantaNum(1)               // Factor in any bonuses multiplying gain here.
        return mult
    },
    gainExp() {                             // Returns your exponent to your gain of the prestige resource.
        return new ExpantaNum(1)
    },

    layerShown() { return hasUpgrade("pos", 19) },          // Returns a bool for if this layer's node should be visible in the tree.

    tabFormat: {
        "Main": {
            content: ["main-display", ["display-text", function() {
                return `Your negativity cap is <h3 style="color: red;"> ${format(player[this.layer].cap)} </h3>`
            }]]
        }
    },

    passiveGeneration() {
        let p = new ExpantaNum(0)
        if (hasUpgrade("pos", 19)) p = p.add(1)

        if (player.neg.points.gte(player.neg.cap)) {
            player.neg.points = player.neg.cap
            p = new ExpantaNum(0)
        } else {
            p = new ExpantaNum(p)
        }

        return p
    },

    UpdateNegCap() {
        let cap = new ExpantaNum(1e6)

        player.neg.cap = cap
        return cap
    },

    branches: ["pos"],

    upgrades: {},

    effect() {
        let base = new ExpantaNum(1)
        let exp = new ExpantaNum(0.4)

        return player[this.layer].points.add(base).pow(exp)
    },

    effectDescription() {
        return `wich are dividing your point gain by ${format(tmp[this.layer].effect)}`
    },
})
