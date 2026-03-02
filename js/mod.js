let modInfo = {
	name: "reality incremental",
	id: "realityInc",
	author: "TheRaceDev",
	pointsName: "points",
	discordName: "",
	discordLink: "",
	initialStartPoints: new ExpantaNum(0), // Used for hard resets and new players
	
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.0",
	name: "Init",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.0</h3><br>
		- Added things.<br>
		- Added stuff.`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new ExpantaNum(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new ExpantaNum(0)

	let gain = new ExpantaNum(1)
	if (hasUpgrade("p", 11)) gain = gain.times(1.5)
	if (hasUpgrade("p", 12)) gain = gain.times(2)
	gain = gain.times(ExpantaNum.pow(1.5, getBuyableAmount("p", 11)))
    if (hasUpgrade("p", 14)) gain = gain.times(5)
	if (hasUpgrade("p", 15)) gain = gain.times(upgradeEffect("p", 15))
	if (hasUpgrade("p", 17)) gain = gain.times(10)
	if (hasUpgrade("p", 18)) gain = gain.times(upgradeEffect("p", 18))
	gain = gain.times(tmp.pos.effect)
    if (hasUpgrade("pos", 11)) gain = gain.times(1.5)
	if (hasUpgrade("pos", 16)) gain = gain.times(3)
	if (hasUpgrade("pos", 18)) gain = gain.pow(1.1)
	if (hasUpgrade("pos", 19)) gain = gain.div(tmp.neg.effect)
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return false
}



// Less important things beyond this point!

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}
