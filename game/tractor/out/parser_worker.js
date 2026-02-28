"use strict";
self.onmessage = function (e) {
    try {
        var data = JSON.parse(e.data);
        var messageType = data["messageType"];
        var playerID = data["playerID"];
        var content = data["content"];
        var objList = JSON.parse(content);
        if (objList == null || objList.length == 0) {
            self.postMessage({ success: false, error: new Error("objList is null or empty!") });
            return;
        }
        self.postMessage({ success: true, messageType: messageType, playerID: playerID, objList: objList });
    }
    catch (err) {
        self.postMessage({ success: false, error: err });
    }
};
