// const axios = require('axios');

function eventListeners(area, fileInput) {

    // Prevent defaults for all drag events
    ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        area.addEventListener(eventName, e => {
            e.preventDefault();
            e.stopPropagation();
        }, false);
    });

    // Highlight/unhighlight at appropriate drag events
    ;['dragenter', 'dragover'].forEach(eventName => {
        area.addEventListener(eventName, _ => {
            area.classList.add('highlight');
        }, false);
    });

    ;['dragleave', 'drop'].forEach(eventName => {
        area.addEventListener(eventName, _ => {
            area.classList.remove('highlight');
        }, false);
    });

    // Act when a file is dropped
    area.addEventListener('drop', e => handleFiles(e.dataTransfer.files), false);

    // Let the user click the area to select a file, then act as if it were dropped
    area.addEventListener     ('click' , _ => fileInput.click()            , false);
    fileInput.addEventListener('change', _ => handleFiles(fileInput.files) , false);
}

function handleFiles(files) {
    ([...files]).forEach(file => {

        // NOTE: Using the filename as an ID for the message boxes will break if we upload
        // two files with the same name. I think that's fine for now though.
        makeMsgBox(file.name);
        let formData = new FormData();
        formData.append('file', file);

        axios.post(uploadUrl, formData, {
            onUploadProgress: p => handleProgress(file.name, p)
        }).then(response => {
            handleSuccess(response.data, file.name);
        }).catch(error => {
            const contentType = error.response.headers['content-type'];
            if (contentType === 'application/json')
                // error returned by Flask show message
                handleFailure(error.response.data, file.name);
            else
                 // error probably returned by NGINX, show status text
                handleFailure(error.response.statusText, file.name);
        });

    });
}

function makeMsgBox(id) {
    const box = document.createElement('div');
    box.setAttribute('data-id', id);
    box.classList.add('message');
    box.innerHTML = "Uploading... <div class='progress'><div></div></div>";
    document.querySelector('#message-area').appendChild(box);
}

function handleProgress(id, progress) {
    const pBar = document.querySelector(`#message-area [data-id="${id}"] .progress div`);
    pBar.style.width = `${100 * progress.loaded / progress.total}%`;
}

function handleSuccess(text, filename) {
    appendMessage(filename, `${filename} <a href=${text}>${text}</a>`, "success");
}

function handleFailure(text, filename) {
    appendMessage(filename, `Failed to upload ${filename}: ${text}`, "failure");
}

function appendMessage(id, text, type) {
    const msg = document.querySelector(`#message-area [data-id="${id}"]`);
    msg.innerHTML = text;
    msg.classList.add(type);
}

window.addEventListener("load", _ => {
    const fileInput = document.querySelector('#drop-area #file');
    const dragArea = document.querySelector('#drop-area');
    eventListeners(dragArea, fileInput);
})
