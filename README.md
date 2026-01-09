# ProyectoFinalGraficos

Aunque cada uno tenía una cosa asignada del proyecto hemos estado ayudándonos mutuamente y realizando el proyecto a la vez.

## Miembros

SrTibii --> Marc Luengo - Agua + Movimiento

GuilleElPro --> Guillermo Vieco - SkyBox + Movimiento

Unai Arias o Unaiarias --> Unai Arias - Niebla + Movimiento

## Proceso
Niebla:

La niebla se implementó en el fragment shader. Para cada fragmento se calcula su distancia a la cámara en espacio de cámara, y a partir de esa distancia se obtiene un factor de niebla que mezcla el color del objeto con un color de niebla configurable.
Para dar sensación de niebla en movimiento, la distancia efectiva se modifica usando funciones seno dependientes del tiempo (uTime) y de la posición del fragmento, generando bancos de niebla que se desplazan suavemente.
Los parámetros de inicio, fin y color de la niebla se controlan desde JavaScript mediante uniforms, lo que permite ajustar fácilmente su intensidad y apariencia.

Agua:

El agua se implementó mediante una malla plana subdividida generada por código (grid), que permite aplicar deformaciones suaves.
En el vertex shader se aplica un displacement mapping procedural, desplazando la coordenada vertical (Y) de cada vértice usando combinaciones de funciones seno y coseno dependientes del tiempo, simulando el movimiento de las olas.
Las normales se recalculan de forma aproximada para que la iluminación responda correctamente. El agua utiliza un material azul oscuro, con bajo componente difuso y un componente especular alto, para simular reflejos y darle un aspecto más realista y profundo.

Skybox:

El skybox se implementó como un cubo de gran tamaño que rodea toda la escena y se dibuja antes que el resto de los objetos.
Se renderiza con la cámara centrada en el origen, escalándolo para que siempre envuelva la escena, y se desactiva la niebla durante su dibujo para evitar que el cielo se vea afectado por ella.
Además, se aplica una rotación lenta al skybox usando una variable de tiempo, lo que añade dinamismo al fondo sin afectar a los objetos de la escena. Esto permite crear un entorno visual coherente cielo/espacio.

## Resultado Final GIFS

![niebl](https://github.com/user-attachments/assets/5ec59823-c1f9-4145-a306-db30a9a60762)

![niebl3](https://github.com/user-attachments/assets/ebfb6823-545f-46a0-97b9-2fe6d1730f8d)


![cielo](https://github.com/user-attachments/assets/b9ab2fc6-a53f-4fc7-b801-b000b99b25ea)


![cielo2](https://github.com/user-attachments/assets/ab709e7d-f98e-44c6-9338-ad314377e439)


![cielo3](https://github.com/user-attachments/assets/f44a8129-710f-490d-a383-e6ec818d3920)
