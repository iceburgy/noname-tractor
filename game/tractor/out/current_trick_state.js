import { CommonMethods } from './common_methods.js';
import { PokerHelper } from './poker_helper.js';
import { ServerLocalCache } from './server_local_cache.js';
import { SuitEnums } from './suit_enums.js';
var CurrentTrickState = /** @class */ (function () {
    function CurrentTrickState() {
        this.Learder = "";
        this.Winner = "";
        this.ShowedCards = [];
        this.serverLocalCache = new ServerLocalCache();
        this.Trump = 0;
        this.Rank = 0;
    }
    CurrentTrickState.prototype.CloneFrom = function (from) {
        this.Learder = from.Learder;
        this.Winner = from.Winner;
        if (from.ShowedCards) {
            this.ShowedCards = CommonMethods.deepCopy(from.ShowedCards);
        }
        this.serverLocalCache.CloneFrom(from.serverLocalCache);
        this.Trump = from.Trump;
        this.Rank = from.Rank;
    };
    CurrentTrickState.prototype.LatestPlayerShowedCard = function () {
        var playerId = "";
        if (this.Learder) {
            var sc = CommonMethods.GetShowedCardsByPlayerID(this.ShowedCards, this.Learder);
            if (sc.length == 0)
                return playerId;
        }
        var afterLeader = false;
        //find next player to show card after learder
        for (var i = 0; i < this.ShowedCards.length; i++) {
            var keyValue = this.ShowedCards[i];
            if (keyValue.PlayerID != this.Learder && afterLeader == false)
                continue;
            else if (keyValue.PlayerID == this.Learder) //search from leader;
             {
                playerId = this.Learder;
                afterLeader = true;
            }
            else if (afterLeader) {
                if (keyValue.Cards.length == 0)
                    return playerId;
                playerId = keyValue.PlayerID;
            }
        }
        for (var i = 0; i < this.ShowedCards.length; i++) {
            var keyValue = this.ShowedCards[i];
            if (keyValue.PlayerID != this.Learder) {
                if (keyValue.Cards.length == 0)
                    return playerId;
                playerId = keyValue.PlayerID;
            }
            else //search end before leader
                break;
        }
        return playerId;
    };
    CurrentTrickState.prototype.IsStarted = function () {
        if (!this.Learder)
            return false;
        if (!this.ShowedCards || Object.keys(this.ShowedCards).length == 0)
            return false;
        return CommonMethods.GetShowedCardsByPlayerID(this.ShowedCards, this.Learder).length > 0;
    };
    CurrentTrickState.prototype.CountOfPlayerShowedCards = function () {
        var result = 0;
        if (!this.ShowedCards)
            return result;
        for (var i = 0; i < this.ShowedCards.length; i++) {
            var keyValue = this.ShowedCards[i];
            if (keyValue.Cards.length > 0)
                result++;
        }
        return result;
    };
    CurrentTrickState.prototype.ScoreCards = function () {
        var scorecards = [];
        for (var i = 0; i < this.ShowedCards.length; i++) {
            var keyValue = this.ShowedCards[i];
            for (var j = 0; j < keyValue.Cards.length; j++) {
                var card = keyValue.Cards[j];
                if (card % 13 == 3 || card % 13 == 8 || card % 13 == 11)
                    scorecards.push(card);
            }
        }
        return scorecards;
    };
    CurrentTrickState.prototype.NextPlayer = function () {
        var playerId = "";
        if (CommonMethods.GetShowedCardsByPlayerID(this.ShowedCards, this.Learder).length == 0)
            playerId = this.Learder;
        else {
            var afterLeader = false;
            //find next player to show card after learder
            for (var i = 0; i < this.ShowedCards.length; i++) {
                var keyValue = this.ShowedCards[i];
                if (keyValue.PlayerID != this.Learder && afterLeader == false)
                    continue;
                if (keyValue.PlayerID == this.Learder) { // search from learder
                    afterLeader = true;
                }
                if (afterLeader) {
                    if (keyValue.Cards.length == 0) {
                        playerId = keyValue.PlayerID;
                        break;
                    }
                }
            }
            if (!playerId) {
                for (var i = 0; i < this.ShowedCards.length; i++) {
                    var keyValue = this.ShowedCards[i];
                    if (keyValue.PlayerID != this.Learder) {
                        if (keyValue.Cards.length == 0) {
                            playerId = keyValue.PlayerID;
                            break;
                        }
                    }
                    else //search end before leader;
                        break;
                }
            }
        }
        return playerId;
    };
    CurrentTrickState.prototype.NextPlayerByID = function (playerId) {
        var nextPlayer = "";
        if (!this.ShowedCards || CommonMethods.GetShowedCardsByPlayerID(this.ShowedCards, playerId).length == 0)
            return "";
        var afterLeader = false;
        //find next player to show card after learder
        for (var i = 0; i < this.ShowedCards.length; i++) {
            var keyValue = this.ShowedCards[i];
            if (keyValue.PlayerID != playerId && afterLeader == false)
                continue;
            else if (keyValue.PlayerID == playerId) // search from learder
             {
                afterLeader = true;
            }
            else if (afterLeader) {
                nextPlayer = keyValue.PlayerID;
                break;
            }
        }
        if (!nextPlayer) {
            for (var i = 0; i < this.ShowedCards.length; i++) {
                var keyValue = this.ShowedCards[i];
                if (keyValue.PlayerID != playerId) {
                    nextPlayer = keyValue.PlayerID;
                }
                break;
            }
        }
        return nextPlayer;
    };
    CurrentTrickState.prototype.AllPlayedShowedCards = function () {
        for (var i = 0; i < this.ShowedCards.length; i++) {
            var keyValue = this.ShowedCards[i];
            if (keyValue.Cards.length == 0)
                return false;
        }
        return true;
    };
    CurrentTrickState.prototype.LeadingCards = function () {
        if (this.IsStarted()) {
            return CommonMethods.GetShowedCardsByPlayerID(this.ShowedCards, this.Learder);
        }
        return [];
    };
    CurrentTrickState.prototype.LeadingSuit = function () {
        if (this.IsStarted()) {
            if (PokerHelper.IsTrump(this.LeadingCards()[0], this.Trump, this.Rank))
                return this.Trump;
            else
                return PokerHelper.GetSuit(this.LeadingCards()[0]);
        }
        return SuitEnums.Suit.None;
    };
    CurrentTrickState.prototype.Points = function () {
        var points = 0;
        for (var i = 0; i < this.ShowedCards.length; i++) {
            var keyValue = this.ShowedCards[i];
            for (var _i = 0, _a = keyValue.Cards; _i < _a.length; _i++) {
                var card = _a[_i];
                if (card % 13 == 3)
                    points += 5;
                else if (card % 13 == 8)
                    points += 10;
                else if (card % 13 == 11)
                    points += 10;
            }
        }
        return points;
    };
    return CurrentTrickState;
}());
export { CurrentTrickState };
