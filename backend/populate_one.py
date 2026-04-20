import os
import django
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from courses.models import Course, Lesson, Exercise

COURSES_DATA = {
    'Sumas Galácticas': [
        {
            'title': 'El Contador de Estrellas',
            'content': '<h3 class="text-2xl text-purple-400 font-bold mb-4">Contando Astros</h3><p class="mb-4 text-slate-300 text-lg">Sumar es agrupar elementos. Si tienes 2 satélites y llegan 3 más, ahora tienes 5.</p><div class="bg-purple-900/30 p-4 rounded-xl border-l-4 border-purple-500"><p>✨ 2 + 3 = 5</p></div>',
            'question': 'Si en un sector hay 4 asteroides y detectamos 3 más, ¿cuántos hay en total?',
            'options': ['6', '7', '8'],
            'answer': '7'
        },
        {
            'title': 'Adiciones de Gran Alcance',
            'content': '<h3 class="text-2xl text-purple-400 font-bold mb-4">Miles de Luces</h3><p class="mb-4 text-slate-300 text-lg">Al sumar números grandes, trabajamos por columnas galácticas: unidades, decenas y centenas.</p>',
            'question': '¿Cuánto es 120 + 35?',
            'options': ['150', '155', '165'],
            'answer': '155'
        },
        {
            'title': 'Propiedades Galácticas',
            'content': '<h3 class="text-2xl text-purple-400 font-bold mb-4">El Orden no Altera el Cosmos</h3><p class="mb-4 text-slate-300 text-lg">La propiedad conmutativa dice que a + b = b + a. No importa si cuentas primero las estrellas rojas o las azules.</p>',
            'question': 'Si 10 + 5 = 15, ¿cuánto es 5 + 10?',
            'options': ['15', '20', '10'],
            'answer': '15'
        }
    ],
    'Restas Espaciales': [
        {
            'title': 'Evaporando Materia',
            'content': '<h3 class="text-2xl text-rose-400 font-bold mb-4">La Diferencia Estelar</h3><p class="mb-4 text-slate-300 text-lg">Restar es quitar una cantidad a otra. Si tenías 10 litros de combustible y gastas 4, te quedan 6.</p>',
            'question': 'Si un cohete tiene 5 motores y se averían 2, ¿cuántos motores le quedan operativos?',
            'options': ['3', '2', '4'],
            'answer': '3'
        },
        {
            'title': 'Restas con Llevada (Agujeros de Gusano)',
            'content': '<h3 class="text-2xl text-rose-400 font-bold mb-4">Pidiendo Prestado al Vecino</h3><p class="mb-4 text-slate-300 text-lg">Cuando la cifra de arriba es menor que la de abajo, pedimos una decena a la columna de al lado.</p>',
            'question': '¿Cuánto es 52 - 17?',
            'options': ['35', '45', '38'],
            'answer': '35'
        },
        {
            'title': 'Verificación de Sensores',
            'content': '<h3 class="text-2xl text-rose-400 font-bold mb-4">La Prueba Cósmica</h3><p class="mb-4 text-slate-300 text-lg">Puedes comprobar una resta sumando el resultado con lo que quitaste. Si volvemos al inicio, ¡es correcto!</p>',
            'question': 'Si 20 - 8 = 12, ¿cómo lo compruebas?',
            'options': ['12 + 8 = 20', '20 + 8 = 28', '12 - 8 = 4'],
            'answer': '12 + 8 = 20'
        }
    ],
    'Multiplicación Cuántica': [
        {
            'title': 'Clonación de Materia',
            'content': '<h3 class="text-2xl text-cyan-400 font-bold mb-4">Sumar Rápido</h3><p class="mb-4 text-slate-300 text-lg">Multiplicar es sumar el mismo número varias veces. 3 x 4 es lo mismo que 3+3+3+3.</p>',
            'question': 'Si tienes 4 cajas con 5 raciones de comida cada una, ¿cuántas raciones tienes?',
            'options': ['20', '15', '25'],
            'answer': '20'
        },
        {
            'title': 'Las Tablas de Navegación',
            'content': '<h3 class="text-2xl text-cyan-400 font-bold mb-4">Patrones Numéricos</h3><p class="mb-4 text-slate-300 text-lg">Dominar las tablas del 1 al 10 te permite calcular órbitas en milisegundos.</p>',
            'question': '¿Cuánto es 7 x 8?',
            'options': ['56', '54', '64'],
            'answer': '56'
        },
        {
            'title': 'Multiplicando por Cero y Uno',
            'content': '<h3 class="text-2xl text-cyan-400 font-bold mb-4">La Singularidad</h3><p class="mb-4 text-slate-300 text-lg">Cualquier número multiplicado por 0 es 0 (la nada). Multiplicado por 1, se queda igual (identidad).</p>',
            'question': '¿Cuánto es 450 x 0?',
            'options': ['0', '450', '1'],
            'answer': '0'
        }
    ],
    'División Cósmica': [
        {
            'title': 'Reparto Equitativo',
            'content': '<h3 class="text-2xl text-amber-400 font-bold mb-4">Justicia Galáctica</h3><p class="mb-4 text-slate-300 text-lg">Dividir es repartir una cantidad en partes iguales. Si tienes 10 gemas para 2 exploradores, cada uno recibe 5.</p>',
            'question': 'Tienes 12 cristales de energía y 3 naves. ¿Cuántos cristales le das a cada nave?',
            'options': ['4', '3', '6'],
            'answer': '4'
        },
        {
            'title': 'El Resto del Cargamento',
            'content': '<h3 class="text-2xl text-amber-400 font-bold mb-4">Divisiones Inexactas</h3><p class="mb-4 text-slate-300 text-lg">A veces sobra algo. Ese "algo" se llama resto. Si repartes 7 manzanas entre 3 personas, sobran 1.</p>',
            'question': 'Si divides 10 entre 3, ¿cuál es el resto?',
            'options': ['1', '0', '2'],
            'answer': '1'
        },
        {
            'title': 'La División por Cero',
            'content': '<h3 class="text-2xl text-amber-400 font-bold mb-4">¡Peligro: Agujero Negro!</h3><p class="mb-4 text-slate-300 text-lg">Nunca intentes dividir por cero. Es una operación imposible que rompería las leyes matemáticas del universo.</p>',
            'question': '¿Se puede dividir 50 entre 0?',
            'options': ['No, es imposible', 'Sí, da 0', 'Sí, da 50'],
            'answer': 'No, es imposible'
        }
    ],
    'Ecuaciones de 1er Grado': [
        {
            'title': 'El Misterio de la X',
            'content': '<h3 class="text-2xl text-violet-400 font-bold mb-4">La Incógnita Estelar</h3><p class="mb-4 text-slate-300 text-lg">Una ecuación es una balanza en equilibrio. La "X" es un valor oculto que debemos despejar para que ambos lados sigan pesando lo mismo.</p>',
            'question': 'En la ecuación X + 5 = 12, ¿cuánto vale X?',
            'options': ['7', '8', '5'],
            'answer': '7'
        },
        {
            'title': 'Despejando el Radier',
            'content': '<h3 class="text-2xl text-violet-400 font-bold mb-4">El Salto del Igual</h3><p class="mb-4 text-slate-300 text-lg">Cuando un número cruza el signo "=", cambia su operación: si estaba sumando, pasa restando; si multiplicaba, pasa dividiendo.</p>',
            'question': 'Si 2X = 10, ¿cuál es el siguiente paso para despejar X?',
            'options': ['X = 10 / 2', 'X = 10 - 2', 'X = 10 * 2'],
            'answer': 'X = 10 / 2'
        },
        {
            'title': 'Equilibrio de Antimateria',
            'content': '<h3 class="text-2xl text-violet-400 font-bold mb-4">Operaciones en Ambos Lados</h3><p class="mb-4 text-slate-300 text-lg">Lo que hagas a un lado del igual, DEBES hacerlo al otro. Si restas 3 a la izquierda, resta 3 a la derecha para no romper el equilibrio cósmico.</p>',
            'question': 'En 3X - 1 = 8, ¿cuánto vale 3X antes de despejar la X final?',
            'options': ['9', '7', '10'],
            'answer': '9'
        }
    ],
    'Fracciones Interestelares': [
        {
            'title': 'Partes de la Galaxia',
            'content': '<h3 class="text-2xl text-blue-400 font-bold mb-4">Numerador y Denominador</h3><p class="mb-4 text-slate-300 text-lg">Una fracción representa una parte de un todo. El denominador (abajo) dice en cuántas partes dividimos la pizza galáctica. El numerador (arriba) dice cuántas nos comemos.</p>',
            'question': 'En la fracción 3/4, ¿cuál es el denominador?',
            'options': ['4', '3', '7'],
            'answer': '4'
        },
        {
            'title': 'Fracciones Equivalentes',
            'content': '<h3 class="text-2xl text-blue-400 font-bold mb-4">Diferentes Formas, Misma Masa</h3><p class="mb-4 text-slate-300 text-lg">1/2 planeta es lo mismo que 2/4 de planeta. Aunque los números cambien, la cantidad de materia es la misma.</p>',
            'question': '¿Cuál de estas fracciones es equivalente a 1/2?',
            'options': ['2/4', '1/3', '2/3'],
            'answer': '2/4'
        },
        {
            'title': 'Suma de Fragmentos Cósmicos',
            'content': '<h3 class="text-2xl text-blue-400 font-bold mb-4">Mismo Denominador</h3><p class="mb-4 text-slate-300 text-lg">Si las partes son del mismo tamaño (mismo denominador), solo tienes que sumar los numeradores. ¡Fácil como contar estrellas!</p>',
            'question': '¿Cuánto es 1/5 + 2/5?',
            'options': ['3/5', '3/10', '2/5'],
            'answer': '3/5'
        }
    ],
    'Geometría de Órbitas': [
        {
            'title': 'Formas en el Vacío',
            'content': '<h3 class="text-2xl text-teal-400 font-bold mb-4">Puntos, Rectas y Planos</h3><p class="mb-4 text-slate-300 text-lg">La geometría estudia el espacio. Un punto es una coordenada, una recta es la trayectoria de un fotón y un plano es la superficie de un panel solar.</p>',
            'question': '¿Cómo se llama la línea que une el centro de un círculo con cualquier punto de su borde?',
            'options': ['Radio', 'Diámetro', 'Perímetro'],
            'answer': 'Radio'
        },
        {
            'title': 'Áreas de Campos de Fuerza',
            'content': '<h3 class="text-2xl text-teal-400 font-bold mb-4">Superficies Proyectadas</h3><p class="mb-4 text-slate-300 text-lg">Calcular el área es saber cuánto espacio ocupa una forma. Para un cuadrado, multiplicamos lado por lado.</p>',
            'question': '¿Cuál es el área de un cuadrado de lado 5 unidades?',
            'options': ['25', '20', '10'],
            'answer': '25'
        },
        {
            'title': 'Perímetros y Órbitas',
            'content': '<h3 class="text-2xl text-teal-400 font-bold mb-4">El Borde del Universo</h3><p class="mb-4 text-slate-300 text-lg">El perímetro es la longitud del contorno. Si caminas alrededor de un asteroide rectangular, la distancia total recorrida es su perímetro.</p>',
            'question': '¿Qué operación realizas para hallar el perímetro de un triángulo?',
            'options': ['Sumar sus tres lados', 'Multiplicar sus lados', 'Dividir la base por la altura'],
            'answer': 'Sumar sus tres lados'
        }
    ],
    'Polinomios Estelares': [
        {
            'title': 'Monomios de Energía',
            'content': '<h3 class="text-2xl text-orange-400 font-bold mb-4">Expresiones Simples</h3><p class="mb-4 text-slate-300 text-lg">Un monomio es un número y una letra pegados, como 3x. El número es el coeficiente y la letra es la parte literal.</p>',
            'question': 'En el monomio 5y, ¿cuál es el coeficiente?',
            'options': ['5', 'y', '5y'],
            'answer': '5'
        },
        {
            'title': 'Sumas de Términos Semejantes',
            'content': '<h3 class="text-2xl text-orange-400 font-bold mb-4">Agrupando Materia</h3><p class="mb-4 text-slate-300 text-lg">Solo puedes sumar monomios si tienen la misma letra. 2x + 3x = 5x. ¡Pero no puedes sumar 2x + 3y!</p>',
            'question': '¿Cuánto es 4a + 2a - a?',
            'options': ['5a', '6a', '4a'],
            'answer': '5a'
        },
        {
            'title': 'Grado de un Polinomio',
            'content': '<h3 class="text-2xl text-orange-400 font-bold mb-4">Nivel de Potencia</h3><p class="mb-4 text-slate-300 text-lg">El grado es el exponente más alto de la letra. En x² + 3x + 1, el grado es 2 porque el mayor exponente es el 2.</p>',
            'question': '¿Cuál es el grado del polinomio: x³ + 4x - 5?',
            'options': ['3', '1', '4'],
            'answer': '3'
        }
    ],
    'Leyes de la Termodinámica': [
        {
            'title': 'La Energía no Desaparece',
            'content': '<h3 class="text-2xl text-red-400 font-bold mb-4">Conservación Estelar</h3><p class="mb-4 text-slate-300 text-lg">La Primera Ley dice que la energía se transforma. El calor de una estrella puede convertirse en luz y movimiento.</p>',
            'question': '¿Qué dice la primera ley de la termodinámica?',
            'options': ['La energía se crea', 'La energía se transforma', 'La energía desaparece'],
            'answer': 'La energía se transforma'
        },
        {
            'title': 'El Frío Absoluto',
            'content': '<h3 class="text-2xl text-red-400 font-bold mb-4">Cero Kelvin</h3><p class="mb-4 text-slate-300 text-lg">A medida que bajamos la temperatura, los átomos se mueven menos. En el cero absoluto (-273°C), todo movimiento se detiene.</p>',
            'question': '¿A cuántos grados Celsius equivale aproximadamente el cero absoluto?',
            'options': ['-273°C', '0°C', '-100°C'],
            'answer': '-273°C'
        },
        {
            'title': 'Entropía y Caos',
            'content': '<h3 class="text-2xl text-red-400 font-bold mb-4">El Desorden del Universo</h3><p class="mb-4 text-slate-300 text-lg">La entropía siempre tiende a aumentar. El universo tiende al desorden a menos que apliquemos energía para organizarlo.</p>',
            'question': '¿Qué concepto mide el grado de desorden de un sistema?',
            'options': ['Entropía', 'Entalpía', 'Energía cinética'],
            'answer': 'Entropía'
        }
    ],
    'Electromagnetismo Básico': [
        {
            'title': 'Campos de Fuerza Reales',
            'content': '<h3 class="text-2xl text-yellow-400 font-bold mb-4">Magnetismo Planetario</h3><p class="mb-4 text-slate-300 text-lg">Ciertas piedras y el núcleo de algunos planetas atraen metales. Esto es debido a los campos magnéticos.</p>',
            'question': '¿Qué parte de la Tierra genera su campo magnético protector?',
            'options': ['El núcleo de hierro', 'La corteza rocosa', 'La atmósfera'],
            'answer': 'El núcleo de hierro'
        },
        {
            'title': 'Corriente Eléctrica',
            'content': '<h3 class="text-2xl text-yellow-400 font-bold mb-4">Flujo de Electrones</h3><p class="mb-4 text-slate-300 text-lg">La electricidad es el movimiento de electrones a través de un conductor, como el cable de cobre de una nave.</p>',
            'question': '¿Cómo se llama el material que permite que la electricidad pase fácilmente?',
            'options': ['Conductor', 'Aislante', 'Semiconductor'],
            'answer': 'Conductor'
        },
        {
            'title': 'Inducción Electromagnética',
            'content': '<h3 class="text-2xl text-yellow-400 font-bold mb-4">Generando Energía</h3><p class="mb-4 text-slate-300 text-lg">Si mueves un imán cerca de un cable, ¡generas electricidad! Así funcionan los generadores de nuestras estaciones espaciales.</p>',
            'question': '¿Qué ocurre al mover un imán dentro de una bobina de cable?',
            'options': ['Se genera corriente eléctrica', 'El imán pierde su fuerza', 'El cable se derrite'],
            'answer': 'Se genera corriente eléctrica'
        }
    ],
    'Cinemática': [
        {
            'title': 'Trayectorias de Vuelo',
            'content': '<h3 class="text-2xl text-indigo-400 font-bold mb-4">Posición y Tiempo</h3><p class="mb-4 text-slate-300 text-lg">La cinemática estudia el movimiento sin importar qué lo causa. Solo nos fijamos en dónde está la nave y cuánto tarda en llegar.</p>',
            'question': '¿Qué magnitud mide el espacio recorrido por unidad de tiempo?',
            'options': ['Velocidad', 'Aceleración', 'Inercia'],
            'answer': 'Velocidad'
        },
        {
            'title': 'El Empuje Final',
            'content': '<h3 class="text-2xl text-indigo-400 font-bold mb-4">Aceleración Constante</h3><p class="mb-4 text-slate-300 text-lg">Acelerar es cambiar la velocidad. Si tu nave va cada vez más rápido para escapar de un planeta, estás acelerando.</p>',
            'question': 'Si un vehículo espacial mantiene su velocidad constante, ¿cuál es su aceleración?',
            'options': ['Cero', 'Positiva', 'Negativa'],
            'answer': 'Cero'
        },
        {
            'title': 'Movimiento Rectilíneo',
            'content': '<h3 class="text-2xl text-indigo-400 font-bold mb-4">Líneas en el Vacío</h3><p class="mb-4 text-slate-300 text-lg">El movimiento más simple es en línea recta. En el espacio, sin obstáculos, la mayoría de los viajes son MRU (Movimiento Rectilíneo Uniforme).</p>',
            'question': 'En un MRU, ¿como es la velocidad?',
            'options': ['Constante', 'Variable', 'Siempre aumenta'],
            'answer': 'Constante'
        }
    ],
    'Relatividad Básica': [
        {
            'title': 'El Tiempo es Elástico',
            'content': '<h3 class="text-2xl text-fuchsia-400 font-bold mb-4">Dilatación Temporal</h3><p class="mb-4 text-slate-300 text-lg">Einstein descubrió que cuanto más rápido viajas, más lento pasa el tiempo para ti. ¡Esmeralda de 20 años podría ser más joven que su hermano menor tras un viaje luz!</p>',
            'question': '¿Qué ocurre con el tiempo a velocidades cercanas a la luz?',
            'options': ['Se acelera', 'Se ralentiza', 'Se detiene por completo'],
            'answer': 'Se ralentiza'
        },
        {
            'title': 'E = mc²',
            'content': '<h3 class="text-2xl text-fuchsia-400 font-bold mb-4">Energía y Masa</h3><p class="mb-4 text-slate-300 text-lg">La masa y la energía son dos caras de la misma moneda. Una pequeña cantidad de materia puede liberar una energía descomunal.</p>',
            'question': 'En la famosa ecuación de Einstein, ¿qué representa la letra "c"?',
            'options': ['Velocidad de la luz', 'Constante gravitatoria', 'Carga eléctrica'],
            'answer': 'Velocidad de la luz'
        },
        {
            'title': 'Curvatura del Espacio-Tiempo',
            'content': '<h3 class="text-2xl text-fuchsia-400 font-bold mb-4">La Gran Malla Cósmica</h3><p class="mb-4 text-slate-300 text-lg">La gravedad no es una fuerza de atracción mágica, sino la deformación que los planetas y estrellas causan en el tejido del universo.</p>',
            'question': '¿Cómo describe la relatividad general a la gravedad?',
            'options': ['Como una fuerza invisible', 'Como una curvatura del espacio-tiempo', 'Como una presión atmosférica'],
            'answer': 'Como una curvatura del espacio-tiempo'
        }
    ],
    'Óptica Espacial': [
        {
            'title': 'Mirando al Pasado',
            'content': '<h3 class="text-2xl text-cyan-300 font-bold mb-4">Luz y Telescopios</h3><p class="mb-4 text-slate-300 text-lg">Cuando miras una estrella lejana, estás viendo luz que salió de allí hace millones de años. ¡Los telescopios son máquinas del tiempo!</p>',
            'question': '¿Qué estamos viendo realmente cuando observamos una estrella a 100 años luz?',
            'options': ['Su estado actual', 'Cómo era hace 100 años', 'Su futuro'],
            'answer': 'Cómo era hace 100 años'
        },
        {
            'title': 'Refracción en Nebulosas',
            'content': '<h3 class="text-2xl text-cyan-300 font-bold mb-4">Desviación de la Trayectoria</h3><p class="mb-4 text-slate-300 text-lg">La luz cambia de dirección cuando pasa de un medio a otro (como del vacío a un gas denso). Esto crea espejismos cósmicos.</p>',
            'question': '¿Cómo se llama el fenómeno donde la luz cambia de dirección al cambiar de medio?',
            'options': ['Refracción', 'Reflexión', 'Difracción'],
            'answer': 'Refracción'
        },
        {
            'title': 'El Espectro Visible',
            'content': '<h3 class="text-2xl text-cyan-300 font-bold mb-4">Arcoíris de Datos</h3><p class="mb-4 text-slate-300 text-lg">La luz blanca es una mezcla de todos los colores. Al descomponerla, podemos saber de qué están hechas las estrellas lejanas.</p>',
            'question': '¿Qué instrumento se usa para separar la luz en sus colores componentes?',
            'options': ['Prisma', 'Espejo plano', 'Lente convergente'],
            'answer': 'Prisma'
        }
    ],
    'Dinámica de Fluidos': [
        {
            'title': 'Ríos de Plasma',
            'content': '<h3 class="text-2xl text-sky-400 font-bold mb-4">Líquidos y Gases en Movimiento</h3><p class="mb-4 text-slate-300 text-lg">En el espacio, los gases de las nebulosas se comportan como fluidos. Estudiar su presión y velocidad es clave para la navegación.</p>',
            'question': '¿Qué propiedad de un fluido mide su resistencia a fluir (espesor)?',
            'options': ['Viscosidad', 'Densidad', 'Volumen'],
            'answer': 'Viscosidad'
        },
        {
            'title': 'El Principio de Bernoulli',
            'content': '<h3 class="text-2xl text-sky-400 font-bold mb-4">Presión y Velocidad</h3><p class="mb-4 text-slate-300 text-lg">A mayor velocidad de un fluido, menor es su presión. Este principio ayuda a que las naves manioquen en atmósferas planetarias.</p>',
            'question': 'Si la velocidad de un fluido aumenta, ¿qué ocurre con su presión según Bernoulli?',
            'options': ['Disminuye', 'Aumenta', 'Se mantiene igual'],
            'answer': 'Disminuye'
        },
        {
            'title': 'Flujo Laminar vs Turbulento',
            'content': '<h3 class="text-2xl text-sky-400 font-bold mb-4">Caos en la Corriente</h3><p class="mb-4 text-slate-300 text-lg">Un flujo suave y ordenado es laminar. Si hay remolinos y desorden, es turbulento. ¡Evita las turbulencias en tu reentrada!</p>',
            'question': '¿Cómo se describe un flujo de fluido suave y ordenado en capas?',
            'options': ['Laminar', 'Turbulento', 'Estático'],
            'answer': 'Laminar'
        }
    ],
    'La Biosfera': [
        {
            'title': 'El Caparazón de la Vida',
            'content': '<h3 class="text-2xl text-emerald-400 font-bold mb-4">Ecosistemas Globales</h3><p class="mb-4 text-slate-300 text-lg">La biosfera es la capa de la Tierra donde se desarrolla la vida. Incluye desde las profundidades del océano hasta las nubes altas.</p>',
            'question': '¿Qué término define al conjunto de seres vivos y el medio físico donde habitan?',
            'options': ['Ecosistema', 'Población', 'Comunidad'],
            'answer': 'Ecosistema'
        },
        {
            'title': 'La Cadena Trófica',
            'content': '<h3 class="text-2xl text-emerald-400 font-bold mb-4">¿Quién se come a quién?</h3><p class="mb-4 text-slate-300 text-lg">La energía fluye de los productores (plantas) a los consumidores (animales). Sin productores, la vida en el planeta colapsaría.</p>',
            'question': '¿Cómo se llaman los organismos que fabrican su propio alimento?',
            'options': ['Productores', 'Descomponedores', 'Herbívoros'],
            'answer': 'Productores'
        },
        {
            'title': 'Fotosíntesis y Oxígeno',
            'content': '<h3 class="text-2xl text-emerald-400 font-bold mb-4">Fábricas de Aire Urbano</h3><p class="mb-4 text-slate-300 text-lg">Las plantas usan la luz solar para convertir CO2 en oxígeno. Este proceso es vital para mantener una atmósfera respirable.</p>',
            'question': '¿Qué gas absorben las plantas durante la fotosíntesis?',
            'options': ['Dióxido de Carbono (CO2)', 'Oxígeno (O2)', 'Nitrógeno'],
            'answer': 'Dióxido de Carbono (CO2)'
        }
    ],
    'Estructura de la Tierra': [
        {
            'title': 'Corazón de Hierro',
            'content': '<h3 class="text-2xl text-amber-500 font-bold mb-4">Núcleo y Manto</h3><p class="mb-4 text-slate-300 text-lg">La Tierra está dividida en capas. El núcleo es de hierro ardiente, el manto es de roca fundida y la corteza es donde pisamos.</p>',
            'question': '¿Qué capa es líquida y genera el campo magnético?',
            'options': ['Núcleo Externo', 'Corteza', 'Litosfera'],
            'answer': 'Núcleo Externo'
        },
        {
            'title': 'Placas en Movimiento',
            'content': '<h3 class="text-2xl text-amber-500 font-bold mb-4">Tectónica Planetaria</h3><p class="mb-4 text-slate-300 text-lg">La litosfera está fragmentada en placas tectónicas que flotan sobre el manto. Su choque crea montañas y terremotos.</p>',
            'question': '¿Qué fenómeno ocurre cuando dos placas chocan violentamente?',
            'options': ['Terremoto', 'Eclipses', 'Mareas bajas'],
            'answer': 'Terremoto'
        },
        {
            'title': 'Rocas del Abismo',
            'content': '<h3 class="text-2xl text-amber-500 font-bold mb-4">Igneas, Sedimentarias y Metamórficas</h3><p class="mb-4 text-slate-300 text-lg">Las rocas cambian con el tiempo. El magma se enfría en rocas ígneas, mientras que la presión crea las metamórficas.</p>',
            'question': '¿Cómo se llaman las rocas formadas por el enfriamiento del magma?',
            'options': ['Ígneas', 'Sedimentarias', 'Fósiles'],
            'answer': 'Ígneas'
        }
    ],
    'Célula Eucariota': [
        {
            'title': 'La Ciudad Microscópica',
            'content': '<h3 class="text-2xl text-green-400 font-bold mb-4">Núcleo y Organelos</h3><p class="mb-4 text-slate-300 text-lg">A diferencia de las bacterias, las células eucariotas tienen un núcleo que protege el ADN, como una caja fuerte biológica.</p>',
            'question': '¿Cuál es la función principal del núcleo celular?',
            'options': ['Proteger el ADN', 'Fabricar energía', 'Mover la célula'],
            'answer': 'Proteger el ADN'
        },
        {
            'title': 'Centrales de Energía',
            'content': '<h3 class="text-2xl text-green-400 font-bold mb-4">Mitocondrias</h3><p class="mb-4 text-slate-300 text-lg">Las mitocondrias son los motores de la célula. Queman nutrientes para dar la energía necesaria para vivir.</p>',
            'question': '¿Qué organelo se encarga de la respiración celular y obtención de energía?',
            'options': ['Mitocondria', 'Ribosoma', 'Vacuola'],
            'answer': 'Mitocondria'
        },
        {
            'title': 'Fábricas de Proteínas',
            'content': '<h3 class="text-2xl text-green-400 font-bold mb-4">Ribosomas y Retículo</h3><p class="mb-4 text-slate-300 text-lg">La célula construye sus propias piezas usando ribosomas. Es como tener una impresora 3D orgánica en cada célula.</p>',
            'question': '¿Qué estructura lee el código genético para fabricar proteínas?',
            'options': ['Ribosoma', 'Aparato de Golgi', 'Lisosoma'],
            'answer': 'Ribosoma'
        }
    ],
    'Reinos de la Naturaleza': [
        {
            'title': 'La Pirámide de la Vida',
            'content': '<h3 class="text-2xl text-lime-400 font-bold mb-4">Cinco Grandes Grupos</h3><p class="mb-4 text-slate-300 text-lg">Clasificamos la vida en Reinos según su estructura y alimentación: Animal, Vegetal, Fungi (hongos), Protista y Monera.</p>',
            'question': '¿A qué reino pertenecen los hongos?',
            'options': ['Fungi', 'Vegetal', 'Animal'],
            'answer': 'Fungi'
        },
        {
            'title': 'El Reino de las Plantas',
            'content': '<h3 class="text-2xl text-lime-400 font-bold mb-4">Autótrofos Fotovoltaicos</h3><p class="mb-4 text-slate-300 text-lg">Las plantas son seres vivos que fabrican su propio alimento mediante la fotosíntesis. Son la base de casi toda la vida.</p>',
            'question': '¿Cómo consiguen energía principalmente las plantas?',
            'options': ['Fotosíntesis', 'Comiendo insectos', 'Absorbiendo piedras'],
            'answer': 'Fotosíntesis'
        },
        {
            'title': 'Bacterias del Espacio Profundo',
            'content': '<h3 class="text-2xl text-lime-400 font-bold mb-4">El Reino Monera</h3><p class="mb-4 text-slate-300 text-lg">Las bacterias son las formas de vida más sencillas y antiguas. No tienen núcleo pero pueden sobrevivir en entornos extremos.</p>',
            'question': '¿Qué reino engloba a los organismos unicelulares sin núcleo (procariotas)?',
            'options': ['Monera', 'Protista', 'Fungi'],
            'answer': 'Monera'
        }
    ],
    'ADN Estelar': [
        {
            'title': 'El Libro de Instrucciones',
            'content': '<h3 class="text-2xl text-teal-400 font-bold mb-4">La Doble Hélice</h3><p class="mb-4 text-slate-300 text-lg">El ADN es una molécula larga que contiene toda la información para construir y operar un ser vivo. Tiene forma de escalera de caracol.</p>',
            'question': '¿Qué molécula contiene las instrucciones genéticas de los seres vivos?',
            'options': ['ADN', 'Proteína', 'Glúcido'],
            'answer': 'ADN'
        },
        {
            'title': 'Genes y Cromosomas',
            'content': '<h3 class="text-2xl text-teal-400 font-bold mb-4">Empaquetando Datos</h3><p class="mb-4 text-slate-300 text-lg">El ADN se organiza en paquetes llamados cromosomas. Los humanos tenemos 46, pero otras especies galácticas pueden tener cientos.</p>',
            'question': '¿Cómo se llaman los fragmentos de ADN que contienen la información para un carácter específico?',
            'options': ['Genes', 'Átomos', 'Células'],
            'answer': 'Genes'
        },
        {
            'title': 'Mutaciones en el Vacío',
            'content': '<h3 class="text-2xl text-teal-400 font-bold mb-4">Errores de Copiado</h3><p class="mb-4 text-slate-300 text-lg">A veces, al copiar el ADN, ocurren errores llamados mutaciones. La radiación espacial puede aumentar la frecuencia de estos cambios.</p>',
            'question': '¿Qué término define un cambio permanente en la secuencia de ADN?',
            'options': ['Mutación', 'Traducción', 'Replicación'],
            'answer': 'Mutación'
        }
    ],
    'Selección Natural': [
        {
            'title': 'Sobre vivencia del más Apto',
            'content': '<h3 class="text-2xl text-emerald-500 font-bold mb-4">La Teoría de Darwin</h3><p class="mb-4 text-slate-300 text-lg">Los individuos con características que les ayudan a sobrevivir en su entorno tienen más probabilidades de tener descendencia.</p>',
            'question': '¿Quién propuso la teoría de la evolución por selección natural?',
            'options': ['Charles Darwin', 'Gregor Mendel', 'Isaac Newton'],
            'answer': 'Charles Darwin'
        },
        {
            'title': 'Adaptaciones Extremas',
            'content': '<h3 class="text-2xl text-emerald-500 font-bold mb-4">Evolución en Otros Mundos</h3><p class="mb-4 text-slate-300 text-lg">Si un planeta tiene mucha gravedad, las especies evolucionarán con huesos más densos y fuertes para no ser aplastadas.</p>',
            'question': '¿Cómo se llama el proceso por el cual una especie se ajusta a su entorno?',
            'options': ['Adaptación', 'Extinción', 'Migración'],
            'answer': 'Adaptación'
        },
        {
            'title': 'El Ancestro Común',
            'content': '<h3 class="text-2xl text-emerald-500 font-bold mb-4">Árbol de la Vida</h3><p class="mb-4 text-slate-300 text-lg">Toda la vida en la Tierra (y quizás en otros rincones) comparte un ancestro común lejano del que todos descendemos.</p>',
            'question': '¿Qué indica que dos especies diferentes tengan ADN similar?',
            'options': ['Parentesco evolutivo', 'Que viven cerca', 'Es pura coincidencia'],
            'answer': 'Parentesco evolutivo'
        }
    ],
    'Egipto y los Faraones': [
        {
            'title': 'El Don del Nilo',
            'content': '<h3 class="text-2xl text-orange-300 font-bold mb-4">Vida en el Desierto</h3><p class="mb-4 text-slate-300 text-lg">Sin el río Nilo, la civilización egipcia no habría existido. Sus crecidas anuales fertilizaban la tierra para el cultivo.</p>',
            'question': '¿Qué río fue fundamental para el desarrollo del Antiguo Egipto?',
            'options': ['Nilo', 'Tigris', 'Eúfrates'],
            'answer': 'Nilo'
        },
        {
            'title': 'Pirámides y Eternidad',
            'content': '<h3 class="text-2xl text-orange-300 font-bold mb-4">Ingeniería para los Dioses</h3><p class="mb-4 text-slate-300 text-lg">Las pirámides eran tumbas monumentales para los faraones, diseñadas para durar para siempre y ayudarles en el más allá.</p>',
            'question': '¿Cuál era la función principal de las grandes pirámides?',
            'options': ['Tumbas reales', 'Graneros', 'Observatorios astronómicos'],
            'answer': 'Tumbas reales'
        },
        {
            'title': 'Jeroglíficos: El Código Sagrado',
            'content': '<h3 class="text-2xl text-orange-300 font-bold mb-4">Escritura en Piedra</h3><p class="mb-4 text-slate-300 text-lg">Los egipcios usaban dibujos llamados jeroglíficos para escribir. Fue un misterio hasta que se descubrió la Piedra de Rosetta.</p>',
            'question': '¿Cómo se llama el sistema de escritura basado en dibujos del Antiguo Egipto?',
            'options': ['Jeroglíficos', 'Cuneiforme', 'Alfabeto'],
            'answer': 'Jeroglíficos'
        }
    ],
    'El Imperio Romano': [
        {
            'title': 'Todos los Caminos llevan a Roma',
            'content': '<h3 class="text-2xl text-red-500 font-bold mb-4">La Gran Expansión</h3><p class="mb-4 text-slate-300 text-lg">Roma pasó de ser una pequeña ciudad a controlar todo el Mediterráneo gracias a su poderoso ejército y sus leyes.</p>',
            'question': '¿Qué mar llamaban los romanos "Mare Nostrum"?',
            'options': ['Mediterráneo', 'Rojo', 'Muerto'],
            'answer': 'Mediterráneo'
        },
        {
            'title': 'Ingeniería y Acueductos',
            'content': '<h3 class="text-2xl text-red-500 font-bold mb-4">Construyendo el Mundo</h3><p class="mb-4 text-slate-300 text-lg">Los romanos eran maestros ingenieros. Inventaron el hormigón y construyeron acueductos para llevar agua a las ciudades.</p>',
            'question': '¿Qué estructura romana se utilizaba para transportar agua a largas distancias?',
            'options': ['Acueducto', 'Circo', 'Termas'],
            'answer': 'Acueducto'
        },
        {
            'title': 'El Legado del Latín',
            'content': '<h3 class="text-2xl text-red-500 font-bold mb-4">La Lengua del Imperio</h3><p class="mb-4 text-slate-300 text-lg">El latín es el padre de muchas lenguas actuales como el español, francés e italiano. También es la base del derecho moderno.</p>',
            'question': '¿Cómo se llama el idioma que hablaban los antiguos romanos?',
            'options': ['Latín', 'Griego', 'Arameo'],
            'answer': 'Latín'
        }
    ],
    # I will add more courses as I go to avoid giant files in one turn
}

def populate(course_title):
    if course_title not in COURSES_DATA:
        print(f"No hay datos para {course_title}")
        return False
    
    try:
        course = Course.objects.get(title=course_title)
        course.lessons.all().delete()
        
        for i, data in enumerate(COURSES_DATA[course_title], 1):
            lesson = Lesson.objects.create(
                course=course,
                title=data['title'],
                content=data['content'],
                order=i
            )
            Exercise.objects.create(
                lesson=lesson,
                question=data['question'],
                options=data['options'],
                correct_answer=data['answer']
            )
        print(f"Course {course_title} populated successfully")
        return True
    except Exception as e:
        print(f"Error in {course_title}: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) > 1:
        populate(sys.argv[1])
    else:
        print("Uso: python populate_one.py 'Nombre del Curso'")
