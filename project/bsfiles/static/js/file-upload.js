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
    area.addEventListener('drop', handleDrop, false);

    // Let the user click the area to select a file
    area.addEventListener     ('click' , _ => fileInput.click()            , false);
    fileInput.addEventListener('change', _ => handleFiles(fileInput.files) , false);

}

function handleDrop(e) {
    let dt = e.dataTransfer;
    let files = dt.files;

    handleFiles(files);
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
    appendMessage(`${filename} ----> ${text}`, "success");
}

function handleFailure(text, filename) {
    appendMessage(`Failed to upload ${filename}: ${text}`, "failure");
}

function appendMessage(text, type) {
    const msgArea = document.querySelector('#message-area');
    let list = msgArea.querySelector('ul');

    if (!list) {
        list = document.createElement('ul');
        msgArea.appendChild(list);
    }

    const msg = document.createElement('li');
    msg.innerText = text;
    msg.classList.add(type);
    list.appendChild(msg);
}

// function handleError(text) {
//     console.log(text);
// }

// function handleSuccess(text) {
//     console.log(text);
// }

window.addEventListener("load", _ => {
    const fileInput = document.querySelector('#drop-area #file');
    const dragArea = document.querySelector('#drop-area');
    eventListeners(dragArea, fileInput);
})
