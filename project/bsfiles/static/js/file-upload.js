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
    // area.addEventListener('drop', handleDrop, false);
    area.addEventListener('drop', e => handleFiles(e.dataTransfer.files), false);

    // Let the user click the area to select a file
    area.addEventListener     ('click' , _ => fileInput.click()            , false);
    fileInput.addEventListener('change', _ => handleFiles(fileInput.files) , false);
}

function handleFiles(files) {
    ([...files]).forEach(file => {
        let formData = new FormData();
        formData.append('file', file);
        fetch(uploadUrl, {
            method: 'POST',
            body: formData
        })
       .then(response  => {
           response.text().then(text => {
               if (!response.ok)
                   handleFailure(response.statusText, file.name);
               else
                   handleSuccess(text, file.name);
           });
       });
    });
}

function handleSuccess(text, filename) {
    // appendMessage(`${filename} <span class="arrow">---&GT;</span> <a href=${text}>${text}</a>`, "success");
    appendMessage(`${filename} <a href=${text}>${text}</a>`, "success");
}

function handleFailure(text, filename) {
    appendMessage(`Failed to upload ${filename}: &nbsp; &nbsp; &nbsp; ${text}`, "failure");
}

function appendMessage(text, type) {
    const msgArea = document.querySelector('#message-area');
    const msg = document.createElement('div');
    msg.innerHTML = text;
    msg.classList.add('message');
    msg.classList.add(type);
    msgArea.appendChild(msg);
}

window.addEventListener("load", _ => {
    const fileInput = document.querySelector('#drop-area #file');
    const dragArea = document.querySelector('#drop-area');
    eventListeners(dragArea, fileInput);
})
