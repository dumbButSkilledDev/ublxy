// ublxy thingy

var UBCDN = "https://cdn.jsdelivr.net/gh/dumbButSkilledDev/ublxy/";

async function fetchWrap(url) {
    var req = await fetch(url);
    var resp = await req.json();
    return resp;
}

var uglUnityConf = {
  Module:
    {
       onRuntimeInitialized: function() { console.log("[UGL] were loaded bruh!") }
    }
};

var uglGameInstance;

function launchGameUnity(jsonUrl) {
     console.log("[UGL] actually launching game...);
     uglGameInstance = UnityLoader.instantiate("gameContainer", jsonUrl, uglUnityConf);
}

async function launchGame(index) {
    var gameList = await fetchWrap(UBCDN + "games.json");
    console.log("[UGL] launching game of index: " + index);

    var game = gameList[index];
    console.log("[UGL] game name: " + game.name);
    console.log("[UGL] load info: " + game.loadInfo);
    console.log("[UGL] load data: " + game.loadData);
    console.log("[UGL] game launch method: " + game.loadInfo);

    if (game.loadInfo == "unity") {
        launchGameUnity(game.loadData);
    }
}
