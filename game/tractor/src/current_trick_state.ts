
import { CommonMethods } from './common_methods.js';
import { PokerHelper } from './poker_helper.js';
import { ServerLocalCache } from './server_local_cache.js';
import { ShowedCardKeyValue } from './showed_card_key_value.js';
import { SuitEnums } from './suit_enums.js';
export class CurrentTrickState {
    public Learder: string
    public Winner: string
    public ShowedCards: ShowedCardKeyValue[]
    public serverLocalCache: ServerLocalCache
    public Trump: number
    public Rank: number
    constructor() {
        this.Learder = ""
        this.Winner = ""
        this.ShowedCards = []
        this.serverLocalCache = new ServerLocalCache()
        this.Trump = 0
        this.Rank = 0
    }

    public CloneFrom(from: CurrentTrickState) {
        this.Learder = from.Learder
        this.Winner = from.Winner
        if (from.ShowedCards) {
            this.ShowedCards = CommonMethods.deepCopy<any>(from.ShowedCards)
        }
        this.serverLocalCache.CloneFrom(from.serverLocalCache)
        this.Trump = from.Trump
        this.Rank = from.Rank
    }

    public LatestPlayerShowedCard(): string {
        let playerId = "";
        if (this.Learder) {
            let sc = CommonMethods.GetShowedCardsByPlayerID(this.ShowedCards, this.Learder)
            if (sc.length == 0)
                return playerId;
        }

        let afterLeader = false;
        //find next player to show card after learder
        for (let i = 0; i < this.ShowedCards.length; i++) {
            let keyValue: ShowedCardKeyValue = this.ShowedCards[i]

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

        for (let i = 0; i < this.ShowedCards.length; i++) {
            let keyValue: ShowedCardKeyValue = this.ShowedCards[i]
            if (keyValue.PlayerID != this.Learder) {
                if (keyValue.Cards.length == 0)
                    return playerId;
                playerId = keyValue.PlayerID;
            }
            else //search end before leader
                break;
        }
        return playerId;
    }

    public IsStarted(): boolean {
        if (!this.Learder)
            return false;
        if (!this.ShowedCards || Object.keys(this.ShowedCards).length == 0)
            return false;
        return CommonMethods.GetShowedCardsByPlayerID(this.ShowedCards, this.Learder).length > 0;
    }

    public CountOfPlayerShowedCards(): number {
        let result = 0;
        if (!this.ShowedCards) return result
        for (let i = 0; i < this.ShowedCards.length; i++) {
            let keyValue: ShowedCardKeyValue = this.ShowedCards[i]
            if (keyValue.Cards.length > 0)
                result++;
        }
        return result;
    }

    public ScoreCards(): number[] {
        let scorecards: number[] = []
        for (let i = 0; i < this.ShowedCards.length; i++) {
            let keyValue: ShowedCardKeyValue = this.ShowedCards[i]
            for (let j = 0; j < keyValue.Cards.length; j++) {
                let card = keyValue.Cards[j]
                if (card % 13 == 3 || card % 13 == 8 || card % 13 == 11)
                    scorecards.push(card);
            }
        }
        return scorecards;
    }

    public NextPlayer(): string {
        let playerId: string = "";
        if (CommonMethods.GetShowedCardsByPlayerID(this.ShowedCards, this.Learder).length == 0)
            playerId = this.Learder;

        else {
            let afterLeader = false;
            //find next player to show card after learder
            for (let i = 0; i < this.ShowedCards.length; i++) {
                let keyValue: ShowedCardKeyValue = this.ShowedCards[i]
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
                for (let i = 0; i < this.ShowedCards.length; i++) {
                    let keyValue: ShowedCardKeyValue = this.ShowedCards[i]
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
    }

    public NextPlayerByID(playerId: string): string {
        let nextPlayer = "";
        if (!this.ShowedCards || CommonMethods.GetShowedCardsByPlayerID(this.ShowedCards, playerId).length == 0)
            return "";


        let afterLeader = false;
        //find next player to show card after learder
        for (let i = 0; i < this.ShowedCards.length; i++) {
            let keyValue: ShowedCardKeyValue = this.ShowedCards[i]
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
            for (let i = 0; i < this.ShowedCards.length; i++) {
                let keyValue: ShowedCardKeyValue = this.ShowedCards[i]
                if (keyValue.PlayerID != playerId) {
                    nextPlayer = keyValue.PlayerID;
                }
                break;
            }
        }
        return nextPlayer;
    }

    public AllPlayedShowedCards(): boolean {
        for (let i = 0; i < this.ShowedCards.length; i++) {
            let keyValue: ShowedCardKeyValue = this.ShowedCards[i]
            if (keyValue.Cards.length == 0)
                return false;
        }
        return true;
    }

    public LeadingCards(): number[] {
        if (this.IsStarted()) {
            return CommonMethods.GetShowedCardsByPlayerID(this.ShowedCards, this.Learder);
        }
        return []
    }

    public LeadingSuit(): number {
        if (this.IsStarted()) {
            if (PokerHelper.IsTrump(this.LeadingCards()[0], this.Trump, this.Rank)) return this.Trump;
            else return PokerHelper.GetSuit(this.LeadingCards()[0]);
        }
        return SuitEnums.Suit.None;
    }

    public Points(): number {
        let points = 0;
        for (let i = 0; i < this.ShowedCards.length; i++) {
            let keyValue: ShowedCardKeyValue = this.ShowedCards[i]
            for (const card of (keyValue.Cards as number[])) {
                if (card % 13 == 3)
                    points += 5;
                else if (card % 13 == 8)
                    points += 10;
                else if (card % 13 == 11)
                    points += 10;
            }
        }
        return points;
    }
}