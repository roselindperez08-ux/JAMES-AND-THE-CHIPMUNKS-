// ==============================
// ELEMENTS
// ==============================
const visualizer =
    document.getElementById("visualizer");
const output =
    document.getElementById("output");
const effectName =
    document.getElementById("effect-name");
const stageLight =
    document.getElementById("stage-light");
const usbStatus =
    document.getElementById("usb-status");
// ==============================
// CLEAR VISUAL EFFECTS
// ==============================
function clearEffects() {
    visualizer.classList.remove(
        "visualizer-green",
        "visualizer-red",
        "visualizer-yellow",
        "visualizer-blue"
    );
    visualizer.style.transform =
        "none";
    output.style.transform =
        "none";
    output.style.color =
        "white";
    stageLight.style.opacity =
        "0";
}
// ==============================
// PLAY VISUAL NOTE
// ==============================
function playNote(color) {
    clearEffects();
    // ==========================
    // GREEN
    // ==========================
    if (color === "Green") {
        visualizer.classList.add(
            "visualizer-green"
        );
        output.innerHTML =
            "🟢 GREEN NOTE";
        effectName.innerHTML =
            "POWER PULSE";
        output.style.color =
            "#00ff55";
        output.style.transform =
            "scale(1.45)";
        stageLight.style.background =
            "#00ff55";
        stageLight.style.boxShadow =
            "0 0 150px #00ff55";
        stageLight.style.opacity =
            "1";
    }
    // ==========================
    // RED
    // ==========================
    else if (color === "Red") {
        visualizer.classList.add(
            "visualizer-red"
        );
        output.innerHTML =
            "🔴 RED NOTE";
        effectName.innerHTML =
            "DISTORTION";
        output.style.color =
            "#ff3333";
        output.style.transform =
            "rotate(-8deg) scale(1.25)";
        visualizer.style.transform =
            "rotate(1deg) scale(1.02)";
        stageLight.style.background =
            "red";
        stageLight.style.boxShadow =
            "0 0 160px red";
        stageLight.style.opacity =
            "1";
    }
    // ==========================
    // YELLOW
    // ==========================
    else if (color === "Yellow") {
        visualizer.classList.add(
            "visualizer-yellow"
        );
        output.innerHTML =
            "🟡 YELLOW NOTE";
        effectName.innerHTML =
            "SHOCKWAVE";
        output.style.color =
            "#ffe600";
        output.style.transform =
            "scale(.78)";
        stageLight.style.background =
            "#ffe600";
        stageLight.style.boxShadow =
            "0 0 170px #ffe600";
        stageLight.style.opacity =
            "1";
    }
    // ==========================
    // BLUE
    // ==========================
    else if (color === "Blue") {
        visualizer.classList.add(
            "visualizer-blue"
        );
        output.innerHTML =
            "🔵 BLUE NOTE";
        effectName.innerHTML =
            "SPIN EFFECT";
        output.style.color =
            "#00bfff";
        output.style.transform =
            "rotate(10deg) scale(1.25)";
        stageLight.style.background =
            "#008cff";
        stageLight.style.boxShadow =
            "0 0 170px #008cff";
        stageLight.style.opacity =
            "1";
    }
    // Reset after note
    setTimeout(
        clearEffects,
        300
    );
}
// ==============================
// KEYBOARD CONTROLS
// ==============================
document.addEventListener(
    "keydown",
    function(event) {
        const key =
            event.key.toLowerCase();
        if (key === "a") {
            playNote("Green");
        }
        else if (key === "s") {
            playNote("Red");
        }
        else if (key === "d") {
            playNote("Yellow");
        }
        else if (key === "f") {
            playNote("Blue");
        }
    }
);
// ==============================
// USB SERIAL
// ==============================
let port;
let reader;
let inputBuffer = "";
// ==============================
// CONNECT GUITAR
// ==============================
async function connectUSB() {
    if (!("serial" in navigator)) {
        usbStatus.innerHTML =
            "❌ WEB SERIAL NOT SUPPORTED";
        alert(
            "USB guitar connection requires a browser that supports Web Serial, such as desktop Google Chrome or Microsoft Edge."
        );
        return;
    }
    try {
        // Ask user to select Pico
        port =
            await navigator.serial.requestPort();
        // Open serial connection
        await port.open({
            baudRate: 115200
        });
        usbStatus.innerHTML =
            "🟢 GUITAR CONTROLLER CONNECTED";
        // Start reading Pico
        readSerialData();
    }
    catch (error) {
        console.error(error);
        usbStatus.innerHTML =
            "❌ CONNECTION FAILED";
    }
}
// ==============================
// READ SERIAL DATA
// ==============================
async function readSerialData() {
    const decoder =
        new TextDecoder();
    while (
        port &&
        port.readable
    ) {
        reader =
            port.readable.getReader();
        try {
            while (true) {
                const {
                    value,
                    done
                } =
                    await reader.read();
                if (done) {
                    break;
                }
                if (value) {
                    inputBuffer +=
                        decoder.decode(
                            value,
                            {
                                stream: true
                            }
                        );
                    processBuffer();
                }
            }
        }
        catch (error) {
            console.error(
                "Serial read error:",
                error
            );
        }
        finally {
            reader.releaseLock();
        }
    }
}
// ==============================
// PROCESS PICO DATA
// ==============================
function processBuffer() {
    const lines =
        inputBuffer.split("\n");
    inputBuffer =
        lines.pop();
    lines.forEach(
        function(line) {
            readPicoInput(line);
        }
    );
}
// ==============================
// PICO INPUT
// ==============================
function readPicoInput(data) {
    const input =
        data
            .trim()
            .toUpperCase();
    console.log(
        "Pico:",
        input
    );
    if (input === "GREEN") {
        playNote("Green");
    }
    else if (input === "RED") {
        playNote("Red");
    }
    else if (input === "YELLOW") {
        playNote("Yellow");
    }
    else if (input === "BLUE") {
        playNote("Blue");
    }
}
