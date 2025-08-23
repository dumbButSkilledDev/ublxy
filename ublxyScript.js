// ublxyScript.js copyright connor walsh 2025 (c)

var UBLXY_LOG_EN = false;

var UBLXY_STYPE_UKN = 0x0;
var UBLXY_STYPE_STR = 0x1;
var UBLXY_STYPE_NUM = 0x2;

var macroNames = new Array();
var macroFunctions = new Array();

var varNames = new Array();
var varData = new Array();

class macroSenderInformation {
    constructor(args) {
        this.args = args;
    }
}

function logInfo(data) {
    if (UBLXY_LOG_EN) {
        console.log("[INFO] ", data);
    }
}

function getFunctionName(line) {
    return line.substring(0, line.indexOf("("));
}

function getArgs(line) {
    var argsBegin = line.indexOf("(")+1;
    var argsEnd = line.lastIndexOf(")"); 

    var argsNonParsed = line.substring(argsBegin, argsEnd);


    return argsNonParsed.split(", ");
}

function getType(arg) {
    if (arg.startsWith('"') && arg.endsWith('"')) {
        return UBLXY_STYPE_STR;
    }

    if (isNaN(arg.charAt(0))) {
        return UBLXY_STYPE_UKN;
    }

    return UBLXY_STYPE_NUM;
}

function stripQuotes(arg) {
    return arg.substring(arg.indexOf('"')+1, arg.indexOf('"',1));
}

function stripArg(arg) {
    var argType = getType(arg);

    if (argType == UBLXY_STYPE_NUM) {
        return arg;
    } else if (argType == UBLXY_STYPE_STR) {
        return stripQuotes(arg);
    } else {
        var varPos = lookup(arg, varNames);
        if (varPos == -1) {
            alert("ublxyScriptError: ublxy type uknown...");
        }
    }

    return "";
}

function lookup(key, arr) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == key) {
            return i;
        }
    }

    return -1;
}

function addMacro(name, func) {
    macroNames.push(name);
    macroFunctions.push(func);
}

function addVar(name, data) {
    varNames.push(name);
    varData.push(data);
}

function varSet(varName, data) {
    var varPos = lookup(varName, varData);
    varData[varPos] = data;
}

function getVar(varName) {
    var varPos = lookup(varName, varData);
    return varData[varPos];
}

function handleLine(line) {
    var functionName = getFunctionName(line);
    var args = getArgs(line);
    var procArgs = new Array();

    for (var i = 0; i < args.length; i++) {
        var strippedArg = stripArg(args[i]);
        var varPos = lookup(args[i], varNames);

        if (varPos != -1) {
            logInfo("arg is a var!");
            strippedArg = varData[i];
        }

        logInfo(strippedArg);
        procArgs.push(strippedArg);
        logInfo("added proccessed arg: " + strippedArg);
    }

    var macroInfo = new macroSenderInformation(procArgs);
    var macroPos = lookup(functionName, macroNames);

    macroFunctions[macroPos](macroInfo);
}

// macros

function macro_print(macroInfo) {
    console.log(macroInfo.args[0]);
    alert(macroInfo.args[0]);
}

function macro_alert(macroInfo) {
    alert(macroInfo.args[0]);
}

function macro_setParseDebugLoggingStatus(macroInfo) {
    if (macroInfo.args[0] == 1) {
        console.log("[INFO] enabling parse debug logging");
        UBLXY_LOG_EN = true;
    } else {
        UBLXY_LOG_EN = false;
    }
}

function macro_evalJS(macroInfo) {
    eval(macroInfo.args[0]);
}

function macro_newvar(macroInfo) {
    addVar(macroInfo.args[0], macroInfo.args[1]);
}

function macro_setvar(macroInfo) {
    setVar(macroInfo.args[0], macroInfo.args[1]);
}

function macro_launchPayloadB64(macroInfo) {
    window.open().document.write(atob(macroInfo.args[0]));
}

addMacro("print", macro_print);
addMacro("alert", macro_alert);
addMacro("setParseDebugLoggingStatus", macro_setParseDebugLoggingStatus);
addMacro("evalJS", macro_evalJS);
addMacro("newvar", macro_newvar);
addMacro("setvar", macro_setvar);
addMacro("launchPayloadB64", macro_launchPayloadB64);
