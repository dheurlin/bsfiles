class DropFileUpload extends FileUpload {

    preUpload(id) {
        this.deactivate();
        this.dragArea.classList.add("dropping");
        this.dragArea.querySelector("form p").innerHTML = "<div class='progress'><div></div></div>"
    }

    handleProgress(_, progress) {
        const bar = this.dragArea.querySelector("form p .progress");
        updateProgressBar(bar, progress);
    }

    handleSuccess(text, id) {
        location.reload();
    }

    handleFailure(text, id) {
        this.dragArea.querySelector("form p").innerHTML = `Failed to upload ${id}: ${text}`
    }
}


window.addEventListener("load", _ => {
    const upload = new DropFileUpload(uploadUrl, document.querySelector('#message-area'));
    upload.activate();
})
