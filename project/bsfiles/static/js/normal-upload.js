class NormalFileUpload extends FileUpload {

    handleSuccess(text, id) {
        this.addMsg(id
            , `<span class="filename">${id}</span> <a href=${text}>${text}</a>`
            , "success"
        );
    }

    handleFailure(text, id) {
        this.addMsg(id
            , `Failed to upload ${id}: ${text}`
            , "failure"
        );
    }

    handleProgress(id, progress) {
        const pBar = this.msgBoxes[id].querySelector(`.progress`);
        updateProgressBar(pBar, progress);
    }
}


window.addEventListener("load", _ => {
    const normalUpload = new NormalFileUpload(uploadUrl, document.querySelector('#message-area'));
    normalUpload.activate();
})
