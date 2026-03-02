addLayer("ach", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new ExpantaNum(0),             // "points" is the internal name for the main resource of the layer.
    }},

    color: "#fffb00",                       // The color for this layer, which affects many elements.
    resource: "achievements",            // The name of this layer's main prestige resource.
    row: "side",                                 // The row this layer is on (0 is the first row).

    baseResource: "points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.

    requires: new ExpantaNum(10),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.5,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new ExpantaNum(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns your exponent to your gain of the prestige resource.
        return new ExpantaNum(1)
    },

    layerShown() { return true },          // Returns a bool for if this layer's node should be visible in the tree.

    tabFormat: {
        "Achievements": {
            content: ["main-display", "achievements"]
        }
    },

    achievements: {
        11: {
            name: "Small points",
            tooltip: "get 10 Points",
            done() {return player.points.gte(10)},
            onComplete() {player.ach.points = player[this.layer].points.add(1)}
        },

        12: {
            name: "very basic",
            tooltip: "get your first prestige point",
            done() {return player.p.points.gte(1)},
            onComplete() {player.ach.points = player[this.layer].points.add(1)}
        },

        13: {
            name: "something new?",
            tooltip: "Unlock buyables",
            done() {return hasUpgrade("p", 13)},
            onComplete() {player.ach.points = player[this.layer].points.add(1)}
        },

        14: {
            name: "still small",
            tooltip: "get 1000 points",
            done() {return player.points.gte(1000)},
            onComplete() {player.ach.points = player[this.layer].points.add(1)}
        },

        15: {
            name: "small prestige",
            tooltip: "get 100 prestige points",
            done() {return player.p.points.gte(100)},
            onComplete() {player.ach.points = player.ach.points.add(1)},
        },

        16: {
            name: "Milionarie",
            tooltip: "Get 1,000,000 points",
            done() {return player.points.gte(1e6)},
            onComplete() {player.ach.points = player.ach.points.add(1)},
        },

        17: {
            name: "Getting big",
            tooltip: "Get 10,000 prestige points",
            done() {return player.p.points.gte(10000)},
            onComplete() {player.ach.points = player.ach.points.add(1)},
        },

        18: {
            name: "Lets goooo",
            tooltip: "Get 1,000,000 Prestige points",
            done() {return player.p.points.gte(1000000)},
            onComplete() {player.ach.points = player.ach.points.add(1)},
        },

        19: {
            name: "Starting to be positive",
            tooltip: "Unlock Positivity",
            done() { return hasUpgrade("p", 21) },
            onComplete() {player.ach.points = player.ach.points.add(1)},
        },

        21: {
            name: "Very positive",
            tooltip: "get 100 positivity",
            done() { return player.pos.points.gte(100) },
            onComplete() {player.ach.points = player.ach.points.add(1)},
        },

        22: {
            name: "Super Points",
            tooltip: "get 1e10 Points",
            done() { return player.points.gte(1e10) },
            onComplete() {player.ach.points = player.ach.points.add(1)},
        },

        23: {
            name: "happy",
            tooltip: "Get 1e10 Positivity",
            done() { return player.pos.points.gte(1e10) },
            onComplete() { player.ach.points = player.ach.points.add(1) },
        },

        24: {
            name: "Its negative now",
            tooltip: "Get 1 Negativity Point",
            done() { return player.neg.points.gte(1) },
            onComplete() { player.ach.points = player.ach.points.add(1) },
        }
    }
})
