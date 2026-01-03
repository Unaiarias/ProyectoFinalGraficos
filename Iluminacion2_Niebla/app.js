let gl, program;

// ======================= GEOMETRÍA =========================

const cube = {
    vertices: [
        -0.5, -0.5, 0.5, 0, 0, 1,
        0.5, -0.5, 0.5, 0, 0, 1,
        0.5, 0.5, 0.5, 0, 0, 1,
        -0.5, 0.5, 0.5, 0, 0, 1,

        0.5, -0.5, 0.5, 1, 0, 0,
        0.5, -0.5, -0.5, 1, 0, 0,
        0.5, 0.5, -0.5, 1, 0, 0,
        0.5, 0.5, 0.5, 1, 0, 0,

        0.5, -0.5, -0.5, 0, 0, -1,
        -0.5, -0.5, -0.5, 0, 0, -1,
        -0.5, 0.5, -0.5, 0, 0, -1,
        0.5, 0.5, -0.5, 0, 0, -1,

        -0.5, -0.5, -0.5, -1, 0, 0,
        -0.5, -0.5, 0.5, -1, 0, 0,
        -0.5, 0.5, 0.5, -1, 0, 0,
        -0.5, 0.5, -0.5, -1, 0, 0,

        -0.5, 0.5, 0.5, 0, 1, 0,
        0.5, 0.5, 0.5, 0, 1, 0,
        0.5, 0.5, -0.5, 0, 1, 0,
        -0.5, 0.5, -0.5, 0, 1, 0,

        -0.5, -0.5, -0.5, 0, -1, 0,
        0.5, -0.5, -0.5, 0, -1, 0,
        0.5, -0.5, 0.5, 0, -1, 0,
        -0.5, -0.5, 0.5, 0, -1, 0,
    ],

    indices: [
        0, 1, 2, 0, 2, 3,
        4, 5, 6, 4, 6, 7,
        8, 9, 10, 8, 10, 11,
        12, 13, 14, 12, 14, 15,
        16, 17, 18, 16, 18, 19,
        20, 21, 22, 20, 22, 23
    ]
};

// ======================= CONTROLES (RESTAURADOS) =========================

let yaw = 0;
let pitch = 0.4;
let distance = 3.5;

let isDragging = false;
let lastX = 0, lastY = 0;
let shiftPressed = false;

// Niebla
let fogEnabled = 1;
let fogMode = 0;
let uTimeLoc;
let startTime = 0;


function addControls(canvas) {

    canvas.addEventListener("mousedown", e => {
        isDragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
        shiftPressed = e.shiftKey;
    });

    canvas.addEventListener("mouseup", () => isDragging = false);
    canvas.addEventListener("mouseleave", () => isDragging = false);

    canvas.addEventListener("mousemove", e => {
        if (!isDragging) return;

        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;

        if (shiftPressed) {
            // Pan (no lo implementamos porque no había pan real en tu proyecto original)
            // Pero respetamos el comportamiento vacío
        } else {
            yaw += dx * 0.01;
            pitch += dy * 0.01;

            pitch = Math.max(-1.2, Math.min(1.2, pitch));
        }

        lastX = e.clientX;
        lastY = e.clientY;

        draw();
    });

    canvas.addEventListener("wheel", e => {
        distance += e.deltaY * 0.01;
        distance = Math.max(1.5, Math.min(10, distance));
        draw();
    });

    window.addEventListener("keydown", e => {
        if (e.key === "f" || e.key === "F") {
            fogEnabled = 1 - fogEnabled;
            draw();
        }
        if (e.key === "m" || e.key === "M") {
            fogMode = (fogMode === 0 ? 1 : 0);
            draw();
        }
    });
}

// ======================= SHADERS =========================

function compileShader(source, type) {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, source);
    gl.compileShader(sh);

    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(sh));
        throw "Shader compile error";
    }
    return sh;
}

function initProgram() {
    const vsSource = document.getElementById("vs").textContent.trim();
    const fsSource = document.getElementById("fs").textContent.trim();

    const vs = compileShader(vsSource, gl.VERTEX_SHADER);
    const fs = compileShader(fsSource, gl.FRAGMENT_SHADER);

    program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
        throw "Program link error";
    }

    gl.useProgram(program);
    uTimeLoc = gl.getUniformLocation(program, "uTime");

}

// ======================= BUFFERS =========================

function initBuffers() {
    cube.vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cube.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube.vertices), gl.STATIC_DRAW);

    cube.ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cube.ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cube.indices), gl.STATIC_DRAW);

    const stride = 6 * 4;

    const locPos = gl.getAttribLocation(program, "VertexPosition");
    gl.vertexAttribPointer(locPos, 3, gl.FLOAT, false, stride, 0);
    gl.enableVertexAttribArray(locPos);

    const locNor = gl.getAttribLocation(program, "VertexNormal");
    gl.vertexAttribPointer(locNor, 3, gl.FLOAT, false, stride, 3 * 4);
    gl.enableVertexAttribArray(locNor);
}

// ======================= MATRICES / CÁMARA =========================

function getEye() {
    return [
        distance * Math.sin(yaw) * Math.cos(pitch),
        distance * Math.sin(pitch),
        distance * Math.cos(yaw) * Math.cos(pitch)
    ];
}

// ======================= DIBUJO =========================

function draw(timeSeconds = 0) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const eye = getEye();

    // --- matrices ---
    const view = mat4.create();
    mat4.lookAt(view, eye, [0, 0, 0], [0, 1, 0]);

    const proj = mat4.create();
    mat4.perspective(proj, Math.PI / 4, 1, 0.1, 50);

    const mv = mat4.clone(view);
    const nm = mat3.create();
    mat3.normalFromMat4(nm, mv);

    // --- uniforms matrices ---
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelViewMatrix"), false, mv);
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "projectionMatrix"), false, proj);
    gl.uniformMatrix3fv(gl.getUniformLocation(program, "normalMatrix"), false, nm);

    // --- material ---
    gl.uniform3fv(gl.getUniformLocation(program, "Material.Ka"), [0.2, 0.2, 0.2]);
    gl.uniform3fv(gl.getUniformLocation(program, "Material.Kd"), [0.6, 0.6, 0.6]);
    gl.uniform3fv(gl.getUniformLocation(program, "Material.Ks"), [1, 1, 1]);
    gl.uniform1f(gl.getUniformLocation(program, "Material.alpha"), 20.0);

    // --- luz ---
    gl.uniform3fv(gl.getUniformLocation(program, "Light.La"), [1, 1, 1]);
    gl.uniform3fv(gl.getUniformLocation(program, "Light.Ld"), [1, 1, 1]);
    gl.uniform3fv(gl.getUniformLocation(program, "Light.Ls"), [1, 1, 1]);
    gl.uniform3fv(gl.getUniformLocation(program, "Light.Position"), eye);

    // --- niebla ---
    gl.uniform1f(gl.getUniformLocation(program, "fogMin"), 1.0);
    gl.uniform1f(gl.getUniformLocation(program, "fogMax"), 6.0);
    gl.uniform3fv(gl.getUniformLocation(program, "fogColor"), [1.0, 0.15, 0.15]);
    gl.uniform1i(gl.getUniformLocation(program, "fogEnabled"), fogEnabled);
    gl.uniform1i(gl.getUniformLocation(program, "fogMode"), fogMode);

    // --- draw ---
    gl.uniform1f(uTimeLoc, timeSeconds);
    gl.drawElements(gl.TRIANGLES, cube.indices.length, gl.UNSIGNED_SHORT, 0);
}

// ======================= INIT =========================

function init() {
    const canvas = document.getElementById("glCanvas");
    gl = canvas.getContext("webgl2");

    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.15, 0.15, 0.15, 1);

    addControls(canvas);
    initProgram();
    initBuffers();
    startTime = performance.now();

    function frame() {
        const t = (performance.now() - startTime) * 0.001; // segundos
        draw(t);
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

}

init();
