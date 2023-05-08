// import { Match } from './match.js';
// import { RoomState } from './room_state.js';
// import { count } from "console";
// import { RoomSetting } from "./room_setting.js";
// import { GameState } from "./game_state.js";
// import { CurrentHandState } from "./current_hand_state.js";
// import { CurrentTrickState } from "./current_trick_state.js";
// import { TractorPlayer } from "./tractor_player.js";
import { MainForm } from "./main_form.js";
// import { Coordinates } from "./coordinates.js";
import { CommonMethods } from "./common_methods.js";
// import { ShowingCardsValidationResult } from "./showing_cards_validation_result.js";
// import { ReplayEntity } from "./replay_entity.js";
// import { IDBHelper } from "./idb_helper.js";
var dummyValue = "dummyValue";
var IPPort = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?):(6553[0-5]|655[0-2][0-9]|65[0-4][0-9][0-9]|6[0-4][0-9][0-9][0-9][0-9]|[1-5](\d){4}|[1-9](\d){0,3})$/;
var GameScene = /** @class */ (function () {
    function GameScene(hostName, playerName, nickNameOverridePass, playerEmail) {
        // // public cardImages: Phaser.GameObjects.GameObject[]
        // // public cardImageSequence: Phaser.GameObjects.Text[]
        // // public toolbarImages: Phaser.GameObjects.GameObject[]
        // // public sidebarImages: Phaser.GameObjects.GameObject[]
        // // public scoreCardsImages: Phaser.GameObjects.GameObject[]
        // // public last8CardsImages: Phaser.GameObjects.GameObject[]
        // // public showedCardImages: Phaser.GameObjects.GameObject[]
        // // public OverridingFlagImage: Phaser.GameObjects.Image
        // public overridingLabelImages: string[] 
        // public overridingLabelAnims: string[] 
        // // public hallPlayerHeader: Phaser.GameObjects.Text
        // // public hallPlayerNames: Phaser.GameObjects.Text[]
        // // public btnJoinAudio: Phaser.GameObjects.Text
        // // public btnQiandao: Phaser.GameObjects.Text
        // public joinAudioUrl: string 
        this.nickNameOverridePass = "";
        this.playerEmail = "";
        // // public clientMessages: Phaser.GameObjects.Text[]
        // public danmuMessages: any[] 
        // // public roomUIControls: { images: any[], texts: Phaser.GameObjects.Text[], imagesChair: Phaser.GameObjects.Image[] }
        // public soundPool: any
        // // public soundMaleLiangpai: Phaser.Sound.BaseSound;
        // // public soundFemaleLiangpai: Phaser.Sound.BaseSound;
        // // public soundMaleShuaicuo: Phaser.Sound.BaseSound;
        // // public soundFemaleShuaicuo: Phaser.Sound.BaseSound;
        // // public soundRecoverhp: Phaser.Sound.BaseSound;
        // // public sounddraw: Phaser.Sound.BaseSound;
        // // public sounddrawx: Phaser.Sound.BaseSound;
        // public soundPlayersShowCard: any[] 
        // // public soundtie: Phaser.Sound.BaseSound;
        // // public soundclickwa: Phaser.Sound.BaseSound;
        // // public soundwin: Phaser.Sound.BaseSound;
        // public soundVolume: number 
        // public noDanmu: string 
        // public noCutCards: string 
        // public yesDragSelect: string 
        // public yesFirstPersonView: string 
        // public qiangliangMin: string 
        // public skinInUse: string 
        // public decadeUICanvas: HTMLElement 
        // public coordinates: Coordinates 
        this.wsprotocal = "wss";
        this.isReplayMode = false;
        this.hostName = hostName.trim();
        this.hostNameOriginal = this.hostName;
        this.playerName = playerName.trim();
        if (this.playerName && CommonMethods.IsNumber(this.playerName)) {
            document.body.innerHTML = "<div>!!! \u6635\u79F0\u4E0D\u80FD\u4EE5\u6570\u5B57\u5F00\u5934\u7ED3\u5C3E\uFF1A".concat(this.playerName, "</div>");
            this.hostName = "";
            return;
        }
        // // this.existPlayers = [1]
        // // this.websocket = null
        // // this.getPlayerMsgCnt = 0
        // // this.prepareOkImg = [null, null, null, null]
        // // this.pokerTableChairImg = []
        // // this.pokerTableChairNames = []
        // this.match = new Match()
        // // this.cardImages = [];
        // // this.cardImageSequence = [];
        // // this.toolbarImages = [];
        // // this.sidebarImages = [];
        // // this.scoreCardsImages = [];
        // // this.last8CardsImages = [];
        // // this.showedCardImages = [];
        // this.overridingLabelImages = [];
        // this.overridingLabelAnims = [];
        // // this.hallPlayerNames = [];
        // // this.clientMessages = [];
        // this.danmuMessages = [];
        // // this.roomUIControls = { images: [], texts: [], imagesChair: [] };
        // // this.soundVolume = cookies.get("soundVolume");
        // // if (this.soundVolume === undefined) this.soundVolume = 0.5
        // // this.noDanmu = cookies.get("noDanmu");
        // // if (this.noDanmu === undefined) this.noDanmu = 'false'
        // // this.noCutCards = cookies.get("noCutCards");
        // // if (this.noCutCards === undefined) this.noCutCards = 'false'
        // // this.yesDragSelect = cookies.get("yesDragSelect");
        // // if (this.yesDragSelect === undefined) this.yesDragSelect = 'false'
        // // this.yesFirstPersonView = cookies.get("yesFirstPersonView");
        // // if (this.yesFirstPersonView === undefined) this.yesFirstPersonView = 'false'
        // // this.qiangliangMin = cookies.get("qiangliangMin");
        // // if (this.qiangliangMin === undefined) this.qiangliangMin = '5'
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
        // // this.joinAudioUrl = cookies.get("joinAudioUrl") ? cookies.get("joinAudioUrl") : "";
        // // IDBHelper.maxReplays = cookies.get("maxReplays") ? parseInt(cookies.get("maxReplays")) : IDBHelper.maxReplays;
        this.nickNameOverridePass = nickNameOverridePass;
        this.playerEmail = playerEmail;
        // this.coordinates = new Coordinates(this.isReplayMode);
        // this.soundPool = {};
    }
    GameScene.prototype.connect = function () {
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
                // empty password means recover password or playerName
                if (!this.gs.nickNameOverridePass) {
                    this.gs.nickNameOverridePass = CommonMethods.recoverLoginPassFlag;
                    if (!this.gs.playerName) {
                        this.gs.playerName = "";
                    }
                }
                this.gs.sendMessageToServer(CommonMethods.PLAYER_ENTER_HALL_REQUEST, this.gs.playerName, JSON.stringify([this.gs.nickNameOverridePass, this.gs.playerEmail]));
                this.gs.mainForm = new MainForm(this.gs);
                this.gs.mainForm.drawFrameMain();
                this.gs.mainForm.drawFrameChat();
                // this.loadAudioFiles()
                CommonMethods.BuildCardNumMap();
                // IDBHelper.InitIDB();
                // } catch (e) {
                //     // alert("error")
                //     document.body.innerHTML = `<div>!!! onopen Error: ${e}</div>`
                // }
            };
            this.websocket.onmessage = function (message) {
                // try {
                var data = JSON.parse(message.data);
                var messageType = data["messageType"];
                var playerID = data["playerID"];
                var content = data["content"];
                // console.log(messageType)
                // console.log(content)
                var objList = JSON.parse(content);
                if (objList == null || objList.length == 0)
                    return;
                switch (messageType) {
                    case CommonMethods.NotifyGameHall_RESPONSE:
                        this.gs.handleNotifyGameHall(objList);
                        break;
                    // case CommonMethods.NotifyOnlinePlayerList_RESPONSE:
                    //     this.gs.handleNotifyOnlinePlayerList(playerID, objList);
                    //     break;
                    // case CommonMethods.NotifyGameRoomPlayerList_RESPONSE:
                    //     this.gs.handleNotifyGameRoomPlayerList(playerID, objList);
                    //     break;
                    // case CommonMethods.NotifyMessage_RESPONSE:
                    //     this.gs.handleNotifyMessage(objList);
                    //     break;
                    // case CommonMethods.NotifyRoomSetting_RESPONSE:
                    //     this.gs.handleNotifyRoomSetting(objList);
                    //     break;
                    // case CommonMethods.NotifyGameState_RESPONSE:
                    //     this.gs.handleNotifyGameState(objList);
                    //     break;
                    // case CommonMethods.NotifyCurrentHandState_RESPONSE:
                    //     this.gs.handleNotifyCurrentHandState(objList);
                    //     break;
                    // case CommonMethods.NotifyCurrentTrickState_RESPONSE:
                    //     this.gs.handleNotifyCurrentTrickState(objList);
                    //     break;
                    // case CommonMethods.GetDistributedCard_RESPONSE:
                    //     this.gs.handleGetDistributedCard(objList);
                    //     break;
                    // case CommonMethods.NotifyCardsReady_RESPONSE:
                    //     this.gs.handleNotifyCardsReady(objList);
                    //     break;
                    // case CommonMethods.NotifyDumpingValidationResult_RESPONSE:
                    //     this.gs.handleNotifyDumpingValidationResult(objList);
                    //     break;
                    // case CommonMethods.NotifyTryToDumpResult_RESPONSE:
                    //     this.gs.handleNotifyTryToDumpResult(objList);
                    //     break;
                    // case CommonMethods.NotifyStartTimer_RESPONSE:
                    //     this.gs.handleNotifyStartTimer(objList);
                    //     break;
                    // case CommonMethods.NotifyEmoji_RESPONSE:
                    //     this.gs.handleNotifyEmoji(objList);
                    //     break;
                    // case CommonMethods.CutCardShoeCards_RESPONSE:
                    //     this.gs.handleCutCardShoeCards();
                    //     break;
                    // case CommonMethods.NotifyReplayState_RESPONSE:
                    //     this.gs.handleNotifyReplayState(objList);
                    //     break;
                    case CommonMethods.NotifyPing_RESPONSE:
                        this.gs.handleNotifyPing_RESPONSE();
                        break;
                    // case CommonMethods.NotifySgcsPlayerUpdated_RESPONSE:
                    //     this.gs.handleNotifySgcsPlayerUpdated_RESPONSE(objList);
                    //     break;
                    // case CommonMethods.NotifyCreateCollectStar_RESPONSE:
                    //     this.gs.handleNotifyCreateCollectStar_RESPONSE(objList);
                    //     break;
                    // case CommonMethods.NotifyEndCollectStar_RESPONSE:
                    //     this.gs.handleNotifyEndCollectStar(objList);
                    //     break;
                    // case CommonMethods.NotifyGrabStar_RESPONSE:
                    //     this.gs.handleNotifyGrabStar_RESPONSE(objList);
                    //     break;
                    // case CommonMethods.NotifyDaojuInfo_RESPONSE:
                    //     // this.gs.handleNotifyDaojuInfo(objList);
                    //     break;
                    // case CommonMethods.NotifyUpdateGobang_RESPONSE:
                    //     this.gs.handleNotifyUpdateGobang_RESPONSE(objList);
                    //     break;
                    default:
                        break;
                }
                // } catch (e) {
                //     // alert("error")
                //     document.body.innerHTML = `<div>!!! onmessage Error: ${e}</div>`
                // }
            };
            this.websocket.onerror = function (e) {
                document.body.innerHTML = "<div>!!! \u5C1D\u8BD5\u94FE\u63A5\u670D\u52A1\u5668\u5931\u8D25\uFF0C\u8BF7\u786E\u8BA4\u8F93\u5165\u4FE1\u606F\u65E0\u8BEF\uFF1A".concat(this.gs.hostNameOriginal, "</div>");
                console.error(JSON.stringify(e));
            };
        }
        catch (e) {
            document.body.innerHTML = "<div>!!! \u5C1D\u8BD5\u94FE\u63A5\u670D\u52A1\u5668\u51FA\u9519\uFF0C\u8BF7\u786E\u8BA4\u8F93\u5165\u4FE1\u606F\u65E0\u8BEF\uFF1A".concat(this.hostNameOriginal, "</div>");
            console.log(e);
        }
    };
    // public handleNotifyUpdateGobang_RESPONSE(objList) {
    //     var result: SGGBState = objList[0];
    //     this.mainForm.sgDrawingHelper.NotifyUpdateGobang(result);
    // }
    // public handleNotifyDaojuInfo(objList: []) {
    //     var daojuInfo: any = objList[0];
    //     var updateQiandao: boolean = objList[1];
    //     var updateSkin: boolean = objList[2];
    //     this.mainForm.tractorPlayer.NotifyDaojuInfo(daojuInfo, updateQiandao, updateSkin);
    // }
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
    // public handleNotifyReplayState(objList: []) {
    //     var result: ReplayEntity = objList[0];
    //     this.mainForm.tractorPlayer.NotifyReplayState(result)
    // }
    // public handleCutCardShoeCards() {
    //     this.mainForm.tractorPlayer.CutCardShoeCards()
    // }
    // public handleNotifyEmoji(objList: []) {
    //     this.mainForm.tractorPlayer.NotifyEmoji(...objList)
    // }
    // public handleNotifyStartTimer(objList: []) {
    //     var result: number = objList[0];
    //     this.mainForm.tractorPlayer.NotifyStartTimer(result)
    // }
    // public handleNotifyDumpingValidationResult(objList: []) {
    //     var result: ShowingCardsValidationResult = objList[0];
    //     this.mainForm.tractorPlayer.NotifyDumpingValidationResult(result)
    // }
    // public handleNotifyTryToDumpResult(objList: []) {
    //     var result: ShowingCardsValidationResult = objList[0];
    //     this.mainForm.tractorPlayer.NotifyTryToDumpResult(result)
    // }
    // public handleNotifyCardsReady(objList: []) {
    //     var cardsReady: boolean[] = objList[0];
    //     this.mainForm.tractorPlayer.NotifyCardsReady(cardsReady)
    // }
    // public handleGetDistributedCard(objList: []) {
    //     var cardNumber: number = objList[0];
    //     this.mainForm.tractorPlayer.GetDistributedCard(cardNumber)
    // }
    GameScene.prototype.handleNotifyGameHall = function (objList) {
        var roomStateList = objList[0];
        var playerList = objList[1];
        this.game.clearConnect();
        this.mainForm.NotifyGameHallEventHandler(roomStateList, playerList);
    };
    // public handleNotifyOnlinePlayerList(playerID: string, objList: []) {
    //     var isJoining: boolean = objList[0];
    //     this.mainForm.tractorPlayer.NotifyOnlinePlayerList(playerID, isJoining)
    // }
    // public handleNotifyGameRoomPlayerList(playerID: string, objList: []) {
    //     var isJoining: boolean = objList[0];
    //     var roomName: string = objList[1];
    //     this.mainForm.tractorPlayer.NotifyGameRoomPlayerList(playerID, isJoining, roomName)
    // }
    // public handleNotifyMessage(objList: []) {
    //     var msgs = objList[0];
    //     this.mainForm.tractorPlayer.NotifyMessage(msgs)
    // }
    // public handleNotifyRoomSetting(objList: []) {
    //     var roomSetting: RoomSetting = objList[0];
    //     var showMessage: boolean = objList[1];
    //     this.mainForm.tractorPlayer.NotifyRoomSetting(roomSetting, showMessage)
    // }
    // public handleNotifyGameState(objList: []) {
    //     var gameState: GameState = objList[0];
    //     var notifyType: string = objList[1];
    //     this.mainForm.tractorPlayer.NotifyGameState(gameState, notifyType)
    // }
    // public handleNotifyCurrentHandState(objList: []) {
    //     var currentHandState: CurrentHandState = objList[0];
    //     var notifyType: string = objList[1];
    //     this.mainForm.tractorPlayer.NotifyCurrentHandState(currentHandState, notifyType)
    // }
    // public handleNotifyCurrentTrickState(objList: []) {
    //     var currentTrickState: CurrentTrickState = objList[0];
    //     var notifyType: string = objList[1];
    //     this.mainForm.tractorPlayer.NotifyCurrentTrickState(currentTrickState, notifyType)
    // }
    GameScene.prototype.processAuth = function () {
        try {
            var CryptoJS = require("crypto-js");
            var bytes = CryptoJS.AES.decrypt(this.hostName, dummyValue);
            var originalText = bytes.toString(CryptoJS.enc.Utf8);
            if (bytes && bytes.sigBytes > 0 && originalText) {
                this.hostName = originalText;
                return true;
            }
        }
        catch (_a) { }
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
    // public loadAudioFiles() {
    //     this.mainForm.enableSound = this.soundVolume > 0
    //     this.soundMaleLiangpai = this.sound.add("soundMaleLiangpai", { volume: this.soundVolume });
    //     this.soundFemaleLiangpai = this.sound.add("soundFemaleLiangpai", { volume: this.soundVolume });
    //     this.soundMaleShuaicuo = this.sound.add("soundMaleShuaicuo", { volume: this.soundVolume });
    //     this.soundFemaleShuaicuo = this.sound.add("soundFemaleShuaicuo", { volume: this.soundVolume });
    //     let tempequip1 = this.sound.add("equip1", { volume: this.soundVolume });
    //     let tempequip2 = this.sound.add("equip2", { volume: this.soundVolume });
    //     let tempmalediaozhu = this.sound.add("soundMaleDiaozhu", { volume: this.soundVolume });
    //     let tempfemalediaozhu = this.sound.add("soundFemaleDiaozhu", { volume: this.soundVolume });
    //     let tempmalesha = this.sound.add("soundMaleSha", { volume: this.soundVolume });
    //     let tempfemalediaosha = this.sound.add("soundFemaleSha", { volume: this.soundVolume });
    //     let tempmaleshafire = this.sound.add("soundMaleShafire", { volume: this.soundVolume });
    //     let tempfemaleshafire = this.sound.add("soundFemaleShafire", { volume: this.soundVolume });
    //     let tempmaleshathunder = this.sound.add("soundMaleShathunder", { volume: this.soundVolume });
    //     let tempfemaleshathunder = this.sound.add("soundFemaleShathunder", { volume: this.soundVolume });
    //     this.soundPlayersShowCard = [
    //         { "m": tempequip1, "f": tempequip1 },
    //         { "m": tempequip2, "f": tempequip2 },
    //         { "m": tempmalediaozhu, "f": tempfemalediaozhu },
    //         { "m": tempmalesha, "f": tempfemalediaosha },
    //         { "m": tempmaleshafire, "f": tempfemaleshafire },
    //         { "m": tempmaleshathunder, "f": tempfemaleshathunder },
    //     ];
    //     this.soundPool[CommonMethods.audioLiangpai] = { "m": this.soundMaleLiangpai, "f": this.soundFemaleLiangpai };
    //     this.soundPool[CommonMethods.audioShuaicuo] = { "m": this.soundMaleShuaicuo, "f": this.soundFemaleShuaicuo };
    //     this.soundPool[CommonMethods.audioDiaozhu] = { "m": this.soundMaleDiaozhu, "f": this.soundFemaleDiaozhu };
    //     this.soundPool[CommonMethods.audioSha] = { "m": this.soundMaleSha, "f": this.soundFemaleSha };
    //     this.soundPool[CommonMethods.audioShafire] = { "m": this.soundMaleShafire, "f": this.soundFemaleShafire };
    //     this.soundPool[CommonMethods.audioShathunder] = { "m": this.soundMaleShathunder, "f": this.soundFemaleShathunder };
    //     this.soundRecoverhp = this.sound.add("recoverhp", { volume: this.soundVolume });
    //     this.sounddraw = this.sound.add("draw", { volume: this.soundVolume });
    //     this.sounddrawx = this.sound.add("drawx", { volume: this.soundVolume });
    //     this.soundtie = this.sound.add("tie", { volume: this.soundVolume });
    //     this.soundwin = this.sound.add("win", { volume: this.soundVolume });
    //     this.soundclickwa = this.sound.add("clickwa", { volume: this.soundVolume });
    // }
    // public saveSettings() {
    //     cookies.set('soundVolume', this.soundVolume, { path: '/', expires: CommonMethods.GetCookieExpires() });
    //     cookies.set('noDanmu', this.noDanmu, { path: '/', expires: CommonMethods.GetCookieExpires() });
    //     cookies.set('noCutCards', this.noCutCards, { path: '/', expires: CommonMethods.GetCookieExpires() });
    //     cookies.set('yesDragSelect', this.yesDragSelect, { path: '/', expires: CommonMethods.GetCookieExpires() });
    //     cookies.set('yesFirstPersonView', this.yesFirstPersonView, { path: '/', expires: CommonMethods.GetCookieExpires() });
    //     cookies.set('qiangliangMin', this.qiangliangMin, { path: '/', expires: CommonMethods.GetCookieExpires() });
    //     if (this.joinAudioUrl && !this.joinAudioUrl.match(/^https?:\/\//i)) {
    //         this.joinAudioUrl = 'http://' + this.joinAudioUrl;
    //     }
    //     cookies.set('joinAudioUrl', this.joinAudioUrl, { path: '/', expires: CommonMethods.GetCookieExpires() });
    //     cookies.set('maxReplays', IDBHelper.maxReplays, { path: '/', expires: CommonMethods.GetCookieExpires() });
    // }
    // // [flag, pass, email]
    // public savePlayerLoginInfo(loginInfo: string[]) {
    //     this.nickNameOverridePass = loginInfo[1];
    //     cookies.set('NickNameOverridePass', loginInfo[1], { path: '/', expires: CommonMethods.GetCookieExpires() });
    //     cookies.set('playerEmail', loginInfo[2], { path: '/', expires: CommonMethods.GetCookieExpires() });
    // }
    GameScene.prototype.sendMessageToServer = function (messageType, playerID, content) {
        this.websocket.send(JSON.stringify({
            "messageType": messageType, "playerID": playerID, "content": content
        }));
    };
    GameScene.prototype.isInGameHall = function () {
        // TODO:
        // return this.hallPlayerHeader && this.hallPlayerHeader.visible
        return true;
    };
    GameScene.prototype.isInGameRoom = function () {
        // TODO:
        // return this.mainForm.roomNameText && this.mainForm.roomNameText.visible
        return true;
    };
    return GameScene;
}());
export { GameScene };
