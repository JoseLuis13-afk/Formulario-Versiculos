let db;

window.onload = function() {
    let request = window.indexedDB.open("BibliaDB", 1);

    request.onerror = function(event) {
        console.log("Error al abrir DB", event);
    };

    request.onupgradeneeded = function(event) {
        db = event.target.result;
        let objectStore = db.createObjectStore("verses", { keyPath: "id", autoIncrement: true });
        objectStore.createIndex("name", "name", { unique: false });
    };

    request.onsuccess = function(event) {
        db = event.target.result;
        readData();
    };

    document.getElementById("addVerse").onclick = addData;
};

function readData() {
    let objectStore = db.transaction("verses").objectStore("verses");
    document.getElementById("versesList").innerHTML = "";

    objectStore.openCursor().onsuccess = function(event) {
        let cursor = event.target.result;
        if (cursor) {
            let tr = document.createElement("tr");
            let tdId = tr.appendChild(document.createElement("td"));
            let tdName = tr.appendChild(document.createElement("td"));
            let tdActions = tr.appendChild(document.createElement("td")); 
            //let tdDelete = tr.appendChild(document.createElement("td"));

            tdId.textContent = cursor.value.id;
            tdName.textContent = cursor.value.name;

            // Botón de edición
            let editButton = document.createElement("button");
            editButton.textContent = "Editar";
            editButton.className = "btn btn-outline-warning btn-sm";
            editButton.onclick = function() {
                editData(cursor.value.id, cursor.value.name);
            };
            tdActions.appendChild(editButton);

            // Botón de eliminación
            let deleteButton = document.createElement("button");
            deleteButton.textContent = "Eliminar";
            deleteButton.className = "btn btn-outline-danger btn-sm";
            deleteButton.onclick = function() {
                deleteData(cursor.value.id);
            };
            tdActions.appendChild(deleteButton);

            document.getElementById("versesList").appendChild(tr);
            cursor.continue();
        }
    };
}
function addData() {
    document.getElementById("verseId").value = '';
    document.getElementById("verseName").value = '';
    document.getElementById("modalTitle").innerText = "Agregar Versículo";
    openModal();
}
function editData(id, name) {
    document.getElementById("verseId").value = id;
    document.getElementById("verseName").value = name;
    document.getElementById("modalTitle").innerText = "Editar Versículo";
    openModal();
}
/*
function addData() {
    let newName = prompt("Ingrese el nombre del versículo:");
    let transaction = db.transaction(["verses"], "readwrite");
    let objectStore = transaction.objectStore("verses");

    let request = objectStore.add({ name: newName });
    request.onsuccess = function() {
        readData();
    };
    request.onerror = function(event) {
        console.log("Error al agregar", event);
    };
}
*/
function saveVerse() {
    let id = document.getElementById("verseId").value;
    let name = document.getElementById("verseName").value;
    if (id) {
        // Editar
        let transaction = db.transaction(["verses"], "readwrite");
        let objectStore = transaction.objectStore("verses");
        let request = objectStore.put({ id: Number(id), name: name });
        request.onsuccess = function() {
            closeModal();
            readData();
        };
    } else {
        // Agregar
        let transaction = db.transaction(["verses"], "readwrite");
        let objectStore = transaction.objectStore("verses");
        let request = objectStore.add({ name: name });
        request.onsuccess = function() {
            closeModal();
            readData();
        };
    }
}
function deleteData(id) {
    let transaction = db.transaction(["verses"], "readwrite");
    let objectStore = transaction.objectStore("verses");
    let request = objectStore.delete(id);
    request.onsuccess = function() {
        readData(); // Recargar la lista después de eliminar
    };
}

function openModal() {
    $("#verseModal").modal('toggle')
}
function closeModal() {
    $("#verseModal").modal('hide')
}