const fd = new fileDeferrer();

module.exports = {
    deferUpdate: fd.deferUpdate,
    queueNext: fd.queueNext
};

function fileDeferrer() {
    const fd = this;
    fd.deferred = [];
    fd.deferredPosition = 0;
    fd.deferUpdate = deferUpdate;
    fd.queueNext = queueNext;

    function deferUpdate(fileName, callback) {
        fd.deferred.push({
            cb: callback,
            fileName: fileName
        });
    }

    function queueNext(endCallback) {
        if (fd.deferredPosition >= fd.deferred.length) {
            return endCallback();
        }
        const currentDefer = fd.deferred[fd.deferredPosition];
        currentDefer.cb(currentDefer.fileName);
        fd.deferredPosition++;
    }
}
