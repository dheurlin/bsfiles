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
    files.forEach(file => {
        let formData = new FormData();
        formData.append('file', file);
        fetch(url, {
            method: 'POST',
            body: formData
        })
       .then(()  => { /* Done. Inform the user */ })
       .catch(() => { /* Error. Inform the user */ });
    });
}

window.addEventListener("load", _ => {
    const fileInput = document.querySelector('#drop-area #file');
    const dragArea = document.querySelector('#drop-area');
    eventListeners(dragArea, fileInput);
})
