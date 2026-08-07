function playNote(color) {

    document.getElementById("output").innerHTML =
        color + " Note Played!";

    document.body.style.backgroundColor =
        "#" + Math.floor(Math.random() * 16777215).toString(16);

}
