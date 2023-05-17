var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// @ts-nocheck
import bgimage from "../assets/bg2.jpg";
import packageJson from '../../package.json';
import pokerImage from "../assets/poker.png";
import suitsImage from "../assets/suits.png";
import suitsbarImage from "../assets/suitsbar.png";
import settingsForm from '../assets/text/settings_form.htm';
import replayForm from '../assets/text/replay_form.htm';
import { MainForm } from "./main_form.js";
import { Coordinates } from "./coordinates.js";
import { CommonMethods } from "./common_methods.js";
import { IDBHelper } from "./idb_helper.js";
import { PlayerEntity } from "./player_entity.js";
import { GameState } from "./game_state.js";
import { CurrentHandState } from "./current_hand_state.js";
import { CurrentPoker } from "./current_poker.js";
var cookies = new Cookies();
var GameReplayScene = /** @class */ (function (_super) {
    __extends(GameReplayScene, _super);
    function GameReplayScene() {
        var _this = _super.call(this, "GameReplayScene") || this;
        _this.skinInUse = CommonMethods.defaultSkinInUse;
        _this.isReplayMode = true;
        _this.appVersion = packageJson.version;
        _this.playerName = cookies.get("playerName");
        _this.cardImages = [];
        _this.cardImageSequence = [];
        _this.toolbarImages = [];
        _this.sidebarImages = [];
        _this.scoreCardsImages = [];
        _this.last8CardsImages = [];
        _this.showedCardImages = [];
        _this.clientMessages = [];
        _this.roomUIControls = { images: [], texts: [], imagesChair: [] };
        // this.soundVolume = cookies.get("soundVolume");
        // if (this.soundVolume === undefined) this.soundVolume = 0.5
        _this.noDanmu = cookies.get("noDanmu");
        if (_this.noDanmu === undefined)
            _this.noDanmu = 'false';
        _this.noCutCards = cookies.get("noCutCards");
        if (_this.noCutCards === undefined)
            _this.noCutCards = 'false';
        _this.yesDragSelect = cookies.get("yesDragSelect");
        if (_this.yesDragSelect === undefined)
            _this.yesDragSelect = 'false';
        _this.yesFirstPersonView = cookies.get("yesFirstPersonView");
        if (_this.yesFirstPersonView === undefined)
            _this.yesFirstPersonView = 'false';
        _this.qiangliangMin = cookies.get("qiangliangMin");
        if (_this.qiangliangMin === undefined)
            _this.qiangliangMin = '5';
        _this.joinAudioUrl = cookies.get("joinAudioUrl") ? cookies.get("joinAudioUrl") : "";
        IDBHelper.maxReplays = cookies.get("maxReplays") ? parseInt(cookies.get("maxReplays")) : IDBHelper.maxReplays;
        _this.currentReplayEntities = [];
        IDBHelper.InitIDB();
        _this.coordinates = new Coordinates(_this.isReplayMode);
        return _this;
    }
    GameReplayScene.prototype.preload = function () {
        this.progressBar = this.add.graphics();
        this.progressBox = this.add.graphics();
        this.progressBox.fillStyle(0x999999, 0.7);
        this.progressBox.fillRect(this.coordinates.centerX - this.coordinates.progressBarWidth / 2, this.coordinates.centerY - this.coordinates.progressBarHeight / 2, this.coordinates.progressBarWidth, this.coordinates.progressBarHeight);
        this.loadingText = this.make.text({
            x: this.coordinates.centerX,
            y: this.coordinates.centerY - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        }).setOrigin(0.5, 0.5);
        this.percentText = this.make.text({
            x: this.coordinates.centerX,
            y: this.coordinates.centerY,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        }).setOrigin(0.5, 0.5);
        this.assetText = this.make.text({
            x: this.coordinates.centerX,
            y: this.coordinates.centerY + 50,
            text: '',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        }).setOrigin(0.5, 0.5);
        this.load.on('progress', function (value) {
            if (value == 0)
                return;
            this.progressBar.clear();
            this.progressBar.fillStyle(0xffffff, 1);
            this.progressBar.fillRect(this.coordinates.centerX - this.coordinates.progressBarWidth / 2, this.coordinates.centerY - this.coordinates.progressBarHeight / 2, this.coordinates.progressBarWidth * value, this.coordinates.progressBarHeight);
            this.percentText.setText(parseInt(value * 100) + '%');
        }, this);
        this.load.on('load', function (file) {
            this.assetText.setText('Loaded asset: ' + file.key);
        }, this);
        this.load.image("bg2", bgimage);
        this.load.spritesheet('poker', pokerImage, {
            frameWidth: this.coordinates.cardWidth,
            frameHeight: this.coordinates.cardHeight
        });
        this.load.spritesheet('suitsImage', suitsImage, {
            frameWidth: this.coordinates.toolbarSize,
            frameHeight: this.coordinates.toolbarSize
        });
        this.load.spritesheet('suitsbarImage', suitsbarImage, {
            frameWidth: this.coordinates.toolbarSize,
            frameHeight: this.coordinates.toolbarSize
        });
        this.load.html('settingsForm', settingsForm);
        this.load.html('replayForm', replayForm);
    };
    GameReplayScene.prototype.create = function () {
        var _this = this;
        window.addEventListener("keydown", function (e) {
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
                e.preventDefault();
            }
        }, false);
        this.input.mouse.disableContextMenu();
        this.progressBar.destroy();
        this.progressBox.destroy();
        this.loadingText.destroy();
        this.percentText.destroy();
        this.assetText.destroy();
        this.add.image(0, 0, 'bg2').setOrigin(0).setDisplaySize(this.coordinates.screenWid, this.coordinates.screenHei);
        this.mainForm = new MainForm(this);
        CommonMethods.BuildCardNumMap();
        this.loadReplayForm();
        // 第一视角按钮
        this.btnFirstPersonView = this.add.text(this.coordinates.btnFirstPersonView.x, this.coordinates.btnFirstPersonView.y, '第一视角')
            .setColor('white')
            .setFontSize(30)
            .setPadding(10)
            .setVisible(false)
            .setShadow(2, 2, "#333333", 2, true, true)
            .setStyle({ backgroundColor: 'gray' })
            .setInteractive({ useHandCursor: true })
            .on('pointerup', function () { return _this.btnFirstPersonView_Click(); })
            .on('pointerover', function () {
            _this.btnFirstPersonView.setStyle({ backgroundColor: 'lightblue' });
            // tooltip
            _this.btnTT = _this.createTooltip(_this.btnFirstPersonView.getTopLeft().x, _this.btnFirstPersonView.getTopLeft().y, "快捷键：0 键", true);
        })
            .on('pointerout', function () {
            _this.btnFirstPersonView.setStyle({ backgroundColor: 'gray' });
            // tooltip
            _this.btnTT.destroy();
        });
        this.roomUIControls.texts.push(this.btnFirstPersonView);
        this.btnFirstTrick = this.add.text(this.coordinates.btnFirstTrickPosition.x, this.coordinates.btnFirstTrickPosition.y, '|←')
            .setColor('white')
            .setFontSize(20)
            .setPadding(10)
            .setShadow(2, 2, "#333333", 2, true, true)
            .setStyle({ backgroundColor: 'gray' })
            .setVisible(false)
            .setInteractive({ useHandCursor: true })
            .on('pointerup', function () { return _this.btnFirstTrick_Click(); })
            .on('pointerover', function () {
            _this.btnFirstTrick.setStyle({ backgroundColor: 'lightblue' });
            // tooltip
            _this.btnTT = _this.createTooltip(_this.btnFirstTrick.getTopRight().x, _this.btnFirstTrick.getTopRight().y, "快捷键：↑ 上箭头");
        })
            .on('pointerout', function () {
            _this.btnFirstTrick.setStyle({ backgroundColor: 'gray' });
            // tooltip
            _this.btnTT.destroy();
        });
        this.btnFirstTrick.displayWidth = this.coordinates.replayControlButtonWidth;
        this.roomUIControls.texts.push(this.btnFirstTrick);
        this.btnPreviousTrick = this.add.text(this.coordinates.btnFirstTrickPosition.x + this.coordinates.controlButtonOffset + this.coordinates.replayControlButtonWidth, this.coordinates.btnFirstTrickPosition.y, '←')
            .setColor('white')
            .setFontSize(20)
            .setPadding(10)
            .setShadow(2, 2, "#333333", 2, true, true)
            .setStyle({ backgroundColor: 'gray' })
            .setVisible(false)
            .setInteractive({ useHandCursor: true })
            .on('pointerup', function () { return _this.btnPreviousTrick_Click(); })
            .on('pointerover', function () {
            _this.btnPreviousTrick.setStyle({ backgroundColor: 'lightblue' });
            // tooltip
            _this.btnTT = _this.createTooltip(_this.btnPreviousTrick.getTopRight().x, _this.btnPreviousTrick.getTopRight().y, "快捷键：← 左箭头");
        })
            .on('pointerout', function () {
            _this.btnPreviousTrick.setStyle({ backgroundColor: 'gray' });
            // tooltip
            _this.btnTT.destroy();
        });
        this.btnPreviousTrick.displayWidth = this.coordinates.replayControlButtonWidth;
        this.roomUIControls.texts.push(this.btnPreviousTrick);
        this.btnNextTrick = this.add.text(this.coordinates.btnFirstTrickPosition.x + (this.coordinates.controlButtonOffset + this.coordinates.replayControlButtonWidth) * 2, this.coordinates.btnFirstTrickPosition.y, '→')
            .setColor('white')
            .setFontSize(20)
            .setPadding(10)
            .setShadow(2, 2, "#333333", 2, true, true)
            .setStyle({ backgroundColor: 'gray' })
            .setVisible(false)
            .setInteractive({ useHandCursor: true })
            .on('pointerup', function () { return _this.btnNextTrick_Click(); })
            .on('pointerover', function () {
            _this.btnNextTrick.setStyle({ backgroundColor: 'lightblue' });
            // tooltip
            _this.btnTT = _this.createTooltip(_this.btnNextTrick.getTopRight().x, _this.btnNextTrick.getTopRight().y, "快捷键：→ 右箭头");
        })
            .on('pointerout', function () {
            _this.btnNextTrick.setStyle({ backgroundColor: 'gray' });
            // tooltip
            _this.btnTT.destroy();
        });
        this.btnNextTrick.displayWidth = this.coordinates.replayControlButtonWidth;
        this.roomUIControls.texts.push(this.btnNextTrick);
        this.btnLastTrick = this.add.text(this.coordinates.btnFirstTrickPosition.x + (this.coordinates.controlButtonOffset + this.coordinates.replayControlButtonWidth) * 3, this.coordinates.btnFirstTrickPosition.y, '→|')
            .setColor('white')
            .setFontSize(20)
            .setPadding(10)
            .setShadow(2, 2, "#333333", 2, true, true)
            .setStyle({ backgroundColor: 'gray' })
            .setVisible(false)
            .setInteractive({ useHandCursor: true })
            .on('pointerup', function () { return _this.btnLastTrick_Click(); })
            .on('pointerover', function () {
            _this.btnLastTrick.setStyle({ backgroundColor: 'lightblue' });
            // tooltip
            _this.btnTT = _this.createTooltip(_this.btnLastTrick.getTopRight().x, _this.btnLastTrick.getTopRight().y, "快捷键：↓ 下箭头");
        })
            .on('pointerout', function () {
            _this.btnLastTrick.setStyle({ backgroundColor: 'gray' });
            // tooltip
            _this.btnTT.destroy();
        });
        this.btnLastTrick.displayWidth = this.coordinates.replayControlButtonWidth;
        this.roomUIControls.texts.push(this.btnLastTrick);
    };
    GameReplayScene.prototype.loadReplayForm = function () {
        var _this = this;
        var replayForm = this.add.dom(this.coordinates.replayBarPosition.x, this.coordinates.replayBarPosition.y).setOrigin(0).createFromCache('replayForm');
        this.selectDates = replayForm.getChildByID("selectDates");
        this.selectTimes = replayForm.getChildByID("selectTimes");
        var btnLoadReplay = replayForm.getChildByID("btnLoadReplay");
        this.selectDates.onchange = function () {
            _this.onDatesSelectChange(true, 0);
        };
        this.InitReplayEntities(this);
        btnLoadReplay.onclick = function () {
            if (_this.selectTimes.selectedIndex < 0)
                return;
            _this.loadReplayEntity(_this.currentReplayEntities[1][_this.selectTimes.selectedIndex], true);
            _this.btnFirstPersonView.setVisible(true);
            _this.btnFirstTrick.setVisible(true);
            _this.btnPreviousTrick.setVisible(true);
            _this.btnNextTrick.setVisible(true);
            _this.btnLastTrick.setVisible(true);
            var _loop_1 = function (i) {
                var lblNickName = _this.mainForm.lblNickNames[i];
                // have to clear all listeners, otherwise multiple ones will be added and triggered multiple times
                lblNickName.removeAllListeners();
                lblNickName.setInteractive({ useHandCursor: true })
                    .on('pointerup', function () {
                    lblNickName.setColor('white')
                        .setFontSize(30);
                    var pos = i + 1;
                    _this.replayAngleByPosition(pos);
                })
                    .on('pointerover', function () {
                    lblNickName.setColor('yellow')
                        .setFontSize(40);
                })
                    .on('pointerout', function () {
                    lblNickName.setColor('white')
                        .setFontSize(30);
                });
            };
            // 切换视角
            for (var i = 1; i < 4; i++) {
                _loop_1(i);
            }
        };
    };
    GameReplayScene.prototype.InitReplayEntities = function (that) {
        this.removeOptions(this.selectDates);
        IDBHelper.ReadReplayEntityAll(function (dtList) {
            var dates = [];
            for (var i = 0; i < dtList.length; i++) {
                var dt = dtList[i];
                var datetimes = dt.split(IDBHelper.replaySeparator);
                var dateString = datetimes[0];
                if (!dates.includes(dateString)) {
                    dates.push(dateString);
                    var option = document.createElement("option");
                    option.text = dateString;
                    that.selectDates.add(option);
                }
            }
            that.selectDates.selectedIndex = selectDates.options.length - 1;
            that.onDatesSelectChange(true, 0);
        });
    };
    GameReplayScene.prototype.loadReplayEntity = function (re, shouldDraw) {
        this.mainForm.tractorPlayer.replayEntity.CloneFrom(re);
        this.mainForm.tractorPlayer.replayEntity.CurrentTrickStates.push(null); // use null to indicate end of tricks, so that to show ending scores
        this.mainForm.tractorPlayer.replayedTricks = [];
        this.mainForm.tractorPlayer.replayEntity.Players = CommonMethods.RotateArray(this.mainForm.tractorPlayer.replayEntity.Players, this.mainForm.tractorPlayer.replayAngle);
        if (this.mainForm.tractorPlayer.replayEntity.PlayerRanks != null) {
            this.mainForm.tractorPlayer.replayEntity.PlayerRanks = CommonMethods.RotateArray(this.mainForm.tractorPlayer.replayEntity.PlayerRanks, this.mainForm.tractorPlayer.replayAngle);
        }
        this.StartReplay(shouldDraw);
    };
    GameReplayScene.prototype.StartReplay = function (shouldDraw) {
        this.mainForm.drawingFormHelper.resetReplay();
        this.mainForm.drawingFormHelper.destroyLast8Cards();
        var players = this.mainForm.tractorPlayer.replayEntity.Players;
        var playerRanks = new Array(4);
        if (this.mainForm.tractorPlayer.replayEntity.PlayerRanks != null) {
            playerRanks = this.mainForm.tractorPlayer.replayEntity.PlayerRanks;
        }
        else {
            var tempRank = this.mainForm.tractorPlayer.replayEntity.CurrentHandState.Rank;
            playerRanks = [tempRank, tempRank, tempRank, tempRank];
        }
        this.mainForm.tractorPlayer.PlayerId = players[0];
        this.mainForm.lblNickNames[0].setText(players[0]);
        this.mainForm.lblNickNames[1].setText(players[1]);
        var countofNonEng = (players[1].match(this.coordinates.regexNonEnglishChar) || []).length;
        var tempWid = this.coordinates.player1TextWid * players[1].length + this.coordinates.player1TextWidBigDelta * countofNonEng;
        this.mainForm.lblNickNames[1].setStyle({ fixedWidth: tempWid });
        this.mainForm.lblNickNames[1].setX(this.coordinates.playerMainTextPositions[1].x - tempWid).setY(this.coordinates.playerMainTextPositions[1].y);
        this.mainForm.lblNickNames[2].setText(players[2]).setX(this.coordinates.playerMainTextPositions[2].x);
        this.mainForm.lblNickNames[3].setText(players[3]).setY(this.coordinates.playerMainTextPositions[3].y);
        for (var i = 0; i < this.mainForm.lblNickNames.length; i++) {
            this.mainForm.lblNickNames[i].setVisible(true);
        }
        this.mainForm.lblStarters[0].setText(players[0] == this.mainForm.tractorPlayer.replayEntity.CurrentHandState.Starter ? "庄家" : "1");
        this.mainForm.lblStarters[1].setText(players[1] == this.mainForm.tractorPlayer.replayEntity.CurrentHandState.Starter ? "庄家" : "2");
        this.mainForm.lblStarters[2].setText(players[2] == this.mainForm.tractorPlayer.replayEntity.CurrentHandState.Starter ? "庄家" : "3");
        this.mainForm.lblStarters[3].setText(players[3] == this.mainForm.tractorPlayer.replayEntity.CurrentHandState.Starter ? "庄家" : "4");
        for (var i = 0; i < this.mainForm.lblStarters.length; i++) {
            this.mainForm.lblStarters[i].setVisible(true);
        }
        this.mainForm.tractorPlayer.CurrentGameState = new GameState();
        for (var i = 0; i < this.mainForm.lblStarters.length; i++) {
            var temp = new PlayerEntity();
            temp.PlayerId = players[i];
            temp.Rank = playerRanks[i];
            temp.Team = (i % 2) + 1;
            this.mainForm.tractorPlayer.CurrentGameState.Players[i] = temp;
        }
        //set player position
        this.mainForm.PlayerPosition = {};
        this.mainForm.PositionPlayer = {};
        var nextPlayer = players[0];
        var postion = 1;
        this.mainForm.PlayerPosition[nextPlayer] = postion;
        this.mainForm.PositionPlayer[postion] = nextPlayer;
        nextPlayer = CommonMethods.GetNextPlayerAfterThePlayer(this.mainForm.tractorPlayer.CurrentGameState.Players, nextPlayer).PlayerId;
        while (nextPlayer != players[0]) {
            postion++;
            this.mainForm.PlayerPosition[nextPlayer] = postion;
            this.mainForm.PositionPlayer[postion] = nextPlayer;
            nextPlayer = CommonMethods.GetNextPlayerAfterThePlayer(this.mainForm.tractorPlayer.CurrentGameState.Players, nextPlayer).PlayerId;
        }
        this.mainForm.tractorPlayer.CurrentHandState = new CurrentHandState();
        this.mainForm.tractorPlayer.CurrentHandState.CloneFrom(this.mainForm.tractorPlayer.replayEntity.CurrentHandState);
        for (var _i = 0, _a = Object.entries(this.mainForm.tractorPlayer.CurrentHandState.PlayerHoldingCards); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            var tempcp = new CurrentPoker();
            tempcp.CloneFrom(value);
            this.mainForm.tractorPlayer.CurrentHandState.PlayerHoldingCards[key] = tempcp;
            this.mainForm.tractorPlayer.replayEntity.CurrentHandState.PlayerHoldingCards[key] = tempcp;
        }
        this.mainForm.tractorPlayer.CurrentHandState.Score = 0;
        this.mainForm.tractorPlayer.CurrentHandState.ScoreCards = [];
        this.mainForm.tractorPlayer.CurrentPoker = this.mainForm.tractorPlayer.replayEntity.CurrentHandState.PlayerHoldingCards[players[0]];
        this.mainForm.drawingFormHelper.DrawSidebarFull();
        if (this.shouldShowLast8Cards())
            this.mainForm.drawingFormHelper.DrawDiscardedCards();
        if (shouldDraw) {
            this.drawAllPlayerHandCards();
            this.mainForm.drawingFormHelper.TrumpMadeCardsShowFromLastTrick();
        }
    };
    GameReplayScene.prototype.drawAllPlayerHandCards = function () {
        if (this.yesFirstPersonView === "true") {
            this.mainForm.drawingFormHelper.DrawHandCardsByPosition(1, this.mainForm.tractorPlayer.replayEntity.CurrentHandState.PlayerHoldingCards[this.mainForm.PositionPlayer[1]], 1);
        }
        else {
            for (var i = 1; i <= 4; i++) {
                this.mainForm.drawingFormHelper.DrawHandCardsByPosition(i, this.mainForm.tractorPlayer.replayEntity.CurrentHandState.PlayerHoldingCards[this.mainForm.PositionPlayer[i]], i == 1 ? 1 : this.coordinates.replayHandCardScale);
            }
        }
    };
    GameReplayScene.prototype.replayNextTrick = function () {
        var _this = this;
        if (this.mainForm.tractorPlayer.replayEntity.CurrentTrickStates.Count == 0) {
            return;
        }
        var trick = this.mainForm.tractorPlayer.replayEntity.CurrentTrickStates[0];
        this.mainForm.tractorPlayer.replayEntity.CurrentTrickStates.shift(0);
        this.mainForm.tractorPlayer.replayedTricks.push(trick);
        if (trick == null) {
            this.mainForm.tractorPlayer.CurrentHandState.ScoreCards = CommonMethods.deepCopy(this.mainForm.tractorPlayer.replayEntity.CurrentHandState.ScoreCards);
            this.mainForm.tractorPlayer.CurrentHandState.Score = this.mainForm.tractorPlayer.replayEntity.CurrentHandState.Score;
            this.mainForm.drawingFormHelper.resetReplay();
            this.mainForm.drawingFormHelper.DrawFinishedSendedCards();
            return;
        }
        this.mainForm.drawingFormHelper.resetReplay();
        if (Object.keys(trick.ShowedCards).length == 1 && this.mainForm.PlayerPosition[trick.Learder] == 1) {
            this.DrawDumpFailureMessage(trick);
        }
        this.mainForm.tractorPlayer.CurrentTrickState = trick;
        var curPlayer = trick.Learder;
        var drawDelay = 100;
        var i = 1;
        var _loop_2 = function () {
            var position = this_1.mainForm.PlayerPosition[curPlayer];
            if (Object.keys(trick.ShowedCards).length == 4) {
                trick.ShowedCards[curPlayer].forEach(function (card) {
                    _this.mainForm.tractorPlayer.replayEntity.CurrentHandState.PlayerHoldingCards[curPlayer].RemoveCard(card);
                });
            }
            var cardsList = CommonMethods.deepCopy(trick.ShowedCards[curPlayer]);
            setTimeout(function () {
                _this.mainForm.drawingFormHelper.DrawShowedCardsByPosition(cardsList, position);
            }, i * drawDelay);
            curPlayer = CommonMethods.GetNextPlayerAfterThePlayer(this_1.mainForm.tractorPlayer.CurrentGameState.Players, curPlayer).PlayerId;
        };
        var this_1 = this;
        for (; i <= Object.keys(trick.ShowedCards).length; i++) {
            _loop_2();
        }
        if (Object.keys(trick.ShowedCards).length == 1 && this.mainForm.PlayerPosition[trick.Learder] != 1) {
            this.DrawDumpFailureMessage(trick);
        }
        setTimeout(function () {
            _this.drawAllPlayerHandCards();
        }, i * drawDelay);
        if (trick.Winner) {
            if (!this.mainForm.tractorPlayer.CurrentGameState.ArePlayersInSameTeam(this.mainForm.tractorPlayer.CurrentHandState.Starter, trick.Winner)) {
                this.mainForm.tractorPlayer.CurrentHandState.Score += trick.Points();
                //收集得分牌
                this.mainForm.tractorPlayer.CurrentHandState.ScoreCards = this.mainForm.tractorPlayer.CurrentHandState.ScoreCards.concat(trick.ScoreCards());
            }
        }
        this.mainForm.drawingFormHelper.DrawScoreImageAndCards();
    };
    GameReplayScene.prototype.DrawDumpFailureMessage = function (trick) {
        this.mainForm.tractorPlayer.NotifyMessage([
            "\u73A9\u5BB6\u3010".concat(trick.Learder, "\u3011"),
            "\u7529\u724C".concat(trick.ShowedCards[trick.Learder].length, "\u5F20\u5931\u8D25"),
            "\u7F5A\u5206\uFF1A".concat(trick.ShowedCards[trick.Learder].length * 10),
            "",
            "",
            "",
            ""
        ]);
    };
    GameReplayScene.prototype.btnFirstPersonView_Click = function () {
        if (this.yesFirstPersonView === "false") {
            this.yesFirstPersonView = "true";
            this.btnFirstPersonView.setText("全开视角");
        }
        else {
            this.yesFirstPersonView = "false";
            this.btnFirstPersonView.setText("第一视角");
        }
        this.StartReplay(true);
        this.saveSettings();
    };
    GameReplayScene.prototype.btnFirstTrick_Click = function () {
        if (this.mainForm.tractorPlayer.replayedTricks.length > 0)
            this.loadReplayEntity(this.currentReplayEntities[1][this.selectTimes.selectedIndex], true);
        else {
            if (this.replayPreviousFile())
                this.btnLastTrick_Click();
        }
    };
    GameReplayScene.prototype.btnPreviousTrick_Click = function () {
        if (this.mainForm.tractorPlayer.replayedTricks.length > 1) {
            this.mainForm.drawingFormHelper.resetReplay();
            this.revertReplayTrick();
            this.revertReplayTrick();
            this.replayNextTrick();
        }
        else if (this.mainForm.tractorPlayer.replayedTricks.length == 1) {
            this.btnFirstTrick_Click();
        }
        else {
            if (this.replayPreviousFile())
                this.btnLastTrick_Click();
        }
    };
    GameReplayScene.prototype.btnNextTrick_Click = function () {
        if (this.mainForm.tractorPlayer.replayEntity.CurrentTrickStates.length == 0) {
            this.replayNextFile();
            return;
        }
        this.replayNextTrick();
    };
    GameReplayScene.prototype.btnLastTrick_Click = function () {
        var _this = this;
        if (this.mainForm.tractorPlayer.replayEntity.CurrentTrickStates.length > 0) {
            var _loop_3 = function () {
                var trick = this_2.mainForm.tractorPlayer.replayEntity.CurrentTrickStates[0];
                this_2.mainForm.tractorPlayer.replayedTricks.push(trick);
                this_2.mainForm.tractorPlayer.replayEntity.CurrentTrickStates.shift();
                // 甩牌失败
                if (Object.keys(trick.ShowedCards).length == 1)
                    return "continue";
                var curPlayer = trick.Learder;
                for (var i = 0; i < Object.keys(trick.ShowedCards).length; i++) {
                    trick.ShowedCards[curPlayer].forEach(function (card) {
                        _this.mainForm.tractorPlayer.replayEntity.CurrentHandState.PlayerHoldingCards[curPlayer].RemoveCard(card);
                    });
                    curPlayer = CommonMethods.GetNextPlayerAfterThePlayer(this_2.mainForm.tractorPlayer.CurrentGameState.Players, curPlayer).PlayerId;
                }
            };
            var this_2 = this;
            while (this.mainForm.tractorPlayer.replayEntity.CurrentTrickStates.length > 1) {
                _loop_3();
            }
            this.mainForm.drawingFormHelper.DrawHandCardsByPosition(1, this.mainForm.tractorPlayer.CurrentPoker, 1);
            this.replayNextTrick();
        }
        else
            this.replayNextFile();
    };
    GameReplayScene.prototype.replayPreviousFile = function () {
        if (this.selectTimes.selectedIndex > 0) {
            this.selectTimes.selectedIndex = this.selectTimes.selectedIndex - 1;
            this.loadReplayEntity(this.currentReplayEntities[1][this.selectTimes.selectedIndex], false);
            return true;
        }
        else if (this.selectDates.selectedIndex > 0) {
            this.selectDates.selectedIndex = this.selectDates.selectedIndex - 1;
            this.onDatesSelectChange(false, -1);
            if (this.selectTimes.options && this.selectTimes.options.length > 0) {
                this.selectTimes.selectedIndex = this.selectTimes.options.length - 1;
                this.loadReplayEntity(this.currentReplayEntities[1][this.selectTimes.selectedIndex], false);
                return true;
            }
        }
        return false;
    };
    GameReplayScene.prototype.replayNextFile = function () {
        if (this.selectTimes.selectedIndex < this.selectTimes.options.length - 1) {
            this.selectTimes.selectedIndex = this.selectTimes.selectedIndex + 1;
            this.loadReplayEntity(this.currentReplayEntities[1][this.selectTimes.selectedIndex], true);
        }
        else if (this.selectDates.selectedIndex < this.selectDates.options.length - 1) {
            this.selectDates.selectedIndex = this.selectDates.selectedIndex + 1;
            this.onDatesSelectChange(false, 1);
            if (this.selectTimes.options && this.selectTimes.options.length > 0) {
                this.loadReplayEntity(this.currentReplayEntities[1][this.selectTimes.selectedIndex], true);
            }
        }
    };
    GameReplayScene.prototype.revertReplayTrick = function () {
        var _this = this;
        var trick = this.mainForm.tractorPlayer.replayedTricks.pop();
        this.mainForm.tractorPlayer.replayEntity.CurrentTrickStates.unshift(trick);
        if (trick == null) {
            this.mainForm.tractorPlayer.CurrentHandState.Score -= this.mainForm.tractorPlayer.CurrentHandState.ScorePunishment + this.mainForm.tractorPlayer.CurrentHandState.ScoreLast8CardsBase * this.mainForm.tractorPlayer.CurrentHandState.ScoreLast8CardsMultiplier;
            if (this.shouldShowLast8Cards())
                this.mainForm.drawingFormHelper.DrawDiscardedCards();
        }
        else if (Object.keys(trick.ShowedCards).length == 4) {
            var _loop_4 = function (key, value) {
                value.forEach(function (card) {
                    _this.mainForm.tractorPlayer.replayEntity.CurrentHandState.PlayerHoldingCards[key].AddCard(card);
                });
            };
            for (var _i = 0, _a = Object.entries(trick.ShowedCards); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], value = _b[1];
                _loop_4(key, value);
            }
            if (trick.Winner) {
                if (!this.mainForm.tractorPlayer.CurrentGameState.ArePlayersInSameTeam(this.mainForm.tractorPlayer.CurrentHandState.Starter, trick.Winner)) {
                    this.mainForm.tractorPlayer.CurrentHandState.Score -= trick.Points();
                    //收集得分牌
                    trick.ScoreCards().forEach(function (sc) {
                        _this.mainForm.tractorPlayer.CurrentHandState.ScoreCards = CommonMethods.ArrayRemoveOneByValue(_this.mainForm.tractorPlayer.CurrentHandState.ScoreCards, sc);
                    });
                }
            }
            this.mainForm.drawingFormHelper.DrawScoreImageAndCards();
        }
    };
    // pos is 1-based
    GameReplayScene.prototype.replayAngleByPosition = function (pos) {
        var angleOffset = pos - 1;
        this.mainForm.tractorPlayer.replayAngle = (this.mainForm.tractorPlayer.replayAngle + angleOffset) % 4;
        this.mainForm.tractorPlayer.replayEntity.Players = CommonMethods.RotateArray(this.mainForm.tractorPlayer.replayEntity.Players, angleOffset);
        if (this.mainForm.tractorPlayer.replayEntity.PlayerRanks != null) {
            this.mainForm.tractorPlayer.replayEntity.PlayerRanks = CommonMethods.RotateArray(this.mainForm.tractorPlayer.replayEntity.PlayerRanks, angleOffset);
        }
        this.StartReplay(true);
    };
    GameReplayScene.prototype.onDatesSelectChange = function (isFromClick, direction) {
        var _this = this;
        if (isFromClick) {
            this.currentReplayEntities = [undefined, undefined, undefined];
            IDBHelper.ReadReplayEntityByDate(this.selectDates.value, function (reList) {
                _this.currentReplayEntities[1] = reList;
                _this.removeOptions(_this.selectTimes);
                for (var i = 0; i < reList.length; i++) {
                    var re = reList[i];
                    var datetimes = re.ReplayId.split(IDBHelper.replaySeparator);
                    var timeString = datetimes[1];
                    var option = document.createElement("option");
                    option.text = timeString;
                    _this.selectTimes.add(option);
                }
            });
            var prevDatesIndex = this.selectDates.selectedIndex - 1;
            if (prevDatesIndex >= 0) {
                IDBHelper.ReadReplayEntityByDate(this.selectDates.options[prevDatesIndex].value, function (reList) {
                    _this.currentReplayEntities[0] = reList;
                });
            }
            var nextDatesIndex = this.selectDates.selectedIndex + 1;
            if (nextDatesIndex < this.selectDates.options.length) {
                IDBHelper.ReadReplayEntityByDate(this.selectDates.options[nextDatesIndex].value, function (reList) {
                    _this.currentReplayEntities[2] = reList;
                });
            }
        }
        else {
            this.removeOptions(this.selectTimes);
            var reList = this.currentReplayEntities[1 + direction];
            for (var i = 0; i < reList.length; i++) {
                var re = reList[i];
                var datetimes = re.ReplayId.split(IDBHelper.replaySeparator);
                var timeString = datetimes[1];
                var option = document.createElement("option");
                option.text = timeString;
                this.selectTimes.add(option);
            }
            var newDatesIndex = this.selectDates.selectedIndex + direction;
            if (direction < 0) {
                this.currentReplayEntities.pop();
                this.currentReplayEntities.unshift(undefined);
                if (newDatesIndex >= 0) {
                    IDBHelper.ReadReplayEntityByDate(this.selectDates.options[newDatesIndex].value, function (reList) {
                        _this.currentReplayEntities[0] = reList;
                    });
                }
            }
            else {
                this.currentReplayEntities.shift();
                this.currentReplayEntities.push(undefined);
                if (newDatesIndex < this.selectDates.options.length) {
                    IDBHelper.ReadReplayEntityByDate(this.selectDates.options[newDatesIndex].value, function (reList) {
                        _this.currentReplayEntities[2] = reList;
                    });
                }
            }
        }
    };
    GameReplayScene.prototype.shouldShowLast8Cards = function () {
        return this.yesFirstPersonView !== "true" ||
            this.mainForm.tractorPlayer.CurrentHandState.Starter === this.mainForm.tractorPlayer.replayEntity.Players[0];
    };
    GameReplayScene.prototype.saveSettings = function () {
        // cookies.set('soundVolume', this.soundVolume, { path: '/', expires: CommonMethods.GetCookieExpires() });
        // cookies.set('noDanmu', this.noDanmu, { path: '/', expires: CommonMethods.GetCookieExpires() });
        // cookies.set('noCutCards', this.noCutCards, { path: '/', expires: CommonMethods.GetCookieExpires() });
        // cookies.set('yesDragSelect', this.yesDragSelect, { path: '/', expires: CommonMethods.GetCookieExpires() });
        // cookies.set('yesFirstPersonView', this.yesFirstPersonView, { path: '/', expires: CommonMethods.GetCookieExpires() });
        // cookies.set('qiangliangMin', this.qiangliangMin, { path: '/', expires: CommonMethods.GetCookieExpires() });
        // if (this.joinAudioUrl && !this.joinAudioUrl.match(/^https?:\/\//i)) {
        //     this.joinAudioUrl = 'http://' + this.joinAudioUrl;
        // }
        // cookies.set('joinAudioUrl', this.joinAudioUrl, { path: '/', expires: CommonMethods.GetCookieExpires() });
        // cookies.set('maxReplays', IDBHelper.maxReplays, { path: '/', expires: CommonMethods.GetCookieExpires() });
    };
    GameReplayScene.prototype.isInGameHall = function () {
        return this.hallPlayerHeader && this.hallPlayerHeader.visible;
    };
    GameReplayScene.prototype.isInGameRoom = function () {
        return this.mainForm.roomNameText && this.mainForm.roomNameText.visible;
    };
    GameReplayScene.prototype.removeOptions = function (selectElement) {
        var i, L = selectElement.options.length - 1;
        for (i = L; i >= 0; i--) {
            selectElement.remove(i);
        }
    };
    GameReplayScene.prototype.createTooltip = function (x, y, content, alignLeft) {
        var temptt = this.add.text(x, y, content)
            .setColor('white')
            .setFontSize(20)
            .setShadow(2, 2, "#333333", 2, true, true)
            .setVisible(false);
        if (!alignLeft) {
            x = x - temptt.width;
            temptt.setX(x);
        }
        y = y - temptt.height - 2;
        temptt.setY(y);
        this.tweens.add({
            targets: temptt,
            x: x,
            y: y,
            delay: 500,
            duration: 3000,
            onStart: function () {
                temptt.setVisible(true);
            },
            onComplete: function () {
                temptt.destroy();
            }
        });
        return temptt;
    };
    GameReplayScene.prototype.sendMessageToServer = function (messageType, playerID, content) { };
    GameReplayScene.prototype.loadAudioFiles = function () { };
    GameReplayScene.prototype.drawSgsAni = function (effectName, effectNature, wid, hei) { };
    GameReplayScene.prototype.savePlayerLoginInfo = function (nnorp) { };
    GameReplayScene.prototype.playAudio = function (audioName, sex) { };
    return GameReplayScene;
}(Phaser.Scene));
export { GameReplayScene };
