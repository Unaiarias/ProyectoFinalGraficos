let gl, program;

// ======================= GEOMETRÍA =========================

const cube = {
    vertices: [
        -0.5, -0.5, 0.5, 0, 0, 1, 0.5, -0.5, 0.5, 0, 0, 1,
        0.5, 0.5, 0.5, 0, 0, 1, -0.5, 0.5, 0.5, 0, 0, 1,
        0.5, -0.5, 0.5, 1, 0, 0, 0.5, -0.5, -0.5, 1, 0, 0,
        0.5, 0.5, -0.5, 1, 0, 0, 0.5, 0.5, 0.5, 1, 0, 0,
        0.5, -0.5, -0.5, 0, 0, -1, -0.5, -0.5, -0.5, 0, 0, -1,
        -0.5, 0.5, -0.5, 0, 0, -1, 0.5, 0.5, -0.5, 0, 0, -1,
        -0.5, -0.5, -0.5, -1, 0, 0, -0.5, -0.5, 0.5, -1, 0, 0,
        -0.5, 0.5, 0.5, -1, 0, 0, -0.5, 0.5, -0.5, -1, 0, 0,
        -0.5, 0.5, 0.5, 0, 1, 0, 0.5, 0.5, 0.5, 0, 1, 0,
        0.5, 0.5, -0.5, 0, 1, 0, -0.5, 0.5, -0.5, 0, 1, 0,
        -0.5, -0.5, -0.5, 0, -1, 0, 0.5, -0.5, -0.5, 0, -1, 0,
        0.5, -0.5, 0.5, 0, -1, 0, -0.5, -0.5, 0.5, 0, -1, 0
    ],
    indices: [
        0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7,
        8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15,
        16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23
    ]
};

/* ======================= AGUA ======================= */

function createWater(size = 6, div = 150) {
    const v = [], i = [];
    for (let z = 0; z <= div; z++) {
        for (let x = 0; x <= div; x++) {
            const px = size * (x / div - .5);
            const pz = size * (z / div - .5);
            v.push(px, 0, pz, 0, 1, 0);
        }
    }
    for (let z = 0; z < div; z++) {
        for (let x = 0; x < div; x++) {
            const k = z * (div + 1) + x;
            i.push(k, k + 1, k + div + 1, k + 1, k + div + 2, k + div + 1);
        }
    }
    return { vertices: v, indices: i };
}
const water = createWater();

/* ======================= CÁMARA / CONTROL ======================= */

let yaw = 0;
let pitch = 0.4;
let distance = 3.5;

let isDragging = false;
let lastX = 0, lastY = 0;

/* ======================= SHADERS ======================= */

function compileShader(src, type) {
    src = src.trimStart();
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
        throw gl.getShaderInfoLog(s);
    return s;
}

let uTimeLoc;

function initProgram() {
    const vs = compileShader(document.getElementById("vs").textContent, gl.VERTEX_SHADER);
    const fs = compileShader(document.getElementById("fs").textContent, gl.FRAGMENT_SHADER);
    program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);
    uTimeLoc = gl.getUniformLocation(program, "uTime");
}

/* ======================= BUFFERS ======================= */

function setupBuffer(obj) {
    obj.vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(obj.vertices), gl.STATIC_DRAW);

    obj.ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(obj.indices), gl.STATIC_DRAW);
    obj.count = obj.indices.length;
}

/* ======================= ATRIBUTOS ======================= */

function setupAttributes() {
    const stride = 6 * 4;
    const posLoc = gl.getAttribLocation(program, "VertexPosition");
    const norLoc = gl.getAttribLocation(program, "VertexNormal");

    gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, stride, 0);
    gl.enableVertexAttribArray(posLoc);

    gl.vertexAttribPointer(norLoc, 3, gl.FLOAT, false, stride, 3 * 4);
    gl.enableVertexAttribArray(norLoc);
}

/* ======================= DIBUJO ======================= */

function draw(t) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // 👁️ CÁMARA ORBITAL (ROTACIÓN CON RATÓN)
    const eye = [
        distance * Math.sin(yaw) * Math.cos(pitch),
        distance * Math.sin(pitch),
        distance * Math.cos(yaw) * Math.cos(pitch)
    ];

    const view = mat4.create();
    mat4.lookAt(view, eye, [0, 0, 0], [0, 1, 0]);

    const proj = mat4.create();
    mat4.perspective(proj, Math.PI / 4, 1, 0.1, 50);

    gl.uniformMatrix4fv(gl.getUniformLocation(program, "projectionMatrix"), false, proj);
    gl.uniform3fv(gl.getUniformLocation(program, "Light.Position"), eye);

    /* ===== LUZ ===== */
    gl.uniform3fv(gl.getUniformLocation(program, "Light.La"), [1, 1, 1]);
    gl.uniform3fv(gl.getUniformLocation(program, "Light.Ld"), [1, 1, 1]);
    gl.uniform3fv(gl.getUniformLocation(program, "Light.Ls"), [1, 1, 1]);

    /* ===== MATERIAL ===== */
    gl.uniform3fv(gl.getUniformLocation(program, "Material.Ka"), [0.2, 0.2, 0.2]);
    gl.uniform3fv(gl.getUniformLocation(program, "Material.Kd"), [0.6, 0.6, 0.6]);
    gl.uniform3fv(gl.getUniformLocation(program, "Material.Ks"), [1, 1, 1]);
    gl.uniform1f(gl.getUniformLocation(program, "Material.alpha"), 20);

    /* ===== NIEBLA ===== */
    gl.uniform1f(gl.getUniformLocation(program, "fogMin"), 1.5);
    gl.uniform1f(gl.getUniformLocation(program, "fogMax"), 6.5);
    gl.uniform3fv(gl.getUniformLocation(program, "fogColor"), [0.15, 0.15, 0.15]);
    gl.uniform1i(gl.getUniformLocation(program, "fogEnabled"), 1);
    gl.uniform1i(gl.getUniformLocation(program, "fogMode"), 0);

    gl.uniform1f(uTimeLoc, t);

    /* ===== CUBO ===== */
    let mv = mat4.clone(view), nm = mat3.create();
    mat3.normalFromMat4(nm, mv);
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelViewMatrix"), false, mv);
    gl.uniformMatrix3fv(gl.getUniformLocation(program, "normalMatrix"), false, nm);
    gl.uniform1i(gl.getUniformLocation(program, "isWater"), 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, cube.vbo);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cube.ibo);
    setupAttributes();
    gl.drawElements(gl.TRIANGLES, cube.indices.length, gl.UNSIGNED_SHORT, 0);

    /* ===== AGUA ===== */
    mv = mat4.clone(view);
    mat4.translate(mv, mv, [0, -0.8, 0]);
    mat3.normalFromMat4(nm, mv);
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelViewMatrix"), false, mv);
    gl.uniformMatrix3fv(gl.getUniformLocation(program, "normalMatrix"), false, nm);
    gl.uniform1i(gl.getUniformLocation(program, "isWater"), 1);

    gl.bindBuffer(gl.ARRAY_BUFFER, water.vbo);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, water.ibo);
    setupAttributes();
    gl.drawElements(gl.TRIANGLES, water.count, gl.UNSIGNED_SHORT, 0);
}

/* ======================= INIT ======================= */

function init() {
    const canvas = document.getElementById("glCanvas");
    gl = canvas.getContext("webgl2");
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.15, 0.15, 0.15, 1);

    // 🖱️ CONTROLES RATÓN
    canvas.addEventListener("mousedown", e => {
        isDragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
    });

    window.addEventListener("mouseup", () => isDragging = false);

    window.addEventListener("mousemove", e => {
        if (!isDragging) return;
        yaw += (e.clientX - lastX) * 0.005;
        pitch += (e.clientY - lastY) * 0.005;
        pitch = Math.max(-1.4, Math.min(1.4, pitch));
        lastX = e.clientX;
        lastY = e.clientY;
    });

    initProgram();
    setupBuffer(cube);
    setupBuffer(water);

    let start = performance.now();
    (function frame() {
        draw((performance.now() - start) * 0.001);
        requestAnimationFrame(frame);
    })();
}
init();
