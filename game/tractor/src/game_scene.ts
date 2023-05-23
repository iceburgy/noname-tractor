import { RoomSetting } from "./room_setting.js";
import { GameState } from "./game_state.js";
import { CurrentHandState } from "./current_hand_state.js";
import { CurrentTrickState } from "./current_trick_state.js";
import { MainForm } from "./main_form.js";
import { Coordinates } from "./coordinates.js";
import { CommonMethods } from "./common_methods.js";
import { ShowingCardsValidationResult } from "./showing_cards_validation_result.js";
import { ReplayEntity } from "./replay_entity.js";
import { IDBHelper } from "./idb_helper.js";
import { EnterHallInfo } from './enter_hall_info.js';

const dummyValue = "dummyValue"
const IPPort = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?):(6553[0-5]|655[0-2][0-9]|65[0-4][0-9][0-9]|6[0-4][0-9][0-9][0-9][0-9]|[1-5](\d){4}|[1-9](\d){0,3})$/;
declare let CryptoJS: any;
declare let decadeUI: any;

export class GameScene {
    public isReplayMode: boolean
    // public appVersion: string
    public hostName!: string;
    public hostNameOriginal
    public playerName!: string;
    public websocket: any
    // // public prepareBtn: Phaser.GameObjects.Image
    // // public prepareOkImg: Phaser.GameObjects.Image[]
    // // public pokerTableChairImg: { tableImg: any, chairImgs: Phaser.GameObjects.Image[] }[]
    // // public pokerTableChairNames: { tableName: any, chairNames: { myOwnName: any, observerNames: Phaser.GameObjects.Text[] }[] }[]
    public mainForm!: MainForm;
    public cardImages!: any[]
    public cardImageSequence!: any[]
    public toolbarImages!: any[]
    public sidebarImages!: any[]
    public scoreCardsImages!: any[]
    public scoreTotalText!: any
    public scoreCardsIntsDrawn!: number[]
    public last8CardsImages!: any[]
    public showedCardImages!: any[]
    public OverridingFlagImage: any
    public overridingLabelImages!: string[]
    public overridingLabelAnims: any
    // // public hallPlayerHeader: Phaser.GameObjects.Text
    // // public hallPlayerNames: Phaser.GameObjects.Text[]
    // // public btnJoinAudio: Phaser.GameObjects.Text
    // // public btnQiandao: Phaser.GameObjects.Text
    // public joinAudioUrl: string 
    public nickNameOverridePass: string = ""
    public playerEmail: string = ""
    public clientMessages!: any[]
    public danmuMessages!: any[]
    // // public roomUIControls: { images: any[], texts: Phaser.GameObjects.Text[], imagesChair: Phaser.GameObjects.Image[] }
    public soundPool: any
    public soundMaleLiangpai!: string[];
    public soundFemaleLiangpai!: string[];
    public soundMaleShuaicuo!: string[];
    public soundFemaleShuaicuo!: string[];

    public soundRecoverhp!: string[];
    public sounddraw!: string[];
    public sounddrawx!: string[];
    public soundPlayersShowCard!: any[]
    public soundtie!: string[];
    // public soundclickwa!: string;
    public soundwin!: string[];
    // public soundVolume!: number
    public noDongtu!: string
    public noDongtuUntil!: string
    public noDanmu!: string
    public noTouchDevice!: string
    public noCutCards!: string
    public yesDragSelect!: string
    public yesFirstPersonView!: string
    public qiangliangMin!: string
    public skinInUse!: string
    // public decadeUICanvas: HTMLElement 
    public coordinates!: Coordinates
    public wsprotocal: string = "wss"
    public game: any
    public lib: any
    public ui: any
    public get: any

    constructor(irm: boolean, hostName: string, playerName: string, nickNameOverridePass: string, playerEmail: string, gameIn: any, libIn: any, uiIn: any, getIn: any) {
        this.game = gameIn;
        this.lib = libIn;
        this.ui = uiIn;
        this.get = getIn;
        this.isReplayMode = irm;
        // // this.existPlayers = [1]
        // // this.websocket = null
        // // this.getPlayerMsgCnt = 0
        // // this.prepareOkImg = [null, null, null, null]
        // // this.pokerTableChairImg = []
        // // this.pokerTableChairNames = []
        this.cardImages = [];
        this.cardImageSequence = [];
        this.toolbarImages = [];
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
        ]
        this.overridingLabelAnims = [
            ["", ""],
            ["", ""],
            ["effect_qinglongyanyuedao", undefined],
            ["effect_shoujidonghua", "play3"],
            ["effect_shoujidonghua", "play5"]
        ]
        // // this.hallPlayerNames = [];
        this.clientMessages = [];
        this.danmuMessages = [];
        this.noDongtu = "false";
        this.noDongtuUntil = (this.lib && this.lib.config && this.lib.config.noDongtuUntil) ? this.lib.config.noDongtuUntil : "";
        this.noDanmu = (this.lib && this.lib.config && this.lib.config.noDanmu) ? this.lib.config.noDanmu : "false";
        this.noTouchDevice = (this.lib && this.lib.config && this.lib.config.noTouchDevice) ? this.lib.config.noTouchDevice : "false";
        this.noCutCards = (this.lib && this.lib.config && this.lib.config.noCutCards) ? this.lib.config.noCutCards : "false";
        this.yesDragSelect = (this.lib && this.lib.config && this.lib.config.yesDragSelect) ? this.lib.config.yesDragSelect : "false";
        this.yesFirstPersonView = (this.lib && this.lib.config && this.lib.config.yesFirstPersonView) ? this.lib.config.yesFirstPersonView : "false";
        this.qiangliangMin = (this.lib && this.lib.config && this.lib.config.qiangliangMin) ? this.lib.config.qiangliangMin : "5";
        // // if (this.qiangliangMin === undefined) this.qiangliangMin = '5'

        IDBHelper.maxReplays = (this.lib && this.lib.config && this.lib.config.maxReplays) ? this.lib.config.maxReplays : IDBHelper.maxReplays;
        this.coordinates = new Coordinates(this.isReplayMode);

        if (this.isReplayMode) {
            this.doReplay();
            return;
        }

        this.hostName = hostName.trim()
        this.hostNameOriginal = this.hostName
        this.playerName = playerName.trim()
        if (this.playerName && CommonMethods.IsNumber(this.playerName)) {
            document.body.innerHTML = `<div>!!! 昵称不能以数字开头结尾：${this.playerName}</div>`
            this.hostName = "";
            return;
        }
        let isIPPort = IPPort.test(this.hostName);
        if (isIPPort) {
            this.wsprotocal = "ws";
        } else {
            if (!(/(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)$)/gi.test(this.hostName)) && !this.processAuth()) {
                document.body.innerHTML = `<div>!!! 解析服务器地址失败，请确认输入信息无误：${this.hostNameOriginal}</div>`
                this.hostName = "";
                return;
            }
            this.resolveUrl()
        }
        this.nickNameOverridePass = nickNameOverridePass;
        this.playerEmail = playerEmail;


        this.soundPool = {};
        this.loadAudioFiles();

        this.connect();
    }

    // non-replay mode, online
    connect() {
        if (!this.hostName) return;
        try {
            if (this.websocket) {
                this.websocket.close();
                delete this.websocket;
            }
            this.websocket = new WebSocket(`${this.wsprotocal}://${this.hostName}`)
            this.websocket.gs = this;
            this.websocket.onopen = function () {
                // try {
                console.log("连接成功")
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
                let enterHallInfo: EnterHallInfo = new EnterHallInfo(this.gs.nickNameOverridePass, this.gs.playerEmail, CommonMethods.PLAYER_CLIENT_TYPE_TLJAPP);
                this.gs.sendMessageToServer(CommonMethods.PLAYER_ENTER_HALL_REQUEST, this.gs.playerName, JSON.stringify(enterHallInfo));

                this.gs.mainForm = new MainForm(this.gs)
                this.gs.mainForm.drawFrameMain();
                this.gs.mainForm.drawFrameChat();
                CommonMethods.BuildCardNumMap()

                IDBHelper.InitIDB(() => { void (0); });
                this.gs.mainForm.LoadUIUponConnect();

                // } catch (e) {
                //     // alert("error")
                //     document.body.innerHTML = `<div>!!! onopen Error: ${e}</div>`
                // }
            }
            this.websocket.onmessage = function (message: any) {
                // try {
                const data = JSON.parse(message.data)
                const messageType = data["messageType"]
                const playerID = data["playerID"]
                const content = data["content"]
                // console.log(messageType)
                // console.log(content)

                const objList = JSON.parse(content)
                if (objList == null || objList.length == 0) return

                switch (messageType) {
                    case CommonMethods.NotifyGameHall_RESPONSE:
                        this.gs.handleNotifyGameHall(objList);
                        break;
                    case CommonMethods.NotifyOnlinePlayerList_RESPONSE:
                        this.gs.handleNotifyOnlinePlayerList(playerID, objList);
                        break;
                    case CommonMethods.NotifyGameRoomPlayerList_RESPONSE:
                        this.gs.handleNotifyGameRoomPlayerList(playerID, objList);
                        break;
                    case CommonMethods.NotifyMessage_RESPONSE:
                        this.gs.handleNotifyMessage(objList);
                        break;
                    case CommonMethods.NotifyRoomSetting_RESPONSE:
                        this.gs.handleNotifyRoomSetting(objList);
                        break;
                    case CommonMethods.NotifyGameState_RESPONSE:
                        this.gs.handleNotifyGameState(objList);
                        break;
                    case CommonMethods.NotifyCurrentHandState_RESPONSE:
                        this.gs.handleNotifyCurrentHandState(objList);
                        break;
                    case CommonMethods.NotifyCurrentTrickState_RESPONSE:
                        this.gs.handleNotifyCurrentTrickState(objList);
                        break;
                    case CommonMethods.GetDistributedCard_RESPONSE:
                        this.gs.handleGetDistributedCard(objList);
                        break;
                    case CommonMethods.NotifyCardsReady_RESPONSE:
                        this.gs.handleNotifyCardsReady(objList);
                        break;
                    case CommonMethods.NotifyDumpingValidationResult_RESPONSE:
                        this.gs.handleNotifyDumpingValidationResult(objList);
                        break;
                    case CommonMethods.NotifyTryToDumpResult_RESPONSE:
                        this.gs.handleNotifyTryToDumpResult(objList);
                        break;
                    case CommonMethods.NotifyStartTimer_RESPONSE:
                        this.gs.handleNotifyStartTimer(objList);
                        break;
                    case CommonMethods.NotifyEmoji_RESPONSE:
                        this.gs.handleNotifyEmoji(objList);
                        break;
                    case CommonMethods.CutCardShoeCards_RESPONSE:
                        this.gs.handleCutCardShoeCards();
                        break;
                    case CommonMethods.NotifyReplayState_RESPONSE:
                        this.gs.handleNotifyReplayState(objList);
                        break;
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
                    case CommonMethods.NotifyDaojuInfo_RESPONSE:
                        this.gs.handleNotifyDaojuInfo(objList);
                        break;
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
            }
            this.websocket.onerror = function (e: any) {
                document.body.innerHTML = `<div>!!! 尝试与服务器建立连接失败，请确认输入信息无误：${this.gs.hostNameOriginal}</div>`
                console.error(JSON.stringify(e));
            }
        } catch (e: any) {
            document.body.innerHTML = `<div>!!! 尝试连接服务器出错，请确认输入信息无误：${this.hostNameOriginal}</div>`
            console.log(e);
        }
    }

    // replay mode, offline
    doReplay() {
        this.mainForm = new MainForm(this)
        this.mainForm.drawFrameMain();
        this.mainForm.drawGameRoom();
        this.mainForm.drawFrameChat();
        CommonMethods.BuildCardNumMap()
        this.mainForm.LoadUIUponConnect();

        IDBHelper.InitIDB(() => {
            this.mainForm.DoReplayMainForm();
        });
    }

    // public handleNotifyUpdateGobang_RESPONSE(objList) {
    //     var result: SGGBState = objList[0];
    //     this.mainForm.sgDrawingHelper.NotifyUpdateGobang(result);
    // }

    public handleNotifyDaojuInfo(objList: any) {
        var daojuInfo: any = objList[0];
        var updateQiandao: boolean = objList[1];
        var updateSkin: boolean = objList[2];
        this.mainForm.tractorPlayer.NotifyDaojuInfo(daojuInfo, updateQiandao, updateSkin);
    }

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

    public handleNotifyPing_RESPONSE() {
        this.mainForm.tractorPlayer.NotifyPing()
    }

    public handleNotifyReplayState(objList: any) {
        var result: ReplayEntity = objList[0];
        IDBHelper.SaveReplayEntity(result, () => { void (0); })
    }

    public handleCutCardShoeCards() {
        this.mainForm.CutCardShoeCardsEventHandler()
    }

    public handleNotifyEmoji(objList: any) {
        this.mainForm.NotifyEmojiEventHandler.apply(this.mainForm, objList)
    }

    public handleNotifyStartTimer(objList: any) {
        var result: number = objList[0];
        this.mainForm.NotifyStartTimerEventHandler(result)
    }

    public handleNotifyDumpingValidationResult(objList: any) {
        var result: ShowingCardsValidationResult = objList[0];
        this.mainForm.NotifyDumpingValidationResultEventHandler(result)
    }

    public handleNotifyTryToDumpResult(objList: any) {
        var result: ShowingCardsValidationResult = objList[0];
        this.mainForm.NotifyTryToDumpResultEventHandler(result)
    }

    public handleNotifyCardsReady(objList: any) {
        var cardsReady: boolean[] = objList[0];
        this.mainForm.tractorPlayer.NotifyCardsReady(cardsReady)
    }

    public handleGetDistributedCard(objList: any) {
        var cardNumber: number = objList[0];
        this.mainForm.tractorPlayer.GetDistributedCard(cardNumber)
    }

    public handleNotifyGameHall(objList: any) {
        var roomStateList = objList[0];
        var playerList = objList[1];
        this.mainForm.NotifyGameHallEventHandler(roomStateList, playerList)
    }

    public handleNotifyOnlinePlayerList(playerID: string, objList: any) {
        var isJoining: boolean = objList[0];
        this.mainForm.NotifyOnlinePlayerListEventHandler(playerID, isJoining)
    }

    public handleNotifyGameRoomPlayerList(playerID: string, objList: any) {
        var isJoining: boolean = objList[0];
        var roomName: string = objList[1];
        this.mainForm.NotifyGameRoomPlayerListEventHandler(playerID, isJoining, roomName)
    }

    public handleNotifyMessage(objList: any) {
        var msgs = objList[0];
        this.mainForm.tractorPlayer.NotifyMessage(msgs)
    }

    public handleNotifyRoomSetting(objList: any) {
        var roomSetting: RoomSetting = objList[0];
        var showMessage: boolean = objList[1];
        this.mainForm.tractorPlayer.NotifyRoomSetting(roomSetting, showMessage)
    }

    public handleNotifyGameState(objList: any) {
        var gameState: GameState = objList[0];
        var notifyType: string = objList[1];
        this.mainForm.tractorPlayer.NotifyGameState(gameState, notifyType)
    }

    public handleNotifyCurrentHandState(objList: any) {
        var currentHandState: CurrentHandState = objList[0];
        var notifyType: string = objList[1];
        this.mainForm.tractorPlayer.NotifyCurrentHandState(currentHandState, notifyType)
    }

    public handleNotifyCurrentTrickState(objList: any) {
        var currentTrickState: CurrentTrickState = objList[0];
        var notifyType: string = objList[1];
        this.mainForm.tractorPlayer.NotifyCurrentTrickState(currentTrickState, notifyType)
    }

    private processAuth(): boolean {
        try {
            var bytes = CryptoJS.AES.decrypt(this.hostName, dummyValue);
            var originalText = bytes.toString(CryptoJS.enc.Utf8);
            if (bytes && bytes.sigBytes > 0 && originalText) {
                this.hostName = originalText
                return true;
            }
        } catch (ex) {
            console.log("===")
            console.log(ex)
        }
        return false;
    }

    private resolveUrl(): boolean {
        try {
            let urlParts = this.hostName.split(":");
            let urlPart1 = "";
            for (let i = 0; i < urlParts[0].length; i++) {
                let ascii = urlParts[0].charCodeAt(i);
                let char = String.fromCharCode(ascii);
                urlPart1 += char;
            }
            this.hostName = `${urlPart1}:${urlParts[1]}`;
            return true;
        } catch (ex) {
            console.log("===")
            console.log(ex)
        }
        return false;
    }

    public loadAudioFiles() {
        this.soundMaleLiangpai = ["effect", "liangpai_m_shelie1"];
        this.soundFemaleLiangpai = ["effect", "liangpai_f_biyue1"];
        this.soundMaleShuaicuo = ["effect", "shuaicuo_m_fankui2"];
        this.soundFemaleShuaicuo = ["effect", "shuaicuo_f_guose2"];

        let tempequip1 = ["effect", "equip1"];
        let tempequip2 = ["effect", "equip2"];
        let tempmalediaozhu = ["effect", "zhu_junlve"];
        let tempfemalediaozhu = ["effect", "zhu_lijian2"];
        let tempmalesha = ["effect", "sha"];
        let tempfemalesha = ["effect", "f_sha"];
        let tempmaleshafire = ["effect", "sha_fire"];
        let tempfemaleshafire = ["effect", "f_sha_fire"];
        let tempmaleshathunder = ["effect", "sha_thunder"];
        let tempfemaleshathunder = ["effect", "f_sha_thunder"];
        this.soundPlayersShowCard = [
            { "m": tempequip1, "f": tempequip1 },
            { "m": tempequip2, "f": tempequip2 },
            { "m": tempmalediaozhu, "f": tempfemalediaozhu },
            { "m": tempmalesha, "f": tempfemalesha },
            { "m": tempmaleshafire, "f": tempfemaleshafire },
            { "m": tempmaleshathunder, "f": tempfemaleshathunder },
        ];

        this.soundPool[CommonMethods.audioLiangpai] = { "m": this.soundMaleLiangpai, "f": this.soundFemaleLiangpai };
        this.soundPool[CommonMethods.audioShuaicuo] = { "m": this.soundMaleShuaicuo, "f": this.soundFemaleShuaicuo };

        this.soundPool[CommonMethods.audioRecoverhp] = ["effect", "recover"];
        this.soundPool[CommonMethods.audioDraw] = ["effect", "draw"];
        this.soundPool[CommonMethods.audioDrawx] = ["effect", "drawx"];
        this.soundPool[CommonMethods.audioTie] = ["effect", "tie"];
        this.soundPool[CommonMethods.audioWin] = ["effect", "win"];
        this.soundPool[CommonMethods.audioGameStart] = ["effect", "game_start"];
    }

    public saveSettings() {
        // cookies.set('maxReplays', IDBHelper.maxReplays, { path: '/', expires: CommonMethods.GetCookieExpires() });
    }

    // [flag, pass, email]
    public savePlayerLoginInfo(loginInfo: string[]) {
        this.nickNameOverridePass = loginInfo[1];
        this.game.saveConfig('NickNameOverridePass', loginInfo[1]);
        this.game.saveConfig('playerEmail', loginInfo[2]);
    }

    public sendMessageToServer(messageType: string, playerID: string, content: string) {
        this.websocket.send(JSON.stringify({
            "messageType": messageType, "playerID": playerID, "content": content
        }))
    }

    public isInGameHall() {
        return this.ui && this.ui.frameGameHall && this.ui.frameGameHall;
    }

    public isInGameRoom() {
        return this.ui && this.ui.roomOwnerText;
    }

    public playAudio(audioName: string | number, sex?: string) {
        let audioInfo: string[] = [];
        if (typeof audioName === "string") {
            if (sex) {
                audioInfo = this.soundPool[audioName][sex];
            } else {
                audioInfo = this.soundPool[audioName];
            }
        } else if (sex) {
            audioInfo = this.soundPlayersShowCard[audioName][sex];
        } else {
            return;
        }
        this.game.playAudio(audioInfo[0], audioInfo[1]);
    }
}

