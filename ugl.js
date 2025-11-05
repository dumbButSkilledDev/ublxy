// ublxy thingy

var UBCDN = "https://cdn.jsdelivr.net/gh/dumbButSkilledDev/ublxy@master/";

async function fetchWrap(url) {
    var req = await fetch(url);
    var resp = await req.json();
    return resp;
}

async function fwrap(url) {
  try {
    const res = await fetch(url, { mode: 'cors' });
    if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);
    const html = await res.text();
    return html;
  } catch (err) {
    return `<pre style="color:red;">Fetch error: ${err.message}</pre>`;
  }
}

var uglUnityConf = {Module:{onRuntimeInitialized: function() { console.log("[UGL] were loaded bruh!") }}};

var uglGameInstance;

function launchGameUnity(jsonUrl) {
     console.log("[UGL] actually launching game...");
     uglGameInstance = UnityLoader.instantiate("gameContainer", jsonUrl, uglUnityConf);
}

function launchGameHtml(frameID, dat) {
    console.log("[UGL] actually launching game...");
    document.getElementById(frameID).setAttribute("srcdoc", atob(dat));
}

async function launchGame(index) {
    var gameList = await fetchWrap(UBCDN + "games.json");
    console.log("[UGL] launching game of index: " + index);

    var game = gameList[index];
    console.log(gameList);
    console.log(game);
    console.log("[UGL] game name: " + game.name);
    console.log("[UGL] load info: " + game.loadInfo);
    console.log("[UGL] load data: " + game.loadData);
    console.log("[UGL] game launch method: " + game.loadInfo);

    if (game.loadInfo == "unity") {
        launchGameUnity(game.loadData);
    } else if (game.loadInfo == "html") {
        launchGameHtml("ugl_frame", game.loadData);
    } else if (game.loadInfo == "html_fetch") {
        (async () => {
            launchGameHtml("ugl_frame", fwrap(game.loadData));
        })();
    }
}
