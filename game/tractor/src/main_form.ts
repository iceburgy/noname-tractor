import { GameScene } from './game_scene.js';
import { RoomSetting } from './room_setting.js';
import { CurrentPoker } from './current_poker.js';
import { GameState } from './game_state.js';
import { CurrentHandState } from './current_hand_state.js';
import { CurrentTrickState } from './current_trick_state.js';
import { PlayerLocalCache } from './player_local_cache.js';
import { CommonMethods } from './common_methods.js';
import { PlayerEntity } from './player_entity.js';
import { TractorPlayer } from './tractor_player.js';
import { Coordinates } from './coordinates.js';
import { SuitEnums } from './suit_enums.js';
import { DrawingFormHelper } from './drawing_form_helper.js';
import { TractorRules } from './tractor_rules.js';
import { ShowingCardsValidationResult } from './showing_cards_validation_result.js';
import { Algorithm } from './algorithm.js';
import { PokerHelper } from './poker_helper.js';
import { RoomState } from './room_state.js';
import { IDBHelper } from './idb_helper.js';
import { ReplayEntity } from './replay_entity.js';
import { GameReplayScene } from './game_replay_scene.js';
import { FileHelper } from './file_helper.js';
import { debug } from 'console';

const ReadyToStart_REQUEST = "ReadyToStart"
const ToggleIsRobot_REQUEST = "ToggleIsRobot"
const ObserveNext_REQUEST = "ObserveNext"
const ExitRoom_REQUEST = "ExitRoom"
const StoreDiscardedCards_REQUEST = "StoreDiscardedCards"
const PlayerShowCards_REQUEST = "PlayerShowCards"
const ValidateDumpingCards_REQUEST = "ValidateDumpingCards"
const CardsReady_REQUEST = "CardsReady"
const ResumeGameFromFile_REQUEST = "ResumeGameFromFile"
const SaveRoomSetting_REQUEST = "SaveRoomSetting"
const RandomSeat_REQUEST = "RandomSeat"
const SwapSeat_REQUEST = "SwapSeat"
const PLAYER_ENTER_ROOM_REQUEST = "PlayerEnterRoom"
const PLAYER_EXIT_AND_ENTER_ROOM_REQUEST = "ExitAndEnterRoom"
const PLAYER_EXIT_AND_OBSERVE_REQUEST = "ExitAndObserve"
const BUY_USE_SKIN_REQUEST = "BuyUseSkin"
const UsedShengbiType_Qiangliangka = "UsedShengbiType_Qiangliangka"
const PLAYER_QIANDAO_REQUEST = "PlayerQiandao"

export class MainForm {
    // public gameScene: GameScene | GameReplayScene
    public gameScene: GameScene
    public tractorPlayer!: TractorPlayer
    // public btnShowLastTrick: Phaser.GameObjects.Text
    // public btnReady: Phaser.GameObjects.Text
    // public btnRobot: Phaser.GameObjects.Text
    // public btnExitRoom: Phaser.GameObjects.Text
    // public btnExitAndObserve: Phaser.GameObjects.Text

    // gobang
    // public btnSmallGames: Phaser.GameObjects.Text
    // public groupSmallGames: Phaser.GameObjects.Group
    // public panelSmallGames: Phaser.GameObjects.Sprite
    // public btnGobang: Phaser.GameObjects.Text
    // public btnCollectStar: Phaser.GameObjects.Text

    public isSendEmojiEnabled: boolean
    // public btnPig: Phaser.GameObjects.Text

    // public lblNickNames: Phaser.GameObjects.Text[]
    // public lblStarters: Phaser.GameObjects.Text[]
    // public lblObservers: Phaser.GameObjects.Text[];
    // public roomNameText: Phaser.GameObjects.Text;
    // public roomOwnerText: Phaser.GameObjects.Text;

    public PlayerPosition: any
    public PositionPlayer: any
    public myCardIsReady: boolean[]
    public SelectedCards: number[]
    public cardsOrderNumber: number

    public enableSound: boolean
    public drawingFormHelper: DrawingFormHelper
    // public sgDrawingHelper: SGDrawingHelper
    public IsDebug: boolean
    public timerIntervalID: any[]
    public timerCountDown: number
    // public timerImage: Phaser.GameObjects.Text
    public modalForm: any
    public firstWinNormal = 1;
    public firstWinBySha = 3;
    public chatForm: any
    // public sgcsPlayer: SGCSPlayer;
    public rightSideButtonDepth = 1;
    public DaojuInfo: any;
    public MySkinInUse: any;
    public MySkinFrame: any;

    public selectPresetMsgsIsOpen: boolean = false;

    constructor(gs: GameScene) {
        this.gameScene = gs
        this.tractorPlayer = new TractorPlayer(this)
        this.drawingFormHelper = new DrawingFormHelper(this)
        // this.sgDrawingHelper = new SGDrawingHelper(this)
        // this.sgcsPlayer = new SGCSPlayer(this.tractorPlayer.MyOwnId)
        this.PlayerPosition = {}
        this.PositionPlayer = {}
        this.myCardIsReady = []
        this.cardsOrderNumber = 0
        this.enableSound = true
        this.IsDebug = false
        this.SelectedCards = []
        this.timerIntervalID = []
        this.timerCountDown = 0
        this.isSendEmojiEnabled = true;
        this.DaojuInfo = {};
        /*
        /*
                // 房间信息
                this.roomNameText = this.gameScene.add.text(this.gameScene.coordinates.roomNameTextPosition.x, this.gameScene.coordinates.roomNameTextPosition.y, "")
                    .setVisible(false)
                    .setColor("orange")
                    .setFontSize(20)
                    .setShadow(2, 2, "#333333", 2, true, true);
                this.roomOwnerText = this.gameScene.add.text(this.gameScene.coordinates.roomOwnerTextPosition.x, this.gameScene.coordinates.roomOwnerTextPosition.y, "")
                    .setVisible(false)
                    .setColor("orange")
                    .setFontSize(20)
                    .setShadow(2, 2, "#333333", 2, true, true);
                this.gameScene.roomUIControls.texts.push(this.roomNameText)
                this.gameScene.roomUIControls.texts.push(this.roomOwnerText)
        
                // 回看上轮按钮
                this.btnShowLastTrick = this.gameScene.add.text(this.gameScene.coordinates.btnShowLastTrickPosition.x, this.gameScene.coordinates.btnShowLastTrickPosition.y, '上轮')
                    .setDepth(this.rightSideButtonDepth)
                    .setColor('white')
                    .setFontSize(30)
                    .setPadding(10)
                    .setShadow(2, 2, "#333333", 2, true, true)
                    .setStyle({ backgroundColor: 'gray' })
                    .setVisible(false)
                    .setInteractive({ useHandCursor: true })
                    .on('pointerup', () => this.HandleRightClickEmptyArea())
                    .on('pointerover', () => {
                        this.btnShowLastTrick.setStyle({ backgroundColor: 'lightblue' })
                    })
                    .on('pointerout', () => {
                        this.btnShowLastTrick.setStyle({ backgroundColor: 'gray' })
                    })
                this.gameScene.roomUIControls.texts.push(this.btnShowLastTrick)
        
                // 就绪按钮
                this.btnReady = this.gameScene.add.text(this.gameScene.coordinates.btnReadyPosition.x, this.gameScene.coordinates.btnReadyPosition.y, '就绪')
                    .setDepth(this.rightSideButtonDepth)
                    .setColor('white')
                    .setFontSize(30)
                    .setPadding(10)
                    .setShadow(2, 2, "#333333", 2, true, true)
                    .setStyle({ backgroundColor: 'gray' })
                    .setVisible(false)
                    .setInteractive({ useHandCursor: true })
                    .on('pointerup', () => this.btnReady_Click())
                    .on('pointerover', () => {
                        this.btnReady.setStyle({ backgroundColor: 'lightblue' })
                    })
                    .on('pointerout', () => {
                        this.btnReady.setStyle({ backgroundColor: 'gray' })
                    })
                this.gameScene.roomUIControls.texts.push(this.btnReady)
        
                // 托管按钮
                this.btnRobot = this.gameScene.add.text(this.gameScene.coordinates.btnRobotPosition.x, this.gameScene.coordinates.btnRobotPosition.y, '托管')
                    .setDepth(this.rightSideButtonDepth)
                    .setColor('white')
                    .setFontSize(30)
                    .setPadding(10)
                    .setShadow(2, 2, "#333333", 2, true, true)
                    .setStyle({ backgroundColor: 'gray' })
                    .setVisible(false)
                    .setInteractive({ useHandCursor: true })
                    .on('pointerup', () => this.btnRobot_Click())
                    .on('pointerover', () => {
                        this.btnRobot.setStyle({ backgroundColor: 'lightblue' })
                    })
                    .on('pointerout', () => {
                        this.btnRobot.setStyle({ backgroundColor: 'gray' })
                    })
                this.gameScene.roomUIControls.texts.push(this.btnRobot)
        
                // 退出按钮
                this.btnExitRoom = this.gameScene.add.text(this.gameScene.coordinates.btnExitRoomPosition.x, this.gameScene.coordinates.btnExitRoomPosition.y, '退出')
                    .setColor('white')
                    .setFontSize(30)
                    .setPadding(10)
                    .setShadow(2, 2, "#333333", 2, true, true)
                    .setStyle({ backgroundColor: 'gray' })
                    .setInteractive({ useHandCursor: true })
                    .on('pointerup', () => this.btnExitRoom_Click())
                    .on('pointerover', () => {
                        this.btnExitRoom.setStyle({ backgroundColor: 'lightblue' })
                    })
                    .on('pointerout', () => {
                        this.btnExitRoom.setStyle({ backgroundColor: 'gray' })
                    })
        
        /*      
                // 房间信息
                this.roomNameText = this.gameScene.add.text(this.gameScene.coordinates.roomNameTextPosition.x, this.gameScene.coordinates.roomNameTextPosition.y, "")
                    .setVisible(false)
                    .setColor("orange")
                    .setFontSize(20)
                    .setShadow(2, 2, "#333333", 2, true, true);
                this.roomOwnerText = this.gameScene.add.text(this.gameScene.coordinates.roomOwnerTextPosition.x, this.gameScene.coordinates.roomOwnerTextPosition.y, "")
                    .setVisible(false)
                    .setColor("orange")
                    .setFontSize(20)
                    .setShadow(2, 2, "#333333", 2, true, true);
                this.gameScene.roomUIControls.texts.push(this.roomNameText)
                this.gameScene.roomUIControls.texts.push(this.roomOwnerText)
        
                // 回看上轮按钮
                this.btnShowLastTrick = this.gameScene.add.text(this.gameScene.coordinates.btnShowLastTrickPosition.x, this.gameScene.coordinates.btnShowLastTrickPosition.y, '上轮')
                    .setDepth(this.rightSideButtonDepth)
                    .setColor('white')
                    .setFontSize(30)
                    .setPadding(10)
                    .setShadow(2, 2, "#333333", 2, true, true)
                    .setStyle({ backgroundColor: 'gray' })
                    .setVisible(false)
                    .setInteractive({ useHandCursor: true })
                    .on('pointerup', () => this.HandleRightClickEmptyArea())
                    .on('pointerover', () => {
                        this.btnShowLastTrick.setStyle({ backgroundColor: 'lightblue' })
                    })
                    .on('pointerout', () => {
                        this.btnShowLastTrick.setStyle({ backgroundColor: 'gray' })
                    })
                this.gameScene.roomUIControls.texts.push(this.btnShowLastTrick)
        
                // 就绪按钮
                this.btnReady = this.gameScene.add.text(this.gameScene.coordinates.btnReadyPosition.x, this.gameScene.coordinates.btnReadyPosition.y, '就绪')
                    .setDepth(this.rightSideButtonDepth)
                    .setColor('white')
                    .setFontSize(30)
                    .setPadding(10)
                    .setShadow(2, 2, "#333333", 2, true, true)
                    .setStyle({ backgroundColor: 'gray' })
                    .setVisible(false)
                    .setInteractive({ useHandCursor: true })
                    .on('pointerup', () => this.btnReady_Click())
                    .on('pointerover', () => {
                        this.btnReady.setStyle({ backgroundColor: 'lightblue' })
                    })
                    .on('pointerout', () => {
                        this.btnReady.setStyle({ backgroundColor: 'gray' })
                    })
                this.gameScene.roomUIControls.texts.push(this.btnReady)
        
                // 托管按钮
                this.btnRobot = this.gameScene.add.text(this.gameScene.coordinates.btnRobotPosition.x, this.gameScene.coordinates.btnRobotPosition.y, '托管')
                    .setDepth(this.rightSideButtonDepth)
                    .setColor('white')
                    .setFontSize(30)
                    .setPadding(10)
                    .setShadow(2, 2, "#333333", 2, true, true)
                    .setStyle({ backgroundColor: 'gray' })
                    .setVisible(false)
                    .setInteractive({ useHandCursor: true })
                    .on('pointerup', () => this.btnRobot_Click())
                    .on('pointerover', () => {
                        this.btnRobot.setStyle({ backgroundColor: 'lightblue' })
                    })
                    .on('pointerout', () => {
                        this.btnRobot.setStyle({ backgroundColor: 'gray' })
                    })
                this.gameScene.roomUIControls.texts.push(this.btnRobot)
        
                // 退出按钮
                this.btnExitRoom = this.gameScene.add.text(this.gameScene.coordinates.btnExitRoomPosition.x, this.gameScene.coordinates.btnExitRoomPosition.y, '退出')
                    .setColor('white')
                    .setFontSize(30)
                    .setPadding(10)
                    .setShadow(2, 2, "#333333", 2, true, true)
                    .setStyle({ backgroundColor: 'gray' })
                    .setInteractive({ useHandCursor: true })
                    .on('pointerup', () => this.btnExitRoom_Click())
                    .on('pointerover', () => {
                        this.btnExitRoom.setStyle({ backgroundColor: 'lightblue' })
                    })
                    .on('pointerout', () => {
                        this.btnExitRoom.setStyle({ backgroundColor: 'gray' })
                    })
        
                // 上树按钮
                this.btnExitAndObserve = this.gameScene.add.text(this.gameScene.coordinates.btnExitAndObservePosition.x, this.gameScene.coordinates.btnExitAndObservePosition.y, '上树')
                    .setColor('white')
                    .setFontSize(30)
                    .setPadding(10)
                    .setVisible(false)
                    .setShadow(2, 2, "#333333", 2, true, true)
                    .setStyle({ backgroundColor: 'gray' })
                    .setInteractive({ useHandCursor: true })
                    .on('pointerup', () => this.ExitAndObserve())
                    .on('pointerover', () => {
                        this.btnExitAndObserve.setStyle({ backgroundColor: 'lightblue' })
                    })
                    .on('pointerout', () => {
                        this.btnExitAndObserve.setStyle({ backgroundColor: 'gray' })
                    })
                this.gameScene.roomUIControls.texts.push(this.btnExitAndObserve)
        
                // 快捷键
                this.gameScene.input.keyboard.on('keydown', this.shortcutKeyDownEventhandler, this)
                this.gameScene.input.keyboard.on('keyup', this.shortcutKeyUpEventhandler, this)
                */
    }

    public HandleRightClickEmptyArea() {
        if (this.tractorPlayer.mainForm.gameScene.isReplayMode) return;
        if (this.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.Playing ||
            this.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.DiscardingLast8Cards) {
            this.tractorPlayer.ShowLastTrickCards = !this.tractorPlayer.ShowLastTrickCards;
            if (this.tractorPlayer.ShowLastTrickCards) {
                this.ShowLastTrickAndTumpMade();
            }
            else {
                this.PlayerCurrentTrickShowedCards();
            }
        }
        //一局结束时右键查看最后一轮各家所出的牌，缩小至一半，放在左下角
        else if (this.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.Ending) {
            this.tractorPlayer.ShowLastTrickCards = !this.tractorPlayer.ShowLastTrickCards;
            if (this.tractorPlayer.ShowLastTrickCards) {
                this.ShowLastTrickAndTumpMade();
            }
            else {
                this.drawingFormHelper.DrawFinishedSendedCards()
            }
        }
        this.gameScene.ui.btnShowLastTrick.innerHTML = (this.tractorPlayer.ShowLastTrickCards ? "还原" : "上轮");
    }

    public NewPlayerReadyToStart(readyToStart: boolean) {
        if (CommonMethods.GetReadyCount(this.tractorPlayer.CurrentGameState.Players) < 4) {
            this.gameScene.ui.btnReady.show();

            // this.btnExitAndObserve.setInteractive({ useHandCursor: true })
            // this.btnExitAndObserve.setColor('white')

            // small games
            // this.btnSmallGames.setInteractive({ useHandCursor: true })
            // this.btnSmallGames.setColor('white')
        } else {
            this.gameScene.ui.btnReady.hide();

            // this.btnExitAndObserve.disableInteractive()
            // this.btnExitAndObserve.setColor('gray')

            // small games
            // this.btnSmallGames.disableInteractive()
            // this.btnSmallGames.setColor('gray')
            // this.groupSmallGames.setVisible(false);
        }
        this.gameScene.ui.btnReady.innerHTML = (readyToStart ? "取消" : "就绪");
        this.setStartLabels()
    }

    public PlayerToggleIsRobot(isRobot: boolean) {
        this.gameScene.ui.btnRobot.innerHTML = (isRobot ? "取消" : "托管");
        this.setStartLabels()

        let shouldTrigger = isRobot && isRobot != this.IsDebug;
        this.IsDebug = isRobot;

        if (shouldTrigger) {
            if (!this.tractorPlayer.CurrentTrickState.IsStarted()) this.RobotPlayStarting();
            else this.RobotPlayFollowing();
        }
    }

    public PlayersTeamMade() {
        //set player position
        this.PlayerPosition = {}
        this.PositionPlayer = {}
        var nextPlayer: string = this.tractorPlayer.PlayerId;
        var postion = 1;
        this.PlayerPosition[nextPlayer] = postion;
        this.PositionPlayer[postion] = nextPlayer;
        nextPlayer = CommonMethods.GetNextPlayerAfterThePlayer(this.tractorPlayer.CurrentGameState.Players, nextPlayer).PlayerId;
        while (nextPlayer != this.tractorPlayer.PlayerId) {
            postion++;
            this.PlayerPosition[nextPlayer] = postion;
            this.PositionPlayer[postion] = nextPlayer;
            nextPlayer = CommonMethods.GetNextPlayerAfterThePlayer(this.tractorPlayer.CurrentGameState.Players, nextPlayer).PlayerId;
        }
    }

    public NewPlayerJoined(playerChanged: boolean) {
        if (this.gameScene.isInGameHall()) {
            this.destroyGameHall()
            this.init();
        }

        if (!this.gameScene.ui.frameGameRoom) {
            this.drawGameRoom();
        }

        // this.sgDrawingHelper.myPlayerIndex = CommonMethods.GetPlayerIndexByID(this.tractorPlayer.CurrentGameState.Players, this.tractorPlayer.MyOwnId);
        // this.sgcsPlayer.PlayerIndex = this.sgDrawingHelper.myPlayerIndex;

        // this.roomNameText.setVisible(true)
        // this.roomOwnerText.setVisible(true)

        // this.btnExitRoom.setVisible(true)
        this.gameScene.ui.btnShowLastTrick.show();

        if (this.tractorPlayer.isObserver) {
            this.gameScene.ui.btnReady.hide();
            this.gameScene.ui.btnRobot.hide();
        } else {
            this.gameScene.ui.btnReady.show();
            this.gameScene.ui.btnRobot.show();
        }

        // this.btnExitAndObserve.setVisible(!this.tractorPlayer.isObserver)

        // // small games
        // this.btnSmallGames.setVisible(!this.tractorPlayer.isObserver);
        // if (this.tractorPlayer.isObserver) {
        //     this.groupSmallGames.setVisible(false);
        // }

        var curIndex = CommonMethods.GetPlayerIndexByID(this.tractorPlayer.CurrentGameState.Players, this.tractorPlayer.PlayerId)
        if (playerChanged) this.destroyImagesChairOrPlayer();
        this.destroyPokerPlayerObGameRoom();
        for (let i = 0; i < 4; i++) {
            // let lblNickName = this.lblNickNames[i];
            // let lblObserver = this.lblObservers[i];
            // lblNickName.setVisible(true)
            let p = this.tractorPlayer.CurrentGameState.Players[curIndex];
            let isEmptySeat = !p;
            if (isEmptySeat) {
                if (playerChanged) {
                    // lblNickName.setText("");
                    // lblObserver.setText("");
                    var pokerChair = this.gameScene.ui.create.div('.pokerChair', this.gameScene.ui.frameGameRoom);
                    pokerChair.setBackgroundImage('image/tractor/btn/poker_chair.png')
                    if (i === 1) pokerChair.style.right = `calc(${this.gameScene.coordinates.playerChairPositions[i].x})`;
                    else pokerChair.style.left = `calc(${this.gameScene.coordinates.playerChairPositions[i].x})`;
                    if (i === 2) pokerChair.style.top = `calc(${this.gameScene.coordinates.playerChairPositions[i].y})`;
                    else pokerChair.style.bottom = `calc(${this.gameScene.coordinates.playerChairPositions[i].y})`;
                    pokerChair.style.width = '80px';
                    pokerChair.style.height = '80px';
                    pokerChair.style['background-size'] = '100% 100%';
                    pokerChair.style['background-repeat'] = 'no-repeat';
                    pokerChair.style.cursor = 'pointer';
                    pokerChair.setAttribute('data-position', i);

                    // click
                    pokerChair.addEventListener("click", (e: any) => {
                        let pos = i + 1;
                        let playerIndex = CommonMethods.GetPlayerIndexByPos(this.tractorPlayer.CurrentGameState.Players, this.tractorPlayer.PlayerId, pos);
                        this.ExitRoomAndEnter(playerIndex);
                    });
                    // mouseover
                    pokerChair.addEventListener("mouseover", (e: any) => {
                        let pos = parseInt(e.target.getAttribute('data-position'));
                        if (pos === 2) e.target.style.top = `calc(${this.gameScene.coordinates.playerChairPositions[i].y} - 5px)`;
                        else e.target.style.bottom = `calc(${this.gameScene.coordinates.playerChairPositions[i].y} + 5px)`;
                    });
                    // mouseout
                    pokerChair.addEventListener("mouseout", (e: any) => {
                        let pos = parseInt(e.target.getAttribute('data-position'));
                        if (pos === 2) e.target.style.top = `calc(${this.gameScene.coordinates.playerChairPositions[i].y})`;
                        else e.target.style.bottom = `calc(${this.gameScene.coordinates.playerChairPositions[i].y})`;
                    });

                    this.gameScene.ui.gameRoomImagesChairOrPlayer[i] = pokerChair;
                }
            } else {
                //skin
                let skinInUse = this.DaojuInfo.daojuInfoByPlayer[p.PlayerId] ? this.DaojuInfo.daojuInfoByPlayer[p.PlayerId].skinInUse : CommonMethods.defaultSkinInUse;
                if (playerChanged) {
                    if (i !== 0) {
                        let playerUI = this.CreatePlayer(i, p.PlayerId, this.gameScene.ui.frameGameRoom);
                        this.gameScene.ui.gameRoomImagesChairOrPlayer[i] = playerUI;
                        let skinType = this.GetSkinType(skinInUse);
                        let skinExtention = skinType === 0 ? "webp" : "gif";
                        let skinURL = `image/tractor/skin/${skinInUse}.${skinExtention}`;
                        this.SetAvatarImage(skinURL, playerUI, this.gameScene.coordinates.cardHeight, this.SetObText, p, i, this.gameScene);

                    }
                    else {
                        this.gameScene.ui.gameMe.node.nameol.innerHTML = this.tractorPlayer.PlayerId;
                        let skinInUseMe = this.tractorPlayer.isObserver ? skinInUse : this.gameScene.skinInUse;
                        let skinTypeMe = this.GetSkinType(skinInUseMe);
                        let skinExtentionMe = skinTypeMe === 0 ? "webp" : "gif";
                        let skinURL = `image/tractor/skin/${skinInUseMe}.${skinExtentionMe}`;
                        this.SetAvatarImage(skinURL, this.gameScene.ui.gameMe, this.gameScene.coordinates.cardHeight, this.SetObText, p, i, this.gameScene);
                    }
                }
                else {
                    let playerDiv = i === 0 ? this.gameScene.ui.gameMe : this.gameScene.ui.gameRoomImagesChairOrPlayer[i];
                    this.SetObText(p, i, this.gameScene, playerDiv.style.width);
                }

                // 旁观玩家切换视角
                if (this.tractorPlayer.isObserver && i !== 0) {
                    let curPlayerImage = this.gameScene.ui.gameRoomImagesChairOrPlayer[i];
                    curPlayerImage.style.cursor = 'pointer';
                    // click
                    curPlayerImage.addEventListener("click", (e: any) => {
                        let pos = i + 1;
                        this.destroyImagesChairOrPlayer();
                        this.observeByPosition(pos);
                    });
                    // mouseover
                    curPlayerImage.addEventListener("mouseover", (e: any) => {
                        let pos = parseInt(e.target.getAttribute('data-position'));
                        if (pos === 2) e.target.style.top = `calc(${this.gameScene.coordinates.playerSkinPositions[i].y} - 5px)`;
                        else e.target.style.bottom = `calc(${this.gameScene.coordinates.playerSkinPositions[i].y} + 5px)`;
                    });
                    // mouseout
                    curPlayerImage.addEventListener("mouseout", (e: any) => {
                        let pos = parseInt(e.target.getAttribute('data-position'));
                        if (pos === 2) e.target.style.top = `calc(${this.gameScene.coordinates.playerSkinPositions[i].y})`;
                        else e.target.style.bottom = `calc(${this.gameScene.coordinates.playerSkinPositions[i].y})`;
                    });
                }

                // // 房主将玩家请出房间
                // if (this.tractorPlayer.CurrentRoomSetting.RoomOwner === this.tractorPlayer.MyOwnId && i !== 0) {
                //     // have to clear all listeners, otherwise multiple ones will be added and triggered multiple times
                //     lblNickName.removeAllListeners();
                //     lblNickName.setInteractive({ useHandCursor: true })
                //         .on('pointerup', (pointer: Phaser.Input.Pointer) => {
                //             if (pointer.rightButtonReleased()) return;
                //             lblNickName.setColor('white')
                //                 .setFontSize(30)
                //             let pos = i + 1;
                //             var c = window.confirm("是否确定将此玩家请出房间？");
                //             if (c == true) {
                //                 this.bootPlayerByPosition(pos);
                //             }
                //         })
                //         .on('pointerover', () => {
                //             lblNickName.setColor('yellow')
                //                 .setFontSize(40)
                //         })
                //         .on('pointerout', () => {
                //             lblNickName.setColor('white')
                //                 .setFontSize(30)
                //         })
                // }
            }

            curIndex = (curIndex + 1) % 4
        }
        // this.loadEmojiForm();
    }

    private SetObText(p: PlayerEntity, i: number, gs: GameScene, skinWid: number) {
        if (p.Observers && p.Observers.length > 0) {
            var obNameText = "";
            let tempWidOb = 0;
            for (let j = 0; j < p.Observers.length; j++) {
                let ob = p.Observers[j];
                if (i === 1) {
                    let tempLenOb = ob.length + 2;
                    let tempLenDeltaOb = (ob.match(gs.coordinates.regexNonEnglishChar) || []).length;
                    let newWid = gs.coordinates.player1TextWid * tempLenOb + gs.coordinates.player1TextWidBigDelta * tempLenDeltaOb;
                    tempWidOb = Math.max(tempWidOb, newWid);
                }
                var newLine = j === 0 || obNameText.length === 0 ? "" : "<br/>";
                obNameText += `${newLine}【${ob}】`
            }
            var pokerPlayerOb = gs.ui.create.div('.pokerPlayerObGameRoom', obNameText, gs.ui.frameGameRoom);
            pokerPlayerOb.style.fontFamily = 'serif';
            pokerPlayerOb.style.fontSize = '16px';
            pokerPlayerOb.style.textAlign = 'left';
            gs.ui.pokerPlayerObGameRoom[i] = pokerPlayerOb;

            var obX = gs.coordinates.observerTextPositions[i].x;
            var obY = gs.coordinates.observerTextPositions[i].y;
            switch (i) {
                case 0:
                    obX = `calc(${obX} + ${skinWid}px)`;
                    pokerPlayerOb.style.left = `calc(${obX})`;
                    pokerPlayerOb.style.bottom = `calc(${obY})`;
                    break;
                case 1:
                    pokerPlayerOb.style.right = `calc(${obX})`;
                    pokerPlayerOb.style.top = `calc(${obY})`;
                    pokerPlayerOb.style.width = tempWidOb;
                    pokerPlayerOb.style.textAlign = 'right';
                    break;
                case 2:
                    obX = `calc(${obX} + ${skinWid}px)`;
                    pokerPlayerOb.style.left = `calc(${obX})`;
                    pokerPlayerOb.style.top = `calc(${obY})`;
                    break;
                case 3:
                    pokerPlayerOb.style.left = `calc(${obX})`;
                    pokerPlayerOb.style.top = `calc(${obY})`;
                    break;
                default:
                    break;
            }
        }
    }

    public ExitRoomAndEnter(posID: number) {
        this.destroyGameRoom();
        this.gameScene.sendMessageToServer(PLAYER_EXIT_AND_ENTER_ROOM_REQUEST, this.tractorPlayer.MyOwnId, JSON.stringify({
            roomID: -1,
            posID: posID,
        }))
    }

    //     public ExitAndObserve() {
    //         if (!this.btnExitAndObserve || !this.btnExitAndObserve.input.enabled) return;
    //         this.btnExitAndObserve.disableInteractive()
    //         this.btnExitAndObserve.setColor('gray')

    //         // small games
    //         this.btnSmallGames.disableInteractive()
    //         this.btnSmallGames.setColor('gray')
    //         this.groupSmallGames.setVisible(false);

    //         this.destroyGameRoom();
    //         this.gameScene.sendMessageToServer(PLAYER_EXIT_AND_OBSERVE_REQUEST, this.tractorPlayer.MyOwnId, "");
    //     }

    //     public SmallGamesHandler() {
    //         this.groupSmallGames.toggleVisible();
    //     }

    public ReenterOrResumeOrObservePlayerByIDEvent(drawCards: boolean) {
        this.drawingFormHelper.DrawSidebarFull();
        if (!drawCards) return;
        this.tractorPlayer.playerLocalCache.ShowedCardsInCurrentTrick = CommonMethods.deepCopy<any>(this.tractorPlayer.CurrentTrickState.ShowedCards);
        if (this.tractorPlayer.CurrentTrickState.ShowedCards && Object.keys(this.tractorPlayer.CurrentTrickState.ShowedCards).length == 4) {
            this.tractorPlayer.playerLocalCache.WinnderID = TractorRules.GetWinner(this.tractorPlayer.CurrentTrickState);
            this.tractorPlayer.playerLocalCache.WinResult = this.IsWinningWithTrump(this.tractorPlayer.CurrentTrickState, this.tractorPlayer.playerLocalCache.WinnderID);
        }
        this.PlayerCurrentTrickShowedCards();
        this.drawingFormHelper.ResortMyHandCards();
        this.DrawDiscardedCardsCaller();
    }

    public TrumpChanged() {
        this.drawingFormHelper.DrawSidebarFull()
        if (SuitEnums.HandStep.DistributingCards <= this.tractorPlayer.CurrentHandState.CurrentHandStep &&
            this.tractorPlayer.CurrentHandState.CurrentHandStep < SuitEnums.HandStep.DistributingLast8Cards) {
            // if (this.enableSound) this.gameScene.playAudio(CommonMethods.audioLiangpai, this.GetPlayerSex(this.tractorPlayer.CurrentHandState.TrumpMaker));
            this.drawingFormHelper.TrumpMadeCardsShow()
        }
        this.drawingFormHelper.reDrawToolbar()
    }

    public TrumpChangedForObservePlayerById() {
        if (SuitEnums.HandStep.DistributingCards <= this.tractorPlayer.CurrentHandState.CurrentHandStep &&
            this.tractorPlayer.CurrentHandState.CurrentHandStep < SuitEnums.HandStep.DistributingLast8Cards) {
            this.drawingFormHelper.TrumpMadeCardsShow()
            this.drawingFormHelper.reDrawToolbar()
        }
    }

    public destroyGameRoom() {
        if (this.gameScene.ui.gameMe) {
            this.gameScene.ui.gameMe.remove();
            delete this.gameScene.ui.gameMe
        }
        delete this.gameScene.ui.roomNameText
        delete this.gameScene.ui.roomOwnerText
        delete this.gameScene.ui.btnPig

        this.gameScene.ui.gameRoomImagesChairOrPlayer = [];
        this.gameScene.ui.pokerPlayerStartersLabel = [];

        if (this.gameScene.ui.btnRobot) {
            this.gameScene.ui.btnRobot.remove();
            delete this.gameScene.ui.btnRobot;
        }
        if (this.gameScene.ui.btnReady) {
            this.gameScene.ui.btnReady.remove();
            delete this.gameScene.ui.btnReady;
        }
        if (this.gameScene.ui.btnShowLastTrick) {
            this.gameScene.ui.btnShowLastTrick.remove();
            delete this.gameScene.ui.btnShowLastTrick;
        }

        if (this.gameScene.ui.frameGameRoom) {
            this.gameScene.ui.frameGameRoom.remove();
            delete this.gameScene.ui.frameGameRoom;
        }

        this.tractorPlayer.PlayerId = this.tractorPlayer.MyOwnId;
        this.tractorPlayer.isObserver = false;
        if (this.gameScene.ui.gameMe) {
            this.gameScene.ui.gameMe.node.nameol.innerHTML = this.tractorPlayer.MyOwnId;
            let skinTypeMe = this.GetSkinType(this.gameScene.skinInUse);
            let skinExtentionMe = skinTypeMe === 0 ? "webp" : "gif";
            let skinURL = `image/tractor/skin/${this.gameScene.skinInUse}.${skinExtentionMe}`;
            this.SetAvatarImage(skinURL, this.gameScene.ui.gameMe, this.gameScene.coordinates.cardHeight);
        }
        // this.drawingFormHelper.destroyAllCards()
        // this.drawingFormHelper.destroyAllShowedCards()
        // this.tractorPlayer.destroyAllClientMessages()
        // this.drawingFormHelper.destroyToolbar()
        // this.drawingFormHelper.destroySidebar()
        // this.drawingFormHelper.destroyScoreImageAndCards()
        // this.drawingFormHelper.destroyLast8Cards()
        this.PlayerPosition = {};
        this.PositionPlayer = {};

        //重置状态
        this.tractorPlayer.CurrentGameState = new GameState();
        this.tractorPlayer.CurrentHandState = new CurrentHandState(this.tractorPlayer.CurrentGameState);
    }

    public destroyImagesChairOrPlayer() {
        if (this.gameScene.ui.gameRoomImagesChairOrPlayer) {
            this.gameScene.ui.gameRoomImagesChairOrPlayer.forEach((image: any) => {
                image.remove();
            })
            this.gameScene.ui.gameRoomImagesChairOrPlayer = [];
        }
    }

    public destroyPokerPlayerStartersLabel() {
        if (this.gameScene.ui.pokerPlayerStartersLabel) {
            this.gameScene.ui.pokerPlayerStartersLabel.forEach((image: any) => {
                image.remove();
            })
            this.gameScene.ui.pokerPlayerStartersLabel = [];
        }
    }

    public destroyPokerPlayerObGameRoom() {
        if (!this.gameScene.ui.pokerPlayerObGameRoom) {
            this.gameScene.ui.pokerPlayerObGameRoom = [];
        }
        this.gameScene.ui.pokerPlayerObGameRoom.forEach((image: any) => {
            image.remove();
        })
        this.gameScene.ui.pokerPlayerObGameRoom = [];
    }

    public PlayerOnGetCard(cardNumber: number) {

        //发牌播放提示音
        // if (this.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.DistributingCards && this.enableSound) {
        //     if (this.enableSound) this.gameScene.sounddraw.play()
        // }

        this.drawingFormHelper.IGetCard();

        //托管代打：亮牌
        let shengbi = 0
        if (this.DaojuInfo && this.DaojuInfo.daojuInfoByPlayer && this.DaojuInfo.daojuInfoByPlayer[this.tractorPlayer.MyOwnId]) {
            shengbi = parseInt(this.DaojuInfo.daojuInfoByPlayer[this.tractorPlayer.MyOwnId].Shengbi);
        }
        let isUsingQiangliangka = shengbi >= CommonMethods.qiangliangkaCost || this.tractorPlayer.CurrentHandState.TrumpMaker && this.tractorPlayer.CurrentHandState.TrumpMaker === this.tractorPlayer.MyOwnId;
        if (this.IsDebug &&
            (this.tractorPlayer.CurrentRoomSetting.IsFullDebug ||
                this.tractorPlayer.CurrentRoomSetting.AllowRobotMakeTrump ||
                isUsingQiangliangka) &&
            !this.tractorPlayer.isObserver) {
            var availableTrump = this.tractorPlayer.AvailableTrumps();
            let qiangliangMin = parseInt(this.gameScene.qiangliangMin);
            let trumpToExpose: number = Algorithm.TryExposingTrump(availableTrump, qiangliangMin, this.tractorPlayer.CurrentHandState.IsFirstHand, this.tractorPlayer.CurrentPoker, this.tractorPlayer.CurrentRoomSetting.IsFullDebug);
            if (trumpToExpose == SuitEnums.Suit.None) return;

            var next = this.tractorPlayer.CurrentHandState.TrumpExposingPoker + 1;
            if (trumpToExpose == SuitEnums.Suit.Joker) {
                if (this.tractorPlayer.CurrentPoker.BlackJoker() == 2)
                    next = SuitEnums.TrumpExposingPoker.PairBlackJoker;
                else if (this.tractorPlayer.CurrentPoker.RedJoker() == 2)
                    next = SuitEnums.TrumpExposingPoker.PairRedJoker;
            }
            // 之前自己抢亮，后来再双亮加持不消耗抢亮卡
            let usedShengbi = 0;
            if (next === SuitEnums.TrumpExposingPoker.SingleRank || this.tractorPlayer.CurrentHandState.TrumpMaker !== this.tractorPlayer.MyOwnId) {
                usedShengbi = 1;
            }
            this.tractorPlayer.ExposeTrump(next, trumpToExpose, usedShengbi);
        }
    }

    public ShowingCardBegan() {
        this.DiscardingLast8();
        this.drawingFormHelper.destroyToolbar();
        this.drawingFormHelper.destroyAllShowedCards();
        this.tractorPlayer.destroyAllClientMessages();

        this.drawingFormHelper.DrawScoreImageAndCards();

        //出牌开始前，去掉不需要的controls
        // this.btnSurrender.Visible = false;
        // this.btnRiot.Visible = false;

    }

    public DistributingLast8Cards() {
        this.tractorPlayer.destroyAllClientMessages()
        //先去掉反牌按钮，再放发底牌动画
        this.drawingFormHelper.destroyToolbar();
        //重画手牌，从而把被提升的自己亮的牌放回去
        this.drawingFormHelper.ResortMyHandCards();

        let position = this.PlayerPosition[this.tractorPlayer.CurrentHandState.Last8Holder];
        //自己摸底不用画
        if (position > 1) {
            this.drawingFormHelper.DrawDistributingLast8Cards(position);
        }
        else {
            //播放摸底音效
            // if (this.enableSound) this.gameScene.sounddrawx.play();
        }

        if (this.tractorPlayer.isObserver) {
            return;
        }

        //摸牌结束，如果处于托管状态，则取消托管
        var me: PlayerEntity = CommonMethods.GetPlayerByID(this.tractorPlayer.CurrentGameState.Players, this.tractorPlayer.MyOwnId);
        if (me.IsRobot && this.gameScene.ui.btnRobot && this.gameScene.ui.btnRobot.innerHTML === "取消" && !this.tractorPlayer.CurrentRoomSetting.IsFullDebug) {
            this.btnRobot_Click()
        }

        //摸牌结束，如果允许投降，则显示投降按钮
        if (this.tractorPlayer.CurrentRoomSetting.AllowSurrender) {
            // this.btnSurrender.Visible = true;
        }

        //仅允许台下的玩家可以革命
        // if (!this.ThisPlayer.CurrentGameState.ArePlayersInSameTeam(this.ThisPlayer.CurrentHandState.Starter, this.ThisPlayer.PlayerId))
        // {
        //     //摸牌结束，如果允许分数革命，则判断是否该显示革命按钮
        //     int riotScoreCap = ThisPlayer.CurrentRoomSetting.AllowRiotWithTooFewScoreCards;
        //     if (ThisPlayer.CurrentPoker.GetTotalScore() <= riotScoreCap)
        //     {
        //         this.btnRiot.Visible = true;
        //     }

        //     //摸牌结束，如果允许主牌革命，则判断是否该显示革命按钮
        //     int riotTrumpCap = ThisPlayer.CurrentRoomSetting.AllowRiotWithTooFewTrumpCards;
        //     if (ThisPlayer.CurrentPoker.GetMasterCardsCount() <= riotTrumpCap && ThisPlayer.CurrentHandState.Trump != Suit.Joker)
        //     {
        //         this.btnRiot.Visible = true;
        //     }
        // }
    }

    public StartGame() {
        this.tractorPlayer.CurrentPoker = new CurrentPoker()
        this.tractorPlayer.CurrentPoker.Rank = this.tractorPlayer.CurrentHandState.Rank;

        //游戏开始前重置各种变量
        this.tractorPlayer.ShowLastTrickCards = false;
        this.tractorPlayer.playerLocalCache = new PlayerLocalCache();
        // this.btnSurrender.Visible = false;
        // this.btnRiot.Visible = false;
        this.tractorPlayer.CurrentTrickState.serverLocalCache.lastShowedCards = {}
        this.timerCountDown = 0;
        this.gameScene.ui.btnPig.hide();

        this.init();
    }

    public DiscardingLast8() {
        // Graphics g = Graphics.FromImage(bmp);

        // g.DrawImage(image, 200 + drawingFormHelper.offsetCenterHalf, 186 + drawingFormHelper.offsetCenterHalf, 85 * drawingFormHelper.scaleDividend, 96 * drawingFormHelper.scaleDividend);
        // Refresh();
        // g.Dispose();

        //托管代打：埋底
        if (this.tractorPlayer.CurrentRoomSetting.IsFullDebug && this.IsDebug && !this.tractorPlayer.isObserver) {
            if (this.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.DiscardingLast8Cards &&
                this.tractorPlayer.CurrentHandState.Last8Holder == this.tractorPlayer.PlayerId) //如果等我扣牌
            {
                this.SelectedCards = []
                Algorithm.ShouldSelectedLast8Cards(this.SelectedCards, this.tractorPlayer.CurrentPoker);
                if (this.SelectedCards.length == 8) {
                    this.ToDiscard8Cards();
                }
                else {
                    alert(`failed to auto select last 8 cards: ${this.SelectedCards}, please manually select`)
                }
            }
        }
    }

    public Last8Discarded() {
        // if (this.enableSound) this.gameScene.soundtie.play()

        this.drawingFormHelper.DrawDiscardedCardsBackground();

        if (this.tractorPlayer.isObserver && this.tractorPlayer.CurrentHandState.Last8Holder == this.tractorPlayer.PlayerId) {
            let tempCP = this.tractorPlayer.CurrentHandState.PlayerHoldingCards[this.tractorPlayer.PlayerId]
            this.tractorPlayer.CurrentPoker.CloneFrom(tempCP);
            this.drawingFormHelper.ResortMyHandCards();
        }
        this.DrawDiscardedCardsCaller();
    }

    public DrawDiscardedCardsCaller() {
        if (this.tractorPlayer.CurrentPoker != null && this.tractorPlayer.CurrentPoker.Count() > 0 &&
            this.tractorPlayer.CurrentHandState.DiscardedCards != null &&
            this.tractorPlayer.CurrentHandState.DiscardedCards.length == 8) {
            if (this.tractorPlayer.CurrentHandState.Last8Holder === this.tractorPlayer.PlayerId) this.drawingFormHelper.DrawDiscardedCards();
            else this.drawingFormHelper.destroyLast8Cards();
        }
    }

    public HandEnding() {
        this.drawingFormHelper.DrawFinishedSendedCards()
    }

    public StarterChangedEvent() {
        this.setStartLabels()
    }

    public StarterFailedForTrump() {
        this.drawingFormHelper.DrawSidebarFull();

        this.drawingFormHelper.ResortMyHandCards();

        this.drawingFormHelper.reDrawToolbar();
    }

    //检查当前出牌者的牌是否为大牌：0 - 否；1 - 是；2 - 是且为吊主；3 - 是且为主毙牌
    private IsWinningWithTrump(trickState: CurrentTrickState, playerID: string): number {
        let isLeaderTrump = PokerHelper.IsTrump(trickState.LeadingCards()[0], this.tractorPlayer.CurrentHandState.Trump, this.tractorPlayer.CurrentHandState.Rank);
        if (playerID == trickState.Learder) {
            if (isLeaderTrump) return 2;
            else return 1;
        }
        let winnerID = TractorRules.GetWinner(trickState);
        if (playerID == winnerID) {
            let isWinnerTrump = PokerHelper.IsTrump(trickState.ShowedCards[winnerID][0], this.tractorPlayer.CurrentHandState.Trump, this.tractorPlayer.CurrentHandState.Rank);
            if (!isLeaderTrump && isWinnerTrump) return 3;
            return 1;
        }
        return 0;
    }

    public PlayerShowedCards() {
        if (!this.tractorPlayer.CurrentHandState.PlayerHoldingCards[this.tractorPlayer.CurrentTrickState.Learder]) return;

        //如果新的一轮开始，重置缓存信息
        if (this.tractorPlayer.CurrentTrickState.CountOfPlayerShowedCards() == 1) {
            this.tractorPlayer.playerLocalCache = new PlayerLocalCache();
        }

        let curPoker = new CurrentPoker()
        curPoker.CloneFrom(this.tractorPlayer.CurrentHandState.PlayerHoldingCards[this.tractorPlayer.CurrentTrickState.Learder])
        if (curPoker.Count() == 0) {
            this.tractorPlayer.playerLocalCache.isLastTrick = true;
        }

        let latestPlayer = this.tractorPlayer.CurrentTrickState.LatestPlayerShowedCard();
        this.tractorPlayer.playerLocalCache.ShowedCardsInCurrentTrick = CommonMethods.deepCopy<any>(this.tractorPlayer.CurrentTrickState.ShowedCards)

        let winResult = this.IsWinningWithTrump(this.tractorPlayer.CurrentTrickState, latestPlayer);
        let position = this.PlayerPosition[latestPlayer];
        let showedCards: number[] = this.tractorPlayer.CurrentTrickState.ShowedCards[latestPlayer]
        //如果大牌变更，更新缓存相关信息
        if (winResult >= this.firstWinNormal) {
            if (winResult < this.firstWinBySha || this.tractorPlayer.playerLocalCache.WinResult < this.firstWinBySha) {
                this.tractorPlayer.playerLocalCache.WinResult = winResult;
            }
            else {
                this.tractorPlayer.playerLocalCache.WinResult++;
            }
            this.tractorPlayer.playerLocalCache.WinnerPosition = position;
            this.tractorPlayer.playerLocalCache.WinnderID = latestPlayer;
        }

        //如果不在回看上轮出牌，才重画刚刚出的牌
        if (!this.tractorPlayer.ShowLastTrickCards) {
            //擦掉上一把
            if (this.tractorPlayer.CurrentTrickState.CountOfPlayerShowedCards() == 1) {
                this.tractorPlayer.destroyAllClientMessages()
                this.drawingFormHelper.destroyAllShowedCards()
                this.drawingFormHelper.DrawScoreImageAndCards();
            }

            //播放出牌音效
            if (this.tractorPlayer.CurrentRoomSetting.HideOverridingFlag) {
                // if (this.enableSound) this.gameScene.playAudio(0, this.GetPlayerSex(latestPlayer));
            } else if (!this.tractorPlayer.playerLocalCache.isLastTrick &&
                !this.IsDebug &&
                !this.tractorPlayer.CurrentTrickState.serverLocalCache.muteSound) {
                let soundInex = winResult;
                if (winResult > 0) soundInex = this.tractorPlayer.playerLocalCache.WinResult;
                // if (this.enableSound) this.gameScene.playAudio(soundInex, this.GetPlayerSex(latestPlayer));
            }

            this.drawingFormHelper.DrawShowedCardsByPosition(showedCards, position);
        }

        //如果正在回看并且自己刚刚出了牌，则重置回看，重新画牌
        if (this.tractorPlayer.ShowLastTrickCards) {
            this.HandleRightClickEmptyArea();
        }

        //即时更新旁观手牌
        if (this.tractorPlayer.isObserver && this.tractorPlayer.PlayerId == latestPlayer) {
            this.tractorPlayer.CurrentPoker.CloneFrom(this.tractorPlayer.CurrentHandState.PlayerHoldingCards[this.tractorPlayer.PlayerId])
            this.drawingFormHelper.ResortMyHandCards();
        }

        if (winResult > 0) {
            this.drawingFormHelper.DrawOverridingFlag(showedCards.length, this.PlayerPosition[this.tractorPlayer.playerLocalCache.WinnderID], this.tractorPlayer.playerLocalCache.WinResult - 1, true);

            //拖拉机动画
            let showedPoker = new CurrentPoker()
            showedPoker.Trump = this.tractorPlayer.CurrentTrickState.Trump;
            showedPoker.Rank = this.tractorPlayer.CurrentTrickState.Rank;
            showedCards.forEach(card => {
                showedPoker.AddCard(card);
            })
            let showedTractors: number[];
            if (winResult < 3) {
                showedTractors = showedPoker.GetTractorBySuit(this.tractorPlayer.CurrentTrickState.LeadingSuit());
            } else {
                showedTractors = showedPoker.GetTractorBySuit(this.tractorPlayer.CurrentHandState.Trump);
            }
            if (showedTractors.length > 1) this.drawingFormHelper.DrawMovingTractorByPosition(showedCards.length, position);
        }

        this.RobotPlayFollowing();
    }

    //托管代打
    private RobotPlayFollowing() {
        if (this.tractorPlayer.isObserver) return
        //跟出
        if ((this.tractorPlayer.playerLocalCache.isLastTrick || this.IsDebug) && !this.tractorPlayer.isObserver &&
            this.tractorPlayer.CurrentTrickState.NextPlayer() == this.tractorPlayer.PlayerId &&
            this.tractorPlayer.CurrentTrickState.IsStarted()) {
            let tempSelectedCards: number[] = []
            Algorithm.MustSelectedCards(tempSelectedCards, this.tractorPlayer.CurrentTrickState, this.tractorPlayer.CurrentPoker);

            this.SelectedCards = []
            let myCardsNumber = this.gameScene.cardImages
            for (let i = 0; i < myCardsNumber.length; i++) {
                let serverCardNumber: number = parseInt(myCardsNumber[i].getAttribute("serverCardNumber"));
                if (tempSelectedCards.includes(serverCardNumber)) {
                    this.SelectedCards.push(serverCardNumber);
                    tempSelectedCards = CommonMethods.ArrayRemoveOneByValue(tempSelectedCards, serverCardNumber);
                }
            }

            let showingCardsValidationResult: ShowingCardsValidationResult =
                TractorRules.IsValid(this.tractorPlayer.CurrentTrickState, this.SelectedCards, this.tractorPlayer.CurrentPoker);
            if (showingCardsValidationResult.ResultType == ShowingCardsValidationResult.ShowingCardsValidationResultType.Valid) {
                setTimeout(() => {
                    this.ToShowCards();
                }, 250);
            }
            else {

                alert(`failed to auto select cards: ${this.SelectedCards}, please manually select`)
            }
            return;
        }

        //跟选：如果玩家没有事先手动选牌，在有必选牌的情况下自动选择必选牌，方便玩家快捷出牌
        if (this.SelectedCards.length == 0 &&
            !this.tractorPlayer.isObserver &&
            this.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.Playing &&
            this.tractorPlayer.CurrentTrickState.NextPlayer() == this.tractorPlayer.PlayerId &&
            this.tractorPlayer.CurrentTrickState.IsStarted()) {
            //如果选了牌，则重画手牌，方便直接点确定出牌
            let tempSelectedCards: number[] = []
            Algorithm.MustSelectedCardsNoShow(tempSelectedCards, this.tractorPlayer.CurrentTrickState, this.tractorPlayer.CurrentPoker);
            if (tempSelectedCards.length > 0) {
                this.SelectedCards = []
                let myCardsNumber = this.gameScene.cardImages
                for (let i = 0; i < myCardsNumber.length; i++) {
                    let serverCardNumber: number = parseInt(myCardsNumber[i].getAttribute("serverCardNumber"));
                    if (tempSelectedCards.includes(serverCardNumber)) {
                        this.myCardIsReady[i] = true;
                        this.SelectedCards.push(serverCardNumber);
                        tempSelectedCards = CommonMethods.ArrayRemoveOneByValue(tempSelectedCards, serverCardNumber);
                        //将选定的牌向上提升 via gameScene.cardImages
                        let toAddImage = this.gameScene.cardImages[i] as any;
                        if (!toAddImage || !toAddImage.getAttribute("status") || toAddImage.getAttribute("status") === "down") {
                            toAddImage.setAttribute("status", "up");
                            toAddImage.style.bottom = `calc(${this.gameScene.coordinates.handCardPositions[0].y} + 30px)`;
                        }
                    }
                }
                this.gameScene.sendMessageToServer(CardsReady_REQUEST, this.tractorPlayer.MyOwnId, JSON.stringify(this.myCardIsReady));
            }
        }
        this.drawingFormHelper.validateSelectedCards()
    }

    //托管代打，先手
    private RobotPlayStarting() {
        if (this.IsDebug && !this.tractorPlayer.isObserver &&
            (this.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.Playing || this.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.DiscardingLast8CardsFinished)) {
            if (!this.tractorPlayer.CurrentTrickState.Learder) return;
            if (this.tractorPlayer.CurrentTrickState.NextPlayer() != this.tractorPlayer.PlayerId) return;
            if (this.tractorPlayer.CurrentTrickState.IsStarted()) return;

            this.SelectedCards = [];
            Algorithm.ShouldSelectedCards(this.SelectedCards, this.tractorPlayer.CurrentTrickState, this.tractorPlayer.CurrentPoker);
            let showingCardsValidationResult: ShowingCardsValidationResult =
                TractorRules.IsValid(this.tractorPlayer.CurrentTrickState, this.SelectedCards, this.tractorPlayer.CurrentPoker);
            if (showingCardsValidationResult.ResultType == ShowingCardsValidationResult.ShowingCardsValidationResultType.Valid) {
                setTimeout(() => {
                    this.ToShowCards();
                }, 250);
            }
            else {
                alert(`failed to auto select cards: ${this.SelectedCards}, please manually select`)
            }
        }
    }

    public TrickFinished() {
        this.drawingFormHelper.DrawScoreImageAndCards();
    }

    public TrickStarted() {
        if (!this.IsDebug && this.tractorPlayer.CurrentTrickState.Learder == this.tractorPlayer.PlayerId) {
            this.drawingFormHelper.DrawMyPlayingCards();
        }
        this.RobotPlayStarting();
    }

    private init() {
        //每次初始化都重绘背景
        this.tractorPlayer.destroyAllClientMessages()
        this.drawingFormHelper.destroyAllCards()
        this.drawingFormHelper.destroyAllShowedCards()
        this.drawingFormHelper.destroyToolbar()
        this.drawingFormHelper.destroyScoreImageAndCards()
        this.drawingFormHelper.destroyLast8Cards()

        this.drawingFormHelper.DrawSidebarFull();
    }

    public setStartLabels() {
        let onesTurnPlayerID: string = "";
        let isShowCards: boolean = false;
        if (this.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.DiscardingLast8Cards) {
            onesTurnPlayerID = this.tractorPlayer.CurrentHandState.Last8Holder;
            isShowCards = false;
        } else if (this.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.Playing &&
            Object.keys(this.tractorPlayer.CurrentTrickState.ShowedCards).length > 0) {
            onesTurnPlayerID = this.tractorPlayer.CurrentTrickState.NextPlayer();
            isShowCards = true;
        }
        var curIndex = CommonMethods.GetPlayerIndexByID(this.tractorPlayer.CurrentGameState.Players, this.tractorPlayer.PlayerId)
        if (curIndex < 0) return;
        for (let i = 0; i < 4; i++) {
            (this.gameScene.ui.pokerPlayerStartersLabel[i] as any).style.color = "orange";

            var curPlayer = this.tractorPlayer.CurrentGameState.Players[curIndex];
            if (curPlayer && curPlayer.IsOffline) {
                (this.gameScene.ui.pokerPlayerStartersLabel[i] as any).innerHTML = "离线中";
            }
            else if (curPlayer && curPlayer.PlayingSG) {
                (this.gameScene.ui.pokerPlayerStartersLabel[i] as any).innerHTML = curPlayer.PlayingSG;
            }
            else if (curPlayer && curPlayer.IsRobot) {
                (this.gameScene.ui.pokerPlayerStartersLabel[i] as any).innerHTML = "托管中";
                if (this.tractorPlayer.CurrentHandState.CurrentHandStep <= SuitEnums.HandStep.DistributingCards) {
                    let shengbi = 0
                    if (this.DaojuInfo && this.DaojuInfo.daojuInfoByPlayer && this.DaojuInfo.daojuInfoByPlayer[curPlayer.PlayerId]) {
                        shengbi = parseInt(this.DaojuInfo.daojuInfoByPlayer[curPlayer.PlayerId].Shengbi);
                    }
                    let isUsingQiangliangka = shengbi >= CommonMethods.qiangliangkaCost;
                    if (isUsingQiangliangka) (this.gameScene.ui.pokerPlayerStartersLabel[i] as any).innerHTML = "抢亮卡";
                }
            }
            else if (curPlayer && !curPlayer.IsReadyToStart) {
                (this.gameScene.ui.pokerPlayerStartersLabel[i] as any).innerHTML = "思索中";
            }
            else {
                if (curPlayer && onesTurnPlayerID && curPlayer.PlayerId === onesTurnPlayerID) {
                    (this.gameScene.ui.pokerPlayerStartersLabel[i] as any).innerHTML = isShowCards ? "出牌中" : "埋底中";
                    (this.gameScene.ui.pokerPlayerStartersLabel[i] as any).style.color = "yellow";
                } else if (curPlayer && this.tractorPlayer.CurrentHandState.Starter && curPlayer.PlayerId == this.tractorPlayer.CurrentHandState.Starter) {
                    (this.gameScene.ui.pokerPlayerStartersLabel[i] as any).innerHTML = "庄家";
                }
                else {
                    (this.gameScene.ui.pokerPlayerStartersLabel[i] as any).innerHTML = `${curIndex + 1}`;
                }
            }
            curIndex = (curIndex + 1) % 4
        }
    }

    private btnReady_Click() {
        if (!this.gameScene.ui.btnReady || this.gameScene.ui.btnReady.classList.contains('hidden')) return;
        //为防止以外连续点两下就绪按钮，造成重复发牌，点完一下就立即disable就绪按钮
        this.gameScene.ui.btnReady.hide()

        this.gameScene.sendMessageToServer(ReadyToStart_REQUEST, this.tractorPlayer.PlayerId, "")
    }

    private btnRobot_Click() {
        if (!this.gameScene.ui.btnRobot || this.gameScene.ui.btnRobot.classList.contains('hidden') || this.gameScene.ui.btnRobot.classList.contains('disabled')) return;
        this.gameScene.sendMessageToServer(ToggleIsRobot_REQUEST, this.tractorPlayer.PlayerId, "")
    }

    // pos is 1-based
    private observeByPosition(pos: number) {
        if (this.tractorPlayer.isObserver && this.PositionPlayer[pos]) {
            this.gameScene.sendMessageToServer(ObserveNext_REQUEST, this.tractorPlayer.MyOwnId, this.PositionPlayer[pos])
        }
    }

    //     // pos is 1-based
    //     private bootPlayerByPosition(pos: number) {
    //         if (this.PositionPlayer[pos]) {
    //             let playerID = this.PositionPlayer[pos];
    //             let args: (string | number)[] = [-1, -1, `玩家【${playerID}】被房主请出房间`];
    //             this.sendEmojiWithCheck(args)
    //             this.gameScene.sendMessageToServer(ExitRoom_REQUEST, playerID, "")
    //         }
    //     }

    public LoadUIUponConnect() {
        this.EnableShortcutKeys();
        this.gameScene.ui.btnQiandao = this.gameScene.ui.create.system('签到领福利', () => { this.gameScene.sendMessageToServer(PLAYER_QIANDAO_REQUEST, this.gameScene.playerName, "") }, true);
        this.gameScene.ui.btnQiandao.hide();
        this.gameScene.ui.gameSettings = this.gameScene.ui.create.system('设置', () => this.btnGameSettings_Click(), true);
        this.gameScene.ui.exitTractor = this.gameScene.ui.create.system('退出', () => this.btnExitRoom_Click(), true);
    }

    private btnGameSettings_Click() {
        var uiintro = this.gameScene.ui.create.dialog('hidden');
        uiintro.listen(function (e:any) {
            e.stopPropagation();
        });
        uiintro.classList.add('clsleaderboard');

        // $("#includedContent").load("b.html");

        // var p = document.createElement('p');
        // p.innerHTML = lib.version + '更新内容';
        // uiintro.add(p.outerHTML);

        // var ul = document.createElement('ul');
        // ul.classList.add('text');
        // ul.style.textAlign = 'left';
        // for (var i = 0; i < lib.changeLog.length; i++) {
        //     var li = document.createElement('li');
        //     li.innerHTML = lib.changeLog[i];
        //     ul.appendChild(li);
        // }
        // uiintro.add(ul.outerHTML);
        // var btnCloseMe = ui.create.div('.menubutton.highlight.large.pointerdiv', '确定', () => uiintro.remove());
        // uiintro.add(btnCloseMe);
        // uiintro.style.left = "calc(30%)";
        // uiintro.style.top = "calc(35%)";
        // uiintro.style.width = "calc(40%)";
        // uiintro.style.height = "calc(30%)";
        // ui.window.appendChild(uiintro);


        // if (this.gameScene.isReplayMode) {
        //     window.location.reload()
        //     return
        // }
        // if (CommonMethods.AllOnline(this.tractorPlayer.CurrentGameState.Players) && !this.tractorPlayer.isObserver && SuitEnums.HandStep.DiscardingLast8Cards <= this.tractorPlayer.CurrentHandState.CurrentHandStep && this.tractorPlayer.CurrentHandState.CurrentHandStep <= SuitEnums.HandStep.Playing) {
        //     var c = window.confirm("游戏进行中退出将会重启游戏，是否确定退出？");
        //     if (c == true) {
        //         window.location.reload()
        //     }
        //     return
        // }
        // if (this.gameScene.isInGameRoom()) {
        //     this.gameScene.sendMessageToServer(ExitRoom_REQUEST, this.tractorPlayer.MyOwnId, "")
        //     return
        // }
        // window.location.reload()
    }

    private btnExitRoom_Click() {
        if (this.gameScene.isReplayMode) {
            window.location.reload()
            return
        }
        if (CommonMethods.AllOnline(this.tractorPlayer.CurrentGameState.Players) && !this.tractorPlayer.isObserver && SuitEnums.HandStep.DiscardingLast8Cards <= this.tractorPlayer.CurrentHandState.CurrentHandStep && this.tractorPlayer.CurrentHandState.CurrentHandStep <= SuitEnums.HandStep.Playing) {
            var c = window.confirm("游戏进行中退出将会重启游戏，是否确定退出？");
            if (c == true) {
                window.location.reload()
            }
            return
        }
        if (this.gameScene.isInGameRoom()) {
            this.gameScene.sendMessageToServer(ExitRoom_REQUEST, this.tractorPlayer.MyOwnId, "")
            return
        }
        window.location.reload()
    }

    //     public loadEmojiForm() {
    //         if (this.chatForm && this.chatForm.visible) return;
    //         let chatFormWid = this.gameScene.coordinates.chatWid;
    //         this.chatForm = this.gameScene.add.dom(this.gameScene.coordinates.screenWid, 0)
    //             .setOrigin(0)
    //             .createFromCache('emojiForm');
    //         let inputForm = this.chatForm.getChildByID("input-form")
    //         inputForm.style.width = `${chatFormWid}px`;
    //         inputForm.style.height = `${this.btnExitRoom.getBottomRight().y - this.gameScene.coordinates.cardHeight - 10}px`;

    //         let divfooter = this.chatForm.getChildByID("divfooter")
    //         divfooter.style.bottom = "-1px";
    //         if (CommonMethods.isMobile()) {
    //             divfooter.style.bottom = "-3px";
    //         }

    //         let fullTextDivHeight = this.gameScene.coordinates.screenHei - divfooter.offsetHeight - 10 - this.gameScene.coordinates.cardHeight - 10;
    //         let divOnlinePlayerListHeight = fullTextDivHeight * (1 - this.gameScene.coordinates.chatHeightRatio);
    //         let divChatHeight = fullTextDivHeight * this.gameScene.coordinates.chatHeightRatio - 5;

    //         let divOnlinePlayerList = this.chatForm.getChildByID("divOnlinePlayerList")
    //         divOnlinePlayerList.style.height = `${divOnlinePlayerListHeight}px`;

    //         let divChatHistory = this.chatForm.getChildByID("divChatHistory")
    //         divChatHistory.style.height = `${divChatHeight}px`;

    //         let selectPresetMsgs = this.chatForm.getChildByID("selectPresetMsgs")
    //         selectPresetMsgs.style.width = `${chatFormWid}px`;
    //         let textAreaMsg = this.chatForm.getChildByID("textAreaMsg")
    //         textAreaMsg.style.width = `${selectPresetMsgs.offsetWidth - 6}px`;
    //         if (CommonMethods.isMobile()) {
    //             selectPresetMsgs.onchange = () => {
    //                 this.selectPresetMsgsIsOpen = true;
    //                 this.handleSelectPresetMsgsClick(selectPresetMsgs);
    //             }
    //         } else {
    //             selectPresetMsgs.onclick = () => {
    //                 this.handleSelectPresetMsgsClick(selectPresetMsgs);
    //             }
    //         }
    //     }

    private handleSelectPresetMsgsClick(selectPresetMsgs: any) {
        if (this.selectPresetMsgsIsOpen) {
            this.selectPresetMsgsIsOpen = false;
            let selectedIndex = selectPresetMsgs.selectedIndex;
            let selectedValue = selectPresetMsgs.value;
            let args: (string | number)[] = [selectedIndex, CommonMethods.GetRandomInt(CommonMethods.winEmojiLength), selectedValue];
            this.sendEmojiWithCheck(args)
        } else {
            this.selectPresetMsgsIsOpen = true;
        }
    }

    private emojiSubmitEventhandler() {
        if (!this.gameScene.ui.selectPresetMsgs) return;
        let emojiType = -1;
        let emojiIndex = -1;
        let msgString = this.gameScene.ui.textAreaChatMsg.value;
        if (msgString) {
            msgString = msgString.trim().replace(/(\r\n|\n|\r)/gm, "");
        }
        this.gameScene.ui.textAreaChatMsg.value = "";
        if (!msgString) {
            msgString = this.gameScene.ui.selectPresetMsgs.value;
            emojiType = this.gameScene.ui.selectPresetMsgs.selectedIndex;
            emojiIndex = CommonMethods.GetRandomInt(CommonMethods.winEmojiLength);
        } else if (msgString.startsWith(CommonMethods.sendBroadcastPrefix)) {
            // SendBroadcast
            this.sendBroadcastMsgType(msgString);
            return;
        }
        let args: (string | number)[] = [emojiType, emojiIndex, msgString];
        this.sendEmojiWithCheck(args)
    }

    public sendBroadcastMsgType(msg: string) {
        let shengbi = 0
        if (this.DaojuInfo.daojuInfoByPlayer[this.tractorPlayer.MyOwnId]) {
            shengbi = parseInt(this.DaojuInfo.daojuInfoByPlayer[this.tractorPlayer.MyOwnId].Shengbi);
        }
        if (shengbi < CommonMethods.sendBroadcastCost) {
            alert("升币余额不足，无法发送广播消息")
            return;
        }

        this.gameScene.sendMessageToServer(CommonMethods.SendBroadcast_REQUEST, this.tractorPlayer.MyOwnId, msg);
    }

    public blurChat() {
        if (!this.gameScene.ui.textAreaChatMsg) return;
        this.gameScene.ui.textAreaChatMsg.value = "";
        this.gameScene.ui.textAreaChatMsg.blur();
    }

    //     private shortcutKeyDownEventhandler(event: KeyboardEvent) {
    //         if (!event || !event.key || !this.sgDrawingHelper.IsPlayingGame || this.sgDrawingHelper.IsPlayingGame !== SGCSState.GameName) return;
    //         if (!this.sgDrawingHelper.sgcsState.Dudes[this.sgDrawingHelper.myPlayerIndex].Enabled) return;
    //         let ekey: string = event.key.toLowerCase();
    //         if (!['arrowup', 'arrowleft', 'arrowright'].includes(ekey)) return;

    //         let isUpdated = false;
    //         switch (ekey) {
    //             case 'arrowup':
    //                 this.sgcsPlayer.PressUpKey();
    //                 isUpdated = true;
    //                 break;
    //             case 'arrowleft':
    //                 this.sgcsPlayer.PressLeftKey();
    //                 isUpdated = true;
    //                 break;
    //             case 'arrowright':
    //                 this.sgcsPlayer.PressRightKey();
    //                 isUpdated = true;
    //                 break;
    //             default:
    //                 break;
    //         }
    //         if (isUpdated && this.sgcsPlayer.PlayerId === this.tractorPlayer.MyOwnId) {
    //             this.gameScene.sendMessageToServer(SGCSPlayer.SgcsPlayerUpdated_REQUEST, this.tractorPlayer.MyOwnId, JSON.stringify(this.sgcsPlayer));
    //         }
    //     }

    //     private shortcutKeyUpEventhandler(event: KeyboardEvent) {
    //         if (!event || !event.key) return;
    //         let ekey: string = event.key.toLowerCase();
    //         if (this.sgDrawingHelper.IsPlayingGame === SGCSState.GameName) {
    //             if (['arrowleft', 'arrowright'].includes(ekey)) {
    //                 if (this.sgcsPlayer.PlayerId === this.tractorPlayer.MyOwnId && this.sgDrawingHelper.sgcsState.Dudes[this.sgDrawingHelper.myPlayerIndex].Enabled) {
    //                     this.sgcsPlayer.ReleaseLeftOrRightKey();
    //                     this.gameScene.sendMessageToServer(SGCSPlayer.SgcsPlayerUpdated_REQUEST, this.tractorPlayer.MyOwnId, JSON.stringify(this.sgcsPlayer));
    //                 }
    //                 return;
    //             }
    //         }
    //         if (this.gameScene.isReplayMode) {
    //             if (this.modalForm) return;
    //             event.preventDefault();
    //             switch (ekey) {
    //                 case 'arrowup':
    //                     (this.gameScene as GameReplayScene).btnFirstTrick_Click();
    //                     return;
    //                 case 'arrowleft':
    //                     (this.gameScene as GameReplayScene).btnPreviousTrick_Click();
    //                     return;
    //                 case 'arrowright':
    //                     (this.gameScene as GameReplayScene).btnNextTrick_Click();
    //                     return;
    //                 case 'arrowdown':
    //                     (this.gameScene as GameReplayScene).btnLastTrick_Click();
    //                     return;
    //                 case '0':
    //                     (this.gameScene as GameReplayScene).btnFirstPersonView_Click();
    //                     return;
    //                 default:
    //                     break;
    //             }
    //         } else {
    //             if (ekey === 'escape') {
    //                 if (this.sgDrawingHelper.IsPlayingGame) {
    //                     switch (this.sgDrawingHelper.IsPlayingGame) {
    //                         case SGCSState.GameName:
    //                             this.sgDrawingHelper.hitBomb(this.sgDrawingHelper.players.children.entries[this.sgDrawingHelper.myPlayerIndex], undefined);
    //                             break;
    //                         case SGGBState.GameName:
    //                             this.sgDrawingHelper.sggbState.GameAction = "quit";
    //                             this.sgDrawingHelper.UpdateGobang();
    //                             break;
    //                         default:
    //                             break;
    //                     }
    //                     this.sgDrawingHelper.destroyGame(2);
    //                 }
    //                 this.resetGameRoomUI();
    //                 return;
    //             }
    //             if (this.chatForm && this.chatForm.getChildByID("textAreaMsg") === document.activeElement) {
    //                 if (ekey === 'enter') {
    //                     this.emojiSubmitEventhandler();
    //                 }
    //                 return;
    //             }

    //             switch (ekey) {
    //                 case 'z':
    //                     if (this.modalForm || this.tractorPlayer.isObserver) return;
    //                     this.btnReady_Click();
    //                     return;
    //                 case 's':
    //                     if (this.modalForm || this.tractorPlayer.isObserver) return;
    //                     this.btnPig_Click();
    //                     return;
    //                 case 'r':
    //                     if (this.modalForm || this.tractorPlayer.isObserver) return;
    //                     this.btnRobot_Click();
    //                     return;
    //                 // case 'c':
    //                 //     if (this.modalForm || this.tractorPlayer.isObserver || !this.sgDrawingHelper.IsPlayingGame || !this.sgDrawingHelper.gameOver) return;
    //                 //     this.sgDrawingHelper.restartGame();
    //                 //     return;
    //                 // case 'p':
    //                 //     if (this.modalForm || this.tractorPlayer.isObserver || !this.sgDrawingHelper.IsPlayingGame || this.sgDrawingHelper.gameOver) return;
    //                 //     this.sgDrawingHelper.pauseGame();
    //                 //     return;
    //                 default:
    //                     break;
    //             }

    //             if ('1' <= ekey && ekey <= CommonMethods.emojiMsgs.length.toString() && !this.modalForm) {
    //                 let selectPresetMsgs = this.chatForm.getChildByID("selectPresetMsgs");
    //                 let prevSelection = selectPresetMsgs.selectedIndex;
    //                 let emojiType = parseInt(ekey) - 1;
    //                 if (emojiType !== prevSelection) {
    //                     selectPresetMsgs.selectedIndex = emojiType;
    //                 }
    //                 let emojiIndex = CommonMethods.GetRandomInt(CommonMethods.winEmojiLength);
    //                 let msgString = CommonMethods.emojiMsgs[emojiType]
    //                 let args: (string | number)[] = [emojiType, emojiIndex, msgString];
    //                 this.sendEmojiWithCheck(args)
    //             }
    //         }
    //     }

    private sendEmojiWithCheck(args: (string | number)[]) {
        // if ((this.sgDrawingHelper.hiddenEffects[args[2]] || this.sgDrawingHelper.hiddenGames[args[2]])) {
        //     if (CommonMethods.AllOnline(this.tractorPlayer.CurrentGameState.Players) &&
        //         (SuitEnums.HandStep.DistributingCards <= this.tractorPlayer.CurrentHandState.CurrentHandStep && this.tractorPlayer.CurrentHandState.CurrentHandStep <= SuitEnums.HandStep.Playing)) {
        //         this.appendChatMsg("游戏中途不允许发隐藏技扰乱视听");
        //         return;
        //     }
        //     if (this.tractorPlayer.isObserver) {
        //         this.appendChatMsg("旁观玩家不能发动隐藏技");
        //         return;
        //     }
        //     if (this.sgDrawingHelper.hiddenEffectImages &&
        //         this.sgDrawingHelper.hiddenEffectImages.length > 0 &&
        //         this.sgDrawingHelper.hiddenEffectImages[0].visible ||
        //         this.sgDrawingHelper.hiddenGamesImages &&
        //         this.sgDrawingHelper.hiddenGamesImages.length > 0 &&
        //         this.sgDrawingHelper.hiddenGamesImages[0].visible) {
        //         this.appendChatMsg(CommonMethods.hiddenEffectsWarningMsg);
        //         return;
        //     }
        // }
        if (!this.isSendEmojiEnabled) {
            this.appendChatMsg(CommonMethods.emojiWarningMsg);
            return;
        }
        this.isSendEmojiEnabled = false;
        setTimeout(() => {
            this.isSendEmojiEnabled = true;
        }, 1000 * CommonMethods.emojiWarningIntervalInSec);
        this.gameScene.sendMessageToServer(CommonMethods.SendEmoji_REQUEST, this.tractorPlayer.MyOwnId, JSON.stringify(args))
    }

    //     private lblNickName_Click() {
    //         if (this.modalForm) return
    //         this.modalForm = this.gameScene.add.dom(this.gameScene.coordinates.screenWid * 0.5, this.gameScene.coordinates.screenHei * 0.5).createFromCache('settingsForm');
    //         if (!this.gameScene.isReplayMode) {
    //             this.gameScene.decadeUICanvas.style.zIndex = "-1000";
    //         }

    //         let pAppVersion = this.modalForm.getChildByID("pAppVersion")
    //         pAppVersion.innerText = `版本：${this.gameScene.appVersion}`

    //         let volumeControl = this.modalForm.getChildByID("rangeAudioVolume")
    //         volumeControl.value = Math.floor(this.gameScene.soundVolume * 100)
    //         volumeControl.onchange = () => {
    //             let volValue: number = volumeControl.value
    //             this.gameScene.soundVolume = volValue / 100.0
    //             this.gameScene.loadAudioFiles()
    //             this.gameScene.playAudio(CommonMethods.audioLiangpai, this.GetPlayerSex(this.tractorPlayer.MyOwnId));
    //         }

    //         let txtJoinAudioUrl = this.modalForm.getChildByID("txtJoinAudioUrl")
    //         txtJoinAudioUrl.value = this.gameScene.joinAudioUrl
    //         txtJoinAudioUrl.oninput = () => {
    //             this.gameScene.joinAudioUrl = txtJoinAudioUrl.value
    //         }

    //         let txtPlayerEmail = this.modalForm.getChildByID("txtPlayerEmail")
    //         txtPlayerEmail.value = cookies.get("playerEmail") ? cookies.get("playerEmail") : "";

    //         let txtMaxReplays = this.modalForm.getChildByID("txtMaxReplays")
    //         txtMaxReplays.value = IDBHelper.maxReplays
    //         txtMaxReplays.oninput = () => {
    //             let maxString = txtMaxReplays.value;
    //             let maxInt = 0;
    //             if (CommonMethods.IsNumber(maxString)) {
    //                 maxInt = Math.max(maxInt, parseInt(maxString));
    //             }
    //             IDBHelper.maxReplays = maxInt
    //         }

    //         let btnCleanupReplays = this.modalForm.getChildByID("btnCleanupReplays")
    //         btnCleanupReplays.onclick = () => {
    //             var c = window.confirm("你确定要清空所有录像文件吗？");
    //             if (c === false) {
    //                 return
    //             }
    //             IDBHelper.CleanupReplayEntity(() => {
    //                 this.ReinitReplayEntities(this);
    //                 if (this.gameScene.isReplayMode) this.tractorPlayer.NotifyMessage(["已尝试清空全部录像文件"]);
    //             });
    //             this.DesotroyModalForm();
    //         }

    //         let btnExportZipFile = this.modalForm.getChildByID("btnExportZipFile")
    //         btnExportZipFile.onclick = () => {
    //             FileHelper.ExportZipFile();
    //             this.DesotroyModalForm();
    //         }

    //         let inputRecordingFile = this.modalForm.getChildByID("inputRecordingFile")
    //         inputRecordingFile.onchange = () => {
    //             let fileName = inputRecordingFile.value;
    //             let extension = fileName.split('.').pop();
    //             if (!["json", "zip"].includes(extension.toLowerCase())) {
    //                 alert("unsupported file type!");
    //                 return;
    //             }
    //             if (!inputRecordingFile || !inputRecordingFile.files || inputRecordingFile.files.length <= 0) {
    //                 alert("No file has been selected!");
    //                 return;
    //             }
    //             if (extension.toLowerCase() === "json") {
    //                 FileHelper.ImportJsonFile(inputRecordingFile.files[0], () => {
    //                     this.ReinitReplayEntities(this);
    //                     if (this.gameScene.isReplayMode) this.tractorPlayer.NotifyMessage(["已尝试加载本地录像文件"]);
    //                 });
    //             } else {
    //                 FileHelper.ImportZipFile(inputRecordingFile.files[0], () => {
    //                     this.ReinitReplayEntities(this);
    //                     if (this.gameScene.isReplayMode) this.tractorPlayer.NotifyMessage(["已尝试加载本地录像文件"]);
    //                 });
    //             }
    //             this.DesotroyModalForm();
    //         }

    //         let noDanmu = this.modalForm.getChildByID("cbxNoDanmu")
    //         noDanmu.checked = this.gameScene.noDanmu.toLowerCase() === "true"
    //         noDanmu.onchange = () => {
    //             this.gameScene.noDanmu = noDanmu.checked.toString()
    //         }

    //         let cbxCutCards = this.modalForm.getChildByID("cbxCutCards")
    //         cbxCutCards.checked = this.gameScene.noCutCards.toLowerCase() === "true"
    //         cbxCutCards.onchange = () => {
    //             this.gameScene.noCutCards = cbxCutCards.checked.toString()
    //         }

    //         let cbxYesDragSelect = this.modalForm.getChildByID("cbxYesDragSelect")
    //         cbxYesDragSelect.checked = this.gameScene.yesDragSelect.toLowerCase() === "true"
    //         cbxYesDragSelect.onchange = () => {
    //             this.gameScene.yesDragSelect = cbxYesDragSelect.checked.toString()
    //         }

    //         if (this.gameScene.isReplayMode) return;

    //         // 以下为需要连接服务器才能显示的设置
    //         // 游戏道具栏
    //         let divDaojuWrapper = this.modalForm.getChildByID("divDaojuWrapper");
    //         divDaojuWrapper.style.display = "block";

    //         // 升币
    //         let lblShengbi = this.modalForm.getChildByID("lblShengbi");
    //         let shengbiNum = 0;
    //         if (this.DaojuInfo.daojuInfoByPlayer[this.tractorPlayer.MyOwnId]) {
    //             shengbiNum = this.DaojuInfo.daojuInfoByPlayer[this.tractorPlayer.MyOwnId].Shengbi;
    //         }
    //         lblShengbi.innerHTML = shengbiNum;

    //         // 签到按钮
    //         let btnQiandaoInSettings = this.modalForm.getChildByID("btnQiandaoInSettings")
    //         if (this.IsQiandaoRenewed()) {
    //             btnQiandaoInSettings.disabled = false;
    //             btnQiandaoInSettings.value = "签到领福利";
    //         } else {
    //             btnQiandaoInSettings.disabled = true;
    //             btnQiandaoInSettings.value = "今日已签到";
    //         }
    //         btnQiandaoInSettings.onclick = () => {
    //             btnQiandaoInSettings.disabled = true;
    //             this.DesotroyModalForm();
    //             this.gameScene.sendMessageToServer(PLAYER_QIANDAO_REQUEST, this.tractorPlayer.MyOwnId, "")
    //         }

    //         let btnShengbiLeadingBoard = this.modalForm.getChildByID("btnShengbiLeadingBoard")
    //         btnShengbiLeadingBoard.onclick = () => {
    //             let divShengbiLeadingBoard = this.modalForm.getChildByID("divShengbiLeadingBoard")
    //             divShengbiLeadingBoard.innerHTML = "";

    //             let shengbiLeadingBoard = this.DaojuInfo.shengbiLeadingBoard;
    //             if (!shengbiLeadingBoard) return;

    //             let sortable = [];
    //             for (const [key, value] of Object.entries(shengbiLeadingBoard)) {
    //                 sortable.push([key, (value as number)]);
    //             }
    //             sortable.sort(function (a: any, b: any) {
    //                 return a[1] !== b[1] ? -1 * (a[1] - b[1]) : (a[0] <= b[0] ? -1 : 1);
    //             });
    //             var ul = document.createElement("ul");
    //             for (let i = 0; i < sortable.length; i++) {
    //                 var li = document.createElement("li");
    //                 li.innerText = `【${sortable[i][0]}】${sortable[i][1]}`;
    //                 ul.appendChild(li);
    //             }
    //             divShengbiLeadingBoard.appendChild(ul);
    //         }

    //         // 抢亮卡
    //         let selectQiangliangMin = this.modalForm.getChildByID("selectQiangliangMin")
    //         selectQiangliangMin.value = this.gameScene.qiangliangMin;
    //         selectQiangliangMin.onchange = () => {
    //             this.gameScene.qiangliangMin = selectQiangliangMin.value;
    //         }
    //         // 皮肤
    //         let selectFullSkinInfo = this.modalForm.getChildByID("selectFullSkinInfo")
    //         this.UpdateSkinInfoUI(false);
    //         selectFullSkinInfo.onchange = () => {
    //             this.UpdateSkinInfoUI(true);
    //         }

    //         let btnBuyOrUseSelectedSkin = this.modalForm.getChildByID("btnBuyOrUseSelectedSkin")
    //         btnBuyOrUseSelectedSkin.onclick = () => {
    //             let skinName = selectFullSkinInfo.value;
    //             let isSkinOwned = this.IsSkinOwned(skinName);
    //             let isSkinAfordableWithConfMsg: any[] = this.IsSkinAfordableWithConfMsg(skinName);
    //             let isSkinAfordable = isSkinAfordableWithConfMsg[0] as boolean;
    //             if (!isSkinOwned && !isSkinAfordable) {
    //                 alert("升币余额不足，无法购买此皮肤")
    //             } else {
    //                 let doTransaction = true;
    //                 let msg = isSkinAfordableWithConfMsg[1] as string;
    //                 if (msg && msg.length > 0) {
    //                     var c = window.confirm(msg);
    //                     if (!c) {
    //                         doTransaction = false;
    //                     }
    //                 }
    //                 if (doTransaction) {
    //                     this.gameScene.sendMessageToServer(BUY_USE_SKIN_REQUEST, this.tractorPlayer.MyOwnId, skinName);
    //                     this.DesotroyModalForm();
    //                 }
    //             }
    //         }

    //         if (this.gameScene.isInGameRoom()) {
    //             let cbxNoOverridingFlag = this.modalForm.getChildByID("cbxNoOverridingFlag");
    //             cbxNoOverridingFlag.checked = this.tractorPlayer.CurrentRoomSetting.HideOverridingFlag;
    //             cbxNoOverridingFlag.onchange = () => {
    //                 this.tractorPlayer.CurrentRoomSetting.HideOverridingFlag = cbxNoOverridingFlag.checked;
    //                 this.gameScene.sendMessageToServer(SaveRoomSetting_REQUEST, this.tractorPlayer.MyOwnId, JSON.stringify(this.tractorPlayer.CurrentRoomSetting));
    //             };

    //             let divRoomSettingsWrapper = this.modalForm.getChildByID("divRoomSettingsWrapper");
    //             divRoomSettingsWrapper.style.display = "block";
    //             if (this.tractorPlayer.CurrentRoomSetting.RoomOwner !== this.tractorPlayer.MyOwnId) {
    //                 cbxNoOverridingFlag.disabled = true;
    //             } else {
    //                 let divRoomSettings = this.modalForm.getChildByID("divRoomSettings");
    //                 divRoomSettings.style.display = "block";
    //                 let btnResumeGame = this.modalForm.getChildByID("btnResumeGame")
    //                 btnResumeGame.onclick = () => {
    //                     if (CommonMethods.AllOnline(this.tractorPlayer.CurrentGameState.Players) && !this.tractorPlayer.isObserver && SuitEnums.HandStep.DistributingCards <= this.tractorPlayer.CurrentHandState.CurrentHandStep && this.tractorPlayer.CurrentHandState.CurrentHandStep <= SuitEnums.HandStep.Playing) {
    //                         alert("游戏中途不允许继续牌局,请完成此盘游戏后重试")
    //                     } else {
    //                         this.gameScene.sendMessageToServer(ResumeGameFromFile_REQUEST, this.tractorPlayer.MyOwnId, "");
    //                     }
    //                     this.DesotroyModalForm();
    //                 }

    //                 let btnRandomSeat = this.modalForm.getChildByID("btnRandomSeat")
    //                 btnRandomSeat.onclick = () => {
    //                     if (CommonMethods.AllOnline(this.tractorPlayer.CurrentGameState.Players) && !this.tractorPlayer.isObserver && SuitEnums.HandStep.DistributingCards <= this.tractorPlayer.CurrentHandState.CurrentHandStep && this.tractorPlayer.CurrentHandState.CurrentHandStep <= SuitEnums.HandStep.Playing) {
    //                         alert("游戏中途不允许随机组队,请完成此盘游戏后重试")
    //                     } else {
    //                         this.gameScene.sendMessageToServer(RandomSeat_REQUEST, this.tractorPlayer.MyOwnId, "");
    //                     }
    //                     this.DesotroyModalForm();
    //                 }

    //                 let btnSwapSeat = this.modalForm.getChildByID("btnSwapSeat")
    //                 btnSwapSeat.onclick = () => {
    //                     if (CommonMethods.AllOnline(this.tractorPlayer.CurrentGameState.Players) && !this.tractorPlayer.isObserver && SuitEnums.HandStep.DistributingCards <= this.tractorPlayer.CurrentHandState.CurrentHandStep && this.tractorPlayer.CurrentHandState.CurrentHandStep <= SuitEnums.HandStep.Playing) {
    //                         alert("游戏中途不允许互换座位,请完成此盘游戏后重试")
    //                     } else {
    //                         let selectSwapSeat = this.modalForm.getChildByID("selectSwapSeat")
    //                         this.gameScene.sendMessageToServer(SwapSeat_REQUEST, this.tractorPlayer.MyOwnId, selectSwapSeat.value);
    //                     }
    //                     this.DesotroyModalForm();
    //                 }
    //             }
    //         }
    //     }

    //     private IsSkinOwned(skinName: string): boolean {
    //         let daojuInfoByPlayer = this.DaojuInfo.daojuInfoByPlayer[this.tractorPlayer.MyOwnId];
    //         if (daojuInfoByPlayer) {
    //             let ownedSkinInfoList = daojuInfoByPlayer.ownedSkinInfo;
    //             return ownedSkinInfoList && ownedSkinInfoList.includes(skinName);
    //         }
    //         return false;
    //     }

    //     private IsSkinAfordableWithConfMsg(skinName: string): any[] {
    //         let fullSkinInfo = this.DaojuInfo.fullSkinInfo;
    //         let daojuInfoByPlayer = this.DaojuInfo.daojuInfoByPlayer[this.tractorPlayer.MyOwnId];
    //         if (fullSkinInfo && daojuInfoByPlayer.Shengbi >= fullSkinInfo[skinName].skinCost) {
    //             let msg = "";
    //             if (fullSkinInfo[skinName].skinCost > 0) {
    //                 msg = `此次购买将消耗升币【${fullSkinInfo[skinName].skinCost}】，购买前余额：【${daojuInfoByPlayer.Shengbi}】，购买后余额：【${daojuInfoByPlayer.Shengbi - fullSkinInfo[skinName].skinCost}】，是否确定？`;
    //             }
    //             return [true, msg];
    //         }
    //         return [false, ""];
    //     }

    private GetSkinType(skinName: string): number {
        let fullSkinInfo = this.DaojuInfo.fullSkinInfo;
        if (fullSkinInfo) {
            let targetSkinInfo = fullSkinInfo[skinName];
            if (targetSkinInfo) {
                return targetSkinInfo.skinType;
            }
        }
        return 0;
    }

    //     public GetPlayerSex(playerID: string): string {
    //         let daojuInfoByPlayer = this.DaojuInfo.daojuInfoByPlayer[playerID];
    //         if (daojuInfoByPlayer) {
    //             let skinInUse = daojuInfoByPlayer.skinInUse
    //             let fullSkinInfo = this.DaojuInfo.fullSkinInfo;
    //             if (fullSkinInfo) {
    //                 let targetSkinInfo = fullSkinInfo[skinInUse];
    //                 if (targetSkinInfo) {
    //                     return targetSkinInfo.skinSex;
    //                 }
    //             }
    //         }
    //         return "m";
    //     }

    //     private UpdateSkinInfoUI(preview: boolean) {
    //         let selectFullSkinInfo = this.modalForm.getChildByID("selectFullSkinInfo")
    //         let lblSkinType = this.modalForm.getChildByID("lblSkinType");
    //         let lblSkinCost = this.modalForm.getChildByID("lblSkinCost");
    //         let lblSkinOnwers = this.modalForm.getChildByID("lblSkinOnwers");
    //         let lblSkinIsOwned = this.modalForm.getChildByID("lblSkinIsOwned");
    //         let lblSkinSex = this.modalForm.getChildByID("lblSkinSex");
    //         let btnBuyOrUseSelectedSkin = this.modalForm.getChildByID("btnBuyOrUseSelectedSkin");
    //         let curSkinInfo: any;
    //         let fullSkinInfo = this.DaojuInfo.fullSkinInfo;
    //         let daojuInfoByPlayer = this.DaojuInfo.daojuInfoByPlayer[this.tractorPlayer.MyOwnId];
    //         if (daojuInfoByPlayer) {
    //             if (fullSkinInfo) {
    //                 if (selectFullSkinInfo.options.length === 0) {
    //                     for (const [key, value] of Object.entries(fullSkinInfo)) {
    //                         var option = document.createElement("option");
    //                         option.value = key;
    //                         option.text = (value as any).skinDesc;
    //                         selectFullSkinInfo.add(option);
    //                     }
    //                     selectFullSkinInfo.value = this.gameScene.skinInUse;
    //                 }

    //                 curSkinInfo = fullSkinInfo[selectFullSkinInfo.value];
    //                 if (curSkinInfo) {
    //                     lblSkinSex.innerHTML = curSkinInfo.skinSex === "f" ? "女性" : "男性";
    //                     lblSkinType.innerHTML = curSkinInfo.skinType === 0 ? "静态" : "动态";
    //                     lblSkinCost.innerHTML = `【升币】x${curSkinInfo.skinCost}`;
    //                     let skinOwnersMsg = `此皮肤尚未被人解锁`;
    //                     if (curSkinInfo.skinOwners > 0) {
    //                         skinOwnersMsg = `已有【${curSkinInfo.skinOwners}】人拥有此皮肤`;
    //                     }
    //                     lblSkinOnwers.innerHTML = skinOwnersMsg;
    //                     lblSkinIsOwned.innerHTML = "尚未拥有";
    //                     btnBuyOrUseSelectedSkin.disabled = false;
    //                     btnBuyOrUseSelectedSkin.value = "购买选定的皮肤";
    //                 }
    //             }
    //             let ownedSkinInfoList = daojuInfoByPlayer.ownedSkinInfo;
    //             if (ownedSkinInfoList && ownedSkinInfoList.includes(selectFullSkinInfo.value)) {
    //                 lblSkinIsOwned.innerHTML = "已经拥有";
    //                 btnBuyOrUseSelectedSkin.disabled = false;
    //                 btnBuyOrUseSelectedSkin.value = "启用选定的皮肤";
    //                 if (this.gameScene.skinInUse === selectFullSkinInfo.value) {
    //                     btnBuyOrUseSelectedSkin.disabled = true;
    //                     btnBuyOrUseSelectedSkin.value = "正在使用选定的皮肤";
    //                 }
    //             }
    //         }

    //         if (preview) {
    //             // 皮肤预览
    //             if (curSkinInfo) {
    //                 this.MySkinInUse.setVisible(false);
    //                 this.MySkinFrame.setVisible(false);
    //                 let skinImage: any;
    //                 if (curSkinInfo.skinType === 0) {
    //                     skinImage = this.gameScene.add.image(this.gameScene.coordinates.playerSkinPositions[0].x, this.gameScene.coordinates.playerSkinPositions[0].y, selectFullSkinInfo.value)
    //                 } else {
    //                     skinImage = this.gameScene.add.sprite(this.gameScene.coordinates.playerSkinPositions[0].x, this.gameScene.coordinates.playerSkinPositions[0].y, selectFullSkinInfo.value)
    //                         .play(selectFullSkinInfo.value);
    //                 }

    //                 let width = this.gameScene.coordinates.cardHeight * (skinImage.width / skinImage.height);
    //                 skinImage.setDisplaySize(width, this.gameScene.coordinates.cardHeight)

    //                 let skinFrame = this.gameScene.add.image(this.gameScene.coordinates.playerSkinPositions[0].x, this.gameScene.coordinates.playerSkinPositions[0].y, 'skin_frame')
    //                     .setDisplaySize(width, this.gameScene.coordinates.cardHeight)

    //                 setTimeout(() => {
    //                     skinImage.destroy();
    //                     skinFrame.destroy();
    //                     this.MySkinInUse.setVisible(true);
    //                     this.MySkinFrame.setVisible(true);
    //                 }, 3000);
    //             }
    //         }
    //     }

    //     private ReinitReplayEntities(that: any) {
    //         if (that.gameScene.isReplayMode) {
    //             let grs = that.gameScene as GameReplayScene;
    //             grs.InitReplayEntities(grs);
    //         }
    //     }

    private btnPig_Click() {
        if (!this.gameScene.ui.btnPig || this.gameScene.ui.btnPig.classList.contains('hidden') || this.gameScene.ui.btnPig.classList.contains('disabled')) return;
        this.ToDiscard8Cards();
        this.ToShowCards();
    }
    private ToDiscard8Cards() {
        //判断是否处在扣牌阶段
        if (this.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.DiscardingLast8Cards &&
            this.tractorPlayer.CurrentHandState.Last8Holder == this.tractorPlayer.PlayerId) //如果等我扣牌
        {
            if (this.SelectedCards.length == 8) {
                //扣牌,所以擦去小猪
                this.gameScene.ui.btnPig.hide();

                this.SelectedCards.forEach(card => {
                    this.tractorPlayer.CurrentPoker.RemoveCard(card);
                })
                this.gameScene.sendMessageToServer(StoreDiscardedCards_REQUEST, this.tractorPlayer.MyOwnId, JSON.stringify(this.SelectedCards))
                this.drawingFormHelper.ResortMyHandCards();
            }
        }
    }
    private ToShowCards() {
        if ((this.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.Playing || this.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.DiscardingLast8CardsFinished) &&
            this.tractorPlayer.CurrentTrickState.NextPlayer() == this.tractorPlayer.PlayerId) {
            var selectedCardsValidationResult = TractorRules.IsValid(this.tractorPlayer.CurrentTrickState, this.SelectedCards, this.tractorPlayer.CurrentPoker);
            //如果我准备出的牌合法
            if (selectedCardsValidationResult.ResultType == ShowingCardsValidationResult.ShowingCardsValidationResultType.Valid) {
                //擦去小猪
                this.gameScene.ui.btnPig.hide();

                this.SelectedCards.forEach(card => {
                    this.tractorPlayer.CurrentPoker.RemoveCard(card);
                })

                this.ShowCards();
                this.drawingFormHelper.ResortMyHandCards();
                this.SelectedCards = []
            }
            else if (selectedCardsValidationResult.ResultType == ShowingCardsValidationResult.ShowingCardsValidationResultType.TryToDump) {
                //擦去小猪
                this.gameScene.ui.btnPig.hide();
                this.gameScene.sendMessageToServer(ValidateDumpingCards_REQUEST, this.tractorPlayer.MyOwnId, JSON.stringify(this.SelectedCards))
            }
        }
    }

    public ShowCards() {
        if (this.tractorPlayer.CurrentTrickState.NextPlayer() == this.tractorPlayer.PlayerId) {
            this.tractorPlayer.CurrentTrickState.ShowedCards[this.tractorPlayer.PlayerId] = CommonMethods.deepCopy<number[]>(this.SelectedCards);
            this.gameScene.sendMessageToServer(PlayerShowCards_REQUEST, this.tractorPlayer.MyOwnId, JSON.stringify(this.tractorPlayer.CurrentTrickState));
        }
    }

    // handle failure
    public NotifyDumpingValidationResultEventHandler(result: ShowingCardsValidationResult) {

        //擦掉上一把
        if (this.tractorPlayer.CurrentTrickState.AllPlayedShowedCards() || this.tractorPlayer.CurrentTrickState.IsStarted() == false) {
            this.drawingFormHelper.destroyAllShowedCards();
            this.drawingFormHelper.DrawScoreImageAndCards();
        }

        let latestPlayer = result.PlayerId;
        let position = this.PlayerPosition[latestPlayer];
        this.drawingFormHelper.DrawShowedCardsByPosition(result.CardsToShow, position)
    }

    // handle both
    public NotifyTryToDumpResultEventHandler(result: ShowingCardsValidationResult) {
        if (result.ResultType == ShowingCardsValidationResult.ShowingCardsValidationResultType.DumpingSuccess) { //甩牌成功.
            this.SelectedCards.forEach(card => {
                this.tractorPlayer.CurrentPoker.RemoveCard(card);
            })

            this.ShowCards();
            this.drawingFormHelper.ResortMyHandCards();
            this.SelectedCards = []
        }
        //甩牌失败
        else {
            let msgs: string[] = [
                `甩牌${this.SelectedCards.length}张失败`,
                `"罚分：${this.SelectedCards.length * 10}`,
            ]
            this.tractorPlayer.NotifyMessage(msgs)

            //甩牌失败播放提示音
            // soundPlayerDumpFailure.Play(this.enableSound);

            //暂时关闭托管功能，以免甩牌失败后立即点托管，会出别的牌
            this.gameScene.ui.btnRobot.hide();

            setTimeout(() => {
                result.MustShowCardsForDumpingFail.forEach(card => {
                    this.tractorPlayer.CurrentPoker.RemoveCard(card);
                })
                this.SelectedCards = CommonMethods.deepCopy<number[]>(result.MustShowCardsForDumpingFail)
                this.ShowCards();
                this.drawingFormHelper.ResortMyHandCards();
                this.SelectedCards = []
                this.gameScene.ui.btnRobot.show();
            }, 3000);
        }
    }

    //     public NotifyStartTimerEventHandler(timerLength: number) {
    //         if (timerLength == 0) {
    //             this.timerCountDown = 0
    //             this.clearTimer()
    //             return
    //         }

    //         this.timerCountDown = timerLength
    //         this.timerImage.setVisible(true)
    //         this.timerImage.depth = 100;
    //         this.timerImage.setText(this.timerCountDown.toString())
    //         this.timerIntervalID.push(setInterval(() => { this.timerTicker() }, 1000))
    //     }

    //     private timerTicker() {
    //         this.timerCountDown--
    //         if (this.timerCountDown >= 0) {
    //             this.timerImage.setVisible(true)
    //             this.timerImage.setText(this.timerCountDown.toString())
    //         }
    //         if (this.timerCountDown <= 0) {
    //             setTimeout(() => { this.clearTimer() }, 200)
    //         }
    //     }

    //     private clearTimer() {
    //         if (this.timerIntervalID.length > 0) clearInterval(this.timerIntervalID.shift())
    //         if (this.timerIntervalID.length == 0 && this.timerImage) this.timerImage.setVisible(false)
    //     }

    //     //绘制当前轮各家所出的牌（仅用于切换视角，断线重连，恢复牌局，当前回合大牌变更时）
    private PlayerCurrentTrickShowedCards() {
        //擦掉出牌区
        this.drawingFormHelper.destroyAllShowedCards();
        this.drawingFormHelper.DrawScoreImageAndCards();
        this.tractorPlayer.destroyAllClientMessages()
        let cardsCount = 0
        if (this.tractorPlayer.playerLocalCache.ShowedCardsInCurrentTrick != null) {
            for (const [key, value] of Object.entries(this.tractorPlayer.playerLocalCache.ShowedCardsInCurrentTrick)) {
                let cards: number[] = value as number[]
                if (!cards || cards.length == 0) continue;
                let player: string = key;
                cardsCount = cards.length
                let position = this.PlayerPosition[player];
                this.drawingFormHelper.DrawShowedCardsByPosition(cards, position)
            }
        }
        //重画亮过的牌
        if (this.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.DiscardingLast8Cards) {
            this.drawingFormHelper.TrumpMadeCardsShow();
        }

        //重画大牌标记
        if (this.tractorPlayer.playerLocalCache.WinnderID && cardsCount > 0) {
            this.drawingFormHelper.DrawOverridingFlag(
                cardsCount,
                this.PlayerPosition[this.tractorPlayer.playerLocalCache.WinnderID],
                this.tractorPlayer.playerLocalCache.WinResult - 1,
                false);
        }
    }

    private resetGameRoomUI() {
        this.blurChat();
        // if (this.modalForm) {
        //     if (this.modalForm.getChildByID("btnBapi1")) {
        //         let cutPoint = 0;
        //         let cutInfo = `取消,${cutPoint}`;
        //         this.CutCardShoeCardsCompleteEventHandler(cutPoint, cutInfo);
        //     } else {
        //         if (!this.gameScene.isReplayMode)
        //             this.gameScene.loadAudioFiles();
        //         this.gameScene.saveSettings();
        //         this.DesotroyModalForm();
        //     }
        // }
    }

    //     private DesotroyModalForm() {
    //         if (!this.modalForm) return;
    //         this.modalForm.destroy();
    //         this.modalForm = undefined;
    //         if (!this.gameScene.isReplayMode) {
    //             this.gameScene.decadeUICanvas.style.zIndex = "1000";
    //         }
    //     }

    private ShowLastTrickAndTumpMade() {
        //擦掉上一把
        this.drawingFormHelper.destroyAllShowedCards()
        this.tractorPlayer.destroyAllClientMessages()

        //查看谁亮过什么牌
        //need to draw this first so that we have max count for trump made cards
        this.drawingFormHelper.TrumpMadeCardsShowFromLastTrick();

        //绘制上一轮各家所出的牌，缩小至一半，放在左下角，或者重画当前轮各家所出的牌
        this.PlayerLastTrickShowedCards();

        this.tractorPlayer.NotifyMessage(["回看上轮出牌及亮牌信息"]);
    }

    //绘制上一轮各家所出的牌，缩小一半
    private PlayerLastTrickShowedCards() {
        let lastLeader = this.tractorPlayer.CurrentTrickState.serverLocalCache.lastLeader;
        if (!lastLeader || !this.tractorPlayer.CurrentTrickState.serverLocalCache.lastShowedCards ||
            Object.keys(this.tractorPlayer.CurrentTrickState.serverLocalCache.lastShowedCards).length == 0) return;

        let trickState: CurrentTrickState = new CurrentTrickState();
        trickState.Learder = lastLeader;
        trickState.Trump = this.tractorPlayer.CurrentTrickState.Trump;
        trickState.Rank = this.tractorPlayer.CurrentTrickState.Rank;
        let cardsCount = 0
        for (const [key, value] of Object.entries(this.tractorPlayer.CurrentTrickState.serverLocalCache.lastShowedCards)) {
            trickState.ShowedCards[key] = CommonMethods.deepCopy<number[]>(value as number[])
        }

        for (const [key, value] of Object.entries(trickState.ShowedCards)) {
            let cards: number[] = value as number[]
            if (!cards || cards.length == 0) continue;
            let position = this.PlayerPosition[key];
            cardsCount = cards.length
            this.drawingFormHelper.DrawShowedCardsByPosition(cards, position)
        }
        let winnerID = TractorRules.GetWinner(trickState);
        let tempIsWinByTrump = this.IsWinningWithTrump(trickState, winnerID);
        this.drawingFormHelper.DrawOverridingFlag(cardsCount, this.PlayerPosition[winnerID], tempIsWinByTrump - 1, false);
    }

    public NotifyGameHallEventHandler(roomStateList: RoomState[], playerList: string[]) {
        this.updateOnlineAndRoomPlayerList(roomStateList, playerList);
        if (playerList.includes(this.tractorPlayer.MyOwnId)) {
            this.tractorPlayer.destroyAllClientMessages();
            this.destroyGameRoom();
            this.destroyGameHall();
            this.drawGameHall(roomStateList, playerList);
        }
    }

    public destroyGameHall() {
        if (this.gameScene.ui.frameGameHall) {
            this.gameScene.ui.frameGameHall.remove();
            delete this.gameScene.ui.frameGameHall;
        }
    }

    public drawFrameMain() {
        let frameMain = this.gameScene.ui.create.div('.frameMain', this.gameScene.ui.window);
        frameMain.style.position = 'absolute';
        frameMain.style.top = 'calc(50px)';
        frameMain.style.left = '0px';
        frameMain.style.bottom = '0px';
        frameMain.style.right = '0px';
        this.gameScene.ui.frameMain = frameMain;

        this.gameScene.ui.arena.setAttribute('data-number', 4);

        this.gameScene.ui.frameMain.appendChild(this.gameScene.ui.arena);
    }

    public drawFrameChat() {
        this.gameScene.ui.frameMain.style.right = '250px';

        let frameChat = this.gameScene.ui.create.div('.framechat', this.gameScene.ui.window);
        frameChat.style.width = '250px';
        frameChat.style.position = 'absolute';
        frameChat.style.top = 'calc(50px)';
        frameChat.style.bottom = '0px';
        frameChat.style.right = '0px';
        frameChat.style['z-index'] = CommonMethods.zIndexFrameChat;
        this.gameScene.ui.frameChat = frameChat;

        let divOnlinePlayerList = this.gameScene.ui.create.div('.chatcomp.chatcompwithpadding.chattextdiv', frameChat);
        divOnlinePlayerList.style.top = 'calc(0%)';
        divOnlinePlayerList.style.height = 'calc(20% - 20px)';
        this.gameScene.ui.divOnlinePlayerList = divOnlinePlayerList;

        let divChatHistory = this.gameScene.ui.create.div('.chatcomp.chatcompwithpadding.chattextdiv', frameChat);
        divChatHistory.style.top = 'calc(20%)';
        divChatHistory.style.height = 'calc(60% - 20px)';
        this.gameScene.ui.divChatHistory = divChatHistory;

        var selectChatPresetMsgs = document.createElement("select");
        selectChatPresetMsgs.style.top = 'calc(80%)';
        selectChatPresetMsgs.style.height = 'calc(4%)';
        selectChatPresetMsgs.classList.add('chatcomp', 'chatcompwithoutpadding', 'chatinput');
        frameChat.appendChild(selectChatPresetMsgs);
        this.gameScene.ui.selectPresetMsgs = selectChatPresetMsgs;
        for (var i = 0; i < CommonMethods.ChatPresetMsgs.length; i++) {
            var option = document.createElement("option");
            option.value = CommonMethods.ChatPresetMsgs[i];
            option.text = `${i + 1}-${CommonMethods.ChatPresetMsgs[i]}`;
            selectChatPresetMsgs.appendChild(option);
        }
        if (CommonMethods.isMobile()) {
            selectChatPresetMsgs.addEventListener('change', () => {
                this.selectPresetMsgsIsOpen = true;
                this.handleSelectPresetMsgsClick(selectChatPresetMsgs);

            });
        } else {
            selectChatPresetMsgs.addEventListener('click', () => {
                this.handleSelectPresetMsgsClick(selectChatPresetMsgs);
            });
        }


        var textAreaChatMsg = document.createElement("textarea");
        textAreaChatMsg.maxLength = CommonMethods.chatMaxLength;
        textAreaChatMsg.placeholder = `消息长度不超过${CommonMethods.chatMaxLength}，按“回车键”发送，快捷消息的快捷键为对应的数字键`;
        textAreaChatMsg.style.height = 'calc(13% - 10px)';
        textAreaChatMsg.style.bottom = 'calc(2%)';
        textAreaChatMsg.classList.add('chatcomp', 'chatcompwithpadding', 'chatinput');
        frameChat.appendChild(textAreaChatMsg);
        this.gameScene.ui.textAreaChatMsg = textAreaChatMsg;
    }

    public drawGameRoom() {
        let frameGameRoom = this.gameScene.ui.create.div('.frameGameRoom', this.gameScene.ui.arena);
        frameGameRoom.style.position = 'absolute';
        frameGameRoom.style.top = '0px';
        frameGameRoom.style.left = '0px';
        frameGameRoom.style.bottom = '0px';
        frameGameRoom.style.right = '0px';
        this.gameScene.ui.frameGameRoom = frameGameRoom;

        if (!this.gameScene.ui.gameMe) {
            this.drawGameMe();
        }

        if (!this.gameScene.ui.handZone) {
            this.drawHandZone();
        }

        if (!this.gameScene.ui.gameRoomImagesChairOrPlayer) {
            this.gameScene.ui.gameRoomImagesChairOrPlayer = [];
        }

        // draw lblstarters
        this.gameScene.ui.pokerPlayerStartersLabel = [];
        for (let i = 0; i < 4; i++) {
            var lblStarter = this.gameScene.ui.create.div('.lblStarter', '', this.gameScene.ui.frameGameRoom);
            lblStarter.style.fontFamily = 'serif';
            lblStarter.style.fontSize = '20px';
            lblStarter.style.color = 'orange';
            lblStarter.style['font-weight'] = 'bold';
            lblStarter.style.textAlign = 'left';
            this.gameScene.ui.pokerPlayerStartersLabel.push(lblStarter);

            var obX = this.gameScene.coordinates.playerStarterPositions[i].x;
            var obY = this.gameScene.coordinates.playerStarterPositions[i].y;
            switch (i) {
                case 0:
                    lblStarter.style.left = `calc(${obX})`;
                    lblStarter.style.bottom = `calc(${obY})`;
                    break;
                case 1:
                    lblStarter.style.right = `calc(${obX})`;
                    lblStarter.style.bottom = `calc(${obY})`;
                    lblStarter.style.textAlign = 'right';
                    break;
                case 2:
                    lblStarter.style.right = `calc(${obX})`;
                    lblStarter.style.top = `calc(${obY})`;
                    break;
                case 3:
                    lblStarter.style.left = `calc(${obX})`;
                    lblStarter.style.bottom = `calc(${obY})`;
                    break;
                default:
                    break;
            }
        }

        // room name
        var roomNameText = this.gameScene.ui.create.div('.roomNameText', '', this.gameScene.ui.frameGameRoom);
        roomNameText.style.fontFamily = 'serif';
        roomNameText.style.fontSize = '20px';
        roomNameText.style.color = 'orange';
        roomNameText.style.textAlign = 'left';
        roomNameText.style.left = `calc(0px)`;
        roomNameText.style.top = `calc(0px)`;
        this.gameScene.ui.roomNameText = roomNameText;

        // room owner
        var roomOwnerText = this.gameScene.ui.create.div('.roomOwnerText', '', this.gameScene.ui.frameGameRoom);
        roomOwnerText.style.fontFamily = 'serif';
        roomOwnerText.style.fontSize = '20px';
        roomOwnerText.style.color = 'orange';
        roomOwnerText.style.textAlign = 'left';
        roomOwnerText.style.left = `calc(0px)`;
        roomOwnerText.style.top = `calc(30px)`;
        this.gameScene.ui.roomOwnerText = roomOwnerText;

        // btnPig
        var btnPig = this.gameScene.ui.create.div('.menubutton.highlight.large.pointerdiv', '确定', () => this.btnPig_Click());
        btnPig.style.width = 'calc(60px)';
        btnPig.style.height = 'calc(30px)';
        btnPig.style.position = 'absolute';
        btnPig.style.right = `calc(${this.gameScene.coordinates.cardWidth}px)`;
        btnPig.style.bottom = `calc(${this.gameScene.coordinates.showedCardsPositions[0].y})`;
        btnPig.style.fontFamily = 'serif';
        btnPig.style.fontSize = '20px';
        btnPig.classList.add('disabled');
        btnPig.hide();
        this.gameScene.ui.frameGameRoom.appendChild(btnPig);

        this.gameScene.ui.btnPig = btnPig;

        // btnRobot
        if (!this.gameScene.ui.btnRobot) {
            this.gameScene.ui.btnRobot = this.gameScene.ui.create.system('托管', () => this.btnRobot_Click());
            this.gameScene.ui.btnRobot.hide();
        }
        // btnReady
        if (!this.gameScene.ui.btnReady) {
            this.gameScene.ui.btnReady = this.gameScene.ui.create.system('就绪', () => this.btnReady_Click());
            this.gameScene.ui.btnReady.hide();
        }
        // btnShowLastTrick
        if (!this.gameScene.ui.btnShowLastTrick) {
            this.gameScene.ui.btnShowLastTrick = this.gameScene.ui.create.system('上轮', () => this.HandleRightClickEmptyArea());
            this.gameScene.ui.btnShowLastTrick.hide();
        }
    }

    public drawGameHall(roomStateList: RoomState[], playerList: string[]) {
        if (!this.gameScene.ui.gameMe) {
            this.drawGameMe();
        }

        this.UpdateQiandaoStatus();

        let frameGameHall = this.gameScene.ui.create.div('.frameGameHall', this.gameScene.ui.frameMain);
        frameGameHall.style.position = 'absolute';
        frameGameHall.style.top = '0px';
        frameGameHall.style.left = '0px';
        frameGameHall.style.bottom = '0px';
        frameGameHall.style.right = '0px';
        this.gameScene.ui.frameGameHall = frameGameHall;

        let textHall = this.gameScene.ui.create.div('', '大厅', this.gameScene.ui.frameGameHall);
        textHall.style.width = '70px';
        textHall.style.fontFamily = 'xinwei';
        textHall.style.fontSize = '30px';
        textHall.style.padding = '10px';
        textHall.style.left = 'calc(10px)';
        textHall.style.top = 'calc(60px)';
        textHall.style.textAlign = 'left';

        let topPx = 110;
        for (let i = 0; i < playerList.length; i++) {
            let textHallPlayer = this.gameScene.ui.create.div('', playerList[i], this.gameScene.ui.frameGameHall);
            textHallPlayer.style.fontFamily = 'serif';
            textHallPlayer.style.fontSize = '20px';
            textHallPlayer.style.padding = '10px';
            textHallPlayer.style.left = 'calc(10px)';
            textHallPlayer.style.top = `calc(${topPx}px)`;
            textHallPlayer.style.textAlign = 'left';
            topPx += 30;
        }


        for (let i = 0; i < roomStateList.length; i++) {
            let leftOffset = 35 + 40 * (i % 2);
            let topOffset = 30 + 40 * Math.floor(i / 2);

            var pokerTable = this.gameScene.ui.create.div('.pokerTable', this.gameScene.ui.frameGameHall);
            pokerTable.setBackgroundImage('image/tractor/btn/poker_table.png')
            pokerTable.setAttribute('data-position', i);
            pokerTable.style.left = `calc(${leftOffset}% - 80px)`;
            pokerTable.style.top = `calc(${topOffset}% - 80px)`;
            pokerTable.style.width = '160px';
            pokerTable.style.height = '160px';
            pokerTable.style['background-size'] = '100% 100%';
            pokerTable.style['background-repeat'] = 'no-repeat';

            let pokerTableName = this.gameScene.ui.create.div('', '加入旁观', this.gameScene.ui.frameGameHall);
            pokerTableName.style.fontFamily = 'serif';
            pokerTableName.style.fontSize = '18px';
            pokerTableName.style.width = '160px';
            pokerTableName.style.height = '160px';
            pokerTableName.style.left = `calc(${leftOffset}% - 80px)`;
            pokerTableName.style.top = `calc(${topOffset}% - 80px)`;
            pokerTableName.style.textAlign = 'center';
            pokerTableName.style['line-height'] = '55px';
            pokerTableName.style.cursor = 'pointer';

            // click
            pokerTableName.addEventListener("click", (e: any) => {
                this.destroyGameHall();
                this.gameScene.sendMessageToServer(PLAYER_ENTER_ROOM_REQUEST, this.tractorPlayer.MyOwnId, JSON.stringify({
                    roomID: i,
                    posID: -1,
                }))
            });
            // mouseover
            pokerTableName.addEventListener("mouseover", (e: any) => {
                e.target.style.top = `calc(${topOffset}% - 85px)`;
                e.target.previousSibling.style.top = `calc(${topOffset}% - 85px)`;
            });
            // mouseout
            pokerTableName.addEventListener("mouseout", (e: any) => {
                e.target.style.top = `calc(${topOffset}% - 80px)`;
                e.target.previousSibling.style.top = `calc(${topOffset}% - 80px)`;
            });

            for (let j = 0; j < 4; j++) {
                let leftOffsetChair = `calc(${leftOffset}% - 40px)`;
                let topOffsetChair = `calc(${topOffset}% - 40px)`;
                let topOffsetChairLifted = `calc(${topOffset}% - 45px)`;
                switch (j) {
                    case 0:
                        topOffsetChair = `calc(${topOffset}% - 160px)`;
                        topOffsetChairLifted = `calc(${topOffset}% - 165px)`;
                        break;
                    case 1:
                        leftOffsetChair = `calc(${leftOffset}% - 170px)`;
                        break;
                    case 2:
                        topOffsetChair = `calc(${topOffset}% + 40px)`;
                        topOffsetChairLifted = `calc(${topOffset}% + 35px)`;
                        break;
                    case 3:
                        leftOffsetChair = `calc(${leftOffset}% + 90px)`;
                        break;
                    default:
                        break;
                }
                if (roomStateList[i].CurrentGameState.Players[j] != null) {
                    var obCount = roomStateList[i].CurrentGameState.Players[j].Observers.length;
                    var obTopOffset = 20;
                    let leftOffsetPlayer = `calc(${leftOffset}% - 80px)`;
                    let topOffsetPlayer = topOffsetChair;
                    switch (j) {
                        case 0:
                            topOffsetPlayer = `calc(${topOffset}% - 120px)`;
                            if (obCount > 0) {
                                topOffsetPlayer = `calc(${topOffset}% - 120px - ${obCount * obTopOffset}px)`;
                            }
                            break;
                        case 1:
                            leftOffsetPlayer = `calc(${leftOffset}% - 250px)`;
                            break;
                        case 3:
                            leftOffsetPlayer = `calc(${leftOffset}% + 90px)`;
                            break;
                        default:
                            break;
                    }

                    var pokerPlayer = this.gameScene.ui.create.div('.pokerPlayer', roomStateList[i].CurrentGameState.Players[j].PlayerId, this.gameScene.ui.frameGameHall);
                    pokerPlayer.style.fontFamily = 'serif';
                    pokerPlayer.style.fontSize = '20px';
                    pokerPlayer.style.left = leftOffsetPlayer;
                    pokerPlayer.style.top = topOffsetPlayer;
                    if (j !== 3) pokerPlayer.style.width = '160px';
                    pokerPlayer.style.textAlign = 'center';
                    if (j === 1) {
                        pokerPlayer.style.textAlign = 'right';
                    }
                    else if (j === 3) {
                        pokerPlayer.style.textAlign = 'left';
                    }

                    if (obCount > 0) {
                        for (let k = 0; k < roomStateList[i].CurrentGameState.Players[j].Observers.length; k++) {
                            var obY = `calc(${topOffset}% - 40px + ${(k + 1) * obTopOffset}px)`;
                            switch (j) {
                                case 0:
                                    obY = `calc(${topOffset}% - 120px - ${(obCount - (k + 1)) * obTopOffset}px)`;
                                    break;
                                case 2:
                                    obY = `calc(${topOffset}% + 40px + ${(k + 1) * obTopOffset}px)`;
                                    break;
                                default:
                                    break;
                            }

                            var pokerPlayerOb = this.gameScene.ui.create.div('.pokerPlayerObGameHall', `【${roomStateList[i].CurrentGameState.Players[j].Observers[k]}】`, this.gameScene.ui.frameGameHall);
                            pokerPlayerOb.style.fontFamily = 'serif';
                            pokerPlayerOb.style.fontSize = '20px';
                            pokerPlayerOb.style.left = leftOffsetPlayer;
                            pokerPlayerOb.style.top = obY;
                            if (j !== 3) pokerPlayerOb.style.width = '160px';
                            pokerPlayerOb.style.textAlign = 'center';
                            if (j === 1) {
                                pokerPlayerOb.style.textAlign = 'right';
                            }
                            else if (j === 3) {
                                pokerPlayerOb.style.textAlign = 'left';
                            }
                        }
                    }
                } else {
                    var pokerChair = this.gameScene.ui.create.div('.pokerChair', this.gameScene.ui.frameGameHall);
                    pokerChair.setBackgroundImage('image/tractor/btn/poker_chair.png')
                    pokerChair.setAttribute('data-position', i * 4 + j);
                    pokerChair.style.left = leftOffsetChair;
                    pokerChair.style.top = topOffsetChair;
                    pokerChair.style.width = '80px';
                    pokerChair.style.height = '80px';
                    pokerChair.style['background-size'] = '100% 100%';
                    pokerChair.style['background-repeat'] = 'no-repeat';

                    let pokerChairName = this.gameScene.ui.create.div('.pokerChairName', `${j + 1}`, this.gameScene.ui.frameGameHall);
                    pokerChairName.style.fontFamily = 'cursive';
                    pokerChairName.style.fontSize = '20px';
                    pokerChairName.style.color = 'yellow';
                    pokerChairName.style.width = '80px';
                    pokerChairName.style.height = '80px';
                    pokerChairName.style.left = leftOffsetChair;
                    pokerChairName.style.top = topOffsetChair;
                    pokerChairName.style.textAlign = 'center';
                    pokerChairName.style['line-height'] = '70px';
                    pokerChairName.style.cursor = 'pointer';

                    // click
                    pokerChairName.addEventListener("click", (e: any) => {
                        this.destroyGameHall();
                        this.gameScene.sendMessageToServer(PLAYER_ENTER_ROOM_REQUEST, this.gameScene.playerName, JSON.stringify({
                            roomID: i,
                            posID: j,
                        }))
                    });
                    // mouseover
                    pokerChairName.addEventListener("mouseover", (e: any) => {
                        e.target.style.top = topOffsetChairLifted;
                        e.target.previousSibling.style.top = topOffsetChairLifted;
                    });
                    // mouseout
                    pokerChairName.addEventListener("mouseout", (e: any) => {
                        e.target.style.top = topOffsetChair;
                        e.target.previousSibling.style.top = topOffsetChair;
                    });
                }
            }
        }
    }

    private drawGameMe() {
        this.gameScene.ui.gameMe = this.CreatePlayer(0, this.tractorPlayer.PlayerId, this.gameScene.ui.arena); // creates ui.gameMe
        let skinTypeMe = this.GetSkinType(this.gameScene.skinInUse);
        let skinExtentionMe = skinTypeMe === 0 ? "webp" : "gif";
        let skinURL = `image/tractor/skin/${this.gameScene.skinInUse}.${skinExtentionMe}`;
        this.SetAvatarImage(skinURL, this.gameScene.ui.gameMe, this.gameScene.coordinates.cardHeight);
    }

    private drawHandZone() {
        this.gameScene.ui.create.me(); // creates ui.me, which is hand zone
        this.gameScene.ui.handZone = this.gameScene.ui.me;
        this.gameScene.ui.handZone.style.position = "absolute";
        this.gameScene.ui.handZone.style.left = `calc(${this.gameScene.ui.gameMe.clientWidth}px)`;
        // this.gameScene.ui.handZone.style.left will be re-adjusted via callback of drawGameMe
        this.gameScene.ui.handZone.style.right = `calc(0px)`;
        this.gameScene.ui.handZone.style.width = "auto";
    }

    private CreatePlayer(pos: number, playerId: string, parentNode: any) {
        let playerDiv = this.gameScene.ui.create.player(parentNode);
        playerDiv.setAttribute('data-position', pos);
        playerDiv.node.avatar.style['background-size'] = '100% 100%';
        playerDiv.node.avatar.style['background-repeat'] = 'no-repeat';
        playerDiv.node.avatar.show();

        playerDiv.node.nameol.innerHTML = playerId;
        return playerDiv;
    }

    private EnableShortcutKeys() {
        // 右键点空白区
        window.addEventListener("mouseup", (e: any) => {
            if (this.gameScene.isInGameRoom()) {
                if (e.button === 2 && e.target.classList.contains('frameGameRoom')) {
                    this.HandleRightClickEmptyArea();
                    return;
                }
            }
            if (e.button === 1 && (e.target.classList.contains('frameGameRoom') || e.target.classList.contains('frameGameHall'))) {
                this.resetGameRoomUI();
                return;
            }
        });
        window.addEventListener('keyup', (e: any) => {
            let keyCode = e.keyCode;

            if (e.target === this.gameScene.ui.textAreaChatMsg) {
                if (keyCode === 13) {
                    this.emojiSubmitEventhandler();
                }
                return;
            }

            // 1 - 9: 49 - 57
            if (49 <= keyCode && keyCode <= 49 + CommonMethods.emojiMsgs.length - 1) {
                let prevSelection = this.gameScene.ui.selectPresetMsgs.selectedIndex;
                let emojiType = keyCode - 49;
                if (emojiType !== prevSelection) {
                    this.gameScene.ui.selectPresetMsgs.selectedIndex = emojiType;
                }
                let emojiIndex = CommonMethods.GetRandomInt(CommonMethods.winEmojiLength);
                let msgString = CommonMethods.emojiMsgs[emojiType]
                let args: (string | number)[] = [emojiType, emojiIndex, msgString];
                this.sendEmojiWithCheck(args)
            }

            if (this.gameScene.isInGameRoom()) {
                switch (keyCode) {
                    case 90:
                        if (this.tractorPlayer.isObserver) return;
                        this.btnReady_Click();
                        return;
                    case 83:
                        if (this.tractorPlayer.isObserver) return;
                        this.btnPig_Click();
                        return;
                    case 82:
                        if (this.tractorPlayer.isObserver) return;
                        this.btnRobot_Click();
                        return;
                    default:
                        break;
                }
            }
        });
    }
    public UpdateQiandaoStatus() {
        if (this.gameScene.ui.btnQiandao) {
            if (this.IsQiandaoRenewed()) {
                this.gameScene.ui.btnQiandao.innerHTML = "签到领福利";
                this.gameScene.ui.btnQiandao.show();
            } else {
                this.gameScene.ui.btnQiandao.innerHTML = "今日已签到";
                this.gameScene.ui.btnQiandao.hide();
            }
        }
    }

    public IsQiandaoRenewed(): boolean {
        let daojuInfoByPlayer: any = this.DaojuInfo.daojuInfoByPlayer[this.tractorPlayer.MyOwnId];
        return daojuInfoByPlayer && daojuInfoByPlayer.isRenewed;
    }

    private SetAvatarImage(skinURL: string, playerObj: any, fixedHeight: number, callback?: any, p?: PlayerEntity, i?: number, gs?: GameScene) {
        var img = new Image();
        img.onload = (e: any) => {
            let wid = e.target.width;
            let hei = e.target.height;
            let skinWid = fixedHeight * wid / hei;
            playerObj.style.width = `calc(${skinWid}px)`;
            playerObj.node.avatar.setBackgroundImage(skinURL);
            if (gs && playerObj === gs.ui.gameMe) {
                gs.ui.handZone.style.left = `calc(${gs.ui.gameMe.clientWidth}px)`;
            }

            if (callback) {
                callback(p, i, gs, skinWid);
            }
        };
        img.src = skinURL;
    }

    public UpdateSkinStatus() {
        this.destroyPokerPlayerObGameRoom();
        let daojuInfoByPlayer = this.DaojuInfo.daojuInfoByPlayer[this.tractorPlayer.PlayerId];
        let pMe = CommonMethods.GetPlayerByID(this.tractorPlayer.CurrentGameState.Players, this.tractorPlayer.PlayerId);
        if (daojuInfoByPlayer) {
            let ownedSkinInfoList = daojuInfoByPlayer.ownedSkinInfo;
            if (ownedSkinInfoList && ownedSkinInfoList.includes(this.gameScene.skinInUse)) {
                let skinType = this.GetSkinType(this.gameScene.skinInUse);
                let skinExtention = skinType === 0 ? "webp" : "gif";
                let skinURL = `image/tractor/skin/${this.gameScene.skinInUse}.${skinExtention}`;
                if (this.gameScene.isInGameRoom()) {
                    this.SetAvatarImage(skinURL, this.gameScene.ui.gameMe, this.gameScene.coordinates.cardHeight, this.SetObText, pMe, 0, this.gameScene);
                }
                else {
                    this.SetAvatarImage(skinURL, this.gameScene.ui.gameMe, this.gameScene.coordinates.cardHeight);
                }
            }
        }

        // 如果在房间里，则事实更新其它玩家的皮肤
        if (!this.gameScene.isInGameRoom()) return;
        var curIndex = CommonMethods.GetPlayerIndexByID(this.tractorPlayer.CurrentGameState.Players, this.tractorPlayer.PlayerId)
        curIndex = (curIndex + 1) % 4;
        for (let i = 1; i < 4; i++) {
            let p = this.tractorPlayer.CurrentGameState.Players[curIndex];
            if (p) {
                let playerImage = this.gameScene.ui.gameRoomImagesChairOrPlayer[i];
                //skin
                let skinInUse = this.DaojuInfo.daojuInfoByPlayer[p.PlayerId] ? this.DaojuInfo.daojuInfoByPlayer[p.PlayerId].skinInUse : CommonMethods.defaultSkinInUse;
                let skinType = this.GetSkinType(skinInUse)
                let skinExtention = skinType === 0 ? "webp" : "gif";
                let skinURL = `image/tractor/skin/${skinInUse}.${skinExtention}`;
                this.SetAvatarImage(skinURL, playerImage, this.gameScene.coordinates.cardHeight, this.SetObText, p, i, this.gameScene);
            }

            curIndex = (curIndex + 1) % 4
        }
    }

    public NotifyEmojiEventHandler(playerID: string, emojiType: number, emojiIndex: number, isCenter: boolean, msgString: string, noSpeaker: boolean) {
        let isPlayerInGameHall = this.gameScene.isInGameHall();
        if (0 <= emojiType && emojiType < CommonMethods.winEmojiTypeLength && Object.keys(this.PlayerPosition).includes(playerID)) {
            msgString = CommonMethods.emojiMsgs[emojiType];
            if (!isPlayerInGameHall) {
                this.drawingFormHelper.DrawEmojiByPosition(this.PlayerPosition[playerID], emojiType, emojiIndex, isCenter);
            }
        }
        if (isCenter) return;
        let finalMsg = "";
        // if (!isPlayerInGameHall && this.sgDrawingHelper.hiddenEffects[msgString]) {
        //     if (this.isInHiddenGames()) {
        //         finalMsg = `【${playerID}】发动了隐藏技：【${msgString}】，因为游戏中已屏蔽`;
        //     } else {
        //         this.sgDrawingHelper.hiddenEffects[msgString].apply(this.sgDrawingHelper);
        //         finalMsg = `【${playerID}】发动了隐藏技：【${msgString}】`;
        //     }
        // } else if (!isPlayerInGameHall && this.sgDrawingHelper.hiddenGames[msgString]) {
        //     if (this.isInHiddenGames()) {
        //         finalMsg = `【${playerID}】发动了隐藏技：【${msgString}】，因为游戏中已屏蔽`;
        //     } else {
        //         finalMsg = `【${playerID}】发动了隐藏技：【${msgString}】`;
        //         if (this.tractorPlayer.MyOwnId === playerID) this.sgDrawingHelper.hiddenGames[msgString].apply(this.sgDrawingHelper, [true, playerID]);
        //     }
        // } else {
        let prefix = "【系统消息】：";
        if (playerID && !noSpeaker) {
            prefix = `【${playerID}】说：`;
        }
        finalMsg = `${prefix}${msgString}`;
        // }
        this.drawingFormHelper.DrawDanmu(finalMsg);
        this.appendChatMsg(finalMsg);
    }

    //     public isInHiddenGames(): boolean {
    //         return this.sgDrawingHelper.hiddenGamesImages &&
    //             this.sgDrawingHelper.hiddenGamesImages.length > 0 &&
    //             this.sgDrawingHelper.hiddenGamesImages[0].visible
    //     }

    public appendChatMsg(finalMsg: string) {
        let p = document.createElement("p");
        p.innerText = finalMsg
        this.gameScene.ui.divChatHistory.appendChild(p);
        this.gameScene.ui.divChatHistory.scrollTop = this.gameScene.ui.divChatHistory.scrollHeight;
    }

    public updateOnlineAndRoomPlayerList(roomStateList: RoomState[], playersInGameHall: string[]) {
        // gather players with status
        let playersInGameRoomPlaying: any = {};
        let playersInGameRoomObserving: any = {};

        for (let i = 0; i < roomStateList.length; i++) {
            let rs: RoomState = roomStateList[i];
            let roomName = rs.roomSetting.RoomName;
            for (let j = 0; j < 4; j++) {
                if (rs.CurrentGameState.Players[j] != null) {
                    let player: PlayerEntity = rs.CurrentGameState.Players[j];
                    if (!playersInGameRoomPlaying[roomName]) {
                        playersInGameRoomPlaying[roomName] = [];
                    }
                    if (!playersInGameRoomObserving[roomName]) {
                        playersInGameRoomObserving[roomName] = [];
                    }
                    playersInGameRoomPlaying[roomName].push(player.PlayerId);
                    if (player.Observers && player.Observers.length > 0) {
                        playersInGameRoomObserving[roomName] = playersInGameRoomObserving[roomName].concat(player.Observers);
                    }
                }
            }
        }

        this.gameScene.ui.divOnlinePlayerList.innerHTML = '';

        // players in game hall
        if (playersInGameHall && playersInGameHall.length > 0) {
            let headerGameHall = document.createElement("p");
            headerGameHall.innerText = "大厅";
            headerGameHall.style.fontWeight = 'bold';
            this.gameScene.ui.divOnlinePlayerList.appendChild(headerGameHall);

            for (let i = 0; i < playersInGameHall.length; i++) {
                let d = document.createElement("div");
                d.style.position = 'static';
                d.style.display = 'block';
                let pid = playersInGameHall[i];
                d.innerText = `【${pid}】积分：${this.DaojuInfo.daojuInfoByPlayer[pid].ShengbiTotal}`;
                this.gameScene.ui.divOnlinePlayerList.appendChild(d);
            }
        }

        // players in game room playing or observing
        for (const [key, value] of Object.entries(playersInGameRoomPlaying)) {
            let players: string[] = value as string[];
            let obs: string[] = playersInGameRoomObserving[key]

            let headerGameRoomPlaying = document.createElement("p");
            headerGameRoomPlaying.innerText = `房间【${key}】桌上`;
            headerGameRoomPlaying.style.fontWeight = 'bold';
            this.gameScene.ui.divOnlinePlayerList.appendChild(headerGameRoomPlaying);
            for (let i = 0; i < players.length; i++) {
                let d = document.createElement("div");
                d.style.position = 'static';
                d.style.display = 'block';
                let pid = players[i];
                d.innerText = `【${pid}】积分：${this.DaojuInfo.daojuInfoByPlayer[pid].ShengbiTotal}`;
                this.gameScene.ui.divOnlinePlayerList.appendChild(d);
            }

            if (obs && obs.length > 0) {
                let headerGameRoomObserving = document.createElement("p");
                headerGameRoomObserving.innerText = `房间【${key}】树上`;
                headerGameRoomObserving.style.fontWeight = 'bold';
                this.gameScene.ui.divOnlinePlayerList.appendChild(headerGameRoomObserving);
                for (let i = 0; i < obs.length; i++) {
                    let d = document.createElement("div");
                    d.style.position = 'static';
                    d.style.display = 'block';
                    let oid = obs[i];
                    d.innerText = `【${oid}】积分：${this.DaojuInfo.daojuInfoByPlayer[oid].ShengbiTotal}`;
                    this.gameScene.ui.divOnlinePlayerList.appendChild(d);
                }
            }
        }
        this.gameScene.ui.divOnlinePlayerList.scrollTop = this.gameScene.ui.divOnlinePlayerList.scrollHeight;
    }

    public NotifyOnlinePlayerListEventHandler(playerID: string, isJoining: boolean) {
        let isJoingingStr = isJoining ? "加入" : "退出";
        let chatMsg = `【${playerID}】${isJoingingStr}了游戏`;
        this.appendChatMsg(chatMsg);
    }

    public NotifyGameRoomPlayerListEventHandler(playerID: string, isJoining: boolean, roomName: string) {
        if (!roomName) return;
        let isJoingingStr = isJoining ? "加入" : "退出";
        let chatMsg = `【${playerID}】${isJoingingStr}了房间【${roomName}】`;
        this.appendChatMsg(chatMsg);
    }

    public CutCardShoeCardsEventHandler() {
        let cutInfo = ""
        let cutPoint = -1;
        // if (this.IsDebug || this.modalForm || this.gameScene.noCutCards.toLowerCase() === "true") {
        cutPoint = 0;
        cutInfo = `取消,${cutPoint}`;
        this.CutCardShoeCardsCompleteEventHandler(cutPoint, cutInfo);
        return;
        // }

        // this.modalForm = this.gameScene.add.dom(this.gameScene.coordinates.screenWid * 0.5, this.gameScene.coordinates.screenHei * 0.5).createFromCache('cutCardsForm');
        // this.gameScene.decadeUICanvas.style.zIndex = "-1000";

        // let btnRandom = this.modalForm.getChildByID("btnRandom")
        // btnRandom.onclick = () => {
        //     cutPoint = CommonMethods.GetRandomInt(107) + 1;
        //     cutInfo = `${btnRandom.value},${cutPoint}`;
        //     this.CutCardShoeCardsCompleteEventHandler(cutPoint, cutInfo);
        // }

        // let btnCancel = this.modalForm.getChildByID("btnCancel")
        // btnCancel.onclick = () => {
        //     cutPoint = 0;
        //     cutInfo = `${btnCancel.value},${cutPoint}`;
        //     this.CutCardShoeCardsCompleteEventHandler(cutPoint, cutInfo);
        // }

        // let btnBapi1 = this.modalForm.getChildByID("btnBapi1")
        // btnBapi1.onclick = () => {
        //     cutPoint = 1;
        //     cutInfo = `${btnBapi1.value},${cutPoint}`;
        //     this.CutCardShoeCardsCompleteEventHandler(cutPoint, cutInfo);
        // }

        // let btnBapi3 = this.modalForm.getChildByID("btnBapi3")
        // btnBapi3.onclick = () => {
        //     cutPoint = 3;
        //     cutInfo = `${btnBapi3.value},${cutPoint}`;
        //     this.CutCardShoeCardsCompleteEventHandler(cutPoint, cutInfo);
        // }

        // let btnManual = this.modalForm.getChildByID("btnManual")
        // btnManual.onclick = () => {
        //     let txtManual = this.modalForm.getChildByID("txtManual")
        //     let cutPointStr = txtManual.value;
        //     if (CommonMethods.IsNumber(cutPointStr)) {
        //         cutPoint = parseInt(cutPointStr);
        //     }
        //     cutInfo = `${btnManual.value},${cutPoint}`;
        //     this.CutCardShoeCardsCompleteEventHandler(cutPoint, cutInfo);
        // }
    }
    public CutCardShoeCardsCompleteEventHandler(cutPoint: number, cutInfo: string) {
        if (cutPoint < 0 || cutPoint > 108) {
            alert("请输入0-108之间的数字");
        } else {
            this.gameScene.sendMessageToServer(CommonMethods.PlayerHasCutCards_REQUEST, this.tractorPlayer.MyOwnId, cutInfo);
            // this.DesotroyModalForm();
        }
    }
}
