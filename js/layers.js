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
        if (hasMilestone("eq", 0)) mult = mult.times(3)
        if (hasUpgrade("real", 32)) mult = mult.times(5)
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
            purchaseLimit: new ExpantaNum(500),
            cost(x) { return new ExpantaNum(10).pow(ExpantaNum.add(1, x))},
            display() { return `1.5x Points <br> Level: ${format(getBuyableAmount(this.layer, this.id))} <br> Cost: ${format(this.cost())} Prestige Points` },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
               if (!this.canAfford()) return;
               if (getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit)) return;
               player[this.layer].points = player[this.layer].points.sub(this.cost())
               setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },

            buyMax() {
            
                if (hasMilestone("eq", 4)) {setInterval(this.buy(), 500)}
               
            },
        }
    },

    autoUpgrade() {
        return hasMilestone("eq", 0)
    },

    passiveGeneration() {
        let p = new ExpantaNum(0)
        if (hasMilestone("eq", 2)) p = p.add(0.1)
        if (hasUpgrade("real", 42)) p = p.add(1)
        return p
    },

    update(diff) {
        if (hasMilestone("eq", 4)) {
            for (let id in this.buyables) {
               if (this.buyables[id].buyMax) {
                   this.buyables[id].buyMax()
               }
            }
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
        if (hasUpgrade("pos", 11)) mult = mult.times(2)
        if (hasUpgrade("pos", 12)) mult = mult.times(3)
        if (hasUpgrade("pos", 13)) mult = mult.times(2)
        if (hasUpgrade("pos", 15)) mult = mult.times(upgradeEffect("pos", 15))
        if (hasUpgrade("pos", 17)) mult = mult.times(5)
        if (hasUpgrade("pos", 17)) mult = mult.times(tmp.pos.effect)
        if (hasUpgrade("pos", 18)) mult = mult.times(4)
        if (hasUpgrade("neg", 12)) mult = mult.div(5)
        if (hasUpgrade("neg", 16)) mult = mult.div(tmp.neg.effect)
        if (hasMilestone("eq", 1)) mult = mult.times(3)
        if (hasMilestone("eq", 3)) mult = mult.times(4)
        if (hasUpgrade("real", 51)) mult = mult.times(10)
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
        if (hasUpgrade("real", 52)) p = p.times(10)
        return p
    },

    effect() {
        let base = new ExpantaNum(1)
        let exp = new ExpantaNum(0.25)
        if (hasUpgrade("pos", 13)) exp = exp.add(0.05)
        if (hasUpgrade("pos", 16)) exp = exp.add(0.1)
        if (hasUpgrade("pos", 17)) exp = exp.sub(0.05)
        if (hasMilestone("eq", 1)) exp = exp.add(0.05)
        if (hasMilestone("eq", 3)) exp = exp.add(0.1)
        return player[this.layer].points.add(base).pow(exp)
    },

    effectDescription() {
        return `wich are boosting your point gain by ${format(tmp[this.layer].effect)}`
    },

    upgrades: {
        11: {
            title: "Feeling fine",
            description: "2x Positivity and 1.5x Points",
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
    },

    autoUpgrade() { return hasUpgrade("eq", 12) },
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
        if (hasUpgrade("neg", 11)) mult = mult.times(3)
        if (hasUpgrade("neg", 12)) mult = mult.times(upgradeEffect("neg", 12))
        if (hasUpgrade("neg", 13)) mult = mult.times(upgradeEffect("neg", 13))
        if (hasUpgrade("neg", 14)) mult = mult.times(5)
        if (hasUpgrade("neg", 15)) mult = mult.times(upgradeEffect("neg", 15))
        if (hasUpgrade("neg", 16)) mult = mult.pow(1.1)
        if (hasUpgrade("neg", 17)) mult = mult.times(10)
        if (hasMilestone("eq", 1)) mult = mult.times(3)
        if (hasMilestone("eq", 5)) mult = mult.times(2)
        if (hasMilestone("eq", 6)) mult = mult.times(5)
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
            }],"blank", "upgrades"]
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
        if (hasMilestone("eq", 3)) cap = cap.sub(500000)
        player.neg.cap = cap
        return cap
    },

    branches: ["pos"],

    upgrades: {
        11: {
            title: "Negative Upgrade",
            description: "3x Negativity",
            cost: new ExpantaNum(10),
        },

        12: {
            title: "Unpositivity",
            description: "Positivity boosts Negativity but /5 Positivity",
            cost: new ExpantaNum(50),
            unlocked() { return hasUpgrade("neg", 11) },

            effect() {
                return player.pos.points.add(1).pow(0.1)
            },

            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id))+"x"
            },
        },

        13: {
            title: "Very bad Prestige",
            description: "Prestige boosts negativity gain.",
            cost: new ExpantaNum(350),

            effect() {
                return player.p.points.div(1e10).pow(0.05).add(1)
            },

            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id))+"x"
            },

            unlocked() { return hasUpgrade("neg", 12) },
        },

        14: {
            title: "reduction",
            description: "5x Negativity, /10 Points",
            cost: new ExpantaNum(1000),
            unlocked() { return hasUpgrade("neg", 13) },
        },

        15: {
            title: "Synergism Negative",
            description: "Negativity boosts itself",
            cost: new ExpantaNum(10000),
            unlocked() { return hasUpgrade("neg", 14) },

            effect() {
                return player[this.layer].points.add(1).pow(0.1)
            },

            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id))+"x"
            },
        },

        16: {
            title: "Exponential",
            description: "^1.1 Points and Negativity, but positivity is affected by negativity effect",
            cost: new ExpantaNum(50000),
             unlocked() { return hasUpgrade("neg", 15) },
        },

        17: {
            title: "Final",
            description: "10x Negativity",
            cost: new ExpantaNum(85000),
            unlocked() { return hasUpgrade("neg", 16) },
        },

        18: {
            title: "???",
            description: "Unlock Equality",
            cost: new ExpantaNum(500000),
            unlocked() { return hasUpgrade("neg", 17) },
        }
    },

    effect() {
        let base = new ExpantaNum(1)
        let exp = new ExpantaNum(0.4)
        if (hasMilestone("eq", 2)) exp = exp.sub(0.3)
        if (hasUpgrade("real", 41)) exp = new ExpantaNum(0)
        return player[this.layer].points.add(base).pow(exp)
    },

    effectDescription() {
        return `wich are dividing your point gain by ${format(tmp[this.layer].effect)}`
    },

    autoUpgrade() {
        return hasUpgrade("eq", 17)
    }
})

addLayer("eq", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new ExpantaNum(0),             // "points" is the internal name for the main resource of the layer.
        power: new ExpantaNum(0),
        powerGain: new ExpantaNum(0),
    }},

    color: "#383838",                       // The color for this layer, which affects many elements.
    resource: "equality points",            // The name of this layer's main prestige resource.
    row: 1,                                 // The row this layer is on (0 is the first row).
    symbol: "=",

    baseResource: "points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.

    requires: new ExpantaNum(1e12),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "static",                         // Determines the formula used for calculating prestige currency.
    exponent() {
        let exp = new ExpantaNum(4)
        if (player[this.layer].points.gte(10)) exp = exp.add(0.5)
        if (player[this.layer].points.gte(20)) exp = exp.add(1)
        if (player[this.layer].points.gte(30)) exp = exp.add(3)
        return exp
    },


    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        let mult = new ExpantaNum(1)
        if (hasUpgrade("eq", 14)) mult = mult.div(2)
        return mult
    },
    gainExp() {                             // Returns your exponent to your gain of the prestige resource.
        return new ExpantaNum(1)
    },

    layerShown() { return hasUpgrade("neg", 18) || player.eq.unlocked },          // Returns a bool for if this layer's node should be visible in the tree.


    unlocked() { return hasUpgrade("neg", 18) },

    branches: ["p", "pos", "neg"],

    nodeStyle() {return {
        "width": "125px",
        "height": "125px",
        "font-size": "60px",
        }
    },

    milestones: {
        0: {
            requirementDescription: "1 Equality Point",
            effectDescription: "^1.15 Points, automate Prestige upgrades and 3x Prestige Points",
            done() { return player[this.layer].points.gte(1) },
        },

        1: {
            requirementDescription: "2 Equality Points",
            effectDescription: "3x Negativity and Positivity gain, also +^0.05 Positivity effect",
            done() { return player[this.layer].points.gte(2) },
        },

        2: {
            requirementDescription: "3 Equality Points",
            effectDescription: "^1.35 Points and passively generates 10% of Prestige per second, -^0.3 negative effect",
            done() { return player[this.layer].points.gte(3) },
        },

        3: {
            requirementDescription: "4 Equality Points",
            effectDescription: "^1.5 Points, 4x Positivity and decreases Negativity cap by -500,000, +^0.1 Positivity effect",
            done() { return player[this.layer].points.gte(4) },
        },

        4: {
            requirementDescription: "5 Equality Points",
            effectDescription: "Automate the Prestige buyables",
            done() { return player[this.layer].points.gte(5) },
        },

        5: {
            requirementDescription: "7 Equality Points",
            effectDescription: "^1.35 Points, 3x Points and 2x Negativity",
            done() { return player[this.layer].points.gte(7) },
        },

        6: {
            requirementDescription: "10 Equality Points",
            effectDescription: "1e1000x Points, 5x Negativity",
            done() { return player[this.layer].points.gte(10) },
        },

        7: {
            requirementDescription: "12 Equality Points",
            effectDescription: "^1.5 Points",
            done() { return player[this.layer].points.gte(12) },
        },

        8: {
            requirementDescription: "31 Equality Points",
            effectDescription: "Unlock Equality Power",
            done() { return player[this.layer].points.gte(31) },
        }
    },

    tabFormat: {
        "Main": {
            content: ["main-display", "prestige-button", "blank", [
                "display-text", function() {
                    return `You have ${format(player.points)} Points`
                }
            ], "blank", "milestones"]
        },

        "Equality Power": {
            content: [
                ["display-text", function() { return `You have ${format(player.eq.power)} Equality Power`}

                ],"blank" ,["clickable", 11], "blank","upgrades",
            ],
            unlocked() { return hasMilestone("eq", 8) },
        }
    },

    calcPowerGain() {
        let calc = new ExpantaNum(0)
        let pow = new ExpantaNum(0.5)
        let mult = new ExpantaNum(1)
        if (hasUpgrade("eq", 13)) mult = mult.times(1.1)
        if (hasUpgrade("eq", 15)) mult = mult.times(1.25)
        if (hasUpgrade("eq", 18)) mult = mult.times(1.5)
        if (hasUpgrade("real", 81)) mult = mult.times(2)
        if (hasUpgrade("real", 113)) mult = mult.times(2.5)
        calc = player[this.layer].points.div(31).pow(pow).times(mult)

        player[this.layer].powerGain = calc
        return calc
    },

    clickables: {
        11: {
            title: "Equality Power",
            display() { return `You will gain ${format(player[this.layer].powerGain)} Equality Power <br> Resets your Equality Points` },
            
            canClick() {
                return player[this.layer].powerGain.gte(1)
            },

            onClick() {
                player.eq.power = player.eq.power.add(player.eq.powerGain)
                player.eq.points = new ExpantaNum(0)
            },

            style: {
                "width": "200px",
                "border-radius": "5%",
                "font-size": "12px",
            }
        }
    },

    upgrades: {
        11: {
            title: "Faster Points",
            description: "^1.1 Points",
            currencyDisplayName: "Equality Power",
            currencyLayer: "eq",
            currencyInternalName: "power",
            cost: new ExpantaNum(1),
        },

        12: {
            title: "Auto I",
            description: "automate positivity upgrades",
            currencyDisplayName: "Equality Power",
            currencyLayer: "eq",
            currencyInternalName: "power",
            cost: new ExpantaNum(2),
            unlocked() { return hasUpgrade("eq", 11) },
        },

        13: {
            title: "31 Speedrun",
            description: "^1.45 Points and 1.1x Equality Power",
            currencyDisplayName: "Equality Power",
            currencyLayer: "eq",
            currencyInternalName: "power",
            cost: new ExpantaNum(2),
            unlocked() { return hasUpgrade("eq", 12) },
        },

        14: {
            title: "Lets speed",
            description: "<h3 style=`font-size: 35px;`>2x Equality Points</h3>",
            currencyDisplayName: "Equality Power",
            currencyLayer: "eq",
            currencyInternalName: "power",
            cost: new ExpantaNum(2),
            unlocked() { return hasUpgrade("eq", 13) },
        },

        15: {
            title: "Better powers",
            description: "1.25x Equality Power",
            currencyDisplayName: "Equality Power",
            currencyLayer: "eq",
            currencyInternalName: "power",
            cost: new ExpantaNum(3),
            unlocked() { return hasUpgrade("eq", 14) },
        },

        16: {
            title: "AutoEquality",
            description: "automatically reset for equality points",
            currencyDisplayName: "Equality Power",
            currencyLayer: "eq",
            currencyInternalName: "power",
            cost: new ExpantaNum(3),
            unlocked() { return hasUpgrade("eq", 15) },
        },

        17: {
            title: "QoL I",
            description: "Equality resets nothing, also automate negativity upgrades",
            currencyDisplayName: "Equality Power",
            currencyLayer: "eq",
            currencyInternalName: "power",
            cost: new ExpantaNum(5),
            unlocked() { return hasUpgrade("eq", 16) },
        },

        18: {
            title: "Power Increase",
            description: "1.5x Equality Power",
            currencyDisplayName: "Equality Power",
            currencyLayer: "eq",
            currencyInternalName: "power",
            cost: new ExpantaNum(10),
            unlocked() { return hasUpgrade("eq", 17) },
        },

        19: {
            title: "Its time...",
            description: "Unlock the next reset layer",
            currencyDisplayName: "Equality Power",
            currencyLayer: "eq",
            currencyInternalName: "power",
            cost: new ExpantaNum(30),
            unlocked() { return hasUpgrade("eq", 18) },
        },
    },

    autoPrestige() {
        return hasUpgrade("eq", 16)
    },

    resetsNothing() {
        return hasUpgrade("eq", 17)
    },

    doReset(eq) {
        if (layers[eq].row <= this.row && layers.eq.row != "side") return;
        let keep = []
        let keepMilestones = []

        if (hasUpgrade("real", 81)) keepMilestones.push(0, 1)
        if (hasUpgrade("real", 114)) keepMilestones.push(2, 3)
        if (hasUpgrade("real", 123)) keep.push("milestones")
        if (hasMilestone("real", 1)) keep.push("upgrades")

        layerDataReset(this.layer, keep)

        player[this.layer].milestones.push(...keepMilestones)
    }
})

addLayer("real", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new ExpantaNum(0),             // "points" is the internal name for the main resource of the layer.
        universes: new ExpantaNum(0),
        // Multiverses
        multiverses: new ExpantaNum(0),
        multiversesGain: new ExpantaNum(0),
        // Dark Matter
        darkMatter: new ExpantaNum(0),
        darkMatterGain: new ExpantaNum(0),
        darkMatterUnlocked: false,
        // Reality shift
        realityShiftUnlocked: false,
        realityShifts: new ExpantaNum(0),
        realityShiftReq: new ExpantaNum(3),
        realityShiftScale: new ExpantaNum(2),
    }},

    color: "purple",
    resource: "Reality Points",            // The name of this layer's main prestige resource.
    row: 2,                                 // The row this layer is on (0 is the first row).
    symbol: "R",

    baseResource: "Equality points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.eq.points },  // A function to return the current amount of baseResource.

    requires: new ExpantaNum(125),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.01,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        let mult = new ExpantaNum(1)
        if (hasMilestone("real", 2)) mult = mult.times(1.5)
        return mult
    },
    gainExp() {                             // Returns your exponent to your gain of the prestige resource.
        return new ExpantaNum(1)
    },

    unlocked() { return hasUpgrade("eq", 19) },

    layerShown() { return hasUpgrade("eq", 19) || player[this.layer].unlocked },          // Returns a bool for if this layer's node should be visible in the tree.
    
    nodeStyle() {return {
        "height": "200px",
        "width": "200px",
        "background-color": "purple",
    }},

    branches: ["eq"],

    tabFormat: {
        "Main": {
            content: ["main-display", "prestige-button", "blank", ["display-text", 
                function() { return `You have ${format(player.eq.points)} Equality points` }
             ], "blank", ["display-text", function() { return `You have <h3 style="color: purple;"> ${format(player[this.layer].universes)} </h3> universes`}], "blank",
             ["upgrade-tree", 
                [
                    [11],
                    [21],
                    [31, 32],
                    [41, 42],
                    [51, 52, 53],
                    [61],
                    [71],
                    [81],
                    [91],
                    [101],

                ]]
            ]
        },

        "Multiverses": {
            content: [["display-text", function() { return `You have <h3 style="color: lightblue;">${format(player[this.layer].multiverses)}</h3> Multiverses`}],
              "blank", ["clickable", [
                [11]
              ]], "blank", ["upgrades", [11]]
            ],

            unlocked() { return hasUpgrade("real", 101) }
        },

        "Dark Matter": {
            content: [
                ["display-text", function() { return `You have <h3 style="color: rgb(74, 15, 74);">${format(player[this.layer].darkMatter)}</h3> Dark Matter` }],
                "blank", ["clickable", [[12]]], "blank", ["upgrades", [12]],
            ],

            unlocked() { return player.real.darkMatterUnlocked },
        },

        "Reality Shifts": {
            content: [
                ["display-text", function() { return `You have <h3 style='color: rgb(255,0,255);'>${format(player[this.layer].realityShifts)}</h3> Reality shifts` }],
                "blank", ["clickable", [[13]]], "blank", "milestones",
            ],

            unlocked() { return player.real.realityShiftUnlocked },
        },
    },

    getUniverseMult() {
        let Umult = new ExpantaNum(1)
        if (hasUpgrade("real", 21)) Umult = Umult.times(2)
        if (hasUpgrade("real", 31)) Umult = Umult.times(3)
        if (hasUpgrade("real", 51)) Umult = Umult.times(3)
        if (hasUpgrade("real", 61)) Umult = Umult.times(2.5)
        if (hasUpgrade("real", 71)) Umult = Umult.times(6)
        if (hasUpgrade("real", 91)) Umult = Umult.times(10)
        if (hasUpgrade("real", 101)) Umult = Umult.times(10)
        if (hasUpgrade("real", 111)) Umult = Umult.times(2)
        if (hasUpgrade("real", 112)) Umult = Umult.times(3.5)
        if (hasUpgrade("real", 115)) Umult = Umult.times(3)
        if (hasUpgrade("real", 117)) Umult = Umult.pow(1.01)
        if (hasUpgrade("real", 122)) Umult = Umult.times(10)
        if (hasUpgrade("real", 124)) Umult = Umult.times(5)
        if (hasUpgrade("real", 125)) Umult = Umult.pow(1.25)
        if (hasMilestone("real", 0)) Umult = Umult.times(10)
        return Umult
    },

    update(diff) {
        if (player.real.unlocked) player[this.layer].universes = player[this.layer].universes.add(this.getUniverseMult().times(diff))
    },

    upgrades: {
        11: {
            title: "getting to basics",
            description: "10x Point gain",
            currencyDisplayName: "universes",
            currencyInternalName: "universes",
            currencyLayer: "real",
            cost: new ExpantaNum(10),
        },

        21: {
            title: "Faster generation",
            description: "2x Universe gain",
            currencyDisplayName: "universes",
            currencyInternalName: "universes",
            currencyLayer: "real",
            cost: new ExpantaNum(20),
            unlocked() { return hasUpgrade("real", 11) },
            branches: [11],
        },

        31: {
            title: "Better Universe",
            description: "3x Universe gain",
            currencyDisplayName: "universes",
            currencyInternalName: "universes",
            currencyLayer: "real",
            cost: new ExpantaNum(50),
            unlocked() { return hasUpgrade("real", 21) },
            branches: [21],
        },

        32: {
            title: "Universal Prestige",
            description: "5x Prestige gain",
            currencyDisplayName: "universes",
            currencyInternalName: "universes",
            currencyLayer: "real",
            cost: new ExpantaNum(100),
            unlocked() { return hasUpgrade("real", 21) },
            branches: [21],
        },

        41: {
            title: "No longer be negative",
            description: "negate the Negativity effect",
            currencyDisplayName: "universes",
            currencyInternalName: "universes",
            currencyLayer: "real",
            cost: new ExpantaNum(200),
            unlocked() { return hasUpgrade("real", 31) && hasUpgrade("real", 32) },
            branches: [31, 32],
        },

        42: {
            title: "Universal QoL I",
            description: "Gain always the 100% of your prestige points per second (+10% if you have EM3 (Equality Milestone 3))",
            currencyDisplayName: "universes",
            currencyInternalName: "universes",
            currencyLayer: "real",
            cost: new ExpantaNum(300),
            unlocked() { return hasUpgrade("real", 31) && hasUpgrade("real", 32) },
            branches: [31, 32],
        },

        51: {
            title: "Better",
            description: "10x Positivity gain, also 3x Universe gain",
            currencyDisplayName: "universes",
            currencyInternalName: "universes",
            currencyLayer: "real",
            cost: new ExpantaNum(400),
            unlocked() { return hasUpgrade("real", 41) && hasUpgrade("real", 42) },
            branches: [41, 42],
        },

        52: {
            title: "Fasting",
            description: "10x Positivity generation",
            currencyDisplayName: "universes",
            currencyInternalName: "universes",
            currencyLayer: "real",
            cost: new ExpantaNum(650),
            unlocked() { return hasUpgrade("real", 51) },
            branches: [51],
        },

        53: {
            title: "Lil boost",
            description: "2x Universes and Points are boosted by your Reality Points",
            currencyDisplayName: "universes",
            currencyInternalName: "universes",
            currencyLayer: "real",
            cost: new ExpantaNum(800),
            unlocked() { return hasUpgrade("real", 52) },
            branches: [52],

            effect() {
                return player[this.layer].points.add(1).pow(0.89)
            },

            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },

        61: {
            title: "Super boost",
            description: "2.5x Universes gain",
            currencyDisplayName: "universes",
            currencyInternalName: "universes",
            currencyLayer: "real",
            cost: new ExpantaNum(800),
            unlocked() { return hasUpgrade("real", 51) && hasUpgrade("real", 52) && hasUpgrade("real", 53) },
            branches: [51, 52, 53],
        },

        71: {
            title: "Great Boost",
            description: "6x Universe gain",
            currencyDisplayName: "universes",
            currencyInternalName: "universes",
            currencyLayer: "real",
            cost: new ExpantaNum(1000),
            unlocked() { return hasUpgrade("real", 61) },
            branches: [61],
        },

        81: {
            title: "Its time for QoL",
            description: "Keep the first two Equality milestones, also 2x Equality Power",
            currencyDisplayName: "universes",
            currencyInternalName: "universes",
            currencyLayer: "real",
            cost: new ExpantaNum(8000),
            unlocked() { return hasUpgrade("real", 71) },
            branches: [71],
        },

        91: {
            title: "Better II",
            description: "10x Universes",
            cost: new ExpantaNum(2),
            unlocked() { return hasUpgrade("real", 81) },
            branches: [81],
        },

        101: {
            title: "new Thing",
            description: "10x Universes again and unlock Multiverses",
            currencyDisplayName: "universes",
            currencyInternalName: "universes",
            currencyLayer: "real",
            cost: new ExpantaNum(100000),
            unlocked() { return hasUpgrade("real", 91) },
            branches: [91],
        },

        111: {
            title: "Better Universes",
            description: "2x Universe gain",
            currencyDisplayName: "multiverses",
            currencyInternalName: "multiverses",
            currencyLayer: "real",
            cost: new ExpantaNum(1),
        },

        112: {
            title: "Even Better Universes",
            description: "3.5x Universe gain",
            currencyDisplayName: "multiverses",
            currencyInternalName: "multiverses",
            currencyLayer: "real",
            cost: new ExpantaNum(2),
            unlocked() { return hasUpgrade("real", 111) },
        },

        113: {
            title: "Multiverse Power",
            description: "2.5x Equality Power",
            currencyDisplayName: "multiverses",
            currencyInternalName: "multiverses",
            currencyLayer: "real",
            cost: new ExpantaNum(4),
            unlocked() { return hasUpgrade("real", 112) },
        },

        114: {
            title: "QoL 3",
            description: "Keep another 2 Equality Milestones",
            currencyDisplayName: "multiverses",
            currencyInternalName: "multiverses",
            currencyLayer: "real",
            cost: new ExpantaNum(8),
            unlocked() { return hasUpgrade("real", 113) },
        },

        115: {
            title: "Very Universal",
            description: "1.5x Multiverses and 3x Universes",
            currencyDisplayName: "multiverses",
            currencyInternalName: "multiverses",
            currencyLayer: "real",
            cost: new ExpantaNum(10),
            unlocked() { return hasUpgrade("real", 114) },
        },

        116: {
            title: "Small Multiversal boost",
            description: "1.65x Multiverses",
            currencyDisplayName: "multiverses",
            currencyInternalName: "multiverses",
            currencyLayer: "real",
            cost: new ExpantaNum(25),
            unlocked() { return hasUpgrade("real", 115) },
        },

        117: {
            title: "Getting ready",
            description: "^1.01 Universes",
            currencyDisplayName: "multiverses",
            currencyInternalName: "multiverses",
            currencyLayer: "real",
            cost: new ExpantaNum(50),
            unlocked() { return hasUpgrade("real", 116) },
        },

        118: {
            title: "Almost",
            description: "<h2 style='color: blue'> 3x Multiverses </h2>",
            currencyDisplayName: "multiverses",
            currencyInternalName: "multiverses",
            currencyLayer: "real",
            cost: new ExpantaNum(80),
            unlocked() { return hasUpgrade("real", 117) },
        },

        119: {
            title: "Content",
            description: "Unlock Dark Matter",
            currencyDisplayName: "multiverses",
            currencyInternalName: "multiverses",
            currencyLayer: "real",
            cost: new ExpantaNum(300),
            unlocked() { return hasUpgrade("real", 118) },

            onPurchase() {
                player[this.layer].darkMatterUnlocked = true
            }
        },

        121: {
            title: "Dark Multiversal boost",
            description: "1.5x Multiverses",
            currencyDisplayName: "Dark Matter",
            currencyInternalName: "darkMatter",
            currencyLayer: "real",
            cost: new ExpantaNum(1),
        },

        122: {
            title: "Universal Boost",
            description: "10x Universes",
            currencyDisplayName: "Dark Matter",
            currencyInternalName: "darkMatter",
            currencyLayer: "real",
            cost: new ExpantaNum(1),
            unlocked() { return hasUpgrade("real", 121) },
        },

        123: {
            title: "Keeper I",
            description: "Keep all Equality Milestones.",
            currencyDisplayName: "Dark Matter",
            currencyInternalName: "darkMatter",
            currencyLayer: "real",
            cost: new ExpantaNum(2),
            unlocked() { return hasUpgrade("real", 122) },
        },

        124: {
            title: "Triple boost",
            description: "1.1x Dark Matter, 3x Multiverses, 5x Universes",
            currencyDisplayName: "Dark Matter",
            currencyInternalName: "darkMatter",
            currencyLayer: "real",
            cost: new ExpantaNum(2),
            unlocked() { return hasUpgrade("real", 123) },
        },

        125: {
            title: "Exponential Universe",
            description: "^1.25 Universes",
            currencyDisplayName: "Dark Matter",
            currencyInternalName: "darkMatter",
            currencyLayer: "real",
            cost: new ExpantaNum(4),
            unlocked() { return hasUpgrade("real", 124) },
        },

        126: {
            title: "The last",
            description: "Unlock Reality shifts",
            currencyDisplayName: "Dark Matter",
            currencyInternalName: "darkMatter",
            currencyLayer: "real",
            cost: new ExpantaNum(12),
            unlocked() { return hasUpgrade("real", 125) },

            onPurchase() {
                player[this.layer].realityShiftUnlocked = true
            }
        },
    },

    calcMultiverseMultiANDGain() {
        let Mmult = new ExpantaNum(1)
        let exp = new ExpantaNum(0.45)
        let calc = new ExpantaNum(0)
        if (hasUpgrade("real", 115)) Mmult = Mmult.times(1.5)
        if (hasUpgrade("real", 116)) Mmult = Mmult.times(1.65)
        if (hasUpgrade("real", 118)) Mmult = Mmult.times(3)
        if (hasUpgrade("real", 121)) Mmult = Mmult.times(1.5)
        if (hasUpgrade("real", 124)) Mmult = Mmult.times(3)
        if (hasMilestone("real", 0)) Mmult = Mmult.times(2)
        
        calc = player[this.layer].universes.add(1).div(1000000).pow(exp).times(Mmult)
        player[this.layer].multiversesGain = calc
        return calc
    },

    clickables: {
        11: {
            title: "Multiverse Reset",
            display() { return `<h3> You will gain ${format(player[this.layer].multiversesGain)} Multiverses </h3> <br> Resets your universe points`},

            canClick() {
                return player[this.layer].multiversesGain.gte(1)
            },

            onClick() {
                player[this.layer].universes = new ExpantaNum(0)
                player[this.layer].multiverses = player[this.layer].multiverses.add(player[this.layer].multiversesGain)
            },

            style() { return {
                "width": "300px",
                "height": "100px",
                "border-radius": "5%",
                "background-color": this.canClick() ? "lightblue" : "#bf8f8f",
             }
            }
        },

        12: {
            title: "Dark Matter Reset",
            display() { return `<h3> You will gain ${format(player[this.layer].darkMatterGain)} Dark Matter </h3> <br> Resets Multiverse and Multiverse Upgrades.` },

            canClick() {
                return player[this.layer].darkMatterGain.gte(1)
            },

            onClick() {
                let keepUpg = 111
                player[this.layer].universes = new ExpantaNum(0)
                player[this.layer].multiverses = new ExpantaNum(0)
                player[this.layer].darkMatter = player[this.layer].darkMatter.add(player[this.layer].darkMatterGain)

                player[this.layer].upgrades = player[this.layer].upgrades.filter(id => id < keepUpg || id >= 120)
            },

            style() { return {
                "width": "300px",
                "height": "100px",
                "border-radius": "5%",
                "background-color": this.canClick() ? "rgb(74, 15, 74)" : "#bf8f8f",
             }
            }
        },

        13: {
            title: "Reality Shift",
            display() { return `<h3> You need ${format(player[this.layer].realityShiftReq)} Reality points </h3> <br> Resets Dark Matter, Dark Matter Upgrades, Multiverse, Multiverse Upgrades and Universes` },

            canClick() {
                return player.real.points.gte(player.real.realityShiftReq)
            },

            onClick() {
                let keepUpg = 101

                // Reset
                player[this.layer].points = new ExpantaNum(0)
                player[this.layer].universes = new ExpantaNum(0)
                player[this.layer].multiverses = new ExpantaNum(0)
                player[this.layer].darkMatter = new ExpantaNum(0)

                // Gain
                player[this.layer].realityShifts = player[this.layer].realityShifts.add(1)
                player[this.layer].realityShiftReq = player[this.layer].realityShiftReq.times(player[this.layer].realityShiftScale)
                player[this.layer].realityShiftUnlocked = true
                
                // Keep on Reset
                player[this.layer].upgrades = player[this.layer].upgrades.filter(id => id <= keepUpg || id >= 127)


            },

            style() { return {
                "width": "300px",
                "height": "100px",
                "border-radius": "5%",
                "background-color": this.canClick() ? "rgb(255, 0, 255)" : "#bf8f8f",
             }
            }
        }
    },

    calcDarkMatter() {
        let DMmult = new ExpantaNum(1)
        let DMexp = new ExpantaNum(0.25)
        let calc = new ExpantaNum(0)
        if (hasUpgrade("real", 124)) DMmult = DMmult.times(1.1)
        if (hasMilestone("real", 2)) DMmult = DMmult.times(1.5)

        calc = player[this.layer].multiverses.add(1).div(500).pow(DMexp).times(DMmult)
        player[this.layer].darkMatterGain = calc
        return calc
    },

    milestones: {
        0: {
            requirementDescription: "1 Reality Shift",
            effectDescription: "2x Multiverses, 10x Universes",
            done() { return player[this.layer].realityShifts.gte(1) },
        },

        1: {
            requirementDescription: "2 Reality Shifts",
            effectDescription: "Keep all Equality Upgrades when performing a reality reset",
            done() { return player[this.layer].realityShifts.gte(2) },
            unlocked() { return hasMilestone("real", 0) },
        },

        2: {
            requirementDescription: "3 Reality Shifts",
            effectDescription: "1.5x Reality Points and Dark Matter",
            done() { return player[this.layer].realityShifts.gte(3) },
            unlocked() { return hasMilestone("real", 1) },
        },
    },
})
