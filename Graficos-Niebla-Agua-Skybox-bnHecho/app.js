let gl, program;

// ======================= GEOMETRÍA =========================

const cube = {
    vertices: [
        // Cara frontal (z = 0.5)
        -0.5, -0.5, 0.5, 0, 0, 1, 0, 0,
         0.5, -0.5, 0.5, 0, 0, 1, 1, 0,
         0.5,  0.5, 0.5, 0, 0, 1, 1, 1,
        -0.5,  0.5, 0.5, 0, 0, 1, 0, 1,
        
        // Cara derecha (x = 0.5)
        0.5, -0.5, 0.5, 1, 0, 0, 0, 0,
        0.5, -0.5, -0.5, 1, 0, 0, 1, 0,
        0.5,  0.5, -0.5, 1, 0, 0, 1, 1,
        0.5,  0.5, 0.5, 1, 0, 0, 0, 1,
        
        // Cara trasera (z = -0.5)
        0.5, -0.5, -0.5, 0, 0, -1, 0, 0,
        -0.5, -0.5, -0.5, 0, 0, -1, 1, 0,
        -0.5,  0.5, -0.5, 0, 0, -1, 1, 1,
        0.5,  0.5, -0.5, 0, 0, -1, 0, 1,
        
        // Cara izquierda (x = -0.5)
        -0.5, -0.5, -0.5, -1, 0, 0, 0, 0,
        -0.5, -0.5, 0.5, -1, 0, 0, 1, 0,
        -0.5,  0.5, 0.5, -1, 0, 0, 1, 1,
        -0.5,  0.5, -0.5, -1, 0, 0, 0, 1,
        
        // Cara superior (y = 0.5)
        -0.5, 0.5, 0.5, 0, 1, 0, 0, 0,
         0.5, 0.5, 0.5, 0, 1, 0, 1, 0,
         0.5, 0.5, -0.5, 0, 1, 0, 1, 1,
        -0.5, 0.5, -0.5, 0, 1, 0, 0, 1,
        
        // Cara inferior (y = -0.5)
        -0.5, -0.5, -0.5, 0, -1, 0, 0, 0,
         0.5, -0.5, -0.5, 0, -1, 0, 1, 0,
         0.5, -0.5, 0.5, 0, -1, 0, 1, 1,
        -0.5, -0.5, 0.5, 0, -1, 0, 0, 1
    ],
    indices: [
        0, 1, 2, 0, 2, 3,       // frontal
        4, 5, 6, 4, 6, 7,       // derecha
        8, 9, 10, 8, 10, 11,    // trasera
        12, 13, 14, 12, 14, 15, // izquierda
        16, 17, 18, 16, 18, 19, // superior
        20, 21, 22, 20, 22, 23  // inferior
    ]
};

/* ======================= SKYBOX ======================= */
const skybox = {
    vertices: [
        // Cara frontal (z = 0.5)
        -1, -1,  0.5,  0, 0, 1, 0, 0,
         1, -1,  0.5,  0, 0, 1, 1, 0,
         1,  1,  0.5,  0, 0, 1, 1, 1,
        -1,  1,  0.5,  0, 0, 1, 0, 1,
        
        // Cara trasera (z = -0.5)
        -1, -1, -0.5,  0, 0, -1, 0, 0,
        -1,  1, -0.5,  0, 0, -1, 1, 0,
         1,  1, -0.5,  0, 0, -1, 1, 1,
         1, -1, -0.5,  0, 0, -1, 0, 1,
        
        // Cara superior (y = 1)
        -1,  1, -0.5,  0, 1, 0, 0, 0,
        -1,  1,  0.5,  0, 1, 0, 1, 0,
         1,  1,  0.5,  0, 1, 0, 1, 1,
         1,  1, -0.5,  0, 1, 0, 0, 1,
        
        // Cara inferior (y = -1)
        -1, -1, -0.5,  0, -1, 0, 0, 0,
         1, -1, -0.5,  0, -1, 0, 1, 0,
         1, -1,  0.5,  0, -1, 0, 1, 1,
        -1, -1,  0.5,  0, -1, 0, 0, 1,
        
        // Cara derecha (x = 1)
         1, -1, -0.5,  1, 0, 0, 0, 0,
         1,  1, -0.5,  1, 0, 0, 1, 0,
         1,  1,  0.5,  1, 0, 0, 1, 1,
         1, -1,  0.5,  1, 0, 0, 0, 1,
        
        // Cara izquierda (x = -1)
        -1, -1, -0.5,  -1, 0, 0, 0, 0,
        -1, -1,  0.5,  -1, 0, 0, 1, 0,
        -1,  1,  0.5,  -1, 0, 0, 1, 1,
        -1,  1, -0.5,  -1, 0, 0, 0, 1
    ],
    indices: [
        0, 1, 2, 0, 2, 3,       // frontal
        4, 5, 6, 4, 6, 7,       // trasera
        8, 9, 10, 8, 10, 11,    // superior
        12, 13, 14, 12, 14, 15, // inferior
        16, 17, 18, 16, 18, 19, // derecha
        20, 21, 22, 20, 22, 23  // izquierda
    ]
};

/* ======================= AGUA ======================= */

function createWater(size = 6, div = 150) {
    const v = [], i = [];
    for (let z = 0; z <= div; z++) {
        for (let x = 0; x <= div; x++) {
            const px = size * (x / div - .5);
            const pz = size * (z / div - .5);
            v.push(px, 0, pz, 0, 1, 0, x/div, z/div);
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

// Variables para el skybox
let skyboxRotation = 0;
let skyboxRotationSpeed = 0.02;

// Variables para ajustar la visibilidad del cielo
let cloudIntensity = 1.0;     // Intensidad de las nubes (0.0 a 2.0)
let starIntensity = 1.5;      // Intensidad de las estrellas (0.0 a 3.0)
let skyBrightness = 1.0;      // Brillo general del cielo

/* ======================= SHADERS ======================= */

function compileShader(src, type) {
    src = src.trimStart();
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
}

let uTimeLoc, uSkyboxRotationLoc, uCloudIntensityLoc, uStarIntensityLoc, uSkyBrightnessLoc;

function initProgram() {
    const vs = compileShader(document.getElementById("vs").textContent, gl.VERTEX_SHADER);
    const fs = compileShader(document.getElementById("fs").textContent, gl.FRAGMENT_SHADER);
    
    // Verificar compilación de shaders
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
        console.error("Error compilando vertex shader:", gl.getShaderInfoLog(vs));
        alert("Error compilando vertex shader. Ver consola para detalles.");
        return;
    }
    
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
        console.error("Error compilando fragment shader:", gl.getShaderInfoLog(fs));
        alert("Error compilando fragment shader. Ver consola para detalles.");
        return;
    }
    
    program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Error linkando programa:", gl.getProgramInfoLog(program));
        alert("Error linkando programa de shaders. Ver consola para detalles.");
        return;
    }
    
    gl.useProgram(program);
    console.log("Programa de shaders linkado correctamente");
    
    // Obtener ubicaciones de uniformes
    uTimeLoc = gl.getUniformLocation(program, "uTime");
    uSkyboxRotationLoc = gl.getUniformLocation(program, "skyboxRotation");
    
    // Añadir uniformes para controlar la intensidad
    uCloudIntensityLoc = gl.getUniformLocation(program, "cloudIntensity");
    uStarIntensityLoc = gl.getUniformLocation(program, "starIntensity");
    uSkyBrightnessLoc = gl.getUniformLocation(program, "skyBrightness");
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
    const stride = 8 * 4; // 3 pos + 3 normal + 2 tex = 8 floats * 4 bytes
    
    const posLoc = gl.getAttribLocation(program, "VertexPosition");
    const norLoc = gl.getAttribLocation(program, "VertexNormal");
    const texLoc = gl.getAttribLocation(program, "VertexTexCoord");

    if (posLoc === -1 || norLoc === -1 || texLoc === -1) {
        console.error("No se encontraron algunos atributos");
        return;
    }

    // Configurar posición
    gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, stride, 0);
    gl.enableVertexAttribArray(posLoc);

    // Configurar normal
    gl.vertexAttribPointer(norLoc, 3, gl.FLOAT, false, stride, 3 * 4);
    gl.enableVertexAttribArray(norLoc);

    // Configurar coordenadas de textura
    gl.vertexAttribPointer(texLoc, 2, gl.FLOAT, false, stride, 6 * 4);
    gl.enableVertexAttribArray(texLoc);
}

function setupSkyboxAttributes() {
    const stride = 8 * 4; // 3 pos + 3 normal + 2 tex = 8 floats * 4 bytes
    
    const posLoc = gl.getAttribLocation(program, "VertexPosition");
    const norLoc = gl.getAttribLocation(program, "VertexNormal");
    const texLoc = gl.getAttribLocation(program, "VertexTexCoord");

    if (posLoc === -1 || norLoc === -1 || texLoc === -1) {
        console.error("No se encontraron algunos atributos del skybox");
        return;
    }

    // Configurar posición para skybox
    gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, stride, 0);
    gl.enableVertexAttribArray(posLoc);

    // Configurar normal para skybox
    gl.vertexAttribPointer(norLoc, 3, gl.FLOAT, false, stride, 3 * 4);
    gl.enableVertexAttribArray(norLoc);

    // Configurar coordenadas de textura para skybox
    gl.vertexAttribPointer(texLoc, 2, gl.FLOAT, false, stride, 6 * 4);
    gl.enableVertexAttribArray(texLoc);
}

/* ======================= INTERFAZ DE CONTROL ======================= */

function createControls() {
    const controlsDiv = document.createElement('div');
    controlsDiv.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        background: rgba(0,0,0,0.7);
        padding: 15px;
        border-radius: 10px;
        color: white;
        font-family: sans-serif;
        font-size: 12px;
        max-width: 250px;
    `;
    
    controlsDiv.innerHTML = `
        <h3 style="margin-top:0; margin-bottom:10px;">Controles del Cielo</h3>
        
        <div style="margin-bottom:10px;">
            <label style="display:block; margin-bottom:5px;">Intensidad de Nubes: <span id="cloudValue">1.0</span></label>
            <input type="range" id="cloudSlider" min="0" max="2" step="0.1" value="1.0" style="width:100%;">
        </div>
        
        <div style="margin-bottom:10px;">
            <label style="display:block; margin-bottom:5px;">Intensidad de Estrellas: <span id="starValue">1.5</span></label>
            <input type="range" id="starSlider" min="0" max="3" step="0.1" value="1.5" style="width:100%;">
        </div>
        
        <div style="margin-bottom:10px;">
            <label style="display:block; margin-bottom:5px;">Brillo del Cielo: <span id="brightnessValue">1.0</span></label>
            <input type="range" id="brightnessSlider" min="0.5" max="2" step="0.1" value="1.0" style="width:100%;">
        </div>
        
        <div style="margin-bottom:10px;">
            <label style="display:block; margin-bottom:5px;">Velocidad Rotación: <span id="speedValue">0.02</span></label>
            <input type="range" id="speedSlider" min="0" max="0.05" step="0.001" value="0.02" style="width:100%;">
        </div>
        
        <div style="font-size:11px; color:#aaa; margin-top:10px;">
            Usa los sliders para ajustar la apariencia del cielo
        </div>
    `;
    
    document.body.appendChild(controlsDiv);
    
    // Configurar eventos de los sliders
    const cloudSlider = document.getElementById('cloudSlider');
    const starSlider = document.getElementById('starSlider');
    const brightnessSlider = document.getElementById('brightnessSlider');
    const speedSlider = document.getElementById('speedSlider');
    
    const cloudValue = document.getElementById('cloudValue');
    const starValue = document.getElementById('starValue');
    const brightnessValue = document.getElementById('brightnessValue');
    const speedValue = document.getElementById('speedValue');
    
    cloudSlider.addEventListener('input', function() {
        cloudIntensity = parseFloat(this.value);
        cloudValue.textContent = this.value;
    });
    
    starSlider.addEventListener('input', function() {
        starIntensity = parseFloat(this.value);
        starValue.textContent = this.value;
    });
    
    brightnessSlider.addEventListener('input', function() {
        skyBrightness = parseFloat(this.value);
        brightnessValue.textContent = this.value;
    });
    
    speedSlider.addEventListener('input', function() {
        skyboxRotationSpeed = parseFloat(this.value);
        speedValue.textContent = this.value;
    });
}

/* ======================= DIBUJO ======================= */

function draw(t) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Actualizar rotación del skybox
    skyboxRotation += skyboxRotationSpeed * 0.01;
    if (skyboxRotation > Math.PI * 2) skyboxRotation -= Math.PI * 2;

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

    // Asegurar que el programa esté activo
    gl.useProgram(program);
    
    // Pasar matrices a los shaders
    const projLoc = gl.getUniformLocation(program, "projectionMatrix");
    if (projLoc) gl.uniformMatrix4fv(projLoc, false, proj);
    
    const lightPosLoc = gl.getUniformLocation(program, "Light.Position");
    if (lightPosLoc) gl.uniform3fv(lightPosLoc, eye);

    /* ===== SKYBOX (dibujar primero) ===== */
    gl.depthFunc(gl.LEQUAL);  // Cambiar función de profundidad para skybox
    
    const isSkyboxLoc = gl.getUniformLocation(program, "isSkybox");
    if (isSkyboxLoc) gl.uniform1f(isSkyboxLoc, 1.0);
    
    const isWaterLoc = gl.getUniformLocation(program, "isWater");
    if (isWaterLoc) gl.uniform1f(isWaterLoc, 0.0);
    
    const fogEnabledLoc = gl.getUniformLocation(program, "fogEnabled");
    if (fogEnabledLoc) gl.uniform1f(fogEnabledLoc, 0.0); // Desactivar niebla para skybox
    
    if (uSkyboxRotationLoc) gl.uniform1f(uSkyboxRotationLoc, skyboxRotation);
    
    // Pasar controles de intensidad al shader
    if (uCloudIntensityLoc) gl.uniform1f(uCloudIntensityLoc, cloudIntensity);
    if (uStarIntensityLoc) gl.uniform1f(uStarIntensityLoc, starIntensity);
    if (uSkyBrightnessLoc) gl.uniform1f(uSkyBrightnessLoc, skyBrightness);
    
    // Dibujar skybox
    let mv = mat4.clone(view);
    // Escalar el skybox para que sea grande
    mat4.scale(mv, mv, [50, 50, 50]);
    
    const nm = mat3.create();
    mat3.normalFromMat4(nm, mv);
    
    const mvLoc = gl.getUniformLocation(program, "modelViewMatrix");
    if (mvLoc) gl.uniformMatrix4fv(mvLoc, false, mv);
    
    const nmLoc = gl.getUniformLocation(program, "normalMatrix");
    if (nmLoc) gl.uniformMatrix3fv(nmLoc, false, nm);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, skybox.vbo);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, skybox.ibo);
    setupSkyboxAttributes();
    gl.drawElements(gl.TRIANGLES, skybox.indices.length, gl.UNSIGNED_SHORT, 0);
    
    /* ===== RESTAURAR CONFIGURACIÓN PARA OBJETOS NORMALES ===== */
    gl.depthFunc(gl.LESS);
    
    if (isSkyboxLoc) gl.uniform1f(isSkyboxLoc, 0.0);
    if (fogEnabledLoc) gl.uniform1f(fogEnabledLoc, 1.0); // Reactivar niebla

    /* ===== LUZ ===== */
    const lightLaLoc = gl.getUniformLocation(program, "Light.La");
    const lightLdLoc = gl.getUniformLocation(program, "Light.Ld");
    const lightLsLoc = gl.getUniformLocation(program, "Light.Ls");
    
    if (lightLaLoc) gl.uniform3fv(lightLaLoc, [1, 1, 1]);
    if (lightLdLoc) gl.uniform3fv(lightLdLoc, [1, 1, 1]);
    if (lightLsLoc) gl.uniform3fv(lightLsLoc, [1, 1, 1]);

    /* ===== MATERIAL PARA CUBO ===== */
    const matKaLoc = gl.getUniformLocation(program, "Material.Ka");
    const matKdLoc = gl.getUniformLocation(program, "Material.Kd");
    const matKsLoc = gl.getUniformLocation(program, "Material.Ks");
    const matAlphaLoc = gl.getUniformLocation(program, "Material.alpha");
    
    // Configurar material del cubo
    if (matKaLoc) gl.uniform3fv(matKaLoc, [0.2, 0.2, 0.2]);
    if (matKdLoc) gl.uniform3fv(matKdLoc, [0.6, 0.6, 0.6]);
    if (matKsLoc) gl.uniform3fv(matKsLoc, [1, 1, 1]);
    if (matAlphaLoc) gl.uniform1f(matAlphaLoc, 20);

    /* ===== NIEBLA ===== */
    const fogMinLoc = gl.getUniformLocation(program, "fogMin");
    const fogMaxLoc = gl.getUniformLocation(program, "fogMax");
    const fogColorLoc = gl.getUniformLocation(program, "fogColor");
    const fogModeLoc = gl.getUniformLocation(program, "fogMode");
    
    if (fogMinLoc) gl.uniform1f(fogMinLoc, 1.5);
    if (fogMaxLoc) gl.uniform1f(fogMaxLoc, 6.5);
    if (fogColorLoc) gl.uniform3fv(fogColorLoc, [0.55, 0.75, 0.95]); // Color de niebla azulado
    if (fogModeLoc) gl.uniform1f(fogModeLoc, 0.0);

    if (uTimeLoc) gl.uniform1f(uTimeLoc, t);

    /* ===== CUBO ===== */
    mv = mat4.clone(view);
    mat3.normalFromMat4(nm, mv);
    
    if (mvLoc) gl.uniformMatrix4fv(mvLoc, false, mv);
    if (nmLoc) gl.uniformMatrix3fv(nmLoc, false, nm);
    if (isWaterLoc) gl.uniform1f(isWaterLoc, 0.0);

    gl.bindBuffer(gl.ARRAY_BUFFER, cube.vbo);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cube.ibo);
    setupAttributes();
    gl.drawElements(gl.TRIANGLES, cube.indices.length, gl.UNSIGNED_SHORT, 0);

    /* ===== AGUA ===== */
    mv = mat4.clone(view);
    mat4.translate(mv, mv, [0, -0.8, 0]);
    mat3.normalFromMat4(nm, mv);
    
    if (mvLoc) gl.uniformMatrix4fv(mvLoc, false, mv);
    if (nmLoc) gl.uniformMatrix3fv(nmLoc, false, nm);
    if (isWaterLoc) gl.uniform1f(isWaterLoc, 1.0);

    // ===== MATERIAL AGUA (AZUL MUY OSCURA) =====
    // Ambiente: casi negro azulado
    if (matKaLoc) gl.uniform3fv(matKaLoc, [0.005, 0.015, 0.04]);
    // Difuso: azul profundo
    if (matKdLoc) gl.uniform3fv(matKdLoc, [0.02, 0.07, 0.20]);
    // Especular: reflejos fríos
    if (matKsLoc) gl.uniform3fv(matKsLoc, [0.85, 0.9, 1.0]);
    // Brillo alto (aspecto líquido)
    if (matAlphaLoc) gl.uniform1f(matAlphaLoc, 90.0);

    gl.bindBuffer(gl.ARRAY_BUFFER, water.vbo);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, water.ibo);
    setupAttributes();
    gl.drawElements(gl.TRIANGLES, water.count, gl.UNSIGNED_SHORT, 0);
}

/* ======================= INIT ======================= */

function init() {
    const canvas = document.getElementById("glCanvas");
    gl = canvas.getContext("webgl2");
    
    if (!gl) {
        alert("WebGL2 no está disponible en tu navegador");
        return;
    }
    
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.15, 0.15, 0.15, 1);

    // 🖱️ CONTROLES RATÓN - ROTACIÓN
    canvas.addEventListener("mousedown", e => {
        isDragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
        canvas.style.cursor = 'grabbing';
    });

    window.addEventListener("mouseup", () => {
        isDragging = false;
        canvas.style.cursor = 'grab';
    });

    canvas.addEventListener("mouseleave", () => {
        isDragging = false;
        canvas.style.cursor = 'default';
    });

    window.addEventListener("mousemove", e => {
        if (!isDragging) return;
        yaw += (e.clientX - lastX) * 0.005;
        pitch += (e.clientY - lastY) * 0.005;
        pitch = Math.max(-1.4, Math.min(1.4, pitch));
        lastX = e.clientX;
        lastY = e.clientY;
    });

    // 🖱️ ZOOM con la rueda del ratón
    canvas.addEventListener("wheel", (e) => {
        e.preventDefault();

        // Zoom (ajusta sensibilidad aquí)
        distance += e.deltaY * 0.01;

        // Límites (para que no atravieses el cubo ni te alejes infinito)
        distance = Math.max(1.5, Math.min(30.0, distance));
    }, { passive: false });

    // Inicializar cursor
    canvas.style.cursor = 'grab';

    // Crear controles de interfaz para el cielo
    createControls();

    // Inicializar el programa de shaders
    initProgram();
    
    // Configurar buffers
    setupBuffer(cube);
    setupBuffer(water);
    setupBuffer(skybox);

    // Iniciar bucle de animación
    let start = performance.now();
    (function frame() {
        draw((performance.now() - start) * 0.001);
        requestAnimationFrame(frame);
    })();
}

// Iniciar cuando la página esté cargada
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}