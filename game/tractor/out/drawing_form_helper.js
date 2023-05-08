// @ts-nocheck
import { CurrentPoker } from './current_poker.js';
import { CommonMethods } from './common_methods.js';
import { SuitEnums } from './suit_enums.js';
import { TractorRules } from './tractor_rulesv';
import { ShowingCardsValidationResult } from './showing_cards_validation_result.js';
import { PokerHelper } from './poker_helper.js';
import { EmojiUtil } from './emoji_util.js';
var CardsReady_REQUEST = "CardsReady";
var DrawingFormHelper = /** @class */ (function () {
    function DrawingFormHelper(mf) {
        this.startX = 0;
        this.startY = 0;
        this.handcardScale = 1;
        this.mainForm = mf;
        this.suitSequence = 0;
    }
    DrawingFormHelper.prototype.IGetCard = function () {
        this.DrawMySortedCardsLikeNT();
        this.reDrawToolbar();
    };
    // drawing cards without any tilt
    DrawingFormHelper.prototype.ResortMyHandCards = function () {
        this.mainForm.myCardIsReady = [];
        this.destroyAllCards();
        this.DrawHandCardsByPosition(1, this.mainForm.tractorPlayer.CurrentPoker, 1);
    };
    // drawing cards with selected cards tilted
    DrawingFormHelper.prototype.DrawMyPlayingCards = function () {
        this.DrawScoreImageAndCards();
        this.destroyAllCards();
        this.DrawHandCardsByPosition(1, this.mainForm.tractorPlayer.CurrentPoker, 1);
        this.validateSelectedCards();
    };
    DrawingFormHelper.prototype.validateSelectedCards = function () {
        if (this.mainForm.tractorPlayer.isObserver)
            return;
        this.mainForm.SelectedCards = [];
        for (var k = 0; k < this.mainForm.myCardIsReady.length; k++) {
            if (this.mainForm.myCardIsReady[k]) {
                this.mainForm.SelectedCards.push(this.mainForm.gameScene.cardImages[k].getData("serverCardNumber"));
            }
        }
        //判断当前的出的牌是否有效,如果有效，画小猪
        if (this.mainForm.SelectedCards.length > 0) {
            var selectedCardsValidationResult = TractorRules.IsValid(this.mainForm.tractorPlayer.CurrentTrickState, this.mainForm.SelectedCards, this.mainForm.tractorPlayer.CurrentPoker);
            if ((this.mainForm.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.Playing
                && this.mainForm.tractorPlayer.CurrentTrickState.NextPlayer() == this.mainForm.tractorPlayer.PlayerId)
                &&
                    (selectedCardsValidationResult.ResultType == ShowingCardsValidationResult.ShowingCardsValidationResultType.Valid ||
                        selectedCardsValidationResult.ResultType == ShowingCardsValidationResult.ShowingCardsValidationResultType.TryToDump)) {
                if (this.mainForm.btnPig && this.mainForm.btnPig.visible) {
                    this.mainForm.btnPig.setInteractive({ useHandCursor: true });
                    this.mainForm.btnPig.setColor('white');
                }
            }
            else if ((this.mainForm.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.Playing
                && this.mainForm.tractorPlayer.CurrentTrickState.NextPlayer() == this.mainForm.tractorPlayer.PlayerId)) {
                this.mainForm.btnPig.disableInteractive();
                this.mainForm.btnPig.setColor('gray');
                this.mainForm.btnPig.setStyle({ backgroundColor: 'gray' });
            }
        }
        else if ((this.mainForm.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.Playing
            && this.mainForm.tractorPlayer.CurrentTrickState.NextPlayer() == this.mainForm.tractorPlayer.PlayerId)) {
            this.mainForm.btnPig.disableInteractive();
            this.mainForm.btnPig.setColor('gray');
            this.mainForm.btnPig.setStyle({ backgroundColor: 'gray' });
        }
        this.My8CardsIsReady();
    };
    DrawingFormHelper.prototype.My8CardsIsReady = function () {
        if (this.mainForm.tractorPlayer.isObserver)
            return;
        //如果等我扣牌
        if (this.mainForm.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.DiscardingLast8Cards && this.mainForm.tractorPlayer.CurrentHandState.Last8Holder == this.mainForm.tractorPlayer.PlayerId) {
            var total = 0;
            for (var i = 0; i < this.mainForm.myCardIsReady.length; i++) {
                if (this.mainForm.myCardIsReady[i]) {
                    total++;
                }
            }
            if (total == 8) {
                this.mainForm.btnPig.setInteractive({ useHandCursor: true });
                this.mainForm.btnPig.setColor('white');
            }
            else {
                this.mainForm.btnPig.disableInteractive();
                this.mainForm.btnPig.setColor('gray');
                this.mainForm.btnPig.setStyle({ backgroundColor: 'gray' });
            }
        }
    };
    // playerPos: 1-4
    DrawingFormHelper.prototype.DrawHandCardsByPosition = function (playerPos, currentPoker, hcs) {
        this.mainForm.cardsOrderNumber = 0;
        var cardCount = currentPoker.Count();
        var posIndex = playerPos - 1;
        this.handcardScale = hcs;
        this.startX = this.mainForm.gameScene.coordinates.handCardPositions[posIndex].x;
        if (posIndex == 0) {
            this.startX -= this.mainForm.gameScene.coordinates.handCardOffset * this.handcardScale / 2 * (cardCount - 1);
        }
        else if (posIndex == 1 || posIndex == 2) {
            var numOfSuits = CommonMethods.getNumOfSuits(currentPoker);
            this.startX -= (this.mainForm.gameScene.coordinates.handCardOffset * this.handcardScale * (cardCount - 1) + (numOfSuits - 1) * this.mainForm.gameScene.coordinates.handCardOffset * this.handcardScale);
        }
        this.startY = this.mainForm.gameScene.coordinates.handCardPositions[posIndex].y;
        var allHeartsNoRank = currentPoker.HeartsNoRank();
        var allSpadesNoRank = currentPoker.SpadesNoRank();
        var allDiamondsNoRank = currentPoker.DiamondsNoRank();
        var allClubsNoRank = currentPoker.ClubsNoRank();
        var curTrump = this.mainForm.tractorPlayer.CurrentHandState.Trump;
        var subSolidMasters = [];
        if (curTrump != SuitEnums.Suit.Heart)
            subSolidMasters[currentPoker.Rank] = currentPoker.HeartsRankTotal();
        if (curTrump != SuitEnums.Suit.Spade)
            subSolidMasters[currentPoker.Rank + 13] = currentPoker.SpadesRankTotal();
        if (curTrump != SuitEnums.Suit.Diamond)
            subSolidMasters[currentPoker.Rank + 26] = currentPoker.DiamondsRankTotal();
        if (curTrump != SuitEnums.Suit.Club)
            subSolidMasters[currentPoker.Rank + 39] = currentPoker.ClubsRankTotal();
        var didDrawMaster = false;
        var primeSolidMasters = [];
        if (curTrump == SuitEnums.Suit.Heart) { //红桃
            this.DrawCardsBySuit(allSpadesNoRank, 13, true);
            this.DrawCardsBySuit(allDiamondsNoRank, 26, true);
            this.DrawCardsBySuit(allClubsNoRank, 39, true);
            if (this.DrawCardsBySuit(allHeartsNoRank, 0, true)) {
                this.startX -= this.mainForm.gameScene.coordinates.handCardOffset * this.handcardScale;
                didDrawMaster = true;
            }
            primeSolidMasters[currentPoker.Rank] = currentPoker.HeartsRankTotal();
        }
        else if (curTrump == SuitEnums.Suit.Spade) { //黑桃
            this.DrawCardsBySuit(allDiamondsNoRank, 26, true);
            this.DrawCardsBySuit(allClubsNoRank, 39, true);
            this.DrawCardsBySuit(allHeartsNoRank, 0, true);
            if (this.DrawCardsBySuit(allSpadesNoRank, 13, true)) {
                this.startX -= this.mainForm.gameScene.coordinates.handCardOffset * this.handcardScale;
                didDrawMaster = true;
            }
            primeSolidMasters[currentPoker.Rank + 13] = currentPoker.SpadesRankTotal();
        }
        else if (curTrump == SuitEnums.Suit.Diamond) { //方片
            this.DrawCardsBySuit(allClubsNoRank, 39, true);
            this.DrawCardsBySuit(allHeartsNoRank, 0, true);
            this.DrawCardsBySuit(allSpadesNoRank, 13, true);
            if (this.DrawCardsBySuit(allDiamondsNoRank, 26, true)) {
                this.startX -= this.mainForm.gameScene.coordinates.handCardOffset * this.handcardScale;
                didDrawMaster = true;
            }
            primeSolidMasters[currentPoker.Rank + 26] = currentPoker.DiamondsRankTotal();
        }
        else if (curTrump == SuitEnums.Suit.Club) { //草花
            this.DrawCardsBySuit(allHeartsNoRank, 0, true);
            this.DrawCardsBySuit(allSpadesNoRank, 13, true);
            this.DrawCardsBySuit(allDiamondsNoRank, 26, true);
            if (this.DrawCardsBySuit(allClubsNoRank, 39, true)) {
                this.startX -= this.mainForm.gameScene.coordinates.handCardOffset * this.handcardScale;
                didDrawMaster = true;
            }
            primeSolidMasters[currentPoker.Rank + 39] = currentPoker.ClubsRankTotal();
        }
        else { //无主
            this.DrawCardsBySuit(allHeartsNoRank, 0, true);
            this.DrawCardsBySuit(allSpadesNoRank, 13, true);
            this.DrawCardsBySuit(allDiamondsNoRank, 26, true);
            this.DrawCardsBySuit(allClubsNoRank, 39, true);
        }
        primeSolidMasters[52] = currentPoker.Cards[52];
        primeSolidMasters[53] = currentPoker.Cards[53];
        if (this.DrawCardsBySuit(subSolidMasters, 0, !didDrawMaster)) {
            this.startX -= this.mainForm.gameScene.coordinates.handCardOffset * this.handcardScale;
            didDrawMaster = true;
        }
        this.DrawCardsBySuit(primeSolidMasters, 0, !didDrawMaster);
    };
    DrawingFormHelper.prototype.DrawMySortedCardsLikeNT = function () {
        var currentPoker = this.mainForm.tractorPlayer.CurrentPoker;
        var cardCount = this.mainForm.tractorPlayer.CurrentPoker.Count();
        //将临时变量清空
        //这三个临时变量记录我手中的牌的位置、大小和是否被点出
        // mainForm.myCardsLocation = new ArrayList();
        // mainForm.myCardsNumber = new ArrayList();
        this.destroyAllCards();
        this.startX = this.mainForm.gameScene.coordinates.handCardPositions[0].x - 13 * (cardCount - 1);
        this.startY = this.mainForm.gameScene.coordinates.handCardPositions[0].y;
        var allHeartsNoRank = currentPoker.HeartsNoRank();
        this.DrawCardsBySuit(allHeartsNoRank, 0, true);
        var allSpadesNoRank = currentPoker.SpadesNoRank();
        this.DrawCardsBySuit(allSpadesNoRank, 13, true);
        var allDiamondsNoRank = currentPoker.DiamondsNoRank();
        this.DrawCardsBySuit(allDiamondsNoRank, 26, true);
        var allClubsNoRank = currentPoker.ClubsNoRank();
        this.DrawCardsBySuit(allClubsNoRank, 39, true);
        var allSolidMasters = [];
        allSolidMasters[currentPoker.Rank] = currentPoker.HeartsRankTotal();
        allSolidMasters[currentPoker.Rank + 13] = currentPoker.SpadesRankTotal();
        allSolidMasters[currentPoker.Rank + 26] = currentPoker.DiamondsRankTotal();
        allSolidMasters[currentPoker.Rank + 39] = currentPoker.ClubsRankTotal();
        allSolidMasters[52] = currentPoker.Cards[52];
        allSolidMasters[53] = currentPoker.Cards[53];
        this.DrawCardsBySuit(allSolidMasters, 0, true);
    };
    DrawingFormHelper.prototype.DrawCardsBySuit = function (cardsToDraw, offset, resetSuitSequence) {
        if (resetSuitSequence)
            this.suitSequence = 1;
        var hasDrawn = false;
        for (var i = 0; i < cardsToDraw.length; i++) {
            var cardCount = cardsToDraw[i];
            for (var j = 0; j < cardCount; j++) {
                this.drawCard(this.startX, this.startY, i + offset);
                this.startX += this.mainForm.gameScene.coordinates.handCardOffset * this.handcardScale;
                hasDrawn = true;
            }
        }
        if (hasDrawn)
            this.startX += this.mainForm.gameScene.coordinates.handCardOffset * this.handcardScale;
        return hasDrawn;
    };
    DrawingFormHelper.prototype.DrawShowedCards = function (serverCardList, x, y, targetImages, scale) {
        for (var i = 0; i < serverCardList.length; i++) {
            var uiCardNumber = CommonMethods.ServerToUICardMap[serverCardList[i]];
            var image = this.mainForm.gameScene.add.sprite(x, y, 'poker', uiCardNumber)
                .setOrigin(0, 0)
                .setInteractive()
                .setDisplaySize(this.mainForm.gameScene.coordinates.cardWidth * scale, this.mainForm.gameScene.coordinates.cardHeight * scale);
            targetImages.push(image);
            x += this.mainForm.gameScene.coordinates.handCardOffset * scale;
        }
    };
    DrawingFormHelper.prototype.drawCard = function (x, y, serverCardNumber) {
        var _this = this;
        var uiCardNumber = CommonMethods.ServerToUICardMap[serverCardNumber];
        var image = this.mainForm.gameScene.add.sprite(x, y, 'poker', uiCardNumber).setOrigin(0, 0).setInteractive()
            .setData("serverCardNumber", serverCardNumber)
            .setData("cardsOrderNumber", this.mainForm.cardsOrderNumber)
            .setScale(this.handcardScale);
        this.mainForm.gameScene.cardImages.push(image);
        this.mainForm.gameScene.input.setDraggable(image);
        var leftCenter = image.getLeftCenter();
        var seqText = this.mainForm.gameScene.add.text(leftCenter.x + 2 * this.handcardScale, leftCenter.y + 13 * this.handcardScale, this.suitSequence.toString())
            .setColor("gray")
            .setFontSize(this.mainForm.gameScene.coordinates.suitSequenceSize)
            .setScale(this.handcardScale);
        this.mainForm.gameScene.cardImageSequence.push(seqText);
        this.suitSequence++;
        if (this.mainForm.gameScene.isReplayMode)
            return;
        if (this.mainForm.myCardIsReady[this.mainForm.cardsOrderNumber] === undefined) {
            this.mainForm.myCardIsReady[this.mainForm.cardsOrderNumber] = false;
        }
        if (!this.mainForm.tractorPlayer.isObserver) {
            // left click
            image.on('dragstart', function (pointer) {
                if (pointer.leftButtonDown()) {
                    _this.handleSelectingCard(image);
                    _this.isDragging = image;
                }
            });
            image.on('dragend', function (pointer) {
                _this.isDragging = undefined;
            });
            image.on('pointerover', function (pointer) {
                if (_this.mainForm.gameScene.yesDragSelect.toLowerCase() === "true" && pointer.leftButtonDown() && _this.isDragging !== image) {
                    _this.handleSelectingCard(image);
                }
            });
            // right click
            image.on('pointerdown', function (pointer) {
                if (pointer.rightButtonDown()) {
                    _this.handleSelectingCardRightClick(image);
                }
            });
        }
        // if I made trump, move it up by 30px
        var trumpMadeCard = (this.mainForm.tractorPlayer.CurrentHandState.Trump - 1) * 13 + this.mainForm.tractorPlayer.CurrentHandState.Rank;
        if (this.mainForm.tractorPlayer.CurrentHandState.TrumpExposingPoker == SuitEnums.TrumpExposingPoker.PairBlackJoker)
            trumpMadeCard = 52;
        else if (this.mainForm.tractorPlayer.CurrentHandState.TrumpExposingPoker == SuitEnums.TrumpExposingPoker.PairRedJoker)
            trumpMadeCard = 53;
        if ((this.mainForm.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.DistributingCards || this.mainForm.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.DistributingCardsFinished) &&
            this.mainForm.tractorPlayer.CurrentHandState.TrumpMaker == this.mainForm.tractorPlayer.PlayerId &&
            trumpMadeCard == serverCardNumber) {
            if (this.mainForm.tractorPlayer.CurrentHandState.TrumpExposingPoker > SuitEnums.TrumpExposingPoker.SingleRank) {
                image.setData("status", "up");
                image.y -= 30;
            }
            else {
                var lifted = false;
                for (var i = 0; i < this.mainForm.gameScene.cardImages.length; i++) {
                    if (this.mainForm.gameScene.cardImages[i].y == y - 30) {
                        lifted = true;
                        break;
                    }
                }
                if (!lifted) {
                    image.setData("status", "up");
                    image.y -= 30;
                }
            }
        }
        if ((this.mainForm.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.DiscardingLast8Cards || this.mainForm.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.Playing) &&
            this.mainForm.myCardIsReady[this.mainForm.cardsOrderNumber] &&
            (image.data === null || !image.getData("status") || image.getData("status") === "down")) {
            image.setData("status", "up");
            image.y -= 30;
        }
        this.mainForm.cardsOrderNumber++;
    };
    DrawingFormHelper.prototype.handleSelectingCard = function (image) {
        if (this.mainForm.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.Playing ||
            this.mainForm.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.DiscardingLast8Cards) {
            if (image.data === null || !image.getData("status") || image.getData("status") === "down") {
                image.setData("status", "up");
                image.y -= 30;
                this.mainForm.myCardIsReady[image.getData("cardsOrderNumber")] = true;
                this.mainForm.gameScene.sendMessageToServer(CardsReady_REQUEST, this.mainForm.tractorPlayer.MyOwnId, JSON.stringify(this.mainForm.myCardIsReady));
                this.validateSelectedCards();
            }
            else {
                image.setData("status", "down");
                image.y += 30;
                this.mainForm.myCardIsReady[image.getData("cardsOrderNumber")] = false;
                this.mainForm.gameScene.sendMessageToServer(CardsReady_REQUEST, this.mainForm.tractorPlayer.MyOwnId, JSON.stringify(this.mainForm.myCardIsReady));
                this.validateSelectedCards();
            }
        }
    };
    DrawingFormHelper.prototype.handleSelectingCardRightClick = function (image) {
        var _this = this;
        //统计已选中的牌张数
        var readyCount = 0;
        var crlength = this.mainForm.myCardIsReady.length;
        for (var ri = 0; ri < crlength; ri++) {
            if (this.mainForm.myCardIsReady[ri])
                readyCount++;
        }
        var showingCardsCp = new CurrentPoker();
        showingCardsCp.Trump = this.mainForm.tractorPlayer.CurrentHandState.Trump;
        showingCardsCp.Rank = this.mainForm.tractorPlayer.CurrentHandState.Rank;
        var i = image.getData("cardsOrderNumber");
        var b = this.mainForm.myCardIsReady[i];
        this.mainForm.myCardIsReady[i] = !b;
        var clickedCardNumber = image.getData("serverCardNumber");
        var isClickedTrump = PokerHelper.IsTrump(clickedCardNumber, showingCardsCp.Trump, showingCardsCp.Rank);
        //响应右键的3种情况：
        //1. 首出（默认）
        var selectMoreCount = 0;
        for (var left = i - 1; left >= 0; left--) {
            var toAddImage = this.mainForm.gameScene.cardImages[left];
            var toAddCardNumber = toAddImage.getData("serverCardNumber");
            if (PokerHelper.GetSuit(toAddCardNumber) == PokerHelper.GetSuit(clickedCardNumber) ||
                PokerHelper.IsTrump(toAddCardNumber, showingCardsCp.Trump, showingCardsCp.Rank) && isClickedTrump)
                selectMoreCount++;
            else
                break;
        }
        var isDiscardingLast8 = this.mainForm.tractorPlayer.CurrentHandState.CurrentHandStep == SuitEnums.HandStep.DiscardingLast8Cards;
        var isFollowing = this.mainForm.tractorPlayer.CurrentTrickState.IsStarted() &&
            this.mainForm.tractorPlayer.CurrentTrickState.ShowedCards[this.mainForm.tractorPlayer.MyOwnId].length == 0 &&
            this.mainForm.tractorPlayer.CurrentTrickState.Learder !== this.mainForm.tractorPlayer.MyOwnId;
        var isLeader = !isDiscardingLast8 && !isFollowing;
        if (isDiscardingLast8) {
            //2. 埋底牌
            selectMoreCount = Math.min(selectMoreCount, 8 - 1 - readyCount);
        }
        else if (isFollowing) {
            //3. 跟出
            selectMoreCount = Math.min(selectMoreCount, this.mainForm.tractorPlayer.CurrentTrickState.LeadingCards().length - 1 - readyCount);
        }
        if (!b) {
            var cardsToDump = [];
            var cardsToDumpCardNumber = [];
            var maxCard = showingCardsCp.Rank == 12 ? 11 : 12;
            var selectTopToDump = !isClickedTrump && clickedCardNumber % 13 == maxCard || isClickedTrump && clickedCardNumber == 53; //如果右键点的A或者大王，且满足甩多张的条件，则向左选中所有本门合理可甩的牌
            if (isLeader && selectTopToDump) {
                var singleCardFound = false;
                for (var j = 1; j <= selectMoreCount; j++) {
                    var toAddImage = this.mainForm.gameScene.cardImages[i - j];
                    var toAddCardNumber = toAddImage.getData("serverCardNumber");
                    var toAddCardImageOnRightImage = this.mainForm.gameScene.cardImages[i - j + 1];
                    var toAddCardNumberOnRight = toAddCardImageOnRightImage.getData("serverCardNumber");
                    //如果候选牌是同一花色
                    if (!PokerHelper.IsTrump(toAddCardNumber, showingCardsCp.Trump, showingCardsCp.Rank) && !isClickedTrump && PokerHelper.GetSuit(toAddCardNumber) == PokerHelper.GetSuit(clickedCardNumber) ||
                        PokerHelper.IsTrump(toAddCardNumber, showingCardsCp.Trump, showingCardsCp.Rank) && isClickedTrump) {
                        var isSingleCard = toAddCardNumber != toAddCardNumberOnRight;
                        if (isSingleCard) {
                            if (singleCardFound) {
                                showingCardsCp.Clear();
                                break;
                            }
                            else {
                                singleCardFound = true;
                            }
                        }
                        showingCardsCp.AddCard(toAddCardNumberOnRight);
                        cardsToDump.push(i - j + 1);
                        cardsToDumpCardNumber.push(toAddCardNumberOnRight);
                        showingCardsCp.AddCard(toAddCardNumberOnRight);
                        if (!isSingleCard) {
                            cardsToDump.push(i - j);
                            cardsToDumpCardNumber.push(toAddCardNumberOnRight);
                        }
                        if (j > 1) {
                            var tractorCount = showingCardsCp.GetTractorOfAnySuit().length;
                            var needToBreak = false;
                            while (cardsToDumpCardNumber.length > 0 && !(tractorCount > 1 && tractorCount * 2 == showingCardsCp.Count())) {
                                needToBreak = true;
                                var totalCount = cardsToDumpCardNumber.length;
                                var cardNumToDel = cardsToDumpCardNumber[cardsToDumpCardNumber.length - 1];
                                showingCardsCp.RemoveCard(cardNumToDel);
                                showingCardsCp.RemoveCard(cardNumToDel);
                                cardsToDumpCardNumber.splice(totalCount - 1, 1);
                                cardsToDump.splice(totalCount - 1, 1);
                                if (cardsToDumpCardNumber.length > 0 && cardsToDumpCardNumber[totalCount - 2] == cardNumToDel) {
                                    cardsToDumpCardNumber.splice(totalCount - 2, 1);
                                    cardsToDump.splice(totalCount - 2, 1);
                                }
                            }
                            if (needToBreak) {
                                break;
                            }
                        }
                        if (!isSingleCard) {
                            j++;
                        }
                        //特殊情况处理，最后一个单张顶张进不到下个循环，须在上轮循环处理
                        if (j == selectMoreCount && !singleCardFound) {
                            var toAddCardImageOnRightImage_1 = this.mainForm.gameScene.cardImages[i - j];
                            var toAddCardNumberOnRight_1 = toAddCardImageOnRightImage_1.getData("serverCardNumber");
                            showingCardsCp.AddCard(toAddCardNumberOnRight_1);
                            showingCardsCp.AddCard(toAddCardNumberOnRight_1);
                            var tractorCount = showingCardsCp.GetTractorOfAnySuit().length;
                            if (tractorCount > 1 && tractorCount * 2 == showingCardsCp.Count()) {
                                cardsToDump.push(i - j);
                            }
                        }
                    }
                    else {
                        break;
                    }
                }
            }
            if (cardsToDump.length >= 2) {
                cardsToDump.forEach(function (c) {
                    _this.mainForm.myCardIsReady[c] = !b;
                });
            }
            else {
                showingCardsCp.Clear();
                var selectAll = false; //如果右键点的散牌，则向左选中所有本门花色的牌
                for (var j = 1; j <= selectMoreCount; j++) {
                    var toAddImage = this.mainForm.gameScene.cardImages[i - j];
                    var toAddCardNumber = toAddImage.getData("serverCardNumber");
                    var toAddCardImageOnRightImage = this.mainForm.gameScene.cardImages[i - j + 1];
                    var toAddCardNumberOnRight = toAddCardImageOnRightImage.getData("serverCardNumber");
                    //如果候选牌是同一花色: 1. neither is trump, same suit; 2. both are trump
                    if (!PokerHelper.IsTrump(toAddCardNumber, showingCardsCp.Trump, showingCardsCp.Rank) && !isClickedTrump && PokerHelper.GetSuit(toAddCardNumber) == PokerHelper.GetSuit(clickedCardNumber) ||
                        PokerHelper.IsTrump(toAddCardNumber, showingCardsCp.Trump, showingCardsCp.Rank) && isClickedTrump) {
                        if (isLeader) {
                            //第一个出，候选牌为对子，拖拉机
                            if (!selectAll) {
                                showingCardsCp.AddCard(toAddCardNumberOnRight);
                                showingCardsCp.AddCard(toAddCardNumber);
                            }
                            if (showingCardsCp.Count() == 2 && (showingCardsCp.GetPairs().length == 1) || //如果是一对
                                ((showingCardsCp.GetTractorOfAnySuit().length > 1) &&
                                    showingCardsCp.Count() == showingCardsCp.GetTractorOfAnySuit().length * 2)) //如果是拖拉机
                             {
                                this.mainForm.myCardIsReady[i - j] = !b;
                                this.mainForm.myCardIsReady[i - j + 1] = !b;
                                j++;
                            }
                            else if (j == 1 || selectAll) {
                                selectAll = true;
                                this.mainForm.myCardIsReady[i - j] = !b;
                            }
                            else {
                                break;
                            }
                        }
                        else {
                            //埋底或者跟出
                            this.mainForm.myCardIsReady[i - j] = !b;
                        }
                    }
                    else {
                        break;
                    }
                }
            }
        }
        else {
            for (var j = 1; j <= i; j++) {
                var toAddImage = this.mainForm.gameScene.cardImages[i - j];
                var toAddCardNumber = toAddImage.getData("serverCardNumber");
                var toAddCardImageOnRightImage = this.mainForm.gameScene.cardImages[i - j + 1];
                var toAddCardNumberOnRight = toAddCardImageOnRightImage.getData("serverCardNumber");
                //如果候选牌是同一花色
                if (PokerHelper.GetSuit(toAddCardNumber) == PokerHelper.GetSuit(clickedCardNumber) ||
                    PokerHelper.IsTrump(toAddCardNumber, showingCardsCp.Trump, showingCardsCp.Rank) && isClickedTrump) {
                    this.mainForm.myCardIsReady[i - j] = !b;
                }
                else {
                    break;
                }
            }
        }
        this.mainForm.SelectedCards.length = 0;
        for (var k = 0; k < crlength; k++) {
            var toAddImage = this.mainForm.gameScene.cardImages[k];
            if (this.mainForm.myCardIsReady[k]) {
                var toAddCardNumber = toAddImage.getData("serverCardNumber");
                this.mainForm.SelectedCards.push(toAddCardNumber);
                //将选定的牌向上提升 via gameScene.cardImages
                if (toAddImage.data === null || !toAddImage.getData("status") || toAddImage.getData("status") === "down") {
                    toAddImage.setData("status", "up");
                    toAddImage.y -= 30;
                }
            }
            else if (toAddImage.data !== null && toAddImage.getData("status") && toAddImage.getData("status") === "up") {
                toAddImage.setData("status", "down");
                toAddImage.y += 30;
            }
        }
        this.mainForm.drawingFormHelper.validateSelectedCards();
        this.mainForm.gameScene.sendMessageToServer(CardsReady_REQUEST, this.mainForm.tractorPlayer.MyOwnId, JSON.stringify(this.mainForm.myCardIsReady));
    };
    // with colorful icons if applicabl
    DrawingFormHelper.prototype.reDrawToolbar = function () {
        var _this = this;
        this.destroyToolbar();
        //如果打无主，无需再判断
        if (this.mainForm.tractorPlayer.CurrentHandState.Rank == 53)
            return;
        var availableTrump = this.mainForm.tractorPlayer.AvailableTrumps();
        var x = this.mainForm.gameScene.coordinates.toolbarPosition.x;
        var y = this.mainForm.gameScene.coordinates.toolbarPosition.y;
        var _loop_1 = function (i) {
            var imagebar = this_1.mainForm.gameScene.add.sprite(x, y, 'suitsbarImage', i).setOrigin(0, 0).setInteractive();
            this_1.mainForm.gameScene.toolbarImages.push(imagebar);
            var isSuiteAvailable = availableTrump.includes(i + 1);
            var suiteOffset = isSuiteAvailable ? 0 : 5;
            var image = this_1.mainForm.gameScene.add.sprite(x + 10, y + 10, 'suitsImage', i + suiteOffset)
                .setOrigin(0, 0)
                .setInteractive()
                .setDisplaySize(30, 30);
            if (isSuiteAvailable && !this_1.mainForm.tractorPlayer.isObserver) {
                var trumpExpIndex_1 = this_1.mainForm.tractorPlayer.CurrentHandState.TrumpExposingPoker + 1;
                if (i == 4) {
                    if (this_1.mainForm.tractorPlayer.CurrentPoker.RedJoker() == 2)
                        trumpExpIndex_1 = SuitEnums.TrumpExposingPoker.PairRedJoker;
                    else
                        trumpExpIndex_1 = SuitEnums.TrumpExposingPoker.PairBlackJoker;
                }
                imagebar.on('pointerdown', function () {
                    _this.mainForm.tractorPlayer.ExposeTrump(trumpExpIndex_1, i + 1, 0);
                });
                image.on('pointerdown', function () {
                    _this.mainForm.tractorPlayer.ExposeTrump(trumpExpIndex_1, i + 1, 0);
                });
            }
            this_1.mainForm.gameScene.toolbarImages.push(image);
            x += this_1.mainForm.gameScene.coordinates.toolbarSize;
        };
        var this_1 = this;
        for (var i = 0; i < 5; i++) {
            _loop_1(i);
        }
    };
    DrawingFormHelper.prototype.TrumpMadeCardsShow = function () {
        this.destroyAllShowedCards();
        if (this.mainForm.tractorPlayer.CurrentHandState.IsNoTrumpMaker)
            return;
        if (this.mainForm.tractorPlayer.CurrentHandState.TrumpExposingPoker == SuitEnums.TrumpExposingPoker.None)
            return;
        var posID = this.mainForm.PlayerPosition[this.mainForm.tractorPlayer.CurrentHandState.TrumpMaker];
        if (posID == 1)
            return;
        var trumpMadeCard = (this.mainForm.tractorPlayer.CurrentHandState.Trump - 1) * 13 + this.mainForm.tractorPlayer.CurrentHandState.Rank;
        if (this.mainForm.tractorPlayer.CurrentHandState.TrumpExposingPoker == SuitEnums.TrumpExposingPoker.PairBlackJoker)
            trumpMadeCard = 52;
        else if (this.mainForm.tractorPlayer.CurrentHandState.TrumpExposingPoker == SuitEnums.TrumpExposingPoker.PairRedJoker)
            trumpMadeCard = 53;
        if (this.mainForm.tractorPlayer.CurrentHandState.TrumpExposingPoker > SuitEnums.TrumpExposingPoker.SingleRank) {
            this.DrawShowedCardsByPosition([trumpMadeCard, trumpMadeCard], posID);
        }
        else {
            this.DrawShowedCardsByPosition([trumpMadeCard], posID);
        }
    };
    DrawingFormHelper.prototype.TrumpMadeCardsShowFromLastTrick = function () {
        var trumpDict = {};
        var lastTrumpStates = this.mainForm.tractorPlayer.CurrentHandState.LastTrumpStates;
        // 如果是无人亮主，则不画
        if (lastTrumpStates.length === 1 && lastTrumpStates[0].IsNoTrumpMaker)
            return;
        lastTrumpStates.forEach(function (lastHandState) {
            var key1 = lastHandState.TrumpMaker;
            if (!Object.keys(trumpDict).includes(key1)) {
                trumpDict[key1] = {};
            }
            var val1 = trumpDict[key1];
            var key2 = lastHandState.Trump;
            if (!Object.keys(val1).includes(key2.toString())) {
                val1[key2.toString()] = lastHandState;
            }
            var val2 = val1[key2.toString()];
            val2.TrumpExposingPoker = Math.max(val2.TrumpExposingPoker, lastHandState.TrumpExposingPoker);
        });
        for (var _i = 0, _a = Object.entries(trumpDict); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            var player = key;
            var posIndex = this.mainForm.PlayerPosition[player];
            var suitToTrumInfo = value;
            var allTrumpCards = [];
            for (var _c = 0, _d = Object.entries(suitToTrumInfo); _c < _d.length; _c++) {
                var _e = _d[_c], key_1 = _e[0], value_1 = _e[1];
                var trump = parseInt(key_1);
                var trumpInfo = value_1;
                var trumpMadeCard = (trump - 1) * 13 + this.mainForm.tractorPlayer.CurrentHandState.Rank;
                if (trumpInfo.TrumpExposingPoker == SuitEnums.TrumpExposingPoker.PairBlackJoker)
                    trumpMadeCard = 52;
                else if (trumpInfo.TrumpExposingPoker == SuitEnums.TrumpExposingPoker.PairRedJoker)
                    trumpMadeCard = 53;
                var count = 1;
                if (trumpInfo.TrumpExposingPoker > SuitEnums.TrumpExposingPoker.SingleRank) {
                    count = 2;
                }
                for (var i = 0; i < count; i++) {
                    allTrumpCards.push(trumpMadeCard);
                }
            }
            this.DrawTrumpMadeCardsByPositionFromLastTrick(allTrumpCards, posIndex);
        }
    };
    DrawingFormHelper.prototype.destroyToolbar = function () {
        this.mainForm.gameScene.toolbarImages.forEach(function (image) {
            image.destroy();
        });
        this.mainForm.gameScene.toolbarImages = [];
    };
    DrawingFormHelper.prototype.destroySidebar = function () {
        this.mainForm.gameScene.sidebarImages.forEach(function (image) {
            image.destroy();
        });
        this.mainForm.gameScene.sidebarImages = [];
    };
    DrawingFormHelper.prototype.destroyAllCards = function () {
        this.mainForm.gameScene.cardImages.forEach(function (image) {
            image.destroy();
        });
        this.mainForm.gameScene.cardImages = [];
        this.mainForm.gameScene.cardImageSequence.forEach(function (image) {
            image.destroy();
        });
        this.mainForm.gameScene.cardImageSequence = [];
    };
    DrawingFormHelper.prototype.destroyAllShowedCards = function () {
        this.mainForm.gameScene.showedCardImages.forEach(function (image) {
            image.destroy();
        });
        this.mainForm.gameScene.showedCardImages = [];
        if (this.mainForm.gameScene.OverridingFlagImage) {
            this.mainForm.gameScene.OverridingFlagImage.destroy();
        }
    };
    // drawing showed cards
    DrawingFormHelper.prototype.DrawShowedCardsByPosition = function (cards, pos) {
        var coords = this.getShowedCardsCoordinatesByPosition(cards.length, pos);
        this.DrawShowedCards(cards, coords.x, coords.y, this.mainForm.gameScene.showedCardImages, 1);
    };
    DrawingFormHelper.prototype.getShowedCardsCoordinatesByPosition = function (count, pos) {
        var posInd = pos - 1;
        var x = this.mainForm.gameScene.coordinates.showedCardsPositions[posInd].x;
        var y = this.mainForm.gameScene.coordinates.showedCardsPositions[posInd].y;
        switch (posInd) {
            case 0:
                x = x - (count - 1) * this.mainForm.gameScene.coordinates.handCardOffset / 2;
                break;
            case 1:
                x = x - (count - 1) * this.mainForm.gameScene.coordinates.handCardOffset;
                break;
            case 2:
                x = x - (count - 1) * this.mainForm.gameScene.coordinates.handCardOffset / 2;
                break;
            case 3:
                break;
            default:
                break;
        }
        return { x: x, y: y };
    };
    // drawing TrumpMade cards from last trick
    DrawingFormHelper.prototype.DrawTrumpMadeCardsByPositionFromLastTrick = function (cards, pos) {
        var coords = this.getTrumpMadeCardsCoordinatesByPosition(cards.length, pos);
        this.DrawShowedCards(cards, coords.x, coords.y, this.mainForm.gameScene.showedCardImages, this.mainForm.gameScene.coordinates.trumpMadeCardsScale);
    };
    DrawingFormHelper.prototype.getTrumpMadeCardsCoordinatesByPosition = function (count, pos) {
        var posInd = pos - 1;
        var x = this.mainForm.gameScene.coordinates.trumpMadeCardsPositions[posInd].x;
        var y = this.mainForm.gameScene.coordinates.trumpMadeCardsPositions[posInd].y;
        switch (posInd) {
            case 0:
            case 1:
            case 2:
                x = x - (count - 1) * this.mainForm.gameScene.coordinates.handCardOffset * this.mainForm.gameScene.coordinates.trumpMadeCardsScale;
                break;
            default:
                break;
        }
        return { x: x, y: y };
    };
    DrawingFormHelper.prototype.DrawSidebarFull = function () {
        var isRoomFull = CommonMethods.GetPlayerCount(this.mainForm.tractorPlayer.CurrentGameState.Players) == 4;
        this.destroySidebar();
        var meRank = "2";
        var opRank = "2";
        if (isRoomFull) {
            var allPlayers = this.mainForm.tractorPlayer.CurrentGameState.Players;
            var meIndex = CommonMethods.GetPlayerIndexByID(allPlayers, this.mainForm.tractorPlayer.PlayerId);
            var opIndex = (meIndex + 1) % 4;
            meRank = CommonMethods.GetNumberString(allPlayers[meIndex].Rank);
            opRank = CommonMethods.GetNumberString(allPlayers[opIndex].Rank);
        }
        var meStarterString = "";
        var opStarterString = "";
        var starter = this.mainForm.tractorPlayer.CurrentHandState.Starter;
        if (starter) {
            var isMyTeamStarter = this.mainForm.PlayerPosition[starter] % 2 == 1;
            if (isMyTeamStarter)
                meStarterString = "\uFF0C\u505A\u5E84\uFF1A".concat(starter);
            else
                opStarterString = "\uFF0C\u505A\u5E84\uFF1A".concat(starter);
        }
        var meString = "\u6211\u65B9\uFF1A".concat(meRank).concat(meStarterString);
        var opString = "\u5BF9\u65B9\uFF1A".concat(opRank).concat(opStarterString);
        this.mainForm.gameScene.sidebarImages.push(this.mainForm.gameScene.add.text(this.mainForm.gameScene.coordinates.sidebarMyTeamPostion.x, this.mainForm.gameScene.coordinates.sidebarMyTeamPostion.y, meString).setColor("orange").setFontSize(this.mainForm.gameScene.coordinates.iconSize));
        this.mainForm.gameScene.sidebarImages.push(this.mainForm.gameScene.add.text(this.mainForm.gameScene.coordinates.sidebarOpTeamPostion.x, this.mainForm.gameScene.coordinates.sidebarOpTeamPostion.y, opString).setColor("orange").setFontSize(this.mainForm.gameScene.coordinates.iconSize));
        var trumpMakerString = "";
        var trumpIndex = 0;
        var trumpMaker = this.mainForm.tractorPlayer.CurrentHandState.TrumpMaker;
        if (trumpMaker && this.mainForm.tractorPlayer.CurrentHandState.IsNoTrumpMaker) {
            trumpMakerString = "无人亮主";
        }
        else if (trumpMaker) {
            trumpMakerString = trumpMaker;
            trumpIndex = this.mainForm.tractorPlayer.CurrentHandState.Trump;
        }
        var exposerString = "\u4EAE\u724C\uFF1A".concat(trumpMakerString);
        var trumpImage = this.mainForm.gameScene.add.text(this.mainForm.gameScene.coordinates.sidebarTrumpMaker.x, this.mainForm.gameScene.coordinates.sidebarTrumpMaker.y, exposerString).setColor("orange").setFontSize(this.mainForm.gameScene.coordinates.iconSize);
        this.mainForm.gameScene.sidebarImages.push(trumpImage);
        if (trumpMaker && !this.mainForm.tractorPlayer.CurrentHandState.IsNoTrumpMaker) {
            this.mainForm.gameScene.sidebarImages.push(this.mainForm.gameScene.add.sprite(this.mainForm.gameScene.coordinates.sidebarTrumpMaker.x + trumpImage.displayWidth + 10, this.mainForm.gameScene.coordinates.sidebarTrumpMaker.y, 'suitsImage', trumpIndex - 1 + 5)
                .setOrigin(0, 0)
                .setDisplaySize(20, 20));
            if (this.mainForm.tractorPlayer.CurrentHandState.TrumpExposingPoker > SuitEnums.TrumpExposingPoker.SingleRank) {
                this.mainForm.gameScene.sidebarImages.push(this.mainForm.gameScene.add.sprite(this.mainForm.gameScene.coordinates.sidebarTrumpMaker.x + trumpImage.displayWidth + 10 + this.mainForm.gameScene.coordinates.iconSize, this.mainForm.gameScene.coordinates.sidebarTrumpMaker.y, 'suitsImage', trumpIndex - 1 + 5)
                    .setOrigin(0, 0)
                    .setDisplaySize(this.mainForm.gameScene.coordinates.iconSize, this.mainForm.gameScene.coordinates.iconSize));
            }
        }
    };
    DrawingFormHelper.prototype.DrawFinishedSendedCards = function () {
        this.mainForm.tractorPlayer.destroyAllClientMessages();
        this.destroyScoreImageAndCards();
        this.destroyLast8Cards();
        this.destroyAllShowedCards();
        this.DrawFinishedScoreImage();
    };
    DrawingFormHelper.prototype.DrawFinishedScoreImage = function () {
        //画底牌
        var posX = this.mainForm.gameScene.coordinates.last8Position.x;
        var posY = this.mainForm.gameScene.coordinates.last8Position.y;
        this.DrawShowedCards(this.mainForm.tractorPlayer.CurrentHandState.DiscardedCards, posX, posY, this.mainForm.gameScene.showedCardImages, 1);
        //画上分牌
        posX = this.mainForm.gameScene.coordinates.scoreCardsPosition.x;
        posY = this.mainForm.gameScene.coordinates.scoreCardsPosition.y;
        this.DrawShowedCards(this.mainForm.tractorPlayer.CurrentHandState.ScoreCards, posX, posY, this.mainForm.gameScene.showedCardImages, 1);
        //画得分明细
        // todo
        // lblNickName.setStyle({ fixedWidth: 300 })
        // lblNickName.setStyle({ align: 'right' })
        //上分
        var winPoints = CommonMethods.GetScoreCardsScore(this.mainForm.tractorPlayer.CurrentHandState.ScoreCards);
        posX = this.mainForm.gameScene.coordinates.winPointsPosition.x;
        posY = this.mainForm.gameScene.coordinates.winPointsPosition.y;
        this.mainForm.gameScene.showedCardImages.push(this.mainForm.gameScene.add.text(posX, posY, "\u4E0A\u5206\uFF1A".concat(winPoints)).setColor("orange").setFontSize(this.mainForm.gameScene.coordinates.iconSize));
        //底分
        var base = this.mainForm.tractorPlayer.CurrentHandState.ScoreLast8CardsBase;
        var multiplier = this.mainForm.tractorPlayer.CurrentHandState.ScoreLast8CardsMultiplier;
        var last8Points = base * multiplier;
        posX = this.mainForm.gameScene.coordinates.last8PointsPosition.x;
        posY = this.mainForm.gameScene.coordinates.last8PointsPosition.y;
        var last8PointsImage = this.mainForm.gameScene.add.text(posX, posY, "\u5E95\u5206\uFF1A".concat(last8Points)).setColor("orange").setFontSize(this.mainForm.gameScene.coordinates.iconSize);
        this.mainForm.gameScene.showedCardImages.push(last8PointsImage);
        //底分明细
        if (base > 0) {
            posX = this.mainForm.gameScene.coordinates.last8PointsPosition.x + last8PointsImage.displayWidth + 10;
            posY = this.mainForm.gameScene.coordinates.last8PointsPosition.y;
            this.mainForm.gameScene.showedCardImages.push(this.mainForm.gameScene.add.text(posX, posY, "\u3010".concat(base, "x").concat(multiplier, "\u3011"))
                .setColor("yellow").setFontSize(this.mainForm.gameScene.coordinates.iconSize));
        }
        //罚分
        var scorePunishment = this.mainForm.tractorPlayer.CurrentHandState.ScorePunishment;
        posX = this.mainForm.gameScene.coordinates.punishmentPointsPosition.x;
        posY = this.mainForm.gameScene.coordinates.punishmentPointsPosition.y;
        this.mainForm.gameScene.showedCardImages.push(this.mainForm.gameScene.add.text(posX, posY, "\u7F5A\u5206\uFF1A".concat(scorePunishment)).setColor("orange").setFontSize(this.mainForm.gameScene.coordinates.iconSize));
        //总得分
        var allTotal = this.mainForm.tractorPlayer.CurrentHandState.Score;
        posX = this.mainForm.gameScene.coordinates.totalPointsPosition.x;
        posY = this.mainForm.gameScene.coordinates.totalPointsPosition.y;
        this.mainForm.gameScene.showedCardImages.push(this.mainForm.gameScene.add.text(posX, posY, "\u603B\u5206\uFF1A".concat(allTotal)).setColor("white").setFontSize(this.mainForm.gameScene.coordinates.iconSize));
    };
    DrawingFormHelper.prototype.destroyScoreImageAndCards = function () {
        this.mainForm.gameScene.scoreCardsImages.forEach(function (image) {
            image.destroy();
        });
        this.mainForm.gameScene.scoreCardsImages = [];
    };
    DrawingFormHelper.prototype.DrawScoreImageAndCards = function () {
        this.destroyScoreImageAndCards();
        //画得分图标
        var scores = this.mainForm.tractorPlayer.CurrentHandState.Score;
        this.mainForm.gameScene.scoreCardsImages.push(this.mainForm.gameScene.add.text(this.mainForm.gameScene.coordinates.sidebarScoreText.x, this.mainForm.gameScene.coordinates.sidebarScoreText.y, "\u4E0A\u5206\uFF1A".concat(scores)).setColor("orange").setFontSize(this.mainForm.gameScene.coordinates.iconSize));
        //画得分牌，画在得分图标的下边
        var scoreCards = this.mainForm.tractorPlayer.CurrentHandState.ScoreCards;
        for (var i = 0; i < scoreCards.length; i++) {
            var uiCardNumber = CommonMethods.ServerToUICardMap[scoreCards[i]];
            this.mainForm.gameScene.scoreCardsImages.push(this.mainForm.gameScene.add.sprite(this.mainForm.gameScene.coordinates.sidebarScoreCards.x + i * (this.mainForm.gameScene.coordinates.handCardOffset / 2), this.mainForm.gameScene.coordinates.sidebarScoreCards.y, 'poker', uiCardNumber)
                .setOrigin(0, 0)
                .setInteractive()
                .setDisplaySize(this.mainForm.gameScene.coordinates.cardWidth / 2, this.mainForm.gameScene.coordinates.cardHeight / 2));
        }
    };
    DrawingFormHelper.prototype.destroyLast8Cards = function () {
        this.mainForm.gameScene.last8CardsImages.forEach(function (image) {
            image.destroy();
        });
        this.mainForm.gameScene.last8CardsImages = [];
    };
    DrawingFormHelper.prototype.DrawDiscardedCards = function () {
        this.destroyLast8Cards();
        var posX = this.mainForm.gameScene.coordinates.last8CardsForStarterPosition.x;
        var posY = this.mainForm.gameScene.coordinates.last8CardsForStarterPosition.y;
        var allCards = this.mainForm.tractorPlayer.CurrentHandState.DiscardedCards;
        var count = allCards.length;
        var scale = 0.5;
        posX = posX - this.mainForm.gameScene.coordinates.cardWidth * scale - (count - 1) * this.mainForm.gameScene.coordinates.handCardOffset * scale;
        this.DrawShowedCards(allCards, posX, posY, this.mainForm.gameScene.last8CardsImages, scale);
    };
    DrawingFormHelper.prototype.DrawDiscardedCardsBackground = function () {
        //画8张底牌
        var last8Images = [];
        var x = this.mainForm.gameScene.coordinates.distributingLast8Position.x;
        var y = this.mainForm.gameScene.coordinates.distributingLast8Position.y;
        var cardBackIndex = 54;
        for (var i = 0; i < 8; i++) {
            var image = this.mainForm.gameScene.add.sprite(x, y, 'poker', cardBackIndex)
                .setOrigin(0, 0)
                .setInteractive();
            last8Images.push(image);
            x += this.mainForm.gameScene.coordinates.handCardOffset / 4;
        }
        //隐藏
        setTimeout(function () {
            last8Images.forEach(function (image) {
                image.destroy();
            });
            last8Images.length = 0;
        }, 1000);
    };
    //基于庄家相对于自己所在的位置，画庄家获得底牌的动画
    DrawingFormHelper.prototype.DrawDistributingLast8Cards = function (position) {
        var _this = this;
        //画8张底牌
        var last8Images = [];
        var x = this.mainForm.gameScene.coordinates.distributingLast8Position.x;
        var y = this.mainForm.gameScene.coordinates.distributingLast8Position.y;
        var cardBackIndex = 54;
        for (var i = 0; i < 8; i++) {
            var image = this.mainForm.gameScene.add.sprite(x, y, 'poker', cardBackIndex)
                .setOrigin(0, 0)
                .setInteractive();
            last8Images.push(image);
            x += this.mainForm.gameScene.coordinates.handCardOffset / 4;
        }
        //分发
        setTimeout(function () {
            for (var i = 0; i < 8; i++) {
                var curImage = last8Images[i];
                var pos = curImage.getTopLeft();
                var movingDir = [
                    { x: pos.x, y: pos.y },
                    { x: _this.mainForm.gameScene.coordinates.screenWid - _this.mainForm.gameScene.coordinates.distributingLast8MaxEdge - _this.mainForm.gameScene.coordinates.cardWidth, y: pos.y },
                    { x: _this.mainForm.gameScene.coordinates.screenWid * 0.5 - _this.mainForm.gameScene.coordinates.cardWidth / 2, y: _this.mainForm.gameScene.coordinates.distributingLast8MaxEdge },
                    { x: _this.mainForm.gameScene.coordinates.distributingLast8MaxEdge, y: pos.y },
                ];
                _this.mainForm.gameScene.tweens.add({
                    targets: last8Images[i],
                    x: movingDir[position - 1].x,
                    y: movingDir[position - 1].y,
                    delay: (7 - i) * 100,
                    duration: 200,
                    ease: "Cubic.easeOut"
                });
            }
        }, 200);
        //隐藏
        setTimeout(function () {
            last8Images.forEach(function (image) {
                image.destroy();
            });
            last8Images.length = 0;
        }, 1500);
    };
    DrawingFormHelper.prototype.DrawOverridingFlag = function (cardsCount, position, winType, playAnimation) {
        if (this.mainForm.tractorPlayer.CurrentRoomSetting.HideOverridingFlag)
            return;
        if (this.mainForm.gameScene.OverridingFlagImage) {
            this.mainForm.gameScene.OverridingFlagImage.destroy();
        }
        var posInd = position - 1;
        var x = this.mainForm.gameScene.coordinates.showedCardsPositions[posInd].x;
        var y = this.mainForm.gameScene.coordinates.showedCardsPositions[posInd].y;
        switch (posInd) {
            case 0:
                x = x - (cardsCount - 1) * this.mainForm.gameScene.coordinates.handCardOffset / 2;
                break;
            case 1:
                x = x - (cardsCount - 1) * this.mainForm.gameScene.coordinates.handCardOffset;
                break;
            case 2:
                x = x - (cardsCount - 1) * this.mainForm.gameScene.coordinates.handCardOffset / 2;
                break;
            case 3:
                break;
            default:
                break;
        }
        y = y + this.mainForm.gameScene.coordinates.cardHeight - this.mainForm.gameScene.coordinates.overridingFlagHeight;
        var image = this.mainForm.gameScene.add.image(x, y, this.mainForm.gameScene.overridingLabelImages[winType])
            .setOrigin(0, 0)
            .setDisplaySize(this.mainForm.gameScene.coordinates.overridingFlagWidth, this.mainForm.gameScene.coordinates.overridingFlagHeight);
        this.mainForm.gameScene.OverridingFlagImage = image;
        this.mainForm.gameScene.showedCardImages.push(image);
        if (playAnimation && winType >= 2) {
            this.mainForm.gameScene.decadeUICanvas.style.left = "".concat(x, "px");
            this.mainForm.gameScene.decadeUICanvas.style.top = "".concat(this.mainForm.gameScene.coordinates.showedCardsPositions[posInd].y - this.mainForm.gameScene.coordinates.sgsAnimOffsetY, "px");
            this.mainForm.gameScene.drawSgsAni(this.mainForm.gameScene.overridingLabelAnims[winType][0], this.mainForm.gameScene.overridingLabelAnims[winType][1], this.mainForm.gameScene.coordinates.sgsAnimWidth, this.mainForm.gameScene.coordinates.sgsAnimHeight);
        }
    };
    DrawingFormHelper.prototype.DrawEmojiByPosition = function (position, emojiType, emojiIndex, isCenter) {
        var emojiKey = EmojiUtil.emojiTypesAndInstances[emojiType][emojiIndex];
        var posIndex = position - 1;
        var x = this.mainForm.gameScene.coordinates.playerEmojiPositions[posIndex].x;
        var y = this.mainForm.gameScene.coordinates.playerEmojiPositions[posIndex].y;
        var displaySize = this.mainForm.gameScene.coordinates.emojiSize;
        if (isCenter) {
            x = this.mainForm.gameScene.coordinates.screenWid / 2;
            y = this.mainForm.gameScene.coordinates.screenHei / 2;
            displaySize *= 5;
        }
        var spriteAnimation = this.mainForm.gameScene.add.sprite(x, y, emojiKey)
            .setDisplaySize(displaySize, displaySize * EmojiUtil.emojiXToYRatio[emojiType][emojiIndex]);
        if (!isCenter) {
            spriteAnimation.setOrigin(0);
        }
        spriteAnimation.play(emojiKey);
    };
    DrawingFormHelper.prototype.DrawMovingTractorByPosition = function (cardsCount, position) {
        var posInd = position - 1;
        var height = this.mainForm.gameScene.coordinates.cardHeight - 10;
        var x = this.mainForm.gameScene.coordinates.showedCardsPositions[posInd].x;
        var y = this.mainForm.gameScene.coordinates.showedCardsPositions[posInd].y + this.mainForm.gameScene.coordinates.cardHeight - height;
        switch (posInd) {
            case 0:
                x = x - (cardsCount - 1) * this.mainForm.gameScene.coordinates.handCardOffset / 2;
                break;
            case 1:
                x = x - (cardsCount - 1) * this.mainForm.gameScene.coordinates.handCardOffset;
                break;
            case 2:
                x = x - (cardsCount - 1) * this.mainForm.gameScene.coordinates.handCardOffset / 2;
                break;
            case 3:
                break;
            default:
                break;
        }
        var spriteAnimation = this.mainForm.gameScene.add.sprite(x, y, EmojiUtil.emMovingTractor)
            .setDisplaySize(height * EmojiUtil.emMovingTractorYToXRatio, height);
        spriteAnimation.setOrigin(0);
        spriteAnimation.play(EmojiUtil.emMovingTractor);
    };
    DrawingFormHelper.prototype.DrawDanmu = function (msgString) {
        var _this = this;
        if (this.mainForm.gameScene.noDanmu.toLowerCase() === 'true')
            return;
        var x = this.mainForm.gameScene.coordinates.screenWid;
        var y = this.mainForm.gameScene.coordinates.danmuPositionY;
        var danmuIndex = 0;
        var danmus = this.mainForm.gameScene.danmuMessages;
        var foundEmptyDanmu = false;
        var foundDanmu = false;
        if (danmus.length > 0) {
            for (var i = 0; i < danmus.length; i++) {
                if (danmus[i] === undefined) {
                    if (!foundEmptyDanmu) {
                        foundEmptyDanmu = true;
                        danmuIndex = i;
                    }
                }
                else {
                    foundDanmu = true;
                    if (!foundEmptyDanmu)
                        danmuIndex = i + 1;
                }
            }
        }
        if (!foundDanmu) {
            this.destroyAllDanmuMessages();
        }
        y += this.mainForm.gameScene.coordinates.danmuOffset * danmuIndex;
        var lblDanmu = this.mainForm.gameScene.add.text(x, y, msgString)
            .setColor('white')
            .setFontSize(30)
            .setPadding(10)
            .setShadow(2, 2, "#333333", 2, true, true)
            .setVisible(true);
        this.mainForm.gameScene.danmuMessages[danmuIndex] = lblDanmu;
        this.mainForm.gameScene.tweens.add({
            targets: lblDanmu,
            x: 0 - lblDanmu.width,
            duration: CommonMethods.danmuDuration,
            onComplete: function () {
                _this.mainForm.gameScene.danmuMessages[danmuIndex] = undefined;
                lblDanmu.destroy();
            }
        });
    };
    DrawingFormHelper.prototype.destroyAllDanmuMessages = function () {
        if (this.mainForm.gameScene.danmuMessages == null || this.mainForm.gameScene.danmuMessages.length == 0)
            return;
        this.mainForm.gameScene.danmuMessages.forEach(function (msg) {
            if (msg)
                msg.destroy();
        });
        this.mainForm.gameScene.danmuMessages = [];
    };
    DrawingFormHelper.prototype.resetReplay = function () {
        this.destroyAllCards();
        this.destroyAllShowedCards();
        this.destroyScoreImageAndCards();
        this.mainForm.tractorPlayer.destroyAllClientMessages();
    };
    return DrawingFormHelper;
}());
export { DrawingFormHelper };
