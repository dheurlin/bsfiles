
class FileUpload {

    constructor(uploadUrl, msgArea) {
        this.uploadUrl = uploadUrl;
        this.msgBoxes = {};

        this.msgArea = msgArea;
        this.dragArea = document.querySelector('#drop-area');

        this.eventListeners = {};
        this.makeEventListeners();
    }

    makeEventListeners() {

        this.eventListeners['preventDefaultDrag'] = e => {
            e.preventDefault();
            e.stopPropagation();
        };

        this.eventListeners['highlight'] = _ => {
            this.dragArea.classList.add('highlight');
        };

        this.eventListeners['unhighlight'] = _ => {
                this.dragArea.classList.remove('highlight');
        };

        this.eventListeners['onFileDrop'] = e => this.handleFiles(e.dataTransfer.files);

        const fileInput = this.dragArea.querySelector('#file');

        this.eventListeners['dragAreaClick']   = _ => fileInput.click();
        this.eventListeners['fileInputChange'] = _ => this.handleFiles(fileInput.files)

    }

    activate() {

        // Prevent defaults for all drag events
        ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            this.dragArea.addEventListener(eventName, this.eventListeners['preventDefaultDrag'] , false);
        });

        // Highlight/unhighlight at appropriate drag events
        ;['dragenter', 'dragover'].forEach(eventName => {
            this.dragArea.addEventListener(eventName, this.eventListeners['highlight'] , false);
        });

        ;['dragleave', 'drop'].forEach(eventName => {
            this.dragArea.addEventListener(eventName, this.eventListeners['unhighlight'], false);
        });

        // Act when a file is dropped
        this.dragArea.addEventListener('drop', this.eventListeners['onFileDrop'], false);

        // Let the user click the area to select a file, then act as if it were dropped
        const fileInput = this.dragArea.querySelector('#file');
        this.dragArea.addEventListener('click' , this.eventListeners['dragAreaClick']   , false);
        fileInput.addEventListener(    'change', this.eventListeners['fileInputChange'] , false);
    }

    deactivate() {

        ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            this.dragArea.removeEventListener(eventName, this.eventListeners['preventDefaultDrag']);
        });

        ;['dragenter', 'dragover'].forEach(eventName => {
            this.dragArea.removeEventListener(eventName, this.eventListeners['highlight']);
        });

        ;['dragleave', 'drop'].forEach(eventName => {
            this.dragArea.removeEventListener(eventName, this.eventListeners['unhighlight']);
        });

        this.dragArea.removeEventListener('drop', this.eventListeners['onFileDrop']);

        const fileInput = this.dragArea.querySelector('#file');
        this.dragArea.removeEventListener('click' , this.eventListeners['dragAreaClick']);
        fileInput.removeEventListener(    'change', this.eventListeners['fileInputChange']);
    }


    handleFiles(files) {
        ([...files]).forEach(file => {

            // NOTE: Using the filename as an ID for the message boxes will break if we upload
            // two files with the same name. I think that's fine for now though.
            this.preUpload(file.name);
            let formData = new FormData();
            formData.append('file', file);

            axios.post(this.uploadUrl, formData, {
                onUploadProgress: p => this.handleProgress(file.name, p)
            }).then(response => {
                this.handleSuccess(response.data, file.name);
            }).catch(error => {
                console.log(error);
                const contentType = error.response.headers['content-type'];
                if (contentType === 'application/json')
                    // error returned by Flask show message
                    this.handleFailure(error.response.data, file.name);
                else
                     // error probably returned by NGINX, show status text
                    this.handleFailure(error.response.statusText, file.name);
            });

        });
    }

    preUpload(id) {
        this.makeMsgBox(id);
    }


    makeMsgBox(id) {
        const box = document.createElement('div');
        this.msgBoxes[id] = box;
        box.classList.add('message');
        box.innerHTML = "Uploading... <div class='progress'><div></div></div>";
        this.msgArea.appendChild(box);
    }

    addMsg(id, text, type) {
        this.msgBoxes[id].innerHTML = text;
        this.msgBoxes[id].classList.add(type);
    }

    handleProgress(id, progress) { throw new Error('Not implemented!') };
    handleSuccess(text, id)      { throw new Error('Not implemented!') };
    handleFailure(text, id)      { throw new Error('Not implemented!') };

}

function updateProgressBar(bar, progress) {
    bar.querySelector('div').style.width = `${100 * progress.loaded / progress.total}%`;
}
