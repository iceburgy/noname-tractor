import { RoomSetting } from './room_setting.js';
// import { SuitEnums } from './suit_enums.js';
// import { TractorRules } from './tractor_rules.js';
// import { ShowingCardsValidationResult } from './showing_cards_validation_result.js';
// import { RoomState } from './room_state.js';
// import { ReplayEntity } from './replay_entity.js';
// import { IDBHelper } from './idb_helper.js';
var PlayerMakeTrump_REQUEST = "PlayerMakeTrump";
var UsedShengbi_REQUEST = "UsedShengbi";
var NotifyPong_REQUEST = "NotifyPong";
var TractorPlayer = /** @class */ (function () {
    function TractorPlayer(mf) {
        this.PingInterval = 12000;
        this.PingStatus = 0; // 0: uninitialized; -1: unhealthy; 1: healthy
        this.mainForm = mf;
        this.CurrentRoomSetting = new RoomSetting();
        // this.CurrentPoker = new CurrentPoker()
        this.PlayerId = mf.gameScene.playerName;
        this.MyOwnId = mf.gameScene.playerName;
        this.isObserver = false;
        this.IsTryingReenter = false;
        this.IsOtherTryingReenter = false;
        this.IsTryingResumeGame = false;
        this.ShowLastTrickCards = false;
        // this.CurrentGameState = new GameState()
        // this.CurrentHandState = new CurrentHandState(this.CurrentGameState)
        // this.CurrentTrickState = new CurrentTrickState()
        // this.playerLocalCache = new PlayerLocalCache()
        // this.replayEntity = new ReplayEntity()
        // this.replayedTricks = []
        this.replayAngle = 0;
    }
    TractorPlayer.prototype.destroyAllClientMessages = function () {
        // if (this.mainForm.gameScene.clientMessages == null || this.mainForm.gameScene.clientMessages.length == 0) return
        // this.mainForm.gameScene.clientMessages.forEach((msg: any) => {
        //     // msg.destroy();
        // });
        // this.mainForm.gameScene.clientMessages = []
    };
    TractorPlayer.prototype.NotifyPing = function () {
        var _this = this;
        this.mainForm.gameScene.sendMessageToServer(NotifyPong_REQUEST, this.MyOwnId, "");
        // during initial login after a new release, it'll take more than 5 seconds to fully load
        // and it tends to time out. 
        // hence don't trigger health check if it is not fully loaded
        if (!(this.mainForm.gameScene.isInGameHall() || this.mainForm.gameScene.isInGameRoom()))
            return;
        this.PingStatus = 1;
        setTimeout(function () {
            if (_this.PingStatus < 0) {
                // TODO:
                // this.NotifyMessage(["您已离线，请尝试刷新页面重连"]);
                alert("您已离线，请尝试刷新页面重连");
            }
            else {
                _this.PingStatus = -1;
            }
        }, this.PingInterval + this.PingInterval / 2);
    };
    return TractorPlayer;
}());
export { TractorPlayer };
