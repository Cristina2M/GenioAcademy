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
    'Virus y Bacterias': [
        {
            'title': 'Agentes Infecciosos',
            'content': '<h3 class="text-2xl text-rose-400 font-bold mb-4">Microorganismos de Frontera</h3><p class="mb-4 text-slate-300 text-lg">Las bacterias son células completas, mientras que los virus necesitan infectar una célula para reproducirse. Ambos pueden viajar en meteoritos.</p>',
            'question': '¿Qué microorganismo NO se considera un ser vivo completo porque necesita una célula para replicarse?',
            'options': ['Virus', 'Bacteria', 'Hongo'],
            'answer': 'Virus'
        },
        {
            'title': 'Antibióticos y Defensas',
            'content': '<h3 class="text-2xl text-rose-400 font-bold mb-4">La Guerra Invisble</h3><p class="mb-4 text-slate-300 text-lg">Los antibióticos matan bacterias, pero no sirven contra los virus. Para los virus, usamos vacunas que entrenan a nuestro sistema inmune.</p>',
            'question': '¿Contra cuál de estos agentes es efectivo un antibiótico?',
            'options': ['Bacterias', 'Virus', 'Luz ultravioleta'],
            'answer': 'Bacterias'
        },
        {
            'title': 'Epidemias Interplanetarias',
            'content': '<h3 class="text-2xl text-rose-400 font-bold mb-4">Protocolos de Cuarentena</h3><p class="mb-4 text-slate-300 text-lg">Al llegar a un nuevo planeta, es vital desinfectar el equipo. Una sola bacteria terrestre podría alterar todo un ecosistema alienígena.</p>',
            'question': '¿Cómo se llama la propagación de una enfermedad a gran escala por todo un mundo?',
            'options': ['Pandemia', 'Simbiosis', 'Evolución'],
            'answer': 'Pandemia'
        }
    ],
    'Anatomía Alienígena': [
        {
            'title': 'Sistemas de Soporte Vital',
            'content': '<h3 class="text-2xl text-indigo-400 font-bold mb-4">Órganos y Funciones</h3><p class="mb-4 text-slate-300 text-lg">El cuerpo humano tiene sistemas (circulatorio, respiratorio, etc.). En otros mundos, estos órganos pueden estar basados en silicio en vez de carbono.</p>',
            'question': '¿Qué órgano es el motor principal del sistema circulatorio humano?',
            'options': ['Corazón', 'Pulmón', 'Cerebro'],
            'answer': 'Corazón'
        },
        {
            'title': 'El Esqueleto de Exo-Materia',
            'content': '<h3 class="text-2xl text-indigo-400 font-bold mb-4">Estructura y Movimiento</h3><p class="mb-4 text-slate-300 text-lg">Los huesos nos dan forma y protegen órganos. En planetas gaseosos, las especies podrían no tener huesos, sino flotar mediante sacos de gas.</p>',
            'question': '¿Cuál es la función principal del sistema óseo?',
            'options': ['Sostén y protección', 'Digestión', 'Pensamiento'],
            'answer': 'Sostén y protección'
        },
        {
            'title': 'Sentidos en el Vacío',
            'content': '<h3 class="text-2xl text-indigo-400 font-bold mb-4">Percepción Sensorial</h3><p class="mb-4 text-slate-300 text-lg">La vista y el oído dependen de la luz y el aire. En el espacio, otras especies podrían usar la ecolocalización o campos eléctricos.</p>',
            'question': '¿Cuál de estos sentidos depende de las vibraciones del aire para funcionar?',
            'options': ['Oído', 'Vista', 'Gusto'],
            'answer': 'Oído'
        }
    ],
    'Mesopotamia Antigüa': [
        {
            'title': 'La Cuna entre Ríos',
            'content': '<h3 class="text-2xl text-yellow-600 font-bold mb-4">Tigris y Éufrates</h3><p class="mb-4 text-slate-300 text-lg">Mesopotamia significa "tierra entre ríos". Aquí nacieron las primeras ciudades y la agricultura organizada de la humanidad.</p>',
            'question': '¿Entre qué dos ríos se encontraba la región de Mesopotamia?',
            'options': ['Tigris y Éufrates', 'Nilo y Jordán', 'Indo y Ganges'],
            'answer': 'Tigris y Éufrates'
        },
        {
            'title': 'El Origen de la Escritura',
            'content': '<h3 class="text-2xl text-yellow-600 font-bold mb-4">Tablillas Cuneiformes</h3><p class="mb-4 text-slate-300 text-lg">Los sumerios inventaron la escritura cuneiforme sobre arcilla para llevar cuentas de sus templos y graneros.</p>',
            'question': '¿Cómo se llama el primer sistema de escritura de la historia, nacido en Mesopotamia?',
            'options': ['Cuneiforme', 'Jeroglífico', 'Alfabeto'],
            'answer': 'Cuneiforme'
        },
        {
            'title': 'El Código de Hammurabi',
            'content': '<h3 class="text-2xl text-yellow-600 font-bold mb-4">Ojo por Ojo</h3><p class="mb-4 text-slate-300 text-lg">Fue uno de los primeros conjuntos de leyes escritas. Buscaba poner orden y justicia en las ciudades-estado.</p>',
            'question': '¿Qué rey de Babilonia es famoso por escribir su código de leyes en una estela de piedra?',
            'options': ['Hammurabi', 'Nabucodonosor', 'Gilgamesh'],
            'answer': 'Hammurabi'
        }
    ],
    'Antigua Grecia': [
        {
            'title': 'La Cuna de la Democracia',
            'content': '<h3 class="text-2xl text-blue-500 font-bold mb-4">Atenas y el Ágora</h3><p class="mb-4 text-slate-300 text-lg">En Grecia nació la idea de que los ciudadanos podían participar en las decisiones del gobierno.</p>',
            'question': '¿En qué ciudad griega nació el sistema democrático?',
            'options': ['Atenas', 'Esparta', 'Troya'],
            'answer': 'Atenas'
        },
        {
            'title': 'Filosofía y Ciencia',
            'content': '<h3 class="text-2xl text-blue-500 font-bold mb-4">Buscando la Verdad</h3><p class="mb-4 text-slate-300 text-lg">Sócrates, Platón y Aristóteles se preguntaban el porqué de las cosas, sentando las bases de toda la ciencia moderna.</p>',
            'question': '¿Cómo llamaban los griegos al "amor por la sabiduría"?',
            'options': ['Filosofía', 'Filantropía', 'Democracia'],
            'answer': 'Filosofía'
        },
        {
            'title': 'Dioses del Olimpo',
            'content': '<h3 class="text-2xl text-blue-500 font-bold mb-4">Mitos y Héroes</h3><p class="mb-4 text-slate-300 text-lg">Los griegos creían en dioses que vivían en el Monte Olimpo y que tenían pasiones muy parecidas a las humanas.</p>',
            'question': '¿Quién era el rey de los dioses en la mitología griega?',
            'options': ['Zeus', 'Poseidón', 'Hades'],
            'answer': 'Zeus'
        }
    ],
    'La Revolución Industrial': [
        {
            'title': 'El Vapor que movió el Mundo',
            'content': '<h3 class="text-2xl text-slate-400 font-bold mb-4">De la Granja a la Fábrica</h3><p class="mb-4 text-slate-300 text-lg">A finales del siglo XVIII, la invención de la máquina de vapor cambió todo. El trabajo manual fue sustituido por máquinas potentes.</p>',
            'question': '¿Qué invento fue el motor principal de la Primera Revolución Industrial?',
            'options': ['Máquina de vapor', 'Electricidad', 'Internet'],
            'answer': 'Máquina de vapor'
        },
        {
            'title': 'Crecimiento Urbano',
            'content': '<h3 class="text-2xl text-slate-400 font-bold mb-4">El Éxodo Rural</h3><p class="mb-4 text-slate-300 text-lg">Miles de personas dejaron el campo para trabajar en las nuevas fábricas de las ciudades, creando una nueva clase social: el proletariado.</p>',
            'question': '¿A dónde se mudó la mayoría de la población durante la Revolución Industrial?',
            'options': ['A las ciudades', 'A otros países', 'De vuelta al campo'],
            'answer': 'A las ciudades'
        },
        {
            'title': 'La Era del Carbón y el Hierro',
            'content': '<h3 class="text-2xl text-slate-400 font-bold mb-4">Nuevos Materiales</h3><p class="mb-4 text-slate-300 text-lg">El carbón se convirtió en el combustible del siglo XIX, alimentando trenes y barcos de vapor que conectaron el mundo.</p>',
            'question': '¿Cuál era el combustible principal de las máquinas de vapor?',
            'options': ['Carbón', 'Petróleo', 'Madera'],
            'answer': 'Carbón'
        }
    ],
    'Descubrimientos Geográficos': [
        {
            'title': 'Nuevas Rutas de Especias',
            'content': '<h3 class="text-2xl text-rose-300 font-bold mb-4">Exploradores del Océano</h3><p class="mb-4 text-slate-300 text-lg">En el siglo XV, los europeos buscaban rutas alternativas para llegar a las Indias y así conseguir especias preciosas.</p>',
            'question': '¿Qué buscaban principalmente los exploradores al navegar hacia el oeste?',
            'options': ['Especias y oro', 'Nuevos planetas', 'Hielo'],
            'answer': 'Especias y oro'
        },
        {
            'title': 'El Encuentro de Dos Mundos',
            'content': '<h3 class="text-2xl text-rose-300 font-bold mb-4">1492: El Gran Cambio</h3><p class="mb-4 text-slate-300 text-lg">Cristóbal Colón llegó a América pensando que estaba en Asia. Esto cambió la historia del mundo para siempre.</p>',
            'question': '¿En qué año llegó Cristóbal Colón a tierras americanas?',
            'options': ['1492', '1453', '1500'],
            'answer': '1492'
        },
        {
            'title': 'La Primera Vuelta al Mundo',
            'content': '<h3 class="text-2xl text-rose-300 font-bold mb-4">Magallanes y Elcano</h3><p class="mb-4 text-slate-300 text-lg">Esta expedición demostró por primera vez que la Tierra era redonda y que todos los océanos estaban conectados.</p>',
            'question': '¿Qué demostró la expedición de Magallanes y Elcano?',
            'options': ['Que la Tierra es redonda', 'Que existen las sirenas', 'Que el sol gira alrededor de la Tierra'],
            'answer': 'Que la Tierra es redonda'
        }
    ],
    'Primera Guerra Mundial': [
        {
            'title': 'La Gran Guerra',
            'content': '<h3 class="text-2xl text-stone-500 font-bold mb-4">Trincheras y Barro</h3><p class="mb-4 text-slate-300 text-lg">Fue un conflicto masivo que involucró a las principales potencias del mundo entre 1914 y 1918.</p>',
            'question': '¿En qué año comenzó la Primera Guerra Mundial?',
            'options': ['1914', '1918', '1939'],
            'answer': '1914'
        },
        {
            'title': 'Nuevas Tecnologías de Combate',
            'content': '<h3 class="text-2xl text-stone-500 font-bold mb-4">Tanques y Aviones</h3><p class="mb-4 text-slate-300 text-lg">Por primera vez se usaron armas químicas, tanques y aviación militar a gran escala, cambiando la forma de hacer la guerra.</p>',
            'question': '¿Cuál de estas tecnologías apareció por primera vez en este conflicto?',
            'options': ['Tanques de guerra', 'Drones', 'Misiles nucleares'],
            'answer': 'Tanques de guerra'
        },
        {
            'title': 'El Tratado de Versalles',
            'content': '<h3 class="text-2xl text-stone-500 font-bold mb-4">Un Final Tenso</h3><p class="mb-4 text-slate-300 text-lg">El tratado que puso fin a la guerra impuso duras condiciones a Alemania, lo que sembró las semillas de futuros conflictos.</p>',
            'question': '¿Cómo se llamó el tratado de paz que puso fin oficialmente a la Gran Guerra?',
            'options': ['Tratado de Versalles', 'Pacto de Varsovia', 'Tratado de Utrecht'],
            'answer': 'Tratado de Versalles'
        }
    ],
    'La Guerra Fría': [
        {
            'title': 'Un Mundo Dividido',
            'content': '<h3 class="text-2xl text-cyan-700 font-bold mb-4">El Telón de Acero</h3><p class="mb-4 text-slate-300 text-lg">Tras la 2ª Guerra Mundial, EE.UU. y la URSS compitieron por la influencia global sin llegar a un enfrentamiento directo.</p>',
            'question': '¿Quiénes fueron los dos principales rivales durante la Guerra Fría?',
            'options': ['EE.UU. y la URSS', 'Alemania y Francia', 'China y Japón'],
            'answer': 'EE.UU. y la URSS'
        },
        {
            'title': 'La Carrera Espacial',
            'content': '<h3 class="text-2xl text-cyan-700 font-bold mb-4">Mirando a las Estrellas</h3><p class="mb-4 text-slate-300 text-lg">La competencia entre superpotencias impulsó la llegada del hombre a la Luna y el nacimiento de las agencias espaciales.</p>',
            'question': '¿Qué hito marcó el punto culminante de la carrera espacial en 1969?',
            'options': ['Llegada a la Luna', 'Lanzamiento del Sputnik', 'Primer satélite artificial'],
            'answer': 'Llegada a la Luna'
        },
        {
            'title': 'La Caída del Muro',
            'content': '<h3 class="text-2xl text-cyan-700 font-bold mb-4">El Fin de una Era</h3><p class="mb-4 text-slate-300 text-lg">En 1989, la caída del Muro de Berlín simbolizó el colapso del bloque soviético y el fin de la tensión bipolar.</p>',
            'question': '¿Qué ciudad estaba dividida por un muro durante la Guerra Fría?',
            'options': ['Berlín', 'Londres', 'Moscú'],
            'answer': 'Berlín'
        }
    ],
    'El Sustantivo y Adjetivo': [
        {
            'title': 'Los Nombres de las Cosas',
            'content': '<h3 class="text-2xl text-blue-400 font-bold mb-4">Sustantivos Propios y Comunes</h3><p class="mb-4 text-slate-300 text-lg">El sustantivo es la palabra que usamos para nombrar personas, animales, objetos o planetas. "Nave" es común; "GenioAcademy" es propio.</p>',
            'question': '¿Qué tipo de sustantivo es "Marte"?',
            'options': ['Propio', 'Común', 'Abstracto'],
            'answer': 'Propio'
        },
        {
            'title': 'Dando Color al Cosmos',
            'content': '<h3 class="text-2xl text-blue-400 font-bold mb-4">El Adjetivo Calificativo</h3><p class="mb-4 text-slate-300 text-lg">Los adjetivos nos dicen cómo son los sustantivos. Una nave puede ser "rápida", "grande" o "plateada".</p>',
            'question': 'En la frase "El cohete veloz", ¿cuál es el adjetivo?',
            'options': ['Veloz', 'Cohete', 'El'],
            'answer': 'Veloz'
        },
        {
            'title': 'Género y Número Sideral',
            'content': '<h3 class="text-2xl text-blue-400 font-bold mb-4">Concordancia</h3><p class="mb-4 text-slate-300 text-lg">El sustantivo y el adjetivo deben ir siempre de la mano en género (masculino/femenino) y número (singular/plural). ¡No digas "el estrellas brilloso"!</p>',
            'question': '¿Cuál es la forma correcta de concordancia?',
            'options': ['Las naves espaciales', 'El naves espaciales', 'Las nave espacial'],
            'answer': 'Las naves espaciales'
        }
    ],
    'Acentuación Especial': [
        {
            'title': 'La Fuerza de la Sílaba',
            'content': '<h3 class="text-2xl text-indigo-300 font-bold mb-4">Agudas, Llanas y Esdrújulas</h3><p class="mb-4 text-slate-300 text-lg">Todas las palabras tienen una sílaba tónica (la que suena más fuerte). Dependiendo de dónde esté, la palabra tendrá tilde o no.</p>',
            'question': '¿En qué sílaba llevan el golpe de voz las palabras agudas?',
            'options': ['En la última', 'En la penúltima', 'En la antepenúltima'],
            'answer': 'En la última'
        },
        {
            'title': 'Reglas de Navegación Ortográfica',
            'content': '<h3 class="text-2xl text-indigo-300 font-bold mb-4">¿Cuándo poner Tilde?</h3><p class="mb-4 text-slate-300 text-lg">Las agudas llevan tilde si terminan en n, s o vocal. Las llanas, si NO terminan en n, s o vocal. ¡Las esdrújulas SIEMPRE llevan tilde!</p>',
            'question': '¿Por qué la palabra "Satélite" lleva tilde?',
            'options': ['Porque es esdrújula', 'Porque termina en vocal', 'Porque es aguda'],
            'answer': 'Porque es esdrújula'
        },
        {
            'title': 'Tildes Diacríticas',
            'content': '<h3 class="text-2xl text-indigo-300 font-bold mb-4">Pequeñas Diferencias, Grandes Significados</h3><p class="mb-4 text-slate-300 text-lg">A veces ponemos tilde para distinguir palabras que se escriben igual pero significan cosas distintas, como "tú" (persona) y "tu" (posesión).</p>',
            'question': '¿Qué palabra lleva tilde diacrítica para indicar afirmación?',
            'options': ['Sí', 'Si', 'Se'],
            'answer': 'Sí'
        }
    ],
    'Tipos de Texto': [
        {
            'title': 'Contar Historias',
            'content': '<h3 class="text-2xl text-violet-400 font-bold mb-4">El Texto Narrativo</h3><p class="mb-4 text-slate-300 text-lg">Narrar es contar sucesos que ocurren en un tiempo y lugar. Un diario de bitácora o una novela de ciencia ficción son textos narrativos.</p>',
            'question': '¿Cuál es el objetivo principal de un texto narrativo?',
            'options': ['Contar una historia', 'Explicar cómo funciona algo', 'Convencer de una opinión'],
            'answer': 'Contar una historia'
        },
        {
            'title': 'Manuales de Usuario',
            'content': '<h3 class="text-2xl text-violet-400 font-bold mb-4">El Texto Expositivo</h3><p class="mb-4 text-slate-300 text-lg">Sirve para informar sobre un tema de forma clara y objetiva. Esta misma lección es un ejemplo de texto expositivo.</p>',
            'question': '¿Qué tipo de texto usarías para explicar el funcionamiento de un motor de plasma?',
            'options': ['Expositivo', 'Narrativo', 'Poético'],
            'answer': 'Expositivo'
        },
        {
            'title': 'Debates Galácticos',
            'content': '<h3 class="text-2xl text-violet-400 font-bold mb-4">El Texto Argumentativo</h3><p class="mb-4 text-slate-300 text-lg">Usamos argumentos para defender una idea o convencer a alguien. "Deberíamos explorar Marte porque..." es el inicio de una argumentación.</p>',
            'question': '¿Qué elemento es esencial en un texto argumentativo?',
            'options': ['Razones y argumentos', 'Muchos personajes', 'Rimas'],
            'answer': 'Razones y argumentos'
        }
    ],
    'Sinónimos y Antónimos': [
        {
            'title': 'Palabras Gemelas',
            'content': '<h3 class="text-2xl text-sky-300 font-bold mb-4">Riqueza de Vocabulario</h3><p class="mb-4 text-slate-300 text-lg">Los sinónimos son palabras diferentes que significan lo mismo. "Rápido" y "veloz" son sinónimos.</p>',
            'question': '¿Cuál es un sinónimo de la palabra "Gélido"?',
            'options': ['Frío', 'Caliente', 'Húmedo'],
            'answer': 'Frío'
        },
        {
            'title': 'El Lado Opuesto',
            'content': '<h3 class="text-2xl text-sky-300 font-bold mb-4">Antónimos</h3><p class="mb-4 text-slate-300 text-lg">Los antónimos son palabras con significados contrarios. "Luz" y "oscuridad" son el ejemplo perfecto en el espacio.</p>',
            'question': '¿Cuál es el antónimo de "Ascender"?',
            'options': ['Descender', 'Subir', 'Flotar'],
            'answer': 'Descender'
        },
        {
            'title': 'Precisión de Sensores',
            'content': '<h3 class="text-2xl text-sky-300 font-bold mb-4">Elegir la Palabra Exacta</h3><p class="mb-4 text-slate-300 text-lg">En una academia de genios, usar la palabra precisa marca la diferencia. No es lo mismo un planeta "grande" que uno "gigantesco".</p>',
            'question': '¿Qué logramos al usar sinónimos en un texto?',
            'options': ['Evitar repeticiones', 'Confundir al lector', 'Hacerlo más corto'],
            'answer': 'Evitar repeticiones'
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
