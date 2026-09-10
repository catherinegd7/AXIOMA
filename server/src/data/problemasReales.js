// ---------------------------------------------------------------------------
// problemasReales.js — el contenido real de tres competencias, transcrito de
// los archivos LaTeX que dio el equipo:
//   - OMMU Primera Ronda (2024-2026)
//   - OMMU Concurso Nacional (2024-2026)
//   - Putnam (2021-2025)
//
// Este archivo es solo DATOS (sin conexión a Mongo, sin lógica de base de
// datos) -- seed.js lo importa y hace el trabajo de guardarlo. Separar los
// datos así significa que agregar más problemas en el futuro es solo
// agregar entradas a los arreglos de aquí abajo, sin tocar seed.js.
//
// IMPORTANTE sobre cómo está escrito el LaTeX aquí abajo: cada enunciado usa
// String.raw`...` en vez de comillas normales. La razón es técnica pero
// real: en un string de JavaScript normal, una barra invertida seguida de
// ciertas letras tiene un significado especial ("\n" es un salto de línea,
// "\f" es un carácter invisible de "form feed") -- y el LaTeX está LLENO de
// comandos que empiezan con "\" (\frac, \sum, \sqrt, \neq...). Si
// escribiéramos estos enunciados con comillas normales, JavaScript
// "comería" esas barras invertidas silenciosamente y el LaTeX quedaría roto
// sin ningún error visible. String.raw le dice a JavaScript "no le hagas
// nada especial a las barras invertidas, guarda el texto exactamente como
// está escrito" -- exactamente lo que KaTeX necesita recibir.
//
// dificultad/exito: estimaciones ilustrativas basadas en un patrón conocido
// (el problema #1 de cada ronda/sección es más accesible que el último) --
// NO son datos reales de examen, porque no existen estadísticas públicas de
// qué % de gente resolvió cada uno de estos problemas específicos.
// ---------------------------------------------------------------------------

export const categorias = [
  { key: 'putnam', name: 'Putnam', parent: null },
  { key: 'putnam-2021', name: '2021', parent: 'putnam' },
  { key: 'putnam-2022', name: '2022', parent: 'putnam' },
  { key: 'putnam-2023', name: '2023', parent: 'putnam' },
  { key: 'putnam-2024', name: '2024', parent: 'putnam' },
  { key: 'putnam-2025', name: '2025', parent: 'putnam' },

  { key: 'ommu-pr', name: 'OMMU Primera Ronda', parent: null },
  { key: 'ommu-pr-2024', name: '2024', parent: 'ommu-pr' },
  { key: 'ommu-pr-2025', name: '2025', parent: 'ommu-pr' },
  { key: 'ommu-pr-2026', name: '2026', parent: 'ommu-pr' },

  { key: 'ommu-nac', name: 'OMMU Nacional', parent: null },
  { key: 'ommu-nac-2024', name: '2024', parent: 'ommu-nac' },
  { key: 'ommu-nac-2025', name: '2025', parent: 'ommu-nac' },
  { key: 'ommu-nac-2026', name: '2026', parent: 'ommu-nac' },
]

// posicion = lugar del problema dentro de su ronda/sección (1 = primero).
function estimarPutnam(posicion) {
  const tabla = [
    { dificultad: 'Media', exito: 45 },
    { dificultad: 'Difícil', exito: 24 },
    { dificultad: 'Difícil', exito: 14 },
    { dificultad: 'Difícil', exito: 9 },
    { dificultad: 'Difícil', exito: 5 },
    { dificultad: 'Difícil', exito: 3 },
  ]
  return tabla[posicion - 1]
}

function estimarOMMU(posicion) {
  const tabla = [
    { dificultad: 'Media', exito: 48 },
    { dificultad: 'Media', exito: 36 },
    { dificultad: 'Difícil', exito: 24 },
    { dificultad: 'Difícil', exito: 15 },
    { dificultad: 'Difícil', exito: 9 },
    { dificultad: 'Difícil', exito: 7 },
  ]
  return tabla[posicion - 1]
}

// ===========================================================================
// OMMU — PRIMERA RONDA
// ===========================================================================

const ommuPrimeraRonda = [
  // --- 2024 ---
  {
    codigo: 'OMMU-PR-2024-1',
    titulo: 'Raíces de la derivada de p²',
    categoriaKey: 'ommu-pr-2024',
    año: '2024',
    tema: 'Análisis',
    tipo: 'OMMU Primera Ronda',
    ...estimarOMMU(1),
    enunciado: String.raw`Demuestra que si $p(x)$ es un polinomio de grado $n$ con coeficientes reales y $n$ raíces reales distintas, entonces el polinomio $(p^2)'(x)$ tiene $2n-1$ raíces reales distintas.`,
  },
  {
    codigo: 'OMMU-PR-2024-2',
    titulo: 'Derivada de det(J+tA)',
    categoriaKey: 'ommu-pr-2024',
    año: '2024',
    tema: 'Álgebra Lineal',
    tipo: 'OMMU Primera Ronda',
    ...estimarOMMU(2),
    enunciado: String.raw`Sea $A$ una matriz real de $n \times n$, $J$ la matriz de $n \times n$ cuyas entradas son todas $1$, y $f(t) = \det(J+tA)$. Encuentra $f'(0)$.`,
  },
  {
    codigo: 'OMMU-PR-2024-3',
    titulo: 'Periodo de un corrimiento binario',
    categoriaKey: 'ommu-pr-2024',
    año: '2024',
    tema: 'Combinatoria',
    tipo: 'OMMU Primera Ronda',
    ...estimarOMMU(3),
    enunciado: String.raw`Sea $x=(x_1,x_2,\dots,x_n)$ una sucesión de $0$'s y $1$'s. Considera la función $\rho(x)=\rho(x_1,\dots,x_n)=(x_2,\dots,x_n,x_1)$ que desplaza la primera entrada al final. Sean $u=|\{i \mid x_i=1\}|$ y $v=|\{i \mid x_i=0\}|$ la cantidad de unos y ceros en $x$, respectivamente. Dado que $|u-v|=1$, demuestra que $\rho^t(x)=x$ si y solo si $n \mid t$.`,
  },
  {
    codigo: 'OMMU-PR-2024-4',
    titulo: 'Conjuntos independientes en un ciclo con cola',
    categoriaKey: 'ommu-pr-2024',
    año: '2024',
    tema: 'Combinatoria',
    tipo: 'OMMU Primera Ronda',
    ...estimarOMMU(4),
    enunciado: String.raw`Considera una gráfica $G(n,m)$ que se obtiene al identificar un vértice de un ciclo de $n$ aristas con un extremo de un camino de $m$ aristas.

Un conjunto de vértices se considera bueno si no hay dos de ellos que sean vecinos (es decir, no comparten ninguna arista). Sea $f(n,m,k)$ la cantidad de conjuntos buenos de tamaño $k$ en $G(n,m)$. Encuentra $f(n,m,k)$.`,
  },
  {
    codigo: 'OMMU-PR-2024-5',
    titulo: 'Funciones con f(f(x)) = x⁴',
    categoriaKey: 'ommu-pr-2024',
    año: '2024',
    tema: 'Álgebra',
    tipo: 'OMMU Primera Ronda',
    ...estimarOMMU(5),
    enunciado: String.raw`Encuentra todas las funciones $f:(0,\infty)\rightarrow(0,\infty)$ que satisfacen:
(i) $f(xy)=f(x)f(y)$
(ii) $f(f(x))=x^4$
(iii) $$\lim_{x\rightarrow\infty}f(x)=0$$`,
  },

  // --- 2025 ---
  {
    codigo: 'OMMU-PR-2025-1',
    titulo: 'Suma alternante sobre subconjuntos',
    categoriaKey: 'ommu-pr-2025',
    año: '2025',
    tema: 'Combinatoria',
    tipo: 'OMMU Primera Ronda',
    ...estimarOMMU(1),
    enunciado: String.raw`Sea $n$ un número natural y considera $A_n=\{1,2,\dots,n\}$. Para un subconjunto $B\subset A_n$, sea $S_B=a_r-a_{r-1}+a_{r-2}+\dots+(-1)^{r-1}a_1$ si $B=\{a_r>a_{r-1}>\dots>a_1\}$. Calcula:
$$\sum_{B\subset A_n}S_B$$`,
  },
  {
    codigo: 'OMMU-PR-2025-2',
    titulo: 'Convergencia de una suma sobre potencias de primo',
    categoriaKey: 'ommu-pr-2025',
    año: '2025',
    tema: 'Análisis',
    tipo: 'OMMU Primera Ronda',
    ...estimarOMMU(2),
    enunciado: String.raw`Sea $A=\{n\in\mathbb{N} \mid n \text{ es una potencia de primo compuesta}\}$. Sea $f(n)$ el promedio de los divisores de $n$. Demuestra que la siguiente suma converge:
$$\sum_{n\in A}\frac{1}{f(n)}$$
Nota: Un número compuesto es aquel que puede expresarse como el producto de dos números mayores que uno. Una potencia de primo es el resultado de multiplicar un mismo número primo por sí mismo varias veces (por ejemplo, $2^3=2\times2\times2$).`,
  },
  {
    codigo: 'OMMU-PR-2025-3',
    titulo: 'Matrices sin raíces de x² + px + q',
    categoriaKey: 'ommu-pr-2025',
    año: '2025',
    tema: 'Álgebra Lineal',
    tipo: 'OMMU Primera Ronda',
    ...estimarOMMU(3),
    enunciado: String.raw`Sean $p,q\in\mathbb{R}$ tales que para todo número real $x\in\mathbb{R}$, $x^2+px+q\neq 0$. Si $n$ es un entero positivo impar, demuestra que para toda matriz cuadrada $X$ de $n\times n$ con entradas reales:
$$X^2+pX+qI_n\neq O_n$$
Nota: $I_n$ representa la matriz identidad de orden $n$, es decir, una matriz cuadrada de tamaño $n\times n$ con unos en la diagonal principal y ceros en el resto. $O_n$ representa la matriz de $n\times n$ cuyas entradas son todas cero.`,
  },
  {
    codigo: 'OMMU-PR-2025-4',
    titulo: 'Curva tangente a círculos desde una elipse',
    categoriaKey: 'ommu-pr-2025',
    año: '2025',
    tema: 'Geometría',
    tipo: 'OMMU Primera Ronda',
    ...estimarOMMU(4),
    enunciado: String.raw`Sea $\Gamma$ una elipse con focos $A$ y $B$. Para cada punto $P\in\Gamma$ se traza un círculo $C(P)$ con centro en $P$ que pasa por el punto $B$. Demuestra que existe una curva cerrada que es tangente a todos los círculos $C(P)$ y que el área encerrada por esta curva es al menos cuatro veces el área de la elipse $\Gamma$.`,
  },
  {
    codigo: 'OMMU-PR-2025-5',
    titulo: 'Cota de una integral usando la derivada',
    categoriaKey: 'ommu-pr-2025',
    año: '2025',
    tema: 'Análisis',
    tipo: 'OMMU Primera Ronda',
    ...estimarOMMU(5),
    enunciado: String.raw`Sea $f:[0,1]\rightarrow\mathbb{R}$ una función continua en $[0,1]$ y diferenciable en $(0,1)$ tal que existe $a\in(0,1]$ que satisface $\int_0^a f(x)dx=0$. Demuestra que:
$$\left| \int_0^1 f(x)dx \right| \leq \frac{1-a}{2}\sup_{0<x<1}|f'(x)|$$`,
  },

  // --- 2026 ---
  {
    codigo: 'OMMU-PR-2026-1',
    titulo: 'Concurrencia de rectas con pendiente recíproca',
    categoriaKey: 'ommu-pr-2026',
    año: '2026',
    tema: 'Geometría',
    tipo: 'OMMU Primera Ronda',
    ...estimarOMMU(1),
    enunciado: String.raw`Sea $ABC$ un triángulo en el plano cartesiano tal que ninguno de sus lados es paralelo a los ejes coordenados. Sean $L$, $M$ y $N$ los puntos medios de los lados $BC$, $CA$ y $AB$, respectivamente. Por cada punto medio, se traza una línea cuya pendiente es el recíproco de la pendiente del lado correspondiente. Demuestra que estas tres líneas son concurrentes.
Nota: El recíproco de $m$ es $1/m$.`,
  },
  {
    codigo: 'OMMU-PR-2026-2',
    titulo: 'Punto donde P′/P iguala una suma de recíprocos',
    categoriaKey: 'ommu-pr-2026',
    año: '2026',
    tema: 'Análisis',
    tipo: 'OMMU Primera Ronda',
    ...estimarOMMU(2),
    enunciado: String.raw`Sea $P(x)$ un polinomio con coeficientes reales que no tiene raíces en $(a,b)\subset\mathbb{R}$. Demuestra que existe $\alpha\in(a,b)$ tal que:
$$\frac{P'(\alpha)}{P(\alpha)}=\frac{1}{a-\alpha}+\frac{1}{b-\alpha}$$
Nota: Aquí $P'$ representa la derivada del polinomio.`,
  },
  {
    codigo: 'OMMU-PR-2026-3',
    titulo: 'Determinante de una matriz de senos',
    categoriaKey: 'ommu-pr-2026',
    año: '2026',
    tema: 'Álgebra Lineal',
    tipo: 'OMMU Primera Ronda',
    ...estimarOMMU(3),
    enunciado: String.raw`Calcula el determinante de la matriz $A$ de tamaño $2026\times 2026$ cuyas entradas están dadas por la expresión $A_{i,j}=\sin(2026i+j)$ donde $1\le i\le 2026$ y $0\le j\le 2025$.`,
  },
  {
    codigo: 'OMMU-PR-2026-4',
    titulo: 'Pares y tripletas que dan la identidad en un grupo',
    categoriaKey: 'ommu-pr-2026',
    año: '2026',
    tema: 'Álgebra',
    tipo: 'OMMU Primera Ronda',
    ...estimarOMMU(4),
    enunciado: String.raw`Sea $G$ un grupo finito de orden $2n$ con elemento identidad $e$. Considera $R$ y $B$ como dos subconjuntos disjuntos de $G$ tales que $G=R\cup B$ con $|R|=|B|=n$.
a) Demuestra que $|\{(x,y)\in R^2 \mid xy=e\}|=|\{(x,y)\in B^2 \mid xy=e\}|$.
b) Proporciona un contraejemplo que demuestre que el enunciado análogo para tripletas es falso; es decir, que en general $|\{(x,y,z)\in R^3 \mid xyz=e\}|\neq|\{(x,y,z)\in B^3 \mid xyz=e\}|$.
Nota: Un grupo es un conjunto $G$ con una operación asociativa $\cdot:G\times G\rightarrow G$, con identidad $e$ y con inversos.`,
  },
  {
    codigo: 'OMMU-PR-2026-5',
    titulo: 'Límite del valor esperado de la valuación p-ádica',
    categoriaKey: 'ommu-pr-2026',
    año: '2026',
    tema: 'Probabilidad',
    tipo: 'OMMU Primera Ronda',
    ...estimarOMMU(5),
    enunciado: String.raw`Sea $p$ un número primo fijo. Para cada entero positivo $n$, sea $X_n$ una variable aleatoria uniforme en el conjunto $\{1,2,\dots,n\}$. Definimos $V_p(m)$ como el exponente de $p$ en la factorización prima de $m$. Demuestra que el siguiente límite existe y encuentra su valor:
$$\lim_{n\rightarrow\infty}\mathbb{E}[V_p(X_n)]$$
Nota: Recuerda que para una variable aleatoria discreta $Y$ que toma valores enteros positivos, tenemos $\mathbb{E}(Y)=\sum_{k=1}^{\infty}k\cdot P(Y=k)$.`,
  },
]

// ===========================================================================
// OMMU — CONCURSO NACIONAL
// ===========================================================================

const ommuNacional = [
  // --- 2024 ---
  {
    codigo: 'OMMU-NAC-2024-1',
    titulo: 'La ecuación x⁴ = p + 9y⁴',
    categoriaKey: 'ommu-nac-2024',
    año: '2024',
    tema: 'Teoría de Números',
    tipo: 'OMMU Nacional',
    ...estimarOMMU(1),
    enunciado: String.raw`Sean $x, y, p$ enteros positivos que satisfacen la ecuación $x^4=p+9y^4$ donde $p$ es un número primo. Demuestra que $\frac{p^2-1}{3}$ es un cuadrado perfecto y un múltiplo de $16$.`,
  },
  {
    codigo: 'OMMU-NAC-2024-2',
    titulo: 'Un polinomio que lleva A a B',
    categoriaKey: 'ommu-nac-2024',
    año: '2024',
    tema: 'Álgebra Lineal',
    tipo: 'OMMU Nacional',
    ...estimarOMMU(2),
    enunciado: String.raw`Sean $A$ y $B$ dos matrices cuadradas con entradas complejas tales que $A+B=AB$, $A=A^*$ y $A$ tiene todos sus valores propios distintos. Demuestra que existe un polinomio $P$ con coeficientes complejos tal que $P(A)=B$.`,
  },
  {
    codigo: 'OMMU-NAC-2024-3',
    titulo: 'Valores cercanos de una función multiplicativa',
    categoriaKey: 'ommu-nac-2024',
    año: '2024',
    tema: 'Teoría de Números',
    tipo: 'OMMU Nacional',
    ...estimarOMMU(3),
    enunciado: String.raw`Considera una función multiplicativa $f$ de los enteros positivos al disco unitario centrado en el origen, es decir, $f:\mathbb{Z}^+\rightarrow D^2\subseteq\mathbb{C}$ tal que $f(mn)=f(m)f(n)$. Demuestra que para todo $\epsilon>0$ y todo entero $k>0$ existen $k$ enteros positivos distintos $a_1,a_2,\dots,a_k$ tales que $\operatorname{mcd}(a_1,a_2,\dots,a_k)=k$ y $d(f(a_i),f(a_j))<\epsilon$ para todos $i, j=1,\dots,k$.`,
  },
  {
    codigo: 'OMMU-NAC-2024-4',
    titulo: 'Límite de la raíz i-ésima de una entrada de Bⁱ',
    categoriaKey: 'ommu-nac-2024',
    año: '2024',
    tema: 'Álgebra Lineal',
    tipo: 'OMMU Nacional',
    ...estimarOMMU(4),
    enunciado: String.raw`Dado $b>0$ considera la siguiente matriz:
$$B=\begin{pmatrix}b&b^2\\ b^2&b^3\end{pmatrix}$$
Denota por $e_i$ la entrada superior izquierda de $B^i$. Demuestra que el siguiente límite existe y calcula su valor:
$$\lim_{i\rightarrow\infty}\sqrt[i]{e_i}$$`,
  },
  {
    codigo: 'OMMU-NAC-2024-5',
    titulo: 'Permutación que evita sumas cero',
    categoriaKey: 'ommu-nac-2024',
    año: '2024',
    tema: 'Combinatoria',
    tipo: 'OMMU Nacional',
    ...estimarOMMU(5),
    enunciado: String.raw`Considera dos sucesiones finitas de números reales $a_1,a_2,\dots,a_n$ y $b_1,b_2,\dots,b_n$. Sean $\alpha(x)=|\{i \mid a_i=x\}|$ y $\beta(x)=|\{i \mid b_i=-x\}|$. Demuestra que existe una permutación $\sigma\in S_n$ (el grupo simétrico de $n$ elementos) tal que $a_{\sigma(i)}+b_i\neq 0$ para todo $i=1,\dots,n$ si y solo si $\alpha(x)+\beta(x)\le n$ para todo $x\in\mathbb{R}$.`,
  },
  {
    codigo: 'OMMU-NAC-2024-6',
    titulo: 'Cota para (p²)″ en términos de (p′)²',
    categoriaKey: 'ommu-nac-2024',
    año: '2024',
    tema: 'Análisis',
    tipo: 'OMMU Nacional',
    ...estimarOMMU(6),
    enunciado: String.raw`Sea $p$ un polinomio mónico con todas sus raíces reales distintas. Demuestra que existe $K$ tal que $(p(x)^2)''\le K(p'(x))^2$.`,
  },

  // --- 2025 ---
  {
    codigo: 'OMMU-NAC-2025-1',
    titulo: 'Integral con simetría en 25 y 81',
    categoriaKey: 'ommu-nac-2025',
    año: '2025',
    tema: 'Análisis',
    tipo: 'OMMU Nacional',
    ...estimarOMMU(1),
    enunciado: String.raw`Encuentra el valor de la integral (Día 1):
$$\int_{25}^{81}\frac{\sin(x)}{x\left(\sin(x)+\sin\left(\frac{2025}{x}\right)\right)}dx$$`,
  },
  {
    codigo: 'OMMU-NAC-2025-2',
    titulo: 'Ventiladores cíclicos y botones de fila-columna',
    categoriaKey: 'ommu-nac-2025',
    año: '2025',
    tema: 'Combinatoria',
    tipo: 'OMMU Nacional',
    ...estimarOMMU(2),
    enunciado: String.raw`(Día 1) Considera una cuadrícula de $n\times n$ ventiladores, donde cada ventilador tiene $2025$ velocidades. La velocidad más baja corresponde al estado "apagado". Cada ventilador puede cambiar su velocidad a la siguiente más alta, y desde la velocidad máxima pasa al estado "apagado"; es decir, el cambio de velocidades ocurre de forma cíclica. Hay un control remoto con botones también dispuestos en una cuadrícula de $n\times n$. Cuando se presiona un botón, todos los ventiladores en la misma fila y columna que ese botón aumentan su velocidad en uno (siguiendo el ciclo descrito). Determina la cantidad de valores $n\le 2025$ para los cuales es posible pasar del estado donde todos los ventiladores están apagados a un estado donde todos están encendidos a la misma velocidad (para cada una de las $2025$ velocidades posibles).`,
  },
  {
    codigo: 'OMMU-NAC-2025-3',
    titulo: 'Grupo de matrices simétricas con valores propios ±1',
    categoriaKey: 'ommu-nac-2025',
    año: '2025',
    tema: 'Álgebra Lineal',
    tipo: 'OMMU Nacional',
    ...estimarOMMU(3),
    enunciado: String.raw`(Día 1) Sea $G$ un grupo de matrices simétricas de $n\times n$ con entradas reales. Supón que para todo elemento en $G$, sus valores propios son $1$ o $-1$. Demuestra que el tamaño de $G$ es $2^k$ para algún $k\le n$.`,
  },
  {
    codigo: 'OMMU-NAC-2025-4',
    titulo: 'Hexágono regular a partir de triángulos equiláteros',
    categoriaKey: 'ommu-nac-2025',
    año: '2025',
    tema: 'Geometría',
    tipo: 'OMMU Nacional',
    ...estimarOMMU(4),
    enunciado: String.raw`(Día 2) Se construyen triángulos equiláteros externamente sobre los lados de un hexágono que tiene un centro de simetría. Los vértices de estos triángulos que no pertenecen al hexágono inicial forman un nuevo hexágono. Demuestra que los puntos medios de los lados de este nuevo hexágono son vértices de un hexágono regular.`,
  },
  {
    codigo: 'OMMU-NAC-2025-5',
    titulo: 'Camino hamiltoniano de suma cero',
    categoriaKey: 'ommu-nac-2025',
    año: '2025',
    tema: 'Combinatoria',
    tipo: 'OMMU Nacional',
    ...estimarOMMU(5),
    enunciado: String.raw`(Día 2) Cada arista de una gráfica completa con $101$ vértices está etiquetada con $1$ o $-1$. Se sabe que el valor absoluto de la suma de los números asignados a las aristas es menor que $150$. Demuestra que la gráfica contiene un camino que visita todos los vértices exactamente una vez, tal que la suma de los valores de dicho camino es cero.`,
  },
  {
    codigo: 'OMMU-NAC-2025-6',
    titulo: 'Límite de una sucesión recursiva entre √n',
    categoriaKey: 'ommu-nac-2025',
    año: '2025',
    tema: 'Análisis',
    tipo: 'OMMU Nacional',
    ...estimarOMMU(6),
    enunciado: String.raw`(Día 2) Considera la sucesión $(a_n)$ definida por la relación:
$$a_n=\frac{a_{n-1}+\sqrt{a_{n-1}^2+4}}{2}, \quad a_1=1$$
Demuestra que $b_n=\frac{a_n}{\sqrt{n}}$ converge y calcula su valor en el límite cuando $n\rightarrow\infty$.`,
  },

  // --- 2026 ---
  {
    codigo: 'OMMU-NAC-2026-1',
    titulo: 'Longitud mínima de un ciclo con relación tipo trenza',
    categoriaKey: 'ommu-nac-2026',
    año: '2026',
    tema: 'Álgebra',
    tipo: 'OMMU Nacional',
    ...estimarOMMU(1),
    enunciado: String.raw`(Día 1) Sean $\alpha$ y $\beta$ dos permutaciones de $n$ elementos, con $n>3$, tales que:
a) Para cualquier $x$, si $\alpha(x)=x$ entonces $\beta(x)\neq x$, es decir, $\alpha$ y $\beta$ no tienen puntos fijos en común.
b) $\alpha$ y $\beta$ satisfacen la siguiente relación: $\alpha\cdot\beta^{-1}\cdot\alpha^{-1}\cdot\beta\cdot\alpha\cdot\beta^{-1}\cdot\alpha\cdot\beta\cdot\alpha^{-1}\cdot\beta^{-1}=1$.
c) $\alpha$ consiste en un solo ciclo de longitud $k$ con $k<n$.
Demuestra que $k\ge 2n/3$.`,
  },
  {
    codigo: 'OMMU-NAC-2026-2',
    titulo: 'Desigualdad entre grados y una función en los vértices',
    categoriaKey: 'ommu-nac-2026',
    año: '2026',
    tema: 'Combinatoria',
    tipo: 'OMMU Nacional',
    ...estimarOMMU(2),
    enunciado: String.raw`(Día 1) Sea $G=(V,E)$ una gráfica conexa, donde $V$ es el conjunto de vértices y $E$ es el conjunto de aristas. Sea $d_i$ el grado del vértice $i\in V$. Sea también $f:V\rightarrow\mathbb{R}^+$ una función que satisface $f(i)f(j)\ge 1$, para todo $i\sim j$, donde $i\sim j$ significa que los vértices $i$ y $j$ son adyacentes.
a) Demuestra que $\sum_{i\in V}f(i)\ge\sum_{e=\{i,j\}}\frac{2}{\sqrt{d_id_j}}$.
b) Determina todas las gráficas $G$ y funciones $f$ para las cuales se alcanza la igualdad.`,
  },
  {
    codigo: 'OMMU-NAC-2026-3',
    titulo: 'Grado mínimo de un polinomio separador',
    categoriaKey: 'ommu-nac-2026',
    año: '2026',
    tema: 'Geometría',
    tipo: 'OMMU Nacional',
    ...estimarOMMU(3),
    enunciado: String.raw`(Día 1) En el plano, hay $2025$ puntos azules y $2026$ puntos rojos en posición general. Determina el menor entero $d$ con la siguiente propiedad: para cualquier distribución de estos puntos, existe un polinomio $P(x,y)\in\mathbb{R}[x,y]$ de grado a lo más $d$ tal que $P(R)<0$ para todo punto rojo $R$, y $P(A)>0$ para todo punto azul $A$.`,
  },
  {
    codigo: 'OMMU-NAC-2026-4',
    titulo: 'Determinante y valores z_i distintos',
    categoriaKey: 'ommu-nac-2026',
    año: '2026',
    tema: 'Álgebra Lineal',
    tipo: 'OMMU Nacional',
    ...estimarOMMU(4),
    enunciado: String.raw`(Día 2) Sean $z_1,z_2,\dots, z_{1013}$ números complejos. Considera la matriz $A$ de tamaño $2026\times 2026$. Para cada $i=1,\dots, 1013$, la fila $2i-1$ de la matriz está dada por: $(1,z_i,z_i^2,\dots,z_i^{2025})$ y la fila $2i$ está dada por: $(0,1,2z_i,3z_i^2,\dots,2025z_i^{2024})$. Demuestra que $\det(A)$ es distinto de cero si y solo si todos los $z_i$ son distintos.`,
  },
  {
    codigo: 'OMMU-NAC-2026-5',
    titulo: 'Asíntotas de la raíz máxima de q_d',
    categoriaKey: 'ommu-nac-2026',
    año: '2026',
    tema: 'Análisis',
    tipo: 'OMMU Nacional',
    ...estimarOMMU(5),
    enunciado: String.raw`(Día 2) Sea $p(x)$ un polinomio mónico de grado $n$, con $n$ par, que tiene $n$ raíces reales positivas distintas. Para cada $d>0$, define $q_d(x)=\frac{1}{d}x^{n+1}-p(x)$, y sea $\lambda_{\max}(d)$ la mayor raíz real de $q_d$.
a) Demuestra que existen números reales $\alpha$ y $L\neq 0$ tales que $\lim_{d\rightarrow\infty}\frac{\lambda_{\max}(d)}{d^\alpha}=L$, y determina $\alpha$ y $L$.
b) Demuestra que existen números reales $\beta$ y $M\neq 0$ tales que $\lim_{d\rightarrow 0^+}\frac{\lambda_{\max}(d)}{d^\beta}=M$, y determina $\beta$ y $M$.`,
  },
  {
    codigo: 'OMMU-NAC-2026-6',
    titulo: 'Movimientos mínimos para vaciar fichas módulo 2026',
    categoriaKey: 'ommu-nac-2026',
    año: '2026',
    tema: 'Combinatoria',
    tipo: 'OMMU Nacional',
    ...estimarOMMU(6),
    enunciado: String.raw`(Día 2) Sea $N$ un múltiplo de $2025^2-1$. Supón que los números $1, 2, \dots, 2026$ tienen $N$ fichas cada uno. Un movimiento consiste en remover fichas de los números $x_1,x_2,\dots,x_n$ (no necesariamente distintos) tales que:
a) $x_1+x_2+\dots+x_n\equiv 0 \pmod{2026}$, y
b) $x_{i_1}+x_{i_2}+\dots+x_{i_r}\not\equiv 0 \pmod{2026}$ para cualquier subconjunto propio $\{i_1,i_2,\dots,i_r\}\subsetneq\{1,2,\dots,n\}$.
Encuentra el mínimo número de movimientos (en términos de $N$) para remover todas las fichas.`,
  },
]

// ===========================================================================
// PUTNAM
// ===========================================================================

function putnam(codigo, año, seccion, posicion, titulo, tema, enunciado) {
  return {
    codigo,
    titulo,
    categoriaKey: `putnam-${año}`,
    año: String(año),
    tema,
    tipo: 'Putnam',
    ...estimarPutnam(posicion),
    enunciado,
  }
}

const putnam2021 = [
  putnam('PUTNAM-2021-A1', 2021, 'A', 1, 'Saltos mínimos de un saltamontes a (2021, 2021)', 'Teoría de Números', String.raw`Un saltamontes comienza en el origen en el plano coordenado y realiza una secuencia de saltos. Cada salto tiene longitud 5, y después de cada salto el saltamontes se encuentra en un punto cuyas coordenadas son ambas enteros; por lo tanto, hay 12 ubicaciones posibles para el saltamontes después del primer salto. ¿Cuál es el número mínimo de saltos necesarios para que el saltamontes alcance el punto $(2021, 2021)$?`),
  putnam('PUTNAM-2021-A2', 2021, 'A', 2, 'Límite de g(x)/x definida por un límite en r', 'Análisis', String.raw`Para cada número real positivo $x$, sea $g(x) = \lim_{r\to 0} \left((x+1)^{r+1} - x^{r+1}\right)^{\frac{1}{r}}$. Encuentra $\lim_{x\to\infty} \frac{g(x)}{x}$.`),
  putnam('PUTNAM-2021-A3', 2021, 'A', 3, 'Esfera con tetraedro regular de vértices enteros', 'Geometría', String.raw`Determina todos los enteros positivos $N$ para los cuales la esfera $x^2+y^2+z^2=N$ tiene inscrito un tetraedro regular cuyos vértices tienen coordenadas enteras.`),
  putnam('PUTNAM-2021-A4', 2021, 'A', 4, 'Límite de una integral doble con simetría', 'Análisis', String.raw`Sea $I(R) = \iint_{x^2+y^2\le R^2} \left(\frac{1+2x^2}{1+x^4+6x^2y^2+y^4} - \frac{1+y^2}{2+x^4+y^4}\right) dxdy$. Encuentra $\lim_{R\to\infty} I(R)$ o demuestra que este límite no existe.`),
  putnam('PUTNAM-2021-A5', 2021, 'A', 5, 'Sumas de potencias módulo 2021', 'Teoría de Números', String.raw`Sea $A$ el conjunto de todos los enteros $n$ tales que $1 \le n \le 2021$ y $\operatorname{mcd}(n,2021)=1$. Para cada entero no negativo $j$, sea $S(j) = \sum_{n\in A} n^j$. Determina todos los valores de $j$ tales que $S(j)$ es un múltiplo de $2021$.`),
  putnam('PUTNAM-2021-A6', 2021, 'A', 6, '¿Es P(2) compuesto si P(x) factoriza?', 'Álgebra', String.raw`Sea $P(x)$ un polinomio cuyos coeficientes son todos $0$ o $1$. Supón que $P(x)$ se puede escribir como el producto de dos polinomios no constantes con coeficientes enteros. ¿Se sigue de esto que $P(2)$ es un entero compuesto?`),
  putnam('PUTNAM-2021-B1', 2021, 'B', 1, 'Probabilidad de no cubrir esquinas del tablero', 'Probabilidad', String.raw`Supón que el plano está embaldosado con un tablero de ajedrez infinito de cuadrados unitarios. Si se deja caer otro cuadrado unitario sobre el plano al azar con posición y orientación independientes del embaldosado del tablero de ajedrez, ¿cuál es la probabilidad de que no cubra ninguna de las esquinas de los cuadrados del tablero de ajedrez?`),
  putnam('PUTNAM-2021-B2', 2021, 'B', 2, 'Máximo de una suma con media geométrica', 'Análisis', String.raw`Determina el valor máximo de la suma $S = \sum_{n=1}^{\infty} \frac{n}{2^n} (a_1 a_2 \dots a_n)^{\frac{1}{n}}$ sobre todas las sucesiones $a_1, a_2, a_3, \dots$ de números reales no negativos que satisfacen $\sum_{k=1}^{\infty} a_k = 1$.`),
  putnam('PUTNAM-2021-B3', 2021, 'B', 3, 'Círculo donde la integral de ρ se anula', 'Análisis', String.raw`Sea $h(x,y)$ una función de valor real que es dos veces continuamente diferenciable en todo $\mathbb{R}^2$ y define $\rho(x,y) = yh_x - xh_y$. Pruebe o refute: Para cualquier constante positiva $d$ y $r$ con $d > r$, existe un círculo $S$ de radio $r$ cuyo centro está a una distancia $d$ del origen tal que la integral de $\rho$ sobre el interior de $S$ es cero.`),
  putnam('PUTNAM-2021-B4', 2021, 'B', 4, 'Residuo de un producto módulo un Fibonacci', 'Teoría de Números', String.raw`Sean $F_0, F_1, \dots$ la sucesión de números de Fibonacci, con $F_0=0$, $F_1=1$, y $F_n = F_{n-1} + F_{n-2}$ para $n \ge 2$. Para $m > 2$, sea $R_m$ el residuo cuando el producto $\prod_{k=1}^{m-1} k^k$ se divide por $F_m$. Demuestra que $R_m$ también es un número de Fibonacci.`),
  putnam('PUTNAM-2021-B5', 2021, 'B', 5, 'Potencias de una matriz "muy impar"', 'Álgebra Lineal', String.raw`Se dice que una matriz de $n \times n$ con entradas enteras es muy impar si, para cada subconjunto no vacío $S$ de $\{1, 2, \dots, n\}$, la submatriz de $|S| \times |S|$ $(a_{ij})_{i,j\in S}$ tiene determinante impar. Demuestra que si $A$ es muy impar, entonces $A^k$ es muy impar para todo $k \ge 1$.`),
  putnam('PUTNAM-2021-B6', 2021, 'B', 6, 'Cota para el valor esperado tras recortar medianas', 'Probabilidad', String.raw`Dada una lista ordenada de $3N$ números reales, podemos recortarla para formar una lista de $N$ números de la siguiente manera: dividimos la lista en $N$ grupos de 3 números consecutivos, y dentro de cada grupo, descartamos el número más alto y el más bajo, conservando solo la mediana. Considera generar un número aleatorio $X$ mediante el siguiente procedimiento: comienza con una lista de $3^{2021}$ números, extraídos independiente y uniformemente al azar entre 0 y 1. Luego recorta esta lista como se definió anteriormente, dejando una lista de $3^{2020}$ números. Luego recorta nuevamente de forma repetida hasta que solo quede un número; sea $X$ este número. Sea $\mu$ el valor esperado de $|X - 1/2|$. Muestra que $\mu \ge \frac{1}{4} \left(\frac{2}{3}\right)^{2021}$.`),
]

const putnam2022 = [
  putnam('PUTNAM-2022-A1', 2022, 'A', 1, 'Recta tangente única a ln(1+x²)', 'Análisis', String.raw`Determina todos los pares ordenados de números reales $(a, b)$ tales que la recta $y = ax + b$ interseca a la curva $y = \ln(1+x^2)$ en exactamente un punto.`),
  putnam('PUTNAM-2022-A2', 2022, 'A', 2, 'Coeficientes negativos máximos de p(x)²', 'Álgebra', String.raw`Sea $n$ un entero con $n \ge 2$. Sobre todos los polinomios reales $p(x)$ de grado $n$, ¿cuál es el mayor número posible de coeficientes negativos de $p(x)^2$?`),
  putnam('PUTNAM-2022-A3', 2022, 'A', 3, 'Sucesiones módulo p y una congruencia módulo 5', 'Teoría de Números', String.raw`Sea $p$ un número primo mayor que 5. Sea $f(p)$ el número de sucesiones infinitas $a_1, a_2, a_3, \dots$ tales que $a_n \in \{1, 2, \dots, p-1\}$ y $a_n a_{n+2} \equiv 1 + a_{n+1} \pmod{p}$ para todo $n \ge 1$. Demuestra que $f(p)$ es congruente con 0 o 2 (mód 5).`),
  putnam('PUTNAM-2022-A4', 2022, 'A', 4, 'Valor esperado hasta la primera bajada', 'Probabilidad', String.raw`Supón que $X_1, X_2, \dots$ son números reales entre 0 y 1 elegidos independiente y uniformemente al azar. Sea $S = \sum_{i=1}^{k} X_i / 2^i$, donde $k$ es el menor entero positivo tal que $X_k < X_{k+1}$, o $k=\infty$ si no existe tal entero. Encuentra el valor esperado de $S$.`),
  putnam('PUTNAM-2022-A5', 2022, 'A', 5, 'Juego de fichas en una fila de 2022 casillas', 'Combinatoria', String.raw`Alice y Bob juegan un juego en un tablero que consiste en una fila de 2022 cuadrados consecutivos. Se turnan colocando fichas que cubren dos cuadrados adyacentes, jugando Alice primero. Por regla, una ficha no debe cubrir un cuadrado que ya esté cubierto por otra ficha. El juego termina cuando no se puede colocar ninguna ficha según esta regla. El objetivo de Alice es maximizar el número de cuadrados descubiertos cuando termina el juego; el objetivo de Bob es minimizarlo. ¿Cuál es el mayor número de cuadrados descubiertos que Alice puede asegurar al final del juego, sin importar cómo juegue Bob?`),
  putnam('PUTNAM-2022-A6', 2022, 'A', 6, 'Intervalos de potencias impares de longitud igual', 'Análisis', String.raw`Sea $n$ un entero positivo. Determina, en términos de $n$, el entero más grande $M$ con la siguiente propiedad: Existen números reales $x_1, \dots, x_{2n}$ con $-1 < x_1 < x_2 < \dots < x_{2n} < 1$ tales que la suma de las longitudes de los $n$ intervalos $[x_1^{2k-1}, x_2^{2k-1}], [x_3^{2k-1}, x_4^{2k-1}], \dots, [x_{2n-1}^{2k-1}, x_{2n}^{2k-1}]$ es igual a 1 para todos los enteros $k$ con $1 \le k \le m$.`),
  putnam('PUTNAM-2022-B1', 2022, 'B', 1, 'Coeficientes de e^{P(x)} todos distintos de cero', 'Análisis', String.raw`Supón que $P(x) = a_1 x + a_2 x^2 + \dots + a_n x^n$ es un polinomio con coeficientes enteros, con $a_1$ impar. Supón que $e^{P(x)} = b_0 + b_1 x + b_2 x^2 + \dots$ para todo $x$. Demuestra que $b_k$ es distinto de cero para todo $k \ge 0$.`),
  putnam('PUTNAM-2022-B2', 2022, 'B', 2, 'Conjuntos cerrados bajo el producto cruz', 'Álgebra Lineal', String.raw`Sea $\times$ el producto vectorial en $\mathbb{R}^3$. ¿Para qué enteros positivos $n$ existe un conjunto $S \subset \mathbb{R}^3$ con exactamente $n$ elementos tal que $S = \{v \times w : v, w \in S\}$?`),
  putnam('PUTNAM-2022-B3', 2022, 'B', 3, 'Recoloreo iterado por distancias repetidas', 'Combinatoria', String.raw`Asigna a cada número real positivo un color, rojo o azul. Sea $D$ el conjunto de todas las distancias $d > 0$ tales que hay dos puntos del mismo color a una distancia $d$ de separación. Recolorea los reales positivos de modo que los números en $D$ sean rojos y los números que no están en $D$ sean azules. Si iteramos el proceso de recoloración, ¿terminaremos siempre con todos los números rojos después de un número finito de pasos?`),
  putnam('PUTNAM-2022-B4', 2022, 'B', 4, 'Progresiones aritméticas cíclicas de tres términos', 'Combinatoria', String.raw`Encuentra todos los enteros $n$ con $n \ge 4$ para los cuales existe una sucesión de números reales distintos $x_1, \dots, x_n$ tal que cada uno de los conjuntos $\{x_1, x_2, x_3\}, \{x_2, x_3, x_4\}, \dots, \{x_{n-2}, x_{n-1}, x_n\}, \{x_{n-1}, x_n, x_1\}, \text{ y } \{x_n, x_1, x_2\}$ forma una progresión aritmética de 3 términos cuando se ordena de forma creciente.`),
  putnam('PUTNAM-2022-B5', 2022, 'B', 5, 'Valor más probable de una suma aleatoria', 'Probabilidad', String.raw`Para $0 \le p \le 1/2$, sean $X_1, X_2, \dots$ variables aleatorias independientes tales que $X_i = 1$ con probabilidad $p$, $-1$ con probabilidad $p$, y $0$ con probabilidad $1-2p$, para todo $i \ge 1$. Dado un entero positivo $n$ y enteros $b, a_1, \dots, a_n$, sea $P(b, a_1, \dots, a_n)$ la probabilidad de que $a_1 X_1 + \dots + a_n X_n = b$. ¿Para qué valores de $p$ se cumple que $P(0, a_1, \dots, a_n) \ge P(b, a_1, \dots, a_n)$ para todos los enteros positivos $n$ y todos los enteros $b, a_1, \dots, a_n$?`),
  putnam('PUTNAM-2022-B6', 2022, 'B', 6, 'Ecuación funcional f(xf(y)) + f(yf(x)) = 1 + f(x+y)', 'Álgebra', String.raw`Encuentra todas las funciones continuas $f: \mathbb{R}^+ \to \mathbb{R}^+$ tales que $f(x f(y)) + f(y f(x)) = 1 + f(x+y)$ para todo $x, y > 0$.`),
]

const putnam2023 = [
  putnam('PUTNAM-2023-A1', 2023, 'A', 1, 'Segunda derivada de un producto de cosenos', 'Análisis', String.raw`Para un entero positivo $n$, sea $f_n(x) = \cos(x) \cos(2x) \cos(3x) \dots \cos(nx)$. Encuentra el $n$ más pequeño tal que $|f_n''(0)| > 2023$.`),
  putnam('PUTNAM-2023-A2', 2023, 'A', 2, 'Un polinomio que satisface p(1/k) = k²', 'Álgebra', String.raw`Sea $n$ un entero positivo par. Sea $p$ un polinomio real mónico de grado $2n$; es decir, $p(x) = x^{2n} + a_{2n-1}x^{2n-1} + \dots + a_1 x + a_0$ para algunos coeficientes reales $a_0, \dots, a_{2n-1}$. Supón que $p(1/k) = k^2$ para todos los enteros $k$ tales que $1 \le |k| \le n$. Encuentra todos los demás números reales $x$ para los cuales $p(1/x) = x^2$.`),
  putnam('PUTNAM-2023-A3', 2023, 'A', 3, 'Menor cero de un par de funciones acopladas', 'Análisis', String.raw`Determina el número real positivo más pequeño tal que existen funciones diferenciables $f: \mathbb{R} \to \mathbb{R}$ y $g: \mathbb{R} \to \mathbb{R}$ que satisfacen (a) $f(0) > 0$, (b) $g(0) = 0$, (c) $|f'(x)| \le |g(x)|$ para todo $x$, (d) $|g'(x)| \le |f(x)|$ para todo $x$, y (e) $f(r) = 0$.`),
  putnam('PUTNAM-2023-A4', 2023, 'A', 4, 'Aproximación de vectores con combinaciones enteras de un icosaedro', 'Álgebra Lineal', String.raw`Sean $v_1, \dots, v_{12}$ vectores unitarios en $\mathbb{R}^3$ desde el origen hasta los vértices de un icosaedro regular. Muestra que para cada vector $v \in \mathbb{R}^3$ y cada $\epsilon > 0$, existen enteros $a_1, \dots, a_{12}$ tales que $||a_1 v_1 + \dots + a_{12} v_{12} - v|| < \epsilon$.`),
  putnam('PUTNAM-2023-A5', 2023, 'A', 5, 'Suma con signos alternantes en base 3', 'Teoría de Números', String.raw`Para un entero no negativo $k$, sea $f(k)$ el número de unos en la representación en base 3 de $k$. Encuentra todos los números complejos $z$ tales que $\sum_{k=0}^{3^{1010}-1} (-2)^{f(k)}(z+k)^{2023} = 0$.`),
  putnam('PUTNAM-2023-A6', 2023, 'A', 6, 'Juego de paridad eligiendo enteros', 'Combinatoria', String.raw`Alice y Bob juegan un juego en el que se turnan eligiendo enteros del 1 al $N$. Antes de que se elija cualquier entero, Bob selecciona una meta de "par" o "impar". En el primer turno, Alice elige uno de los $N$ enteros. En el segundo turno, Bob elige uno de los enteros restantes. Continúan eligiendo alternadamente uno de los enteros que aún no ha sido elegido, hasta el turno 12, que es forzado y termina el juego. Bob gana si la paridad de $\{k \mid \text{el número } k \text{ fue elegido en el turno } k\}$ coincide con su meta. ¿Para qué valores de $N$ tiene Bob una estrategia ganadora?`),
  putnam('PUTNAM-2023-B1', 2023, 'B', 1, 'Configuraciones alcanzables deslizando monedas', 'Combinatoria', String.raw`Considera una cuadrícula de $m \times n$ de cuadrados unitarios, indexados por $(i,j)$ con $1 \le i \le m$ y $1 \le j \le n$. Hay $(m-1)(n-1)$ monedas, que se colocan inicialmente en los cuadrados $(i,j)$ con $1 \le i \le m-1$ y $1 \le j \le n-1$. Si una moneda ocupa el cuadrado $(i,j)$ con $1 \le i \le m-1$ y $1 \le j \le n-1$ y los cuadrados $(i+1,j), (i,j+1), (i+1,j+1)$ están desocupados, un movimiento legal es deslizar la moneda de $(i,j)$ a $(i+1,j+1)$. ¿Cuántas configuraciones distintas de monedas se pueden alcanzar comenzando desde la configuración inicial mediante una secuencia (posiblemente vacía) de movimientos legales?`),
  putnam('PUTNAM-2023-B2', 2023, 'B', 2, 'Mínimo de unos en la representación binaria de 2023n', 'Teoría de Números', String.raw`Para cada entero positivo $n$, sea $k(n)$ el número de unos en la representación binaria de $2023 \cdot n$. ¿Cuál es el valor mínimo de $k(n)$?`),
  putnam('PUTNAM-2023-B3', 2023, 'B', 3, 'Longitud esperada de una subsucesión zigzag', 'Probabilidad', String.raw`Una sucesión $y_1, y_2, \dots, y_k$ de números reales se llama en zigzag si $k=1$, o si $y_2-y_1, y_3-y_2, \dots, y_k-y_{k-1}$ son distintos de cero y alternan en signo. Sean $X_1, X_2, \dots, X_n$ elegidos independientemente de la distribución uniforme en $[0,1]$. Sea $a(X_1, X_2, \dots, X_n)$ el valor más grande de $k$ para el cual existe una sucesión creciente de enteros $i_1, i_2, \dots, i_k$ tal que $X_{i_1}, X_{i_2}, \dots, X_{i_k}$ es en zigzag. Encuentra el valor esperado de $a(X_1, X_2, \dots, X_n)$ para $n \ge 2$.`),
  putnam('PUTNAM-2023-B4', 2023, 'B', 4, 'Menor T para alcanzar el valor 2023', 'Análisis', String.raw`Para un entero no negativo $n$ y una sucesión estrictamente creciente de números reales $t_0, t_1, \dots, t_n$, sea $f(t)$ la función de valor real correspondiente definida para $t \ge t_0$ por las siguientes propiedades: (a) $f(t)$ es continua para $t \ge t_0$ y es dos veces diferenciable para todo $t > t_0$ distinto de $t_1, \dots, t_n$; (b) $f(t_0) = 1/2$; (c) $\lim_{t \to t_k^+} f'(t) = 0$ para $0 \le k \le n$; (d) Para $0 \le k \le n-1$, tenemos $f''(t) = k+1$ cuando $t_k < t < t_{k+1}$, y $f''(t) = n+1$ cuando $t > t_n$. Considerando todas las elecciones de $n$ y $t_0, t_1, \dots, t_n$ tales que $t_k \ge t_{k-1} + 1$ para $1 \le k \le n$, ¿cuál es el valor más pequeño posible de $T$ para el cual $f(t_0 + T) = 2023$?`),
  putnam('PUTNAM-2023-B5', 2023, 'B', 5, 'Permutaciones que satisfacen π(π(k)) ≡ mk', 'Teoría de Números', String.raw`Determina qué enteros positivos $n$ tienen la siguiente propiedad: Para todos los enteros $M$ que son relativamente primos con $N$, existe una permutación $\pi: \{1, 2, \dots, n\} \to \{1, 2, \dots, n\}$ tal que $\pi(\pi(k)) \equiv mk \pmod{n}$ para todo $k \in \{1, 2, \dots, n\}$.`),
  putnam('PUTNAM-2023-B6', 2023, 'B', 6, 'Determinante de una matriz de conteo de soluciones', 'Álgebra Lineal', String.raw`Sea $n$ un entero positivo. Para $i$ y $j$ en $\{1, 2, \dots, n\}$, sea $s(i,j)$ el número de pares $(a,b)$ de enteros no negativos que satisfacen $ai + bj = n$. Sea $S$ la matriz de $n \times n$ cuya entrada $(i,j)$ es $s(i,j)$. Calcula el determinante de $S$.`),
]

const putnam2024 = [
  putnam('PUTNAM-2024-A1', 2024, 'A', 1, 'Enteros n con solución de 2aⁿ + 3bⁿ = 4cⁿ', 'Teoría de Números', String.raw`Determina todos los enteros positivos $n$ para los cuales existen enteros positivos $a, b$ y $c$ que satisfacen $2a^n + 3b^n = 4c^n$.`),
  putnam('PUTNAM-2024-A2', 2024, 'A', 2, 'Polinomios p con esta factorización de p(p(x)) − x', 'Álgebra', String.raw`¿Para qué polinomios reales $p$ existe un polinomio real $q$ tal que $p(p(x)) - x = (p(x) - x)^2 q(x)$ para todo $x$ real?`),
  putnam('PUTNAM-2024-A3', 2024, 'A', 3, 'Fracción de comparaciones en biyecciones ordenadas', 'Combinatoria', String.raw`Sea $S$ el conjunto de biyecciones $T: \{1, 2, 3\} \times \{1, 2, \dots, 2024\} \to \{1, 2, \dots, 6072\}$ tales que $T(1,j) < T(2,j) < T(3,j)$ para todo $j \in \{1, 2, \dots, 2024\}$ y $T(i,j) < T(i, j+1)$ para todo $i \in \{1, 2, 3\}$ y $j \in \{1, 2, \dots, 2023\}$. ¿Existen $a$ y $c$ en $\{1, 2, 3\}$ y $b$ y $d$ en $\{1, 2, \dots, 2024\}$ tales que la fracción de elementos $T$ en $S$ para los cuales $T(a,b) < T(c,d)$ es al menos $1/3$ y a lo más $2/3$?`),
  putnam('PUTNAM-2024-A4', 2024, 'A', 4, 'Reordenamiento de potencias con diferencia constante mod p', 'Teoría de Números', String.raw`Encuentra todos los primos $p > 5$ para los cuales existe un entero $a$ y un entero $r$ que satisfacen $1 \le r \le p-1$ con la siguiente propiedad: la sucesión $1, a, a^2, \dots, a^{p-5}$ se puede reordenar para formar una sucesión $b_0, b_1, b_2, \dots, b_{p-5}$ tal que $b_n - b_{n-1} - r$ es divisible por $p$ para $1 \le n \le p-5$.`),
  putnam('PUTNAM-2024-A5', 2024, 'A', 5, 'Radio que minimiza la intersección de una cuerda con un disco', 'Probabilidad', String.raw`Considera el círculo de radio 9 y centro en el origen $(0,0)$, y un disco de radio 1 y centro en $(r,0)$, donde $0 \le r \le 8$. Se eligen dos puntos $P$ y $Q$ independiente y uniformemente al azar en el círculo. ¿Qué valor(es) de $r$ minimizan la probabilidad de que la cuerda $\overline{PQ}$ interseque al disco?`),
  putnam('PUTNAM-2024-A6', 2024, 'A', 6, 'Determinante de una matriz de Hankel generada por una raíz cuadrada', 'Álgebra Lineal', String.raw`Sea $c_0, c_1, c_2, \dots$ una sucesión definida de modo que $\frac{1 - 3x - \sqrt{1 - 14x + 9x^2}}{4} = \sum_{k=0}^{\infty} c_k x^k$ para $x$ suficientemente pequeño. Para un entero positivo $n$, sea $A$ la matriz de $n \times n$ con entrada $(i,j)$ igual a $c_{i+j-1}$ para $i$ y $j$ en $\{1, \dots, n\}$. Encuentra el determinante de $A$.`),
  putnam('PUTNAM-2024-B1', 2024, 'B', 1, 'Selección de casillas con valores 1 a n', 'Combinatoria', String.raw`Sean $n$ y $k$ enteros positivos. El cuadrado en la $i$-ésima fila y $j$-ésima columna de una cuadrícula de $n \times n$ contiene el número $i+j-k$. ¿Para qué $n$ y $k$ es posible seleccionar $n$ cuadrados de la cuadrícula, sin que dos estén en la misma fila o columna, tales que los números contenidos en los cuadrados seleccionados sean exactamente $1, 2, \dots, n$?`),
  putnam('PUTNAM-2024-B2', 2024, 'B', 2, 'Sucesión infinita de cuadriláteros "socios"', 'Geometría', String.raw`Dos cuadriláteros convexos se llaman socios si tienen tres vértices en común y se pueden etiquetar como $ABCD$ y $ABCE$ de modo que $E$ sea la reflexión de $D$ a través de la mediatriz de la diagonal $\overline{AC}$. ¿Existe una sucesión infinita de cuadriláteros convexos tal que cada cuadrilátero sea socio de su sucesor y no haya dos elementos de la sucesión que sean congruentes?`),
  putnam('PUTNAM-2024-B3', 2024, 'B', 3, 'Cota en la diferencia entre raíces consecutivas de tan x = x', 'Análisis', String.raw`Sea $r_n$ la $n$-ésima solución positiva más pequeña de $\tan x = x$ donde el argumento de la tangente está en radianes. Demuestra que $0 < r_{n+1} - r_n - \pi < \frac{1}{(n^2+n)\pi}$ para $n \ge 1$.`),
  putnam('PUTNAM-2024-B4', 2024, 'B', 4, 'Límite del valor esperado de un paseo aleatorio acotado', 'Probabilidad', String.raw`Sea $n$ un entero positivo. Establece $a_{n,0} = 1$. Para $k \ge 0$, elige un entero $m_{n,k}$ uniformemente al azar del conjunto $\{1, \dots, n\}$, y sea $a_{n,k+1} = a_{n,k}+1$ si $m_{n,k} > a_{n,k}$; $a_{n,k}$ si $m_{n,k} = a_{n,k}$; y $a_{n,k}-1$ si $m_{n,k} < a_{n,k}$. Sea $E(n)$ el valor esperado de $a_{n,n}$. Determina $\lim_{n\to\infty} E(n)/n$.`),
  putnam('PUTNAM-2024-B5', 2024, 'B', 5, 'Polinomio de conteo con coeficientes no negativos', 'Combinatoria', String.raw`Sean $k$ y $m$ enteros positivos. Para un entero positivo $n$, sea $f(n)$ el número de sucesiones de enteros $x_1, \dots, x_k, y_1, \dots, y_m$ que satisfacen $1 \le x_1 \le \dots \le x_k \le z \le n$ y $1 \le y_1 \le \dots \le y_m \le z \le n$. Muestra que $f(n)$ se puede expresar como un polinomio en $n$ con coeficientes no negativos.`),
  putnam('PUTNAM-2024-B6', 2024, 'B', 6, 'Constante crítica para el crecimiento de F_a(x)', 'Análisis', String.raw`Para un número real $a$, sea $F_a(x) = \sum_{n \ge 1} n^a e^{2n} x^{n^2}$ para $0 \le x < 1$. Encuentra un número real $C$ tal que $\lim_{x \to 1^-} F_a(x) e^{-1/(1-x)} = 0$ para todo $a < C$ y $\lim_{x \to 1^-} F_a(x) e^{-1/(1-x)} = \infty$ para todo $a > C$.`),
]

const putnam2025 = [
  putnam('PUTNAM-2025-A1', 2025, 'A', 1, 'Coprimalidad eventual de una recursión de fracciones', 'Teoría de Números', String.raw`Sean $m_0$ y $n_0$ enteros positivos distintos. Para cada entero positivo $k$, define $m_k$ y $n_k$ como los enteros positivos relativamente primos tales que $\frac{m_k}{n_k} = \frac{2m_{k-1}+1}{2n_{k-1}+1}$. Demuestra que $2m_k+1$ y $2n_k+1$ son relativamente primos para todos los enteros positivos $k$ excepto un número finito de ellos.`),
  putnam('PUTNAM-2025-A2', 2025, 'A', 2, 'Cotas óptimas cuadráticas para sin x', 'Análisis', String.raw`Encuentra el número real más grande $a$ y el número real más pequeño $b$ tales que $ax(\pi-x) \le \sin x \le bx(\pi-x)$ para todo $x$ en el intervalo $[0, \pi]$.`),
  putnam('PUTNAM-2025-A3', 2025, 'A', 3, 'Juego de cadenas ternarias sin repetición', 'Combinatoria', String.raw`Alice y Bob juegan un juego con una cadena de $n$ dígitos, cada uno de los cuales está restringido a ser 0, 1 o 2. Inicialmente todos los dígitos son 0. Un movimiento legal es sumar o restar 1 de un dígito para crear una nueva cadena que no haya aparecido antes. Un jugador sin movimientos legales pierde, y el otro jugador gana. Alice juega primero, y los jugadores alternan turnos. Para cada $n \ge 1$, determina qué jugador tiene una estrategia que garantiza ganar.`),
  putnam('PUTNAM-2025-A4', 2025, 'A', 4, 'Tamaño mínimo de matrices con un patrón de conmutación cíclico', 'Álgebra Lineal', String.raw`Encuentra el valor mínimo de $k$ tal que existen matrices reales $A_1, \dots, A_{2025}$ de tamaño $k \times k$ con la propiedad de que $A_i A_j = A_j A_i$ si y solo si $|i-j| \in \{0, 1, 2024\}$.`),
  putnam('PUTNAM-2025-A5', 2025, 'A', 5, 'Signos que maximizan permutaciones ordenadas', 'Combinatoria', String.raw`Sea $n$ un entero con $n \ge 2$. Para una sucesión $s = (s_1, \dots, s_{n-1})$ donde cada $s_i = \pm 1$, sea $f(s)$ el número de permutaciones $(a_1, \dots, a_n)$ de $\{1, 2, \dots, n\}$ tales que $s_i(a_{i+1} - a_i) > 0$ para todo $i$. Para cada $n$, determina las sucesiones $s$ para las cuales $f(s)$ es máximo.`),
  putnam('PUTNAM-2025-A6', 2025, 'A', 6, 'Divisibilidad en una sucesión binaria recursiva', 'Teoría de Números', String.raw`Sea $b_0 = 0$ y, para $n \ge 0$, define $b_{n+1} = 2b_n + b_n + 1$. Para cada $k \ge 1$, muestra que $b_{2^{k+1}} - 2b_{2^k}$ es divisible por $2^{2k+2}$ pero no por $2^{2k+3}$.`),
  putnam('PUTNAM-2025-B1', 2025, 'B', 1, 'Coloración del plano cerrada bajo circuncentros', 'Geometría', String.raw`Supón que cada punto del plano está coloreado de rojo o verde, sujeto a la siguiente condición: Para cada tres puntos no colineales $A, B, C$ del mismo color, el centro del círculo que pasa por $A, B$ y $C$ también es de este color. Demuestra que todos los puntos del plano son del mismo color.`),
  putnam('PUTNAM-2025-B2', 2025, 'B', 2, 'Comparación de centroides de una región y su sólido de revolución', 'Análisis', String.raw`Sea $f: [0,1] \to [0, \infty)$ estrictamente creciente y continua. Sea $R$ la región acotada por $x=0$, $x=1$, $y=0$ e $y=f(x)$. Sea $x_1$ la coordenada $x$ del centroide de $R$. Sea $x_2$ la coordenada $x$ del centroide del sólido generado al rotar $R$ alrededor del eje $x$. Demuestra que $x_1 < x_2$.`),
  putnam('PUTNAM-2025-B3', 2025, 'B', 3, 'Conjunto cerrado bajo divisores de 2025ⁿ − 15ⁿ', 'Teoría de Números', String.raw`Supón que $S$ es un conjunto no vacío de enteros positivos con la propiedad de que si $n$ está en $S$, entonces todo divisor positivo de $2025^n - 15^n$ está en $S$. ¿Debe $S$ contener todos los enteros positivos?`),
  putnam('PUTNAM-2025-B4', 2025, 'B', 4, 'Cota de suma entre entradas no nulas en una matriz escalera', 'Combinatoria', String.raw`Para $n \ge 2$, sea $A = [a_{i,j}]_{i,j=1}^n$ una matriz de $n \times n$ de enteros no negativos tal que (a) $a_{i,j} = 0$ cuando $i+j \le n$, (b) $a_{i+1,j} \in \{a_{i,j}, a_{i,j}+1\}$ cuando $1 \le i \le n-1$ y $1 \le j \le n$, y (c) $a_{i,j+1} \in \{a_{i,j}, a_{i,j}+1\}$ cuando $1 \le i \le n$ y $1 \le j \le n-1$. Sea $S$ la suma de las entradas de $A$, y sea $N$ el número de entradas no nulas de $A$. Demuestra que $S \le \frac{(n+2)N}{3}$.`),
  putnam('PUTNAM-2025-B5', 2025, 'B', 5, 'Descensos del inverso modular', 'Teoría de Números', String.raw`Sea $p$ un número primo mayor que 3. Para cada $k \in \{1, \dots, p-1\}$, sea $I(k) \in \{1, 2, \dots, p-1\}$ tal que $k \cdot I(k) \equiv 1 \pmod{p}$. Demuestra que el número de enteros $k \in \{1, \dots, p-2\}$ tales que $I(k+1) < I(k)$ es mayor que $p/4 - 1$.`),
  putnam('PUTNAM-2025-B6', 2025, 'B', 6, 'Máxima constante r para un crecimiento tipo g(g(n))^r', 'Análisis', String.raw`Sea $\mathbb{N} = \{1, 2, 3, \dots\}$. Encuentra la constante real más grande tal que existe una función $g: \mathbb{N} \to \mathbb{N}$ tal que $g(n+1) - g(n) \ge (g(g(n)))^r$ para todo $n \in \mathbb{N}$.`),
]

export const problemas = [
  ...ommuPrimeraRonda,
  ...ommuNacional,
  ...putnam2021,
  ...putnam2022,
  ...putnam2023,
  ...putnam2024,
  ...putnam2025,
]
