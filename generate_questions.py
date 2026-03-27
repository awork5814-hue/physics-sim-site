import json, random, math
from pathlib import Path

random.seed(42)

TOPICS = [
    ("Kinematics", "Mechanics"),
    ("Newton's Laws", "Mechanics"),
    ("Work & Energy", "Mechanics"),
    ("Momentum", "Mechanics"),
    ("Circular Motion", "Mechanics"),
    ("Gravitation", "Mechanics"),
    ("Simple Harmonic Motion", "Mechanics"),
    ("Waves Basics", "Waves & Optics"),
    ("Sound", "Waves & Optics"),
    ("Light & Optics", "Waves & Optics"),
    ("Refraction & Lenses", "Waves & Optics"),
    ("Interference & Diffraction", "Waves & Optics"),
    ("Electricity Basics", "Electricity"),
    ("Series & Parallel", "Electricity"),
    ("Electric Power", "Electricity"),
    ("Magnetism", "Electricity"),
    ("Induction", "Electricity"),
    ("Thermal Energy", "Thermal"),
    ("Gas Laws", "Thermal"),
    ("Thermal Expansion", "Thermal"),
    ("Atomic Structure", "Modern Physics"),
    ("Nuclear Physics", "Modern Physics"),
    ("Relativity", "Modern Physics"),
    ("Quantum Basics", "Modern Physics"),
    ("Materials", "Mechanics"),
]

DIFFICULTY_COUNTS = {"Easy": 40, "Medium": 120, "Hard": 40}

TF_STATEMENTS = {
    "Kinematics": [("Velocity is the rate of change of displacement.", True), ("Acceleration has units of m/s.", False)],
    "Newton's Laws": [("Net force equals mass times acceleration.", True), ("If net force is zero, an object must be at rest.", False)],
    "Work & Energy": [("Work is the dot product of force and displacement.", True), ("Potential energy depends on the path taken.", False)],
    "Momentum": [("Momentum is conserved in an isolated system.", True), ("Impulse has units of Newtons only.", False)],
    "Circular Motion": [("Centripetal acceleration points toward the center.", True), ("Centripetal force can be zero for circular motion.", False)],
    "Gravitation": [("Gravitational force decreases with the square of distance.", True), ("All objects have the same weight on the Moon.", False)],
    "Simple Harmonic Motion": [("SHM has a restoring force proportional to displacement.", True), ("Amplitude affects the period of a simple pendulum for small angles.", False)],
    "Waves Basics": [("Wave speed equals frequency times wavelength.", True), ("Wavelength is measured in seconds.", False)],
    "Sound": [("Sound needs a medium to travel.", True), ("Sound travels fastest in gases.", False)],
    "Light & Optics": [("Light is an electromagnetic wave.", True), ("Refractive index is always less than 1.", False)],
    "Refraction & Lenses": [("A convex lens can form a real image.", True), ("For lenses, magnification is always positive.", False)],
    "Interference & Diffraction": [("Constructive interference occurs when path difference is mλ.", True), ("Diffraction is strongest when aperture is much larger than wavelength.", False)],
    "Electricity Basics": [("Current is the rate of flow of charge.", True), ("Voltage is measured in amperes.", False)],
    "Series & Parallel": [("Parallel circuits have the same voltage across branches.", True), ("Series circuits have the same current through each element.", True)],
    "Electric Power": [("Electrical power is P=IV.", True), ("Energy used is independent of time.", False)],
    "Magnetism": [("A moving charge experiences a magnetic force.", True), ("Magnetic field lines start and end on charges.", False)],
    "Induction": [("A changing magnetic flux induces emf.", True), ("Induced emf is zero if flux changes.", False)],
    "Thermal Energy": [("Heat flows from hot to cold.", True), ("Temperature and heat are the same thing.", False)],
    "Gas Laws": [("At constant temperature, PV is constant for a fixed amount of gas.", True), ("Doubling Kelvin temperature halves pressure at constant volume.", False)],
    "Thermal Expansion": [("Most materials expand when heated.", True), ("Expansion depends on temperature change only, not initial length.", False)],
    "Atomic Structure": [("Electrons occupy quantized energy levels.", True), ("The nucleus contains electrons.", False)],
    "Nuclear Physics": [("Half-life is the time for half the nuclei to decay.", True), ("Alpha particles are more penetrating than gamma rays.", False)],
    "Relativity": [("Time dilation increases with speed.", True), ("The speed of light depends on the observer.", False)],
    "Quantum Basics": [("de Broglie wavelength decreases as momentum increases.", True), ("Photons have zero energy.", False)],
    "Materials": [("Stress equals force divided by area.", True), ("Strain has units of newtons.", False)],
}

OPEN_PROMPTS = {
    "Kinematics": "Describe the difference between speed and velocity with a real-life example.",
    "Newton's Laws": "Explain Newton's third law and give an example.",
    "Work & Energy": "Explain conservation of energy and give a simple example.",
    "Momentum": "Explain momentum conservation in a collision.",
    "Circular Motion": "Explain why an object needs centripetal force to move in a circle.",
    "Gravitation": "Explain why weight changes between planets.",
    "Simple Harmonic Motion": "Describe the restoring force in SHM and how it causes oscillation.",
    "Waves Basics": "Explain wavelength, frequency, and how they relate to wave speed.",
    "Sound": "Describe how sound travels and why it cannot travel in vacuum.",
    "Light & Optics": "Explain refraction and give one everyday example.",
    "Refraction & Lenses": "Explain how a convex lens forms a real image.",
    "Interference & Diffraction": "Explain constructive vs destructive interference with an example.",
    "Electricity Basics": "Explain the difference between voltage and current.",
    "Series & Parallel": "Compare current and voltage in series vs parallel circuits.",
    "Electric Power": "Explain how electrical power relates to energy use.",
    "Magnetism": "Explain how a magnetic field affects a moving charge.",
    "Induction": "Explain electromagnetic induction in a simple generator.",
    "Thermal Energy": "Explain specific heat capacity and what it means physically.",
    "Gas Laws": "Explain Boyle's law in words.",
    "Thermal Expansion": "Explain why bridges need expansion gaps.",
    "Atomic Structure": "Explain the structure of the atom (nucleus + electrons).",
    "Nuclear Physics": "Explain what half-life means for radioactive decay.",
    "Relativity": "Explain time dilation in special relativity.",
    "Quantum Basics": "Explain the photoelectric effect in one paragraph.",
    "Materials": "Explain stress–strain behavior for elastic materials.",
}


def mcq(question, correct, unit="", sig=2):
    # create 4 choices with distractors
    val = float(correct)
    # round
    if abs(val) >= 1:
        val = round(val, sig)
    else:
        val = round(val, sig+1)
    # distractors
    deltas = [0.8, 1.2, 1.5]
    choices = [val * d for d in deltas]
    choices.append(val)
    # unique and sort-ish
    choices = list(dict.fromkeys([round(c, sig) for c in choices]))
    while len(choices) < 4:
        choices.append(round(val + random.uniform(-0.5, 0.5), sig))
    random.shuffle(choices)
    idx = choices.index(round(val, sig))
    choices_str = [f"{c} {unit}".strip() for c in choices]
    return {
        "question": question,
        "choices": choices_str,
        "answer": choices_str[idx],
        "answerIndex": idx,
    }


def tf(question, truth):
    return {"question": question, "answer": "True" if truth else "False"}


def open_q(question, answer):
    return {"question": question, "answer": answer}


# Template generators per topic

def gen_kinematics(diff):
    if diff == "Easy":
        u = random.randint(2, 20)
        a = random.randint(1, 5)
        t = random.randint(2, 6)
        v = u + a * t
        q = f"A cart starts at {u} m/s and accelerates at {a} m/s² for {t} s. What is its final speed?"
        return mcq(q, v, "m/s")
    if diff == "Medium":
        u = random.randint(0, 10)
        a = random.randint(1, 5)
        t = random.randint(2, 8)
        s = u * t + 0.5 * a * t * t
        q = f"A ball starts at {u} m/s with acceleration {a} m/s² for {t} s. How far does it travel?"
        return mcq(q, s, "m")
    # Hard
    v = random.randint(12, 30)
    a = random.randint(1, 5)
    s = random.randint(20, 80)
    u2 = v*v - 2*a*s
    u = math.sqrt(max(u2, 0))
    q = f"A runner reaches {v} m/s after accelerating {a} m/s² over {s} m. What was the initial speed?"
    return mcq(q, u, "m/s")


def gen_newton(diff):
    if diff == "Easy":
        m = random.randint(1, 10)
        a = random.randint(1, 6)
        q = f"A {m} kg block accelerates at {a} m/s². What is the net force?"
        return mcq(q, m*a, "N")
    if diff == "Medium":
        m = random.randint(2, 12)
        f1 = random.randint(10, 30)
        f2 = random.randint(5, 20)
        net = f1 - f2
        q = f"Two horizontal forces act on a {m} kg cart: {f1} N forward and {f2} N backward. What is its acceleration?"
        return mcq(q, net/m, "m/s²")
    f = random.randint(40, 80)
    mu = random.choice([0.2, 0.3, 0.4])
    m = random.randint(5, 15)
    g = 10
    net = f - mu*m*g
    q = f"A {m} kg block is pulled with {f} N on a rough surface (μ = {mu}). What is the acceleration? (g=10 m/s²)"
    return mcq(q, net/m, "m/s²")


def gen_energy(diff):
    if diff == "Easy":
        f = random.randint(5, 30)
        d = random.randint(2, 10)
        q = f"How much work is done by a {f} N force over {d} m?"
        return mcq(q, f*d, "J")
    if diff == "Medium":
        m = random.randint(1, 8)
        v = random.randint(4, 16)
        q = f"A {m} kg object moves at {v} m/s. What is its kinetic energy?"
        return mcq(q, 0.5*m*v*v, "J")
    h = random.randint(5, 25)
    m = random.randint(2, 10)
    g = 10
    q = f"A {m} kg mass is dropped from {h} m. Ignoring air resistance, what speed does it reach at the bottom?"
    v = math.sqrt(2*g*h)
    return mcq(q, v, "m/s")


def gen_momentum(diff):
    if diff == "Easy":
        m = random.randint(1, 6)
        v = random.randint(2, 12)
        q = f"A {m} kg object moves at {v} m/s. What is its momentum?"
        return mcq(q, m*v, "kg·m/s")
    if diff == "Medium":
        f = random.randint(10, 50)
        t = random.randint(2, 6)
        q = f"A force of {f} N acts for {t} s. What impulse is delivered?"
        return mcq(q, f*t, "N·s")
    m1 = random.randint(1, 5)
    v1 = random.randint(4, 10)
    m2 = random.randint(1, 5)
    v2 = random.randint(1, 6)
    vf = (m1*v1 + m2*v2)/(m1+m2)
    q = f"Two carts (m1={m1} kg at {v1} m/s, m2={m2} kg at {v2} m/s) stick together. Final speed?"
    return mcq(q, vf, "m/s")


def gen_circular(diff):
    if diff == "Easy":
        v = random.randint(4, 12)
        r = random.randint(2, 8)
        q = f"An object moves at {v} m/s in a circle of radius {r} m. Centripetal acceleration?"
        return mcq(q, v*v/r, "m/s²")
    if diff == "Medium":
        m = random.randint(1, 6)
        v = random.randint(5, 15)
        r = random.randint(2, 8)
        q = f"A {m} kg mass moves at {v} m/s in a circle of radius {r} m. Centripetal force?"
        return mcq(q, m*v*v/r, "N")
    r = random.randint(2, 10)
    v = random.randint(6, 18)
    q = f"A satellite moves at {v} m/s in a circle of radius {r} m. What is the period?"
    T = 2*math.pi*r/v
    return mcq(q, T, "s")


def gen_gravity(diff):
    if diff == "Easy":
        m = random.randint(1, 20)
        g = 10
        q = f"What is the weight of a {m} kg object on Earth? (g=10 m/s²)"
        return mcq(q, m*g, "N")
    if diff == "Medium":
        m1 = random.randint(1, 5)
        m2 = random.randint(1, 5)
        r = random.randint(2, 8)
        G = 6.67e-11
        F = G*m1*m2/(r*r)
        q = f"Two masses {m1} kg and {m2} kg are {r} m apart. What is the gravitational force?"
        return mcq(q, F, "N", sig=3)
    M = 6.0e24
    r = 6.4e6
    G = 6.67e-11
    v = math.sqrt(2*G*M/r)
    q = "Estimate the escape speed from Earth (M≈6.0×10^24 kg, R≈6.4×10^6 m)."
    return mcq(q, v, "m/s", sig=2)


def gen_shm(diff):
    if diff == "Easy":
        m = random.randint(1, 5)
        k = random.randint(50, 200)
        T = 2*math.pi*math.sqrt(m/k)
        q = f"A {m} kg mass on a spring (k={k} N/m). What is the period?"
        return mcq(q, T, "s")
    if diff == "Medium":
        L = random.randint(1, 4)
        g = 10
        T = 2*math.pi*math.sqrt(L/g)
        q = f"A simple pendulum of length {L} m. What is its period? (g=10 m/s²)"
        return mcq(q, T, "s")
    A = random.randint(2, 8)/10
    w = random.randint(2, 5)
    vmax = A*w
    q = f"A particle in SHM has amplitude {A} m and angular frequency {w} rad/s. What is vmax?"
    return mcq(q, vmax, "m/s")


def gen_waves(diff):
    if diff == "Easy":
        f = random.randint(2, 10)
        lam = random.randint(1, 5)
        v = f*lam
        q = f"A wave has frequency {f} Hz and wavelength {lam} m. What is its speed?"
        return mcq(q, v, "m/s")
    if diff == "Medium":
        v = random.randint(10, 40)
        f = random.randint(2, 8)
        lam = v/f
        q = f"A wave travels at {v} m/s with frequency {f} Hz. What is its wavelength?"
        return mcq(q, lam, "m")
    f = random.randint(1, 6)
    T = 1/f
    q = f"A wave has frequency {f} Hz. What is its period?"
    return mcq(q, T, "s")


def gen_sound(diff):
    if diff == "Easy":
        t = random.randint(2, 6)
        v = 340
        d = v*t/2
        q = f"An echo is heard {t} s after a shout. How far is the wall? (v=340 m/s)"
        return mcq(q, d, "m")
    if diff == "Medium":
        v = 340
        lam = random.randint(1, 4)
        f = v/lam
        q = f"Sound in air has wavelength {lam} m. What is its frequency? (v=340 m/s)"
        return mcq(q, f, "Hz")
    I = random.choice([1e-6, 1e-5, 1e-4])
    I0 = 1e-12
    L = 10*math.log10(I/I0)
    q = f"What is the sound level for intensity {I:.0e} W/m²? (I0=1×10^-12)"
    return mcq(q, L, "dB")


def gen_light(diff):
    if diff == "Easy":
        n = random.choice([1.3, 1.5, 2.0])
        c = 3e8
        v = c/n
        q = f"Light enters a medium with refractive index {n}. What is its speed?"
        return mcq(q, v, "m/s", sig=3)
    if diff == "Medium":
        f = random.randint(4, 8)*1e14
        c = 3e8
        lam = c/f
        q = f"Light has frequency {f:.0e} Hz. What is its wavelength in vacuum?"
        return mcq(q, lam, "m", sig=3)
    n1 = 1.5
    n2 = 1.0
    critical = math.degrees(math.asin(n2/n1))
    q = "What is the critical angle for light going from glass (n=1.5) to air (n=1.0)?"
    return mcq(q, critical, "deg")


def gen_lens(diff):
    if diff == "Easy":
        f = random.randint(10, 30)
        u = random.choice([x for x in range(20, 61) if x != f])
        v = 1/(1/f - 1/u)
        q = f"A convex lens has f={f} cm and object distance u={u} cm. Find image distance v."
        return mcq(q, v, "cm")
    if diff == "Medium":
        f = random.randint(8, 20)
        v = random.choice([x for x in range(15, 41) if x != f])
        u = 1/(1/f - 1/v)
        q = f"A lens has f={f} cm and image distance v={v} cm. What is object distance u?"
        return mcq(q, u, "cm")
    u = random.randint(20, 50)
    v = random.randint(20, 50)
    m = v/u
    q = f"An image forms at v={v} cm for an object at u={u} cm. What is magnification?"
    return mcq(q, m, "")


def gen_interference(diff):
    if diff == "Easy":
        lam = random.randint(400, 700)*1e-9
        L = random.randint(1, 3)
        d = random.randint(1, 3)*1e-3
        fringe = lam*L/d
        q = f"Double-slit: λ={lam:.0e} m, L={L} m, slit spacing d={d:.0e} m. Fringe spacing?"
        return mcq(q, fringe, "m", sig=3)
    if diff == "Medium":
        m = random.randint(1, 3)
        lam = random.randint(500, 650)*1e-9
        q = f"For order m={m}, what path difference gives constructive interference? (λ={lam:.0e} m)"
        return mcq(q, m*lam, "m", sig=3)
    d = random.randint(1, 5)*1e-6
    L = random.randint(1, 3)
    x = random.randint(1, 6)*1e-3
    lam = x*d/L
    q = f"Interference: fringe spacing x={x:.0e} m at screen distance L={L} m with slit spacing d={d:.0e} m. Find λ."
    return mcq(q, lam, "m", sig=3)


def gen_electric(diff):
    if diff == "Easy":
        V = random.randint(6, 24)
        I = random.randint(1, 6)
        R = V/I
        q = f"A current of {I} A flows with potential {V} V. What is resistance?"
        return mcq(q, R, "Ω")
    if diff == "Medium":
        V = random.randint(6, 24)
        R = random.randint(2, 12)
        I = V/R
        q = f"A {R} Ω resistor is connected to {V} V. What current flows?"
        return mcq(q, I, "A")
    P = random.randint(20, 100)
    V = random.randint(6, 24)
    I = P/V
    q = f"A device uses {P} W at {V} V. What current does it draw?"
    return mcq(q, I, "A")


def gen_series_parallel(diff):
    if diff == "Easy":
        r1 = random.randint(2, 8)
        r2 = random.randint(2, 8)
        q = f"Two resistors {r1} Ω and {r2} Ω in series. Equivalent resistance?"
        return mcq(q, r1+r2, "Ω")
    if diff == "Medium":
        r1 = random.randint(2, 8)
        r2 = random.randint(2, 8)
        req = 1/(1/r1 + 1/r2)
        q = f"Two resistors {r1} Ω and {r2} Ω in parallel. Equivalent resistance?"
        return mcq(q, req, "Ω")
    r1 = random.randint(2, 8)
    r2 = random.randint(2, 8)
    r3 = random.randint(2, 8)
    req = r1 + 1/(1/r2 + 1/r3)
    q = f"R1={r1} Ω in series with (R2={r2} Ω || R3={r3} Ω). Find equivalent resistance."
    return mcq(q, req, "Ω")


def gen_power(diff):
    if diff == "Easy":
        V = random.randint(6, 24)
        I = random.randint(1, 6)
        q = f"A circuit has V={V} V and I={I} A. Power?"
        return mcq(q, V*I, "W")
    if diff == "Medium":
        P = random.randint(40, 200)
        t = random.randint(2, 8)
        E = P*t
        q = f"A {P} W device runs for {t} s. Energy used?"
        return mcq(q, E, "J")
    R = random.randint(2, 10)
    I = random.randint(2, 6)
    P = I*I*R
    q = f"Current {I} A flows through {R} Ω. What is power?"
    return mcq(q, P, "W")


def gen_magnetism(diff):
    if diff == "Easy":
        B = random.choice([0.2, 0.4, 0.6])
        I = random.randint(2, 6)
        L = random.randint(1, 4)
        F = B*I*L
        q = f"A wire of length {L} m carries {I} A in B={B} T. What magnetic force?"
        return mcq(q, F, "N")
    if diff == "Medium":
        B = random.choice([0.2, 0.3, 0.5])
        A = random.randint(2, 6)*1e-3
        flux = B*A
        q = f"A coil of area {A:.0e} m² in a {B} T field. Magnetic flux?"
        return mcq(q, flux, "Wb", sig=3)
    I = random.randint(3, 8)
    r = random.randint(5, 15)*1e-2
    B = (4e-7*math.pi*I)/(2*r)
    q = f"A long straight wire carries {I} A. Find B at distance {r:.2f} m."
    return mcq(q, B, "T", sig=3)


def gen_induction(diff):
    if diff == "Easy":
        N = random.randint(50, 200)
        dphi = random.randint(2, 8)*1e-3
        dt = random.randint(1, 4)
        emf = N*dphi/dt
        q = f"A {N}-turn coil has flux change {dphi:.0e} Wb in {dt} s. Induced emf?"
        return mcq(q, emf, "V")
    if diff == "Medium":
        B = random.choice([0.2, 0.4, 0.6])
        A = random.randint(2, 6)*1e-3
        dt = random.randint(1, 3)
        emf = B*A/dt
        q = f"A loop area {A:.0e} m² in B={B} T is removed in {dt} s. emf?"
        return mcq(q, emf, "V")
    N = random.randint(100, 500)
    B = random.choice([0.2, 0.4, 0.8])
    A = random.randint(2, 8)*1e-3
    dt = random.randint(1, 5)
    emf = N*B*A/dt
    q = f"A {N}-turn coil, area {A:.0e} m², B drops from {B} T to 0 in {dt} s. emf?"
    return mcq(q, emf, "V")


def gen_thermal(diff):
    if diff == "Easy":
        m = random.randint(1, 5)
        c = random.randint(300, 800)
        dT = random.randint(5, 20)
        Q = m*c*dT
        q = f"A {m} kg material with c={c} J/kg·°C heats by {dT}°C. Heat gained?"
        return mcq(q, Q, "J")
    if diff == "Medium":
        m = random.randint(1, 4)
        L = random.randint(2, 5)*1e5
        Q = m*L
        q = f"How much energy to melt {m} kg with L={L:.0e} J/kg?"
        return mcq(q, Q, "J", sig=3)
    P = random.randint(200, 800)
    t = random.randint(30, 120)
    E = P*t
    q = f"A heater of {P} W runs for {t} s. Energy delivered?"
    return mcq(q, E, "J")


def gen_gas(diff):
    if diff == "Easy":
        P1 = random.randint(1, 3)
        V1 = random.randint(2, 6)
        V2 = random.randint(2, 6)
        P2 = P1*V1/V2
        q = f"Boyle's law: P1={P1} atm, V1={V1} L, V2={V2} L. Find P2."
        return mcq(q, P2, "atm")
    if diff == "Medium":
        n = random.randint(1, 3)
        R = 8.31
        T = random.randint(250, 350)
        V = random.randint(5, 12)
        P = n*R*T/V
        q = f"Ideal gas: n={n} mol, T={T} K, V={V} m³. Find P."
        return mcq(q, P, "Pa", sig=3)
    P = random.randint(1, 3)
    V = random.randint(2, 6)
    T = random.randint(250, 350)
    q = f"A gas has P={P} atm, V={V} L at T={T} K. If T doubles (V constant), new pressure?"
    return mcq(q, 2*P, "atm")


def gen_expansion(diff):
    if diff == "Easy":
        L = random.randint(1, 5)
        a = random.choice([1.2e-5, 2.0e-5])
        dT = random.randint(10, 40)
        dL = a*L*dT
        q = f"A rod of {L} m, α={a:.1e} /°C, ΔT={dT}°C. Find ΔL."
        return mcq(q, dL, "m", sig=3)
    if diff == "Medium":
        L = random.randint(1, 4)
        a = random.choice([1.2e-5, 2.3e-5])
        dL = random.randint(1, 6)*1e-3
        dT = dL/(a*L)
        q = f"A rod L={L} m, α={a:.1e} /°C expands by {dL:.0e} m. Find ΔT."
        return mcq(q, dT, "°C")
    a = random.choice([1.2e-5, 2.3e-5])
    L = random.randint(1, 4)
    dT = random.randint(20, 60)
    q = f"A rod L={L} m, α={a:.1e} /°C, ΔT={dT}°C. New length?"
    return mcq(q, L*(1+a*dT), "m", sig=4)


def gen_atomic(diff):
    if diff == "Easy":
        n = random.randint(1, 4)
        E = -13.6/(n*n)
        q = f"Hydrogen energy level for n={n}?"
        return mcq(q, E, "eV")
    if diff == "Medium":
        f = random.randint(4, 8)*1e14
        h = 6.63e-34
        E = h*f
        q = f"Photon energy for f={f:.0e} Hz?"
        return mcq(q, E, "J", sig=3)
    f = random.randint(4, 8)*1e14
    c = 3e8
    lam = c/f
    q = f"Photon frequency {f:.0e} Hz. Wavelength?"
    return mcq(q, lam, "m", sig=3)


def gen_nuclear(diff):
    if diff == "Easy":
        N0 = random.randint(100, 400)
        t_half = random.randint(2, 6)
        t = t_half
        N = N0/2
        q = f"A sample has N0={N0}. After one half-life ({t_half} h), how many remain?"
        return mcq(q, N, "")
    if diff == "Medium":
        N0 = random.randint(200, 800)
        t_half = random.randint(2, 6)
        t = 2*t_half
        N = N0/4
        q = f"After two half-lives ({t} h), how many remain if N0={N0}?"
        return mcq(q, N, "")
    N0 = random.randint(400, 900)
    t_half = random.randint(2, 6)
    t = 3*t_half
    N = N0/8
    q = f"After three half-lives ({t} h), how many remain if N0={N0}?"
    return mcq(q, N, "")


def gen_relativity(diff):
    if diff == "Easy":
        v = random.choice([0.6, 0.8, 0.9])
        c = 1
        gamma = 1/math.sqrt(1-v*v)
        q = f"For v={v}c, what is gamma?"
        return mcq(q, gamma, "")
    if diff == "Medium":
        t0 = random.randint(1, 5)
        v = 0.8
        gamma = 1/math.sqrt(1-v*v)
        t = gamma*t0
        q = f"Proper time {t0} s, speed 0.8c. Dilated time?"
        return mcq(q, t, "s")
    L0 = random.randint(5, 12)
    v = 0.8
    gamma = 1/math.sqrt(1-v*v)
    L = L0/gamma
    q = f"Proper length {L0} m, speed 0.8c. Contracted length?"
    return mcq(q, L, "m")


def gen_quantum(diff):
    if diff == "Easy":
        p = random.randint(1, 5)*1e-24
        h = 6.63e-34
        lam = h/p
        q = f"A particle has momentum {p:.0e} kg·m/s. de Broglie wavelength?"
        return mcq(q, lam, "m", sig=3)
    if diff == "Medium":
        f = random.randint(4, 8)*1e14
        h = 6.63e-34
        phi = random.randint(2, 4)*1.6e-19
        K = h*f - phi
        q = f"Photoelectric: f={f:.0e} Hz, work function φ={phi:.1e} J. Kmax?"
        return mcq(q, K, "J", sig=3)
    lam = random.randint(200, 600)*1e-9
    h = 6.63e-34
    c = 3e8
    E = h*c/lam
    q = f"Photon wavelength {lam*1e9:.0f} nm. Energy?"
    return mcq(q, E, "J", sig=3)


def gen_materials(diff):
    if diff == "Easy":
        F = random.randint(100, 400)
        A = random.randint(2, 8)*1e-4
        stress = F/A
        q = f"A force {F} N acts on area {A:.0e} m². Stress?"
        return mcq(q, stress, "Pa", sig=3)
    if diff == "Medium":
        dL = random.randint(1, 5)*1e-3
        L = random.randint(1, 4)
        strain = dL/L
        q = f"A bar elongates {dL:.0e} m over length {L} m. Strain?"
        return mcq(q, strain, "")
    E = random.randint(100, 200)*1e9
    strain = random.randint(1, 5)*1e-4
    stress = E*strain
    q = f"Young's modulus E={E:.0e} Pa, strain={strain:.0e}. Stress?"
    return mcq(q, stress, "Pa", sig=3)


def gen_topic(topic):
    name, _ = topic
    return {
        "Kinematics": gen_kinematics,
        "Newton's Laws": gen_newton,
        "Work & Energy": gen_energy,
        "Momentum": gen_momentum,
        "Circular Motion": gen_circular,
        "Gravitation": gen_gravity,
        "Simple Harmonic Motion": gen_shm,
        "Waves Basics": gen_waves,
        "Sound": gen_sound,
        "Light & Optics": gen_light,
        "Refraction & Lenses": gen_lens,
        "Interference & Diffraction": gen_interference,
        "Electricity Basics": gen_electric,
        "Series & Parallel": gen_series_parallel,
        "Electric Power": gen_power,
        "Magnetism": gen_magnetism,
        "Induction": gen_induction,
        "Thermal Energy": gen_thermal,
        "Gas Laws": gen_gas,
        "Thermal Expansion": gen_expansion,
        "Atomic Structure": gen_atomic,
        "Nuclear Physics": gen_nuclear,
        "Relativity": gen_relativity,
        "Quantum Basics": gen_quantum,
        "Materials": gen_materials,
    }[name]


def generate():
    questions = []
    qid = 1
    for topic_name, category in TOPICS:
        gen = gen_topic((topic_name, category))
        for diff, count in DIFFICULTY_COUNTS.items():
            for _ in range(count):
                qtype_roll = random.random()
                if diff == "Hard" and qtype_roll > 0.7:
                    qtype = "Open Ended"
                elif qtype_roll < 0.2:
                    qtype = "True/False"
                else:
                    qtype = "Multiple Choice"

                if qtype == "True/False":
                    statement, truth = random.choice(TF_STATEMENTS[topic_name])
                    item = tf(statement, truth)
                elif qtype == "Open Ended":
                    prompt = OPEN_PROMPTS[topic_name]
                    item = open_q(prompt, "A correct response should define the principle and give a realistic example.")
                else:
                    item = gen(diff)

                questions.append({
                    "id": f"Q{qid:05d}",
                    "topic": topic_name,
                    "category": category,
                    "difficulty": diff,
                    "type": qtype,
                    **item,
                })
                qid += 1

    return questions


if __name__ == "__main__":
    qs = generate()
    Path('/home/amr/physics-sim-site/questions.json').write_text(json.dumps(qs, indent=2), encoding='utf-8')
    print(f"Generated {len(qs)} questions")
