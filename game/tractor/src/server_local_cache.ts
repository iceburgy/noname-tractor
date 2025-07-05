import { CommonMethods } from "./common_methods.js"
import { ShowedCardKeyValue } from "./showed_card_key_value.js"

export class ServerLocalCache {
    public lastShowedCards: ShowedCardKeyValue[]
    public lastLeader: string
    public muteSound: boolean
    constructor() {
        this.lastShowedCards = []
        this.lastLeader = ""
        this.muteSound = false
    }
    public CloneFrom(from: ServerLocalCache) {
        if (from.lastShowedCards) {
            this.lastShowedCards = CommonMethods.deepCopy<any>(from.lastShowedCards)
        }
        this.lastLeader = from.lastLeader
        this.muteSound = from.muteSound
    }
}
