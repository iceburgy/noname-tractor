import { MainForm } from "./main_form.js";
import { Coordinates } from "./coordinates.js";
import { CommonMethods } from "./common_methods.js";
import { IDBHelper } from "./idb_helper.js";
import { EnterHallInfo } from './enter_hall_info.js';
var dummyValue = "dummyValue";
var IPPort = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?):(6553[0-5]|655[0-2][0-9]|65[0-4][0-9][0-9]|6[0-4][0-9][0-9][0-9][0-9]|[1-5](\d){4}|[1-9](\d){0,3})$/;
var GameScene = /** @class */ (function () {
    function GameScene(irm, hostName, playerName, nickNameOverridePass, playerEmail, gameIn, libIn, uiIn, getIn, _statusIn) {
        // // public hallPlayerHeader: Phaser.GameObjects.Text
        // // public hallPlayerNames: Phaser.GameObjects.Text[]
        // // public btnJoinAudio: Phaser.GameObjects.Text
        // // public btnQiandao: Phaser.GameObjects.Text
        // public joinAudioUrl: string 
        this.nickNameOverridePass = "";
        this.playerEmail = "";
        this.noChat = false;
        this.useCardUIStyleClassic = false;
        this.hidePlayerID = false;
        this.wsprotocal = "wss";
        this.clientVersion = "";
        this.parserWorker = new Worker(new URL("./parser_worker.js", import.meta.url), { type: "module" });
        this.game = gameIn;
        this.lib = libIn;
        this.ui = uiIn;
        this.get = getIn;
        this._status = _statusIn;
        this.isReplayMode = irm;
        // // this.existPlayers = [1]
        // // this.websocket = null
        // // this.getPlayerMsgCnt = 0
        // // this.prepareOkImg = [null, null, null, null]
        // // this.pokerTableChairImg = []
        // // this.pokerTableChairNames = []
        this.cardImages = [];
        this.cardServerNumToImage = {};
        for (var i = 0; i < 54; i++) {
            this.cardServerNumToImage[i] = [];
        }
        this.cardImageSequence = [];
        this.toolbarSuiteImages = [];
        this.sidebarImages = [];
        this.scoreCardsImages = [];
        this.scoreCardsIntsDrawn = [];
        this.last8CardsImages = [];
        this.showedCardImages = [];
        this.overridingLabelImages = [
            "bagua",
            "zhugong",
            "sha",
            "huosha",
            "leisha",
        ];
        this.overridingLabelAnims = [
            ["", ""],
            ["", ""],
            ["effect_qinggangjian", undefined],
            ["effect_shoujidonghua", "play3"],
            ["effect_shoujidonghua", "play5"]
        ];
        // // this.hallPlayerNames = [];
        this.clientMessages = [];
        this.danmuMessages = [];
        this.noDongtu = "false";
        this.useCardUIStyleClassic = (this.lib && this.lib.config && this.lib.config.useCardUIStyleClassic) ? this.lib.config.useCardUIStyleClassic : false;
        this.hidePlayerID = (this.lib && this.lib.config && this.lib.config.hidePlayerID) ? this.lib.config.hidePlayerID : false;
        this.noDanmu = (this.lib && this.lib.config && this.lib.config.noDanmu) ? this.lib.config.noDanmu : "false";
        this.noTouchDevice = (this.lib && this.lib.config && this.lib.config.noTouchDevice) ? this.lib.config.noTouchDevice : "false";
        this.noCutCards = (this.lib && this.lib.config && this.lib.config.noCutCards) ? this.lib.config.noCutCards : "false";
        this.yesDragSelect = (this.lib && this.lib.config && this.lib.config.yesDragSelect) ? this.lib.config.yesDragSelect : "false";
        this.onlyMeShowCardCancelLastTrickView = (this.lib && this.lib.config && this.lib.config.onlyMeShowCardCancelLastTrickView) ? this.lib.config.onlyMeShowCardCancelLastTrickView : "false";
        this.chatMessageCostNoted = (this.lib && this.lib.config && this.lib.config.chatMessageCostNoted !== undefined) ? this.lib.config.chatMessageCostNoted : false;
        this.yesFirstPersonView = (this.lib && this.lib.config && this.lib.config.yesFirstPersonView) ? this.lib.config.yesFirstPersonView : "false";
        this.qiangliangMin = (this.lib && this.lib.config && this.lib.config.qiangliangMin) ? this.lib.config.qiangliangMin : "5";
        this.clientVersion = (this.lib && this.lib.version) ? this.lib.version : CommonMethods.PLAYER_ENTER_HALL_VERSION_UNKNOWN;
        // // if (this.qiangliangMin === undefined) this.qiangliangMin = '5'
        IDBHelper.maxReplays = (this.lib && this.lib.config && this.lib.config.maxReplays) ? this.lib.config.maxReplays : IDBHelper.maxReplays;
        this.coordinates = new Coordinates(this);
        if (this.isReplayMode) {
            this.doReplay();
            return;
        }
        this.hostName = hostName.trim();
        if (!this.hostName) {
            this.hostName = "xicuntractor.ddnsfree.com:889";
        }
        this.hostNameOriginal = this.hostName;
        this.playerName = playerName.trim();
        if (this.playerName && CommonMethods.IsNumber(this.playerName)) {
            document.body.innerHTML = "<div>!!! \u6635\u79F0\u4E0D\u80FD\u4EE5\u6570\u5B57\u5F00\u5934\u7ED3\u5C3E\uFF1A".concat(this.playerName, "</div>");
            this.hostName = "";
            return;
        }
        var isIPPort = IPPort.test(this.hostName);
        if (isIPPort) {
            this.wsprotocal = "ws";
        }
        else {
            if (!(/(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)$)/gi.test(this.hostName)) && !this.processAuth()) {
                document.body.innerHTML = "<div>!!! \u89E3\u6790\u670D\u52A1\u5668\u5730\u5740\u5931\u8D25\uFF0C\u8BF7\u786E\u8BA4\u8F93\u5165\u4FE1\u606F\u65E0\u8BEF\uFF1A".concat(this.hostNameOriginal, "</div>");
                this.hostName = "";
                return;
            }
            this.resolveUrl();
        }
        this.nickNameOverridePass = nickNameOverridePass;
        this.playerEmail = playerEmail;
        this.soundPool = {};
        this.loadAudioFiles();
        this.connect();
    }
    // non-replay mode, online
    GameScene.prototype.connect = function () {
        var _this = this;
        if (!this.hostName)
            return;
        try {
            if (this.websocket) {
                this.websocket.close();
                delete this.websocket;
            }
            this.websocket = new WebSocket("".concat(this.wsprotocal, "://").concat(this.hostName));
            this.websocket.gs = this;
            this.websocket.onopen = function () {
                // try {
                console.log("连接成功");
                if (this.gs.ui.emailtext) {
                    this.gs.game.clearConnect();
                }
                // empty password means recover password or playerName
                if (!this.gs.nickNameOverridePass) {
                    this.gs.nickNameOverridePass = CommonMethods.recoverLoginPassFlag;
                    if (!this.gs.playerName) {
                        this.gs.playerName = "";
                    }
                }
                var enterHallInfo = new EnterHallInfo(this.gs.nickNameOverridePass, this.gs.playerEmail, "".concat(CommonMethods.PLAYER_CLIENT_TYPE_TLJAPP).concat(CommonMethods.PLAYER_ENTER_HALL_DELIMITER).concat(this.gs.clientVersion));
                this.gs.sendMessageToServer(CommonMethods.PLAYER_ENTER_HALL_REQUEST, this.gs.playerName, JSON.stringify(enterHallInfo));
                this.gs.mainForm = new MainForm(this.gs);
                this.gs.mainForm.drawFrameMain();
                this.gs.mainForm.drawFrameChat();
                CommonMethods.BuildCardNumMap();
                IDBHelper.InitIDB(function () { void (0); });
                this.gs.mainForm.LoadUIUponConnect();
                // } catch (e) {
                //     // alert("error")
                //     document.body.innerHTML = `<div>!!! onopen Error: ${e}</div>`
                // }
            };
            this.websocket.onmessage = function (event) {
                // Instead of JSON.parse(event.data) here, send it to the worker
                _this.parserWorker.postMessage(event.data);
            };
            this.parserWorker.onmessage = function (e) {
                if (e.data.success) {
                    var messageType = e.data.messageType;
                    var playerID = e.data.playerID;
                    var objList = e.data.objList;
                    switch (messageType) {
                        case CommonMethods.NotifyGameHall_RESPONSE:
                            _this.handleNotifyGameHall(objList);
                            break;
                        case CommonMethods.NotifyOnlinePlayerList_RESPONSE:
                            _this.handleNotifyOnlinePlayerList(playerID, objList);
                            break;
                        case CommonMethods.NotifyGameRoomPlayerList_RESPONSE:
                            _this.handleNotifyGameRoomPlayerList(playerID, objList);
                            break;
                        case CommonMethods.NotifyMessage_RESPONSE:
                            _this.handleNotifyMessage(objList);
                            break;
                        case CommonMethods.NotifyRoomSetting_RESPONSE:
                            _this.handleNotifyRoomSetting(objList);
                            break;
                        case CommonMethods.NotifyGameState_RESPONSE:
                            _this.handleNotifyGameState(objList);
                            break;
                        case CommonMethods.NotifyCurrentHandState_RESPONSE:
                            _this.handleNotifyCurrentHandState(objList);
                            break;
                        case CommonMethods.NotifyCurrentTrickState_RESPONSE:
                            _this.handleNotifyCurrentTrickState(objList);
                            break;
                        case CommonMethods.GetDistributedCard_RESPONSE:
                            _this.handleGetDistributedCard(objList);
                            break;
                        case CommonMethods.NotifyCardsReady_RESPONSE:
                            _this.handleNotifyCardsReady(objList);
                            break;
                        case CommonMethods.NotifyDumpingValidationResult_RESPONSE:
                            _this.handleNotifyDumpingValidationResult(objList);
                            break;
                        case CommonMethods.NotifyTryToDumpResult_RESPONSE:
                            _this.handleNotifyTryToDumpResult(objList);
                            break;
                        case CommonMethods.NotifyStartTimer_RESPONSE:
                            _this.handleNotifyStartTimer(objList);
                            break;
                        case CommonMethods.NotifyEmoji_RESPONSE:
                            _this.handleNotifyEmoji(objList);
                            break;
                        case CommonMethods.CutCardShoeCards_RESPONSE:
                            _this.handleCutCardShoeCards();
                            break;
                        case CommonMethods.NotifyReplayState_RESPONSE:
                            _this.handleNotifyReplayState(objList);
                            break;
                        case CommonMethods.NotifyPing_RESPONSE:
                            _this.handleNotifyPing_RESPONSE();
                            break;
                        // case CommonMethods.NotifySgcsPlayerUpdated_RESPONSE:
                        //     this.handleNotifySgcsPlayerUpdated_RESPONSE(objList);
                        //     break;
                        // case CommonMethods.NotifyCreateCollectStar_RESPONSE:
                        //     this.handleNotifyCreateCollectStar_RESPONSE(objList);
                        //     break;
                        // case CommonMethods.NotifyEndCollectStar_RESPONSE:
                        //     this.handleNotifyEndCollectStar(objList);
                        //     break;
                        // case CommonMethods.NotifyGrabStar_RESPONSE:
                        //     this.handleNotifyGrabStar_RESPONSE(objList);
                        //     break;
                        case CommonMethods.NotifyDaojuInfo_RESPONSE:
                            _this.handleNotifyDaojuInfo(objList);
                            break;
                        // case CommonMethods.NotifyUpdateGobang_RESPONSE:
                        //     this.handleNotifyUpdateGobang_RESPONSE(objList);
                        //     break;
                        default:
                            break;
                    }
                    // } catch (e) {
                    //     // alert("error")
                    //     document.body.innerHTML = `<div>!!! onmessage Error: ${e}</div>`
                    // }
                }
                else {
                    console.log("this.parserWorker.onmessage failed", e.data.error);
                    console.error(JSON.stringify(e));
                }
            };
            this.websocket.onerror = function (e) {
                document.body.innerHTML = "<div>!!! \u5C1D\u8BD5\u4E0E\u670D\u52A1\u5668\u5EFA\u7ACB\u8FDE\u63A5\u5931\u8D25\uFF0C\u8BF7\u786E\u8BA4\u8F93\u5165\u4FE1\u606F\u65E0\u8BEF\uFF1A".concat(this.gs.hostNameOriginal, "</div>");
                console.error(JSON.stringify(e));
            };
            this.websocket.onclose = function (e) {
                console.log("WS closed by the server. ", e.code, e.reason);
                console.error(JSON.stringify(e));
            };
        }
        catch (e) {
            document.body.innerHTML = "<div>!!! \u5C1D\u8BD5\u8FDE\u63A5\u670D\u52A1\u5668\u51FA\u9519\uFF0C\u8BF7\u786E\u8BA4\u8F93\u5165\u4FE1\u606F\u65E0\u8BEF\uFF1A".concat(this.hostNameOriginal, "</div>");
            console.log(e);
        }
    };
    // replay mode, offline
    GameScene.prototype.doReplay = function () {
        var _this = this;
        this.mainForm = new MainForm(this);
        this.mainForm.drawFrameMain();
        this.mainForm.drawGameRoom();
        this.mainForm.drawFrameChat();
        CommonMethods.BuildCardNumMap();
        this.mainForm.LoadUIUponConnect();
        IDBHelper.InitIDB(function () {
            _this.mainForm.DoReplayMainForm();
        });
    };
    // public handleNotifyUpdateGobang_RESPONSE(objList) {
    //     var result: SGGBState = objList[0];
    //     this.mainForm.sgDrawingHelper.NotifyUpdateGobang(result);
    // }
    GameScene.prototype.handleNotifyDaojuInfo = function (objList) {
        var daojuInfo = objList[0];
        var updateQiandao = objList[1];
        var updateSkin = objList[2];
        this.mainForm.tractorPlayer.NotifyDaojuInfo(daojuInfo, updateQiandao, updateSkin);
    };
    // public handleNotifyGrabStar_RESPONSE(objList) {
    //     let playerIndex: number = objList[0];
    //     let starIndex: number = objList[1];
    //     this.mainForm.sgDrawingHelper.NotifyGrabStar(playerIndex, starIndex);
    // }
    // public handleNotifyCreateCollectStar_RESPONSE(objList) {
    //     var result: SGCSState = objList[0];
    //     this.mainForm.sgDrawingHelper.NotifyCreateCollectStar(result);
    // }
    // public handleNotifyEndCollectStar(objList) {
    //     var result: SGCSState = objList[0];
    //     this.mainForm.sgDrawingHelper.NotifyEndCollectStar(result);
    // }
    // public handleNotifySgcsPlayerUpdated_RESPONSE(objList) {
    //     var result: SGCSPlayer = JSON.parse(objList[0])
    //     this.mainForm.sgDrawingHelper.NotifySgcsPlayerUpdated(result);
    // }
    GameScene.prototype.handleNotifyPing_RESPONSE = function () {
        this.mainForm.tractorPlayer.NotifyPing();
    };
    GameScene.prototype.handleNotifyReplayState = function (objList) {
        var result = objList[0];
        IDBHelper.SaveReplayEntity(result, function () { void (0); });
    };
    GameScene.prototype.handleCutCardShoeCards = function () {
        this.mainForm.CutCardShoeCardsEventHandler();
    };
    GameScene.prototype.handleNotifyEmoji = function (objList) {
        this.mainForm.NotifyEmojiEventHandler.apply(this.mainForm, objList);
    };
    GameScene.prototype.handleNotifyStartTimer = function (objList) {
        var timerLength = objList[0];
        var playerID = objList[1];
        this.mainForm.NotifyStartTimerEventHandler(timerLength, playerID);
    };
    GameScene.prototype.handleNotifyDumpingValidationResult = function (objList) {
        var result = objList[0];
        this.mainForm.NotifyDumpingValidationResultEventHandler(result);
    };
    GameScene.prototype.handleNotifyTryToDumpResult = function (objList) {
        var result = objList[0];
        this.mainForm.NotifyTryToDumpResultEventHandler(result);
    };
    GameScene.prototype.handleNotifyCardsReady = function (objList) {
        var cardsReady = objList[0];
        this.mainForm.tractorPlayer.NotifyCardsReady(cardsReady);
    };
    GameScene.prototype.handleGetDistributedCard = function (objList) {
        var cardNumber = objList[0];
        this.mainForm.tractorPlayer.GetDistributedCard(cardNumber);
    };
    GameScene.prototype.handleNotifyGameHall = function (objList) {
        var roomStateList = objList[0];
        var playerList = objList[1];
        var yuezhanList = objList[2];
        console.log("received NotifyGameHall with roomStateList:");
        console.log(roomStateList);
        console.log("received NotifyGameHall with playerList:");
        console.log(playerList);
        console.log("received NotifyGameHall with yuezhanList:");
        console.log(yuezhanList);
        this.mainForm.NotifyGameHallEventHandler(roomStateList, playerList, yuezhanList);
    };
    GameScene.prototype.handleNotifyOnlinePlayerList = function (playerID, objList) {
        console.log("received handleNotifyOnlinePlayerList with playerID:");
        console.log(playerID);
        console.log("received handleNotifyOnlinePlayerList with objList:");
        console.log(objList);
        var isJoining = objList[0];
        this.mainForm.NotifyOnlinePlayerListEventHandler(playerID, isJoining);
    };
    GameScene.prototype.handleNotifyGameRoomPlayerList = function (playerID, objList) {
        var isJoining = objList[0];
        var roomName = objList[1];
        this.mainForm.NotifyGameRoomPlayerListEventHandler(playerID, isJoining, roomName);
    };
    GameScene.prototype.handleNotifyMessage = function (objList) {
        var msgs = objList[0];
        this.mainForm.tractorPlayer.NotifyMessage(msgs);
    };
    GameScene.prototype.handleNotifyRoomSetting = function (objList) {
        var roomSetting = objList[0];
        var showMessage = objList[1];
        console.log("received handleNotifyRoomSetting with roomSetting:");
        console.log(roomSetting);
        console.log("received handleNotifyRoomSetting with showMessage:");
        console.log(showMessage);
        this.mainForm.tractorPlayer.NotifyRoomSetting(roomSetting, showMessage);
    };
    GameScene.prototype.handleNotifyGameState = function (objList) {
        console.log("===received handleNotifyGameState");
        var gameState = objList[0];
        var notifyType = objList[1];
        this.mainForm.tractorPlayer.NotifyGameState(gameState, notifyType);
    };
    GameScene.prototype.handleNotifyCurrentHandState = function (objList) {
        var currentHandState = objList[0];
        var notifyType = objList[1];
        this.mainForm.tractorPlayer.NotifyCurrentHandState(currentHandState, notifyType);
    };
    GameScene.prototype.handleNotifyCurrentTrickState = function (objList) {
        console.log("===received handleNotifyCurrentTrickState");
        var currentTrickState = objList[0];
        var notifyType = objList[1];
        this.mainForm.tractorPlayer.NotifyCurrentTrickState(currentTrickState, notifyType);
    };
    GameScene.prototype.processAuth = function () {
        try {
            var bytes = CryptoJS.AES.decrypt(this.hostName, dummyValue);
            var originalText = bytes.toString(CryptoJS.enc.Utf8);
            if (bytes && bytes.sigBytes > 0 && originalText) {
                this.hostName = originalText;
                return true;
            }
        }
        catch (ex) {
            console.log("===");
            console.log(ex);
        }
        return false;
    };
    GameScene.prototype.resolveUrl = function () {
        try {
            var urlParts = this.hostName.split(":");
            var urlPart1 = "";
            for (var i = 0; i < urlParts[0].length; i++) {
                var ascii = urlParts[0].charCodeAt(i);
                var char = String.fromCharCode(ascii);
                urlPart1 += char;
            }
            this.hostName = "".concat(urlPart1, ":").concat(urlParts[1]);
            return true;
        }
        catch (ex) {
            console.log("===");
            console.log(ex);
        }
        return false;
    };
    GameScene.prototype.loadAudioFiles = function () {
        this.soundPlayersShowCard = [
            { "m": this.ui.audioResources.equip1, "f": this.ui.audioResources.equip1 },
            { "m": this.ui.audioResources.equip2, "f": this.ui.audioResources.equip2 },
            { "m": this.ui.audioResources.zhu_junlve, "f": this.ui.audioResources.zhu_lijian2 },
            { "m": this.ui.audioResources.sha, "f": this.ui.audioResources.f_sha },
            { "m": this.ui.audioResources.sha_fire, "f": this.ui.audioResources.f_sha_fire },
            { "m": this.ui.audioResources.sha_thunder, "f": this.ui.audioResources.f_sha_thunder },
        ];
        this.soundPool[CommonMethods.audioLiangpai] = { "m": this.ui.audioResources.liangpai_m_shelie1, "f": this.ui.audioResources.liangpai_f_biyue1 };
        this.soundPool[CommonMethods.audioShuaicuo] = { "m": this.ui.audioResources.shuaicuo_m_fankui2, "f": this.ui.audioResources.shuaicuo_f_guose2 };
        this.soundPool[CommonMethods.audioRecoverhp] = this.ui.audioResources.recover;
        this.soundPool[CommonMethods.audioDraw] = this.ui.audioResources.draw;
        this.soundPool[CommonMethods.audioDrawx] = this.ui.audioResources.drawx;
        this.soundPool[CommonMethods.audioTie] = this.ui.audioResources.tie;
        this.soundPool[CommonMethods.audioWin] = this.ui.audioResources.win;
        this.soundPool[CommonMethods.audioGameStart] = this.ui.audioResources.game_start;
        this.soundPool[CommonMethods.audioEnterHall] = this.ui.audioResources.enter_hall_click;
        this.soundPool[CommonMethods.audioCountdown8Sec] = this.ui.audioResources.countdown_8_sec;
        this.soundPool[CommonMethods.audioEnterRoom] = [
            [],
            [],
            this.ui.audioResources.enter_room_kongcheng11,
            this.ui.audioResources.enter_room_kongcheng12,
            this.ui.audioResources.game_start
        ];
    };
    GameScene.prototype.saveSettings = function () { };
    // [flag, pass, email]
    GameScene.prototype.savePlayerLoginInfo = function (loginInfo) {
        this.nickNameOverridePass = loginInfo[1];
        this.game.saveConfig('NickNameOverridePass', loginInfo[1]);
        this.game.saveConfig('playerEmail', loginInfo[2]);
    };
    GameScene.prototype.sendMessageToServer = function (messageType, playerID, content) {
        this.websocket.send(JSON.stringify({
            "messageType": messageType, "playerID": playerID, "content": content
        }));
    };
    GameScene.prototype.isInGameHall = function () {
        return this.ui && this.ui.frameGameHall && this.ui.frameGameHall;
    };
    GameScene.prototype.isInGameRoom = function () {
        return this.ui && this.ui.roomOwnerText;
    };
    GameScene.prototype.playAudio = function (audioName, sex) {
        var audioInfo = [];
        if (typeof audioName === "string") {
            if (sex) {
                audioInfo = this.soundPool[audioName][sex];
            }
            else {
                audioInfo = this.soundPool[audioName];
            }
        }
        else if (typeof audioName === "number" && sex) {
            // 杀牌音效
            audioInfo = this.soundPlayersShowCard[audioName][sex];
        }
        if (audioInfo && audioInfo.length >= 2 && this.ui.audioResourceObjects.hasOwnProperty("".concat(audioInfo[0]).concat(audioInfo[1]))) {
            this.ui.audioResourceObjects["".concat(audioInfo[0]).concat(audioInfo[1])].currentTime = 0;
            this.ui.audioResourceObjects["".concat(audioInfo[0]).concat(audioInfo[1])].play();
        }
    };
    GameScene.prototype.stopAudio = function (audioName, sex) {
        var audioInfo = [];
        if (typeof audioName === "string") {
            if (sex) {
                audioInfo = this.soundPool[audioName][sex];
            }
            else {
                audioInfo = this.soundPool[audioName];
            }
        }
        else if (typeof audioName === "number" && sex) {
            // 杀牌音效
            audioInfo = this.soundPlayersShowCard[audioName][sex];
        }
        if (audioInfo && audioInfo.length >= 2 && this.ui.audioResourceObjects.hasOwnProperty("".concat(audioInfo[0]).concat(audioInfo[1]))) {
            this.ui.audioResourceObjects["".concat(audioInfo[0]).concat(audioInfo[1])].currentTime = 0;
            this.ui.audioResourceObjects["".concat(audioInfo[0]).concat(audioInfo[1])].pause();
        }
    };
    return GameScene;
}());
export { GameScene };
