const fs = require('fs');
const path = require('path');

// Model answers for each distinct Open Ended question type
const modelAnswers = {
  'speed and velocity': `**Speed vs Velocity - Model Answer:**

**Speed** is a scalar quantity that describes how fast an object is moving, regardless of direction. It is the rate of change of distance.

**Velocity** is a vector quantity that describes both how fast an object is moving AND its direction of motion.

**Real-life example:** Imagine a car driving around a circular track and returning to its starting point. 
- Its **average speed** might be 60 km/h (how fast it traveled)
- Its **average velocity** would be 0 km/h (since it ended up at the same position - displacement is zero)

Another example: Walking 10 meters east in 5 seconds gives speed = 2 m/s. Walking 10 meters west gives speed = 2 m/s, but velocity = -2 m/s (negative indicates direction).`,

  'newton\'s third law': `**Newton's Third Law of Motion - Model Answer:**

For every action, there is an equal and opposite reaction. When object A exerts a force on object B, object B simultaneously exerts an equal force in the opposite direction on object A.

**Key points:**
- Forces always occur in pairs
- The two forces are equal in magnitude but opposite in direction
- The forces act on different objects

**Real-life examples:**
1. **Walking:** When you push backward on the ground with your foot, the ground pushes you forward.
2. **Swimming:** A swimmer pushes water backward with their arms/legs, and the water pushes them forward.
3. **Rocket propulsion:** A rocket pushes hot gases downward, and the gases push the rocket upward.
4. **Bouncing a ball:** When a ball hits the ground and exerts a downward force, the ground exerts an equal upward force, causing the ball to bounce.`,

  'conservation of energy': `**Conservation of Energy - Model Answer:**

Energy cannot be created or destroyed, only transformed from one form to another. The total energy in an isolated system remains constant.

**Key principle:** Initial energy = Final energy (in a closed system)

**Simple examples:**
1. **Pendulum:** A swinging pendulum converts potential energy (at the highest point) to kinetic energy (at the lowest point) and back again, with total energy remaining constant (ignoring friction).

2. **Roller coaster:** At the top of the hill, the coaster has maximum gravitational potential energy. As it descends, this converts to kinetic energy. The total energy stays constant (though some is lost to friction/heat).

3. **Falling object:** A book falling from a shelf converts gravitational potential energy to kinetic energy. If we add up both energies at any point, the total is constant (neglecting air resistance).`,

  'momentum conservation': `**Conservation of Momentum - Model Answer:**

In a closed system with no external forces, the total momentum before a collision equals the total momentum after the collision.

**Formula:** m₁v₁ + m₂v₂ = m₁v₁' + m₂v₂' (before = after)

**Key concepts:**
- Momentum = mass × velocity (a vector quantity)
- In collisions, momentum is always conserved
- Kinetic energy may or may not be conserved (elastic vs inelastic collisions)

**Examples:**
1. **Billiard balls:** When one ball strikes another, momentum transfers from the moving ball to the stationary one. Total momentum is conserved.

2. **Recoil of a gun:** When a bullet fires forward, the gun recoils backward. The forward momentum of the bullet equals the backward momentum of the gun.

3. **Ice skaters pushing apart:** When two skaters push away from each other, their momenta are equal and opposite, totaling zero (same as before they pushed).`,

  'centripetal force': `**Centripetal Force - Model Answer:**

An object moving in a circular path requires a centripetal force - a force that always points toward the center of the circle - to maintain that circular motion.

**Why is it necessary?**
Without centripetal force, Newton's First Law tells us the object would continue in a straight line (tangent to the circle). The centripetal force continuously pulls the object inward, changing its direction of motion to follow the curved path.

**Important points:**
- Centripetal force is NOT a new type of force - it can be tension, gravity, friction, or any force pointing toward the center
- The faster the motion or larger the radius, the greater the required centripetal force

**Real-life examples:**
1. **Earth orbiting the Sun:** Gravity provides the centripetal force pulling Earth toward the Sun.
2. **Car turning:** Friction between tires and road provides centripetal force.
3. **Satellite in orbit:** Gravity provides centripetal force to keep satellite in orbit.
4. **Rounding a curve on a bike:** You lean into the curve, and friction provides centripetal force.`,

  'weight changes between planets': `**Weight Changes Between Planets - Model Answer:**

Weight is the force of gravity acting on an object. It depends on:
1. The mass of the planet (or celestial body)
2. The distance from the planet's center

**Key formula:** Weight = mass × gravitational acceleration (W = mg)

**Why weight changes:**
- Different planets have different masses and radii
- A larger/more massive planet has stronger gravity
- Weight = gravitational force = GMm/r²

**Important distinction:**
- **Mass** stays the same everywhere (amount of matter)
- **Weight** changes because gravitational acceleration varies

**Examples:**
1. On the Moon, your weight is about 1/6th of your Earth weight because the Moon has less mass.
2. On Jupiter, you would weigh about 2.5 times your Earth weight due to Jupiter's massive size.
3. An object weighing 60N on Earth (mass ≈ 6 kg) would weigh only 10N on the Moon but 150N on Jupiter.`,

  'restoring force in shm': `**Restoring Force in Simple Harmonic Motion - Model Answer:**

In Simple Harmonic Motion (SHM), the restoring force is the force that always acts to return an object to its equilibrium position.

**How it works:**
1. When displaced from equilibrium, a restoring force pushes/pulls the object back toward center
2. As the object passes through equilibrium, it has maximum velocity
3. Due to inertia, it continues past equilibrium in the opposite direction
4. The restoring force then acts again to bring it back

**Key characteristics:**
- Restoring force is proportional to displacement: F = -kx (Hooke's Law)
- The negative sign shows force is opposite to displacement
- The motion is a continuous oscillation around equilibrium

**Examples:**
1. **Mass on a spring:** Displacing the mass stretches/compresses the spring, creating a restoring force proportional to displacement.
2. **Pendulum:** Gravity provides the restoring force - when displaced, gravity pulls the bob back toward the lowest point.
3. **Guitar string:** Plucking displaces the string from equilibrium; tension in the string provides the restoring force.`,

  'wavelength frequency wave speed': `**Wavelength, Frequency, and Wave Speed - Model Answer:**

**Wavelength (λ):** The distance between two consecutive points in phase (e.g., crest to crest). Measured in meters.

**Frequency (f):** The number of wave cycles passing a point per second. Measured in Hertz (Hz).

**Wave speed (v):** How fast the wave travels through the medium. Measured in m/s.

**The relationship:**
v = f × λ (wave speed equals frequency multiplied by wavelength)

This equation shows that for a given wave speed:
- Higher frequency means shorter wavelength
- Lower frequency means longer wavelength

**Examples:**
1. **Sound waves:** A 440 Hz tuning fork (concert A) has wavelength ≈ 0.78 m in air. If frequency increases, wavelength decreases.

2. **Ocean waves:** Large ocean waves typically have long wavelengths (~100m) and low frequencies. Small ripples have short wavelengths and higher frequencies.

3. **Light:** All light travels at the same speed (c = 3×10⁸ m/s). Red light has lower frequency than blue light, so red light has longer wavelength.`,

  'sound travels vacuum': `**Sound Propagation and Vacuum - Model Answer:**

**How sound travels:**
Sound is a mechanical wave that requires a medium (solid, liquid, or gas) to travel. It works through compression and rarefaction:
1. A vibrating object (like a speaker cone) pushes nearby molecules
2. These molecules push on their neighbors
3. The compression wave propagates through the medium
4. When it reaches your ear, it vibrates your eardrum

**Why sound cannot travel in vacuum:**
In a vacuum, there are no molecules/particles to transmit the compression waves. Since sound depends on molecules bumping into each other, and there are no molecules in vacuum, sound cannot propagate.

**Key difference from light:**
- Sound needs a medium (mechanical wave)
- Light is an electromagnetic wave that can travel through vacuum

**Examples:**
1. **In space:** Astronauts use radios to communicate because sound cannot travel through the vacuum of space. They can see explosions but not hear them.

2. **On Earth:** You hear thunder from far away because sound travels through air. Underwater, sound travels faster because water is denser than air.

3. **Through walls:** You can hear muffled sounds through walls because sound can travel through solids (the wall molecules transmit the vibrations).`,

  'refraction': `**Refraction - Model Answer:**

Refraction is the bending of light (or other waves) when it passes from one medium to another with different optical density.

**Why does it happen?**
Light changes speed when moving between media with different densities:
- Slower in denser media (e.g., water, glass)
- Faster in less dense media (e.g., air)

When light enters at an angle, one side of the wavefront slows down before the other, causing the wave to bend.

**Key concepts:**
- Refractive index (n) measures how much a medium slows light
- Light bends TOWARD the normal when entering a denser medium
- Light bends AWAY from the normal when entering a less dense medium

**Everyday examples:**
1. **A straw in water:** A straw appears bent or broken at the water surface because light from the underwater part is refracted.
2. **Rainbow formation:** Light refracts through water droplets, separating into component colors.
3. **Eye glasses:** Lenses use refraction to correct vision by bending light before it enters the eye.
4. **Mirage:** Refraction of light through heated air near the ground creates fake "water" reflections on hot roads.`,

  'convex lens real image': `**Convex Lens Forming a Real Image - Model Answer:**

A convex (converging) lens is thicker in the middle and can form real images when object is placed beyond the focal point.

**How it works:**
1. Light rays parallel to the principal axis pass through the focal point after refraction
2. Light rays passing through the center of the lens go straight (undeviated)
3. Where these refracted rays converge = location of the real image

**Image characteristics (when object beyond 2F):**
- Inverted (upside-down)
- Real (can be projected on a screen)
- Reduced in size when object is beyond 2F
- Located between F and 2F on the opposite side

**Real-life examples:**
1. **Camera:** The lens forms an inverted real image on the film or sensor.
2. **Human eye:** The cornea and lens form an inverted image on the retina; the brain corrects the orientation.
3. **Projector:** Lenses focus light to form a large, inverted image on a screen.
4. **Magnifying glass (for projection):** When inverted and used as a projector, a magnifying glass forms a real image.

**Note:** When object is between lens and focal point, a virtual, upright, magnified image forms (used in simple magnifiers).`,

  'constructive destructive interference': `**Constructive and Destructive Interference - Model Answer:**

**Interference** occurs when two or more waves overlap, combining their amplitudes.

**Constructive interference:**
- Occurs when waves are "in phase" (crest meets crest, trough meets trough)
- The amplitudes add together
- Result: Larger combined wave, brighter sound, etc.
- Condition: Path difference = nλ (whole number of wavelengths)

**Destructive interference:**
- Occurs when waves are "out of phase" (crest meets trough)
- The amplitudes subtract
- Result: Smaller or zero combined wave
- Condition: Path difference = (n + ½)λ (half-integer wavelengths)

**Real-life examples:**
1. **Noise-canceling headphones:** They emit sound waves that are out of phase with incoming noise, creating destructive interference that cancels the noise.

2. **Thin film interference (soap bubbles/oil slick):** Light reflected from the top and bottom surfaces of a thin film interfere, creating colorful patterns.

3. **Beats in music:** Two similar frequencies played together create beats due to alternating constructive and destructive interference.

4. **Speakers out of phase:** Connecting speakers with reversed polarity causes a "thin" or "hollow" sound in the middle because sound waves cancel at some points.`,

  'voltage current': `**Voltage vs Current - Model Answer:**

**Voltage (Potential Difference):**
- Symbol: V, Unit: Volts (V)
- Definition: The potential energy difference per unit charge between two points
- Analogy: Water pressure in a pipe - the "push" that drives charge through a circuit
- What it does: Creates the electric field that pushes charges through a conductor

**Current:**
- Symbol: I, Unit: Amperes/Amps (A)
- Definition: The rate of flow of electric charge past a point
- Analogy: The amount of water flowing through a pipe per second
- What it does: Actually carries energy from one point to another

**The relationship:**
- Voltage is the cause, current is the effect
- V = IR (Ohm's Law) relates them
- Power: P = VI (voltage × current)

**Examples:**
1. **Battery:** A 9V battery creates high "pressure" (voltage) but delivers current based on the resistance of the connected device.

2. **Thick vs thin wires:** Both can have the same voltage, but the thick wire allows more current to flow (lower resistance).

3. **Water analogy:** A tall waterfall (high voltage) with little water (low current) can have the same power as a wide river (low voltage) with lots of water (high current).`,

  'series parallel circuits': `**Series vs Parallel Circuits - Model Answer:**

**Series Circuits:**
- Components connected end-to-end in a single path
- Current is the same through all components: I₁ = I₂ = I₃
- Voltage divides: Vtotal = V₁ + V₂ + V₃
- Total resistance: Rtotal = R₁ + R₂ + R₃
- If one component fails, circuit is broken

**Parallel Circuits:**
- Components connected across the same two points (branching paths)
- Voltage is the same across all branches: V₁ = V₂ = V₃
- Current divides: Itotal = I₁ + I₂ + I₃
- Total resistance: 1/Rtotal = 1/R₁ + 1/R₂ + 1/R₃
- If one component fails, others continue working

**Real-life examples:**
1. **Christmas lights (old style):** Series - one burned-out bulb breaks the circuit, all lights go out.

2. **Household wiring:** Outlets are wired in parallel - you can turn off one appliance without affecting others.

3. **Car headlights:** Often wired in parallel so both work independently.

4. **Battery combinations:** Two batteries in series add voltage. Two in parallel add current capacity but keep same voltage.`,

  'electrical power energy': `**Electrical Power and Energy - Model Answer:**

**Power (P):**
- Definition: Rate at which electrical energy is transferred or converted
- Formula: P = VI (Power = Voltage × Current)
- Also: P = I²R or P = V²/R (using Ohm's Law)
- Unit: Watts (W), where 1 W = 1 Joule/second

**Energy (E):**
- Definition: Total work done or heat generated over time
- Formula: E = Pt (Energy = Power × Time)
- Also: E = Pt = VIt = I²Rt
- Unit: Joules (J) or kilowatt-hours (kWh)

**Practical examples:**
1. **Light bulbs:** A 60W bulb uses 60 joules per second. Over 10 hours (36,000 s), it uses E = 60 × 36,000 = 2,160,000 J = 0.6 kWh.

2. **Electric kettle (2000W):** Boils water much faster than a 200W heater because it converts electrical energy to heat at a higher rate (more power).

3. **Phone charging:** A 5W phone charger delivers energy slower than a 20W fast charger, but both deliver the same total energy (just at different rates/times).

4. **Electricity bill:** You're charged for energy (kWh), not power. Using a 1000W heater for 1 hour uses the same energy as a 100W bulb for 10 hours (1 kWh each).`,

  'magnetic field moving charge': `**Magnetic Field Effect on Moving Charge - Model Answer:**

A magnetic field exerts a force on any moving electric charge. This is the basis for many technological applications.

**The Force:**
- Formula: F = qvB sin(θ)
- F = force on the charge
- q = charge (positive or negative)
- v = velocity of the charge
- B = magnetic field strength
- θ = angle between velocity and field direction

**Key points:**
- Force is perpendicular to both velocity and magnetic field
- No force acts on a stationary charge (v = 0)
- Maximum force when moving perpendicular to field (θ = 90°)
- No force when moving parallel to field (θ = 0°)

**Direction (Right-hand rule):**
- For positive charges: Thumb = velocity, Fingers = field, Palm = Force direction
- For negative charges: Force direction is opposite

**Real-life examples:**
1. **TV and monitor screens:** Electron beams are deflected by magnetic fields to create images on phosphor screens.

2. **Mass spectrometers:** Particles moving through magnetic fields are deflected based on their mass-to-charge ratio, allowing identification of different atoms.

3. **Aurora borealis:** Charged particles from the Sun spiral along Earth's magnetic field lines toward the poles, colliding with atmospheric gases to create the Northern Lights.

4. **Electric motors:** Current-carrying wires in magnetic fields experience forces that produce rotation.`,

  'electromagnetic induction': `**Electromagnetic Induction in a Simple Generator - Model Answer:**

Electromagnetic induction is the process of generating an electric current from a changing magnetic field.

**How a simple generator works:**
1. A coil of wire rotates between the poles of a magnet
2. As the coil rotates, the magnetic flux through it changes
3. According to Faraday's Law, this changing flux induces an EMF (voltage)
4. When connected to a circuit, current flows

**Key principles:**
- **Faraday's Law:** Induced EMF is proportional to the rate of change of magnetic flux
- **Lenz's Law:** The induced current direction opposes the change that caused it
- More turns in coil = greater induced EMF
- Faster rotation = greater induced EMF

**The EMF equation:**
EMF = BANω sin(ωt) where:
- B = magnetic field strength
- A = area of coil
- N = number of turns
- ω = angular velocity

**Real-life examples:**
1. **Power stations:** Coal, gas, hydro, or wind power all rotate generators (coils in magnetic fields) to produce electricity.

2. **Bicycle dynamo:** A small magnet rotating inside a coil generates electricity to power lights.

3. **Induction cooktops:** Changing magnetic fields from coils induce currents in the ferromagnetic cookware, heating it directly.

4. **Electric guitar pickups:** String vibration near a magnet induces small currents in the coil, creating the guitar signal.`,

  'specific heat capacity': `**Specific Heat Capacity - Model Answer:**

Specific heat capacity (c) is the amount of heat energy required to raise the temperature of 1 kg of a substance by 1°C (or 1 K).

**Formula:** Q = mcΔT
- Q = heat energy added (Joules)
- m = mass of substance (kg)
- c = specific heat capacity (J/kg·°C)
- ΔT = temperature change (°C or K)

**Physical meaning:**
- High specific heat capacity = substance stores lots of energy per degree temperature change
- Low specific heat capacity = substance heats up/cool down easily

**Why different substances have different values:**
- Depends on how the substance stores thermal energy at the molecular level
- More degrees of freedom at molecular level = higher specific heat

**Examples:**
1. **Water (high c = 4186 J/kg·°C):** Coastal areas have milder climates because water absorbs/release lots of heat with small temperature changes.

2. **Metals (low c):** A metal spoon in hot soup heats up quickly but also cools quickly. This is why metals feel "cold" - they change temperature easily.

3. **Cooking:** Water heats slowly but retains heat well (good for even cooking). Oil heats quickly but also cools quickly.

4. **Car radiators:** Water's high specific heat makes it excellent for absorbing engine heat and cooling the car.`,

  'boyle\'s law': `**Boyle's Law - Model Answer:**

For a fixed amount of gas at constant temperature, the pressure of a gas is inversely proportional to its volume.

**Formula:** P₁V₁ = P₂V₂ (at constant temperature)

**What it means:**
- When volume decreases → pressure increases
- When volume increases → pressure decreases
- The product of pressure and volume stays constant

**Physical explanation:**
- Gas pressure results from molecules colliding with container walls
- Smaller volume = molecules hit walls more frequently
- More frequent collisions = higher pressure

**Real-life examples:**
1. **Syringe:** Pulling back the plunger increases volume, decreasing pressure inside - this is how we draw fluid in.

2. **Diving:** As a diver descends, water pressure increases, compressing air spaces (lungs, BCD). As they ascend, the air expands.

3. **Balloon in altitude:** A balloon rises to where pressure is lower; the air inside expands as external pressure decreases.

4. **Piston engines:** In a bicycle pump, pushing down the piston decreases volume, increasing pressure to force air into the tire.

5. **Scuba tank:** Large volume at high pressure stores lots of air; when released through a regulator, it expands to fill lungs at lower pressure.`,

  'expansion gaps': `**Thermal Expansion and Expansion Gaps - Model Answer:**

Bridges (and many structures) need expansion gaps because materials expand when heated and contract when cooled.

**Why materials expand:**
- At higher temperatures, molecules vibrate more vigorously
- This causes the material to take up more space
- Length increase ≈ original length × coefficient of expansion × temperature change

**Why bridges specifically:**
1. **Long bridges experience significant temperature changes:** Direct sunlight can heat the surface 20-30°C above air temperature.

2. **Large thermal expansion:** A 100m steel bridge can expand ~12cm on a hot day.

3. **Prevent buckling/warping:** Without gaps, the bridge would have nowhere to expand, causing it to buckle, warp, or crack.

**Design solutions:**
1. **Expansion joints:** Sliding plates that allow the bridge to expand/contract
2. **Bearings and rollers:** Allow one end to move while the other stays fixed
3. **Flexible materials:** Some bridges use flexible supports

**Real-life examples:**
1. **Railroad tracks:** Small gaps between rail sections allow expansion in summer.

2. **Sidewalks:** Curved expansion joints prevent cracking from temperature changes.

3. **Power lines:** Power cables sag more in summer (expand) and tighten in winter.

4. **Thermostats:** Bimetalic strips bend when heated/cooled, using thermal expansion to make/break electrical contacts.`,

  'structure of the atom': `**Structure of the Atom - Model Answer:**

Atoms consist of three main subatomic particles:

**1. Nucleus (center):**
- Contains protons (positive charge) and neutrons (no charge)
- Holds nearly all the atom's mass
- Very small but dense (99.9% of mass in 0.1% of volume)
- Positive charge from protons determines the element

**2. Electrons (orbiting the nucleus):**
- Very small mass (1/1836 of proton)
- Negative charge (-1)
- Occupy electron shells/orbitals at various energy levels
- Can jump between shells by absorbing/emitting energy
- Responsible for chemical reactions and bonding

**Key points:**
- Atomic number = number of protons (determines element)
- Mass number = protons + neutrons
- Neutral atom: protons = electrons
- Ions: gained/lost electrons give net charge

**Size comparison:**
- If nucleus was a marble (1cm), electrons would orbit ~1km away
- Atoms are mostly empty space!

**Applications:**
1. **Periodic table:** Organized by atomic number (proton count)
2. **Ions and bonding:** Na⁺ and Cl⁻ ions form NaCl (table salt)
3. **Radiation:** Unstable nuclei emit radiation (radioactivity)
4. **Electronics:** Electron flow in conductors enables electrical current`,

  'half-life': `**Half-Life of Radioactive Decay - Model Answer:**

Half-life (t½) is the time required for half of the radioactive atoms in a sample to decay.

**Key characteristics:**
- Each radioactive isotope has a specific half-life (constant)
- After one half-life: 50% of original atoms remain
- After two half-lives: 25% remain (half of 50%)
- After three half-lives: 12.5% remain
- The process continues exponentially

**Mathematical relationship:**
N = N₀ × (½)^(t/t½)
- N = remaining amount
- N₀ = initial amount
- t = elapsed time
- t½ = half-life

**Why half-lives vary:**
- Different isotopes have different nuclear stabilities
- Half-lives range from fractions of a second to billions of years

**Real-life examples:**
1. **Carbon-14 dating:** t½ ≈ 5,730 years. Used to date archaeological artifacts up to ~50,000 years old.

2. **Medical imaging:** Technetium-99m has a 6-hour half-life. It decays by the time the patient leaves the hospital.

3. **Nuclear waste:** Strontium-90 (t½ = 29 years) requires ~300 years for safe disposal. Plutonium-239 (t½ = 24,000 years) needs millions of years.

4. **Chernobyl:** Cesium-137 (t½ = 30 years) contaminated the area; it will take ~300 years for radiation levels to drop significantly.`,

  'time dilation': `**Time Dilation in Special Relativity - Model Answer:**

Time dilation is the phenomenon where time passes more slowly for an object moving relative to a stationary observer.

**The key insight (Einstein):**
Time is not absolute - it depends on the observer's frame of reference. Moving clocks run slower than stationary ones.

**The formula:**
t' = t / √(1 - v²/c²)
- t' = time measured by moving observer
- t = time measured by stationary observer
- v = relative velocity
- c = speed of light (3×10⁸ m/s)

**Key points:**
- Effect is significant only at speeds close to light speed
- At everyday speeds, time dilation is negligible
- The moving observer doesn't notice their time slowing (everything slows proportionally)

**Physical explanation:**
- Space and time are linked as "spacetime"
- To maintain constant speed of light, time must dilate when objects move through space

**Real-life examples:**
1. **GPS satellites:** Their atomic clocks run ~38 microseconds faster per day due to time dilation (both special and general relativity effects). Without correction, GPS would be inaccurate by ~10km per day.

2. **Particle physics:** Muons created in the upper atmosphere reach Earth's surface despite their short half-life because time dilation extends their effective lifetime.

3. **Aging paradox:** A twin traveling at near-light speed would return younger than their Earth-bound twin (though the effect requires extreme speeds to be measurable).

4. **No paradox for traveler:** The traveling twin doesn't notice anything unusual - all processes, including their biological aging, slow together.`,

  'photoelectric effect': `**The Photoelectric Effect - Model Answer:**

The photoelectric effect is the phenomenon where light incident on a metal surface causes electrons to be ejected from the metal.

**Classical prediction vs. reality:**
Classical physics predicted that brighter light would eject more energetic electrons. Instead, experiments showed:
- Light frequency must exceed a threshold frequency (regardless of brightness)
- Brighter light ejects MORE electrons but not MORE energetic ones
- Red light cannot eject electrons no matter how bright

**Einstein's explanation (1905):**
Light behaves as particles (photons):
- Energy of photon: E = hf (h = Planck's constant, f = frequency)
- Higher frequency = higher energy photons
- Brighter light = more photons, not more energetic photons

**The process:**
1. Photon strikes electron in metal
2. If photon energy > work function (φ), electron is ejected
3. Kinetic energy of electron: KE = hf - φ
4. Excess energy becomes electron's kinetic energy

**Real-life applications:**
1. **Solar cells:** Photons in sunlight eject electrons, creating electric current (photovoltaic effect).

2. **Automatic doors:** Light sensors detect interruption and trigger door opening.

3. **Digital cameras:** Light ejects electrons from sensor pixels, converting to electrical signals.

4. **Photomultiplier tubes:** Detect single photons by amplifying the photoelectric effect for extremely light-sensitive measurements.`,

  'stress-strain elastic': `**Stress-Strain Behavior for Elastic Materials - Model Answer:**

**Stress (σ):** Force applied per unit area = F/A, measured in Pa (Pascals)

**Strain (ε):** Deformation relative to original length = ΔL/L, dimensionless

**Elastic behavior:**
- In the elastic region, stress and strain are proportional (Hooke's Law)
- σ = Eε, where E is Young's modulus
- If load is removed, material returns to original shape
- No permanent deformation occurs

**The elastic region:**
1. **Linear region:** Stress proportional to strain (straight line)
2. **Proportional limit:** End of linear relationship
3. **Elastic limit (yield point):** Beyond this, permanent deformation begins

**Key points:**
- Young's modulus (E) measures stiffness
- Higher E = stiffer material (less strain for same stress)
- Elastic behavior = temporary, reversible deformation

**Real-life examples:**
1. **Steel springs:** Spring steel can stretch and return to original shape because it deforms elastically within certain limits.

2. **Rubber bands:** Show large elastic strain - can stretch to many times their original length and return (though not perfectly elastic).

3. **Bones:** Small amounts of stress cause elastic deformation; excessive stress causes fracture (beyond elastic limit).

4. **Building materials:** Concrete and steel in buildings deform slightly under load (within elastic range) but return to shape when load is removed. Overloading causes permanent damage.`
};

// Function to find matching model answer for a question
function findModelAnswer(questionText) {
  const lowerQuestion = questionText.toLowerCase();
  
  for (const [key, answer] of Object.entries(modelAnswers)) {
    if (lowerQuestion.includes(key)) {
      return answer;
    }
  }
  
  // Additional pattern matching
  if (lowerQuestion.includes('wavelength') && lowerQuestion.includes('frequency') && lowerQuestion.includes('wave')) {
    return modelAnswers['wavelength frequency wave speed'];
  }
  if (lowerQuestion.includes('how sound') && lowerQuestion.includes('vacuum')) {
    return modelAnswers['sound travels vacuum'];
  }
  if (lowerQuestion.includes('convex lens') && lowerQuestion.includes('real image')) {
    return modelAnswers['convex lens real image'];
  }
  if (lowerQuestion.includes('constructive') && lowerQuestion.includes('destructive') && lowerQuestion.includes('interference')) {
    return modelAnswers['constructive destructive interference'];
  }
  if (lowerQuestion.includes('how a magnetic field') || (lowerQuestion.includes('magnetic field') && lowerQuestion.includes('moving'))) {
    return modelAnswers['magnetic field moving charge'];
  }
  if (lowerQuestion.includes('electromagnetic induction') && lowerQuestion.includes('generator')) {
    return modelAnswers['electromagnetic induction'];
  }
  if (lowerQuestion.includes('specific heat') && lowerQuestion.includes('physically')) {
    return modelAnswers['specific heat capacity'];
  }
  if (lowerQuestion.includes('boyle')) {
    return modelAnswers['boyle\'s law'];
  }
  if (lowerQuestion.includes('bridges') && lowerQuestion.includes('expansion')) {
    return modelAnswers['expansion gaps'];
  }
  if (lowerQuestion.includes('half-life') && lowerQuestion.includes('radioactive')) {
    return modelAnswers['half-life'];
  }
  if (lowerQuestion.includes('time dilation') && lowerQuestion.includes('relativity')) {
    return modelAnswers['time dilation'];
  }
  if (lowerQuestion.includes('photoelectric')) {
    return modelAnswers['photoelectric effect'];
  }
  if (lowerQuestion.includes('stress') && lowerQuestion.includes('strain') && lowerQuestion.includes('elastic')) {
    return modelAnswers['stress-strain elastic'];
  }
  // Additional matches for remaining questions
  if (lowerQuestion.includes('voltage') && lowerQuestion.includes('current') && lowerQuestion.includes('difference')) {
    return modelAnswers['voltage current'];
  }
  if (lowerQuestion.includes('compare') && lowerQuestion.includes('series') && lowerQuestion.includes('parallel')) {
    return modelAnswers['series parallel circuits'];
  }
  if (lowerQuestion.includes('electrical power') && lowerQuestion.includes('energy')) {
    return modelAnswers['electrical power energy'];
  }
  if (lowerQuestion.includes('atom') && lowerQuestion.includes('nucleus') && lowerQuestion.includes('electrons')) {
    return modelAnswers['structure of the atom'];
  }
  
  return null;
}

// Read and parse the questions file
console.log('Reading questions-data.js...');
const questionsFile = path.join(__dirname, 'questions-data.js');
let content = fs.readFileSync(questionsFile, 'utf8');

// Extract the array from window.QUESTION_BANK
const match = content.match(/window\.QUESTION_BANK\s*=\s*(\[[\s\S]*\]);?\s*$/);
if (!match) {
  console.error('Could not parse questions file');
  process.exit(1);
}

let questions;
try {
  questions = JSON.parse(match[1]);
} catch (e) {
  console.error('Failed to parse JSON:', e.message);
  process.exit(1);
}

console.log(`Found ${questions.length} questions`);

// Count question types
const openEndedQuestions = questions.filter(q => q.type === 'Open Ended');
console.log(`Found ${openEndedQuestions.length} Open Ended questions`);

// Add model answers to Open Ended questions
let updated = 0;
let notFound = [];

for (const q of questions) {
  if (q.type === 'Open Ended') {
    const modelAnswer = findModelAnswer(q.question);
    if (modelAnswer) {
      q.modelAnswer = modelAnswer;
      updated++;
    } else {
      notFound.push({ id: q.id, question: q.question.substring(0, 80) });
    }
  }
}

console.log(`\nUpdated ${updated} questions with model answers`);

if (notFound.length > 0) {
  console.log(`\nCould not find model answers for ${notFound.length} questions:`);
  notFound.slice(0, 5).forEach(q => {
    console.log(`  - ${q.id}: ${q.question}...`);
  });
}

// Create new content with updated questions
const newContent = `window.QUESTION_BANK = ${JSON.stringify(questions, null, 2)};\n`;

// Write to file
const outputFile = path.join(__dirname, 'questions-data.js');
fs.writeFileSync(outputFile, newContent);
console.log(`\nUpdated questions saved to ${outputFile}`);
