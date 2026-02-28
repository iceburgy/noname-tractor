self.onmessage = (e) => {
    try {
        const data = JSON.parse(e.data)
        const messageType = data["messageType"]
        const playerID = data["playerID"]
        const content = data["content"]
        const objList = JSON.parse(content)
        if (objList == null || objList.length == 0) {
            self.postMessage({ success: false, error: new Error("objList is null or empty!") });
            return
        }
        self.postMessage({ success: true, messageType: messageType, playerID: playerID, objList: objList });
    } catch (err) {
        self.postMessage({ success: false, error: err });
    }
};