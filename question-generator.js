// High-Quality Physics Question Generator
// Phase 1-4: Create diverse, well-explained questions

const questionTypes = {
  calculation: 'Calculation',
  conceptual: 'Conceptual',
  realWorld: 'Real-World',
  graphAnalysis: 'Graph Analysis',
  misconception: 'Misconception'
};

const topics = [
  {
    name: 'Kinematics',
    category: 'Mechanics',
    subtopics: [
      {
        name: 'Speed and Velocity',
        questions: [
          {
            type: questionTypes.conceptual,
            difficulty: 'Easy',
            question: 'A car travels 100km in 2 hours. What is its average speed?',
            choices: ['50 km/h', '100 km/h', '200 km/h', '25 km/h'],
            answer: '50 km/h',
            answerIndex: 0,
            explanation: 'Average speed = Total distance / Total time = 100km / 2h = 50 km/h. This tells us how fast the car was traveling on average, regardless of direction.',
            modelAnswer: null
          },
          {
            type: questionTypes.conceptual,
            difficulty: 'Medium',
            question: 'A bird flies 100m North, then 100m South. What is its displacement?',
            choices: ['100m', '200m', '0m', '50m'],
            answer: '0m',
            answerIndex: 2,
            explanation: 'Displacement is the shortest path from start to end. Since the bird returns to its starting point, displacement = 0. Speed considers the path traveled, but displacement only cares about initial and final positions.',
            modelAnswer: 'Displacement = Final position - Initial position = 0 - 0 = 0m. Even though the bird traveled 200m, its net change in position is zero.'
          },
          {
            type: questionTypes.realWorld,
            difficulty: 'Medium',
            question: 'A sprinter completes a 200m race in 25 seconds. An Olympic sprinter runs 100m in 10 seconds. Who runs faster?',
            choices: ['The sprinter (8 m/s)', 'The Olympic sprinter (10 m/s)', 'They run the same speed', 'Cannot be determined'],
            answer: 'The Olympic sprinter (10 m/s)',
            answerIndex: 1,
            explanation: 'Speed = Distance / Time. Sprinter: 200m/25s = 8 m/s. Olympic sprinter: 100m/10s = 10 m/s. The Olympic sprinter is faster despite running half the distance.'
          },
          {
            type: questionTypes.calculation,
            difficulty: 'Easy',
            question: 'A cyclist travels at 15 m/s for 10 seconds. How far does she travel?',
            choices: ['1.5m', '150m', '25m', '1500m'],
            answer: '150m',
            answerIndex: 1,
            explanation: 'Using distance = speed × time: 15 m/s × 10 s = 150 m. This is straightforward application of the speed formula.',
            modelAnswer: 'd = v × t = 15 × 10 = 150 meters'
          },
          {
            type: questionTypes.misconception,
            difficulty: 'Hard',
            question: 'A car moving at 60 km/h suddenly stops. A passenger not wearing a seatbelt flies forward. Which statement is TRUE?',
            choices: [
              'A force pushes the passenger forward',
              'The passenger continues moving due to inertia',
              'The car pushes the passenger backward',
              'Gravity makes the passenger fall'
            ],
            answer: 'The passenger continues moving due to inertia',
            answerIndex: 1,
            explanation: 'Common misconception: People think a "force" pushes them forward. Reality: Without seatbelt, there\'s no force to stop the passenger. Due to inertia (Newton\'s 1st Law), the passenger continues moving at 60 km/h while the car stops. The passenger hits the dashboard because they\'re still moving!',
            modelAnswer: 'This demonstrates Newton\'s First Law: An object in motion stays in motion unless acted upon by an external force. The seatbelt provides that external force to stop you with the car.'
          },
          {
            type: questionTypes.conceptual,
            difficulty: 'Medium',
            question: 'Can an object have high speed but low velocity? Explain.',
            answer: 'Speed is a scalar (just magnitude), velocity is a vector (magnitude + direction). An object moving in a circle at constant speed has high speed but continuously changing velocity because direction changes.',
            modelAnswer: 'Yes! Speed and velocity are different:\n\n• Speed = scalar quantity (just magnitude)\n• Velocity = vector quantity (magnitude + direction)\n\nExample: A car going around a circular track at 60 km/h:\n- Speed = 60 km/h (constant)\n- Velocity = changes constantly (direction keeps changing)\n\nAt any instant, velocity points tangent to the circle, while speed remains 60 km/h.'
          }
        ]
      },
      {
        name: 'Acceleration',
        questions: [
          {
            type: questionTypes.calculation,
            difficulty: 'Easy',
            question: 'A car accelerates from rest at 3 m/s². What is its speed after 4 seconds?',
            choices: ['12 m/s', '7 m/s', '0.75 m/s', '3 m/s'],
            answer: '12 m/s',
            answerIndex: 0,
            explanation: 'Using v = u + at: v = 0 + (3)(4) = 12 m/s. Starting from rest (u=0), acceleration adds to velocity over time.',
            modelAnswer: 'Given: u = 0 m/s, a = 3 m/s², t = 4 s\nUsing: v = u + at\nv = 0 + (3)(4) = 12 m/s'
          },
          {
            type: questionTypes.conceptual,
            difficulty: 'Medium',
            question: 'A ball is thrown straight up. At its highest point, what is its velocity and acceleration?',
            choices: [
              'Velocity = 0, Acceleration = 0',
              'Velocity = 0, Acceleration = 9.8 m/s²',
              'Velocity = 9.8 m/s, Acceleration = 0',
              'Velocity = 9.8 m/s, Acceleration = 9.8 m/s²'
            ],
            answer: 'Velocity = 0, Acceleration = 9.8 m/s²',
            answerIndex: 1,
            explanation: 'At the highest point, the ball momentarily stops (v=0) but gravity still acts on it (a=9.8 m/s² downward). This is why the ball comes back down!',
            modelAnswer: 'At the peak:\n• Velocity = 0 (momentarily at rest)\n• Acceleration = g = 9.8 m/s² (gravity always acts)\n\nThink of it this way: Acceleration shows HOW velocity is changing. At the top, velocity changes from positive (up) to negative (down), so acceleration must be present.'
          },
          {
            type: questionTypes.realWorld,
            difficulty: 'Medium',
            question: 'Modern cars have "0-100 km/h in 8 seconds" as a specification. What does this tell us about acceleration?',
            choices: [
              'Average acceleration = 3.5 m/s²',
              'Average acceleration = 12.5 m/s²',
              'Maximum speed = 100 km/h',
              'Travel time = 8 seconds'
            ],
            answer: 'Average acceleration = 3.5 m/s²',
            answerIndex: 0,
            explanation: 'Converting: 100 km/h = 27.8 m/s. Average acceleration = Δv/t = 27.8/8 ≈ 3.5 m/s². This means the car gains about 3.5 m/s of speed every second.',
            modelAnswer: 'Step 1: Convert 100 km/h to m/s\n100 × 1000/3600 = 27.8 m/s\n\nStep 2: Calculate average acceleration\na = Δv/t = (27.8 - 0)/8 = 3.47 m/s² ≈ 3.5 m/s²'
          },
          {
            type: questionTypes.misconception,
            difficulty: 'Hard',
            question: 'You drop a feather and a hammer from the same height on Earth. Which hits the ground first? (Ignore air resistance first)',
            choices: [
              'Hammer hits first',
              'Feather hits first',
              'They hit at the same time',
              'Depends on how heavy they are'
            ],
            answer: 'They hit at the same time',
            answerIndex: 2,
            explanation: 'Without air resistance, ALL objects fall at the same rate (g = 9.8 m/s²). This was proven by Apollo 15 on the Moon where a hammer and feather fell together in the vacuum. On Earth, air resistance makes the feather fall slower.',
            modelAnswer: 'In vacuum (no air resistance):\n• All objects accelerate at g = 9.8 m/s²\n• Time to fall depends ONLY on height and g\n• Mass does NOT affect fall time\n\nOn Earth with air:\n• Feather experiences more air resistance\n• Falls slower than hammer\n\nApollo 15 demonstration: Hammer and feather fell together on the Moon!'
          }
        ]
      },
      {
        name: 'Newton\'s Laws',
        questions: [
          {
            type: questionTypes.conceptual,
            difficulty: 'Easy',
            question: 'Newton\'s Third Law states: "For every action, there is an equal and opposite reaction." What does this mean?',
            choices: [
              'Forces always cancel out',
              'Action and reaction act on different objects',
              'The bigger object always wins',
              'Action and reaction happen at different times'
            ],
            answer: 'Action and reaction act on different objects',
            answerIndex: 1,
            explanation: 'This is a common misconception! Action-reaction pairs act on DIFFERENT objects. That\'s why they don\'t cancel out. When you push the ground (action), the ground pushes you (reaction) - but these forces are on different objects!',
            modelAnswer: 'Key point: Action and Reaction act on DIFFERENT bodies!\n\nExample: Walking\n• Your foot pushes BACKWARD on the ground (action)\n• Ground pushes FORWARD on your foot (reaction)\n\nThese forces are:\n✓ Equal in magnitude\n✓ Opposite in direction\n✓ On DIFFERENT objects (so they don\'t cancel!)\n\nAnother example: Fish swimming\n• Fish pushes water backward\n• Water pushes fish forward'
          },
          {
            type: questionTypes.realWorld,
            difficulty: 'Medium',
            question: 'A rocket works in outer space where there\'s no air. How does it accelerate if there\'s nothing to push against?',
            choices: [
              'It can\'t accelerate in space',
              'It pushes against cosmic background radiation',
              'It throws gas molecules backward to move forward',
              'Gravity from planets accelerates it'
            ],
            answer: 'It throws gas molecules backward to move forward',
            answerIndex: 2,
            explanation: 'Newton\'s Third Law! The rocket pushes hot gases downward (action), and the gases push the rocket upward (reaction). You don\'t need air to push against - you push the exhaust gases, and they push you back.',
            modelAnswer: 'Rocket propulsion follows Newton\'s Third Law:\n\n1. Rocket burns fuel → creates hot, high-pressure gas\n2. Gas is ejected downward at high speed\n3. Gas pushes UP on rocket (reaction)\n\nKey insight: In space, you "push" the exhaust, not the air. The exhaust carries momentum backward, so the rocket gains momentum forward.\n\nThis is why rockets carry so much fuel - they need to push lots of mass to accelerate effectively.'
          },
          {
            type: questionTypes.calculation,
            difficulty: 'Easy',
            question: 'A 5kg object is pushed with a force of 20N. What is its acceleration?',
            choices: ['100 m/s²', '4 m/s²', '25 m/s²', '0.25 m/s²'],
            answer: '4 m/s²',
            answerIndex: 1,
            explanation: 'Using F = ma: a = F/m = 20N/5kg = 4 m/s². The acceleration is how much the velocity changes per second.',
            modelAnswer: 'Given: m = 5 kg, F = 20 N\nUsing Newton\'s Second Law: F = ma\nSolving for a: a = F/m\na = 20/5 = 4 m/s²\n\nThis means the object\'s speed increases by 4 m/s every second.'
          },
          {
            type: questionTypes.misconception,
            difficulty: 'Hard',
            question: 'A book rests on a table. The table pushes up on the book. Is this the "reaction" to the book pushing down on the table?',
            choices: [
              'Yes, it\'s the reaction force',
              'No, both forces act on the book',
              'No, the reaction is the book pulling up on Earth',
              'Yes, all contact forces are action-reaction pairs'
            ],
            answer: 'No, the reaction is the book pulling up on Earth',
            answerIndex: 2,
            explanation: 'Common misconception! The book\'s weight acts downward on the table. The table pushing UP on the book is NOT the reaction - both forces act ON THE BOOK. The reaction to the book pushing on the table is the table pushing on the book. Wait, that\'s the same thing! Actually, the true reaction pair is: book pulls Earth up (gravity).',
            modelAnswer: 'Action-Reaction Pairs (Newton\'s 3rd Law):\n\nPair 1:\n• Book pushes DOWN on table\n• Table pushes UP on book\n(Both forces ON the book and table - but these are NOT a 3rd law pair!)\n\nPair 2:\n• Book pulls DOWN on Earth (weight)\n• Earth pulls UP on book\n(These ARE the 3rd law pair!)\n\nKey: 3rd law pairs ALWAYS involve two different objects, and both forces are of the SAME type (both contact OR both gravity).'
          },
          {
            type: questionTypes.graphAnalysis,
            difficulty: 'Medium',
            question: 'A velocity-time graph shows a straight line sloping downward. What does this tell us about motion?',
            choices: [
              'Object is speeding up',
              'Object is slowing down',
              'Object has constant velocity',
              'Object is stationary'
            ],
            answer: 'Object is slowing down',
            answerIndex: 1,
            explanation: 'On a v-t graph: Slope = acceleration, Height = velocity. A downward slope means negative (or decreasing) acceleration. If velocity is positive and decreasing, the object is slowing down.',
            modelAnswer: 'Reading a v-t graph:\n• SLOPE = acceleration\n• HEIGHT = velocity\n\nDownward slope (negative acceleration) means:\n• If velocity is positive → slowing down\n• If velocity is negative → speeding up in the negative direction\n\nArea UNDER the graph = distance traveled'
          },
          {
            type: questionTypes.conceptual,
            difficulty: 'Hard',
            question: 'When a car accelerates forward, friction on the tires points in which direction?',
            choices: [
              'Backward (opposing motion)',
              'Forward (in direction of motion)',
              'Downward (into the road)',
              'No friction - engine provides all force'
            ],
            answer: 'Forward (in direction of motion)',
            answerIndex: 1,
            explanation: 'Most people think friction opposes motion, but that\'s not always true! For a car to accelerate forward, tires push backward on the road. The road pushes forward on tires (friction). This is Newton\'s Third Law again - the tire\'s push on the road causes the road\'s push on the tire.',
            modelAnswer: 'For a car to ACCELERATE forward:\n\n1. Engine makes wheels spin backward\n2. Wheels push road BACKWARD (they want to slide backward)\n3. Road pushes wheels FORWARD (static friction)\n\nThis friction is what actually ACCELERATES the car!\n\nCommon misconception: "Friction always opposes motion" - This is wrong! Friction opposes RELATIVE MOTION between surfaces. Since the tire surface is momentarily at rest relative to the road, friction can actually PUSH the car forward.\n\nNote: Once moving at constant speed, friction (air drag, rolling resistance) opposes motion.'
          }
        ]
      }
    ]
  },
  {
    name: 'Forces and Energy',
    category: 'Mechanics',
    subtopics: [
      {
        name: 'Work and Energy',
        questions: [
          {
            type: questionTypes.calculation,
            difficulty: 'Easy',
            question: 'A force of 50N pushes a box 4m along the floor. How much work is done?',
            choices: ['200 J', '12.5 J', '54 J', '2000 J'],
            answer: '200 J',
            answerIndex: 0,
            explanation: 'Work = Force × Distance × cos(θ). Assuming force is parallel to motion: W = 50 × 4 = 200 J. Work measures energy transferred.',
            modelAnswer: 'Given: F = 50 N, d = 4 m, θ = 0° (parallel)\n\nW = F × d × cos(θ)\nW = 50 × 4 × cos(0°)\nW = 50 × 4 × 1\nW = 200 J\n\nNote: Work is done only when force has a component in the direction of motion.'
          },
          {
            type: questionTypes.realWorld,
            difficulty: 'Medium',
            question: 'A car traveling at 60 km/h brakes to a stop. Where does the car\'s kinetic energy go?',
            choices: [
              'It disappears',
              'It transforms to heat in the brakes',
              'It becomes potential energy',
              'It transfers to the road'
            ],
            answer: 'It transforms to heat in the brakes',
            answerIndex: 1,
            explanation: 'Conservation of energy! The kinetic energy doesn\'t just disappear - it converts to heat energy in the brake pads through friction. That\'s why brakes get hot during hard braking.',
            modelAnswer: 'Energy transformation during braking:\n\nKE (kinetic) → Heat (brake friction)\n\nThe brake pads press against the rotating disc. Friction converts kinetic energy into thermal (heat) energy.\n\nThis is why:\n• Brakes get hot during heavy braking\n• Brake pads wear out over time\n• Engineers design brake cooling systems\n\nEnergy is ALWAYS conserved - it just changes form!'
          },
          {
            type: questionTypes.conceptual,
            difficulty: 'Hard',
            question: 'Two identical balls are dropped from the same height. Ball A is dropped, Ball B is thrown horizontally. Which has more kinetic energy just before hitting the ground?',
            choices: [
              'Ball A',
              'Ball B',
              'They have the same kinetic energy',
              'Depends on the horizontal speed'
            ],
            answer: 'They have the same kinetic energy',
            answerIndex: 2,
            explanation: 'Both balls fall the same vertical distance, so they lose the same amount of gravitational potential energy. By conservation of energy, they must gain the same amount of kinetic energy. Horizontal motion doesn\'t affect vertical energy!',
            modelAnswer: 'Using Conservation of Energy:\n\nInitial state (both balls):\nPE = mgh, KE = 0\n\nFinal state (just before impact):\nPE = 0, KE = ?\n\nEnergy conservation:\nInitial energy = Final energy\nmgh + 0 = 0 + KE\nKE = mgh (same for both!)\n\nThe horizontal component of velocity:\n• Does NOT affect energy\n• Does NOT affect fall time (in ideal conditions)\n• Only affects WHERE it lands, not HOW FAST it falls'
          },
          {
            type: questionTypes.misconception,
            difficulty: 'Hard',
            question: 'A heavier object always falls faster than a lighter object. True or False?',
            choices: [
              'True - heavier objects have more weight',
              'False - all objects fall at the same rate in vacuum',
              'True - if air resistance is ignored',
              'False - only in the presence of air'
            ],
            answer: 'False - all objects fall at the same rate in vacuum',
            answerIndex: 1,
            explanation: 'Without air resistance, ALL objects fall at the same rate regardless of mass. This is because while heavier objects have more gravitational force, they also have more inertia. These effects cancel out, leaving acceleration = g for all objects.',
            modelAnswer: 'The famous experiment:\n\nIn vacuum (Apollo 15 Moon landing):\n• Hammer and feather released simultaneously\n• They hit the lunar surface at the same time\n\nWhy does this happen?\n\nNewton\'s 2nd Law: a = F/m\nGravitational force: F = mg\n\nSo: a = mg/m = g\n\nThe m cancels! Acceleration depends ONLY on g, not mass.\n\nOn Earth WITH air:\n• Air resistance affects lighter objects more\n• Feather flutters, hammer falls straight\n• Heavier objects DO fall faster in air\n\nSo the statement is:\n• FALSE in vacuum (all fall same)\n• TRUE in air (lighter = more air resistance effect)'
          }
        ]
      },
      {
        name: 'Momentum',
        questions: [
          {
            type: questionTypes.calculation,
            difficulty: 'Easy',
            question: 'A 2kg ball moving at 5 m/s has what momentum?',
            choices: ['10 kg⋅m/s', '7 kg⋅m/s', '2.5 kg⋅m/s', '3 kg⋅m/s'],
            answer: '10 kg⋅m/s',
            answerIndex: 0,
            explanation: 'Momentum = mass × velocity = 2kg × 5m/s = 10 kg⋅m/s. Momentum is a vector, so direction matters, but here we assume forward direction.',
            modelAnswer: 'Momentum (p) = mass (m) × velocity (v)\n\nGiven: m = 2 kg, v = 5 m/s\n\np = mv\np = 2 × 5\np = 10 kg⋅m/s\n\nNote: Momentum is a VECTOR, so direction matters. If moving forward is positive, p = +10 kg⋅m/s.'
          },
          {
            type: questionTypes.conceptual,
            difficulty: 'Medium',
            question: 'Two objects have the same momentum. Object A has small mass, Object B has large mass. Which has greater kinetic energy?',
            choices: [
              'Object A (small mass)',
              'Object B (large mass)',
              'They have the same kinetic energy',
              'Cannot be determined'
            ],
            answer: 'Object A (small mass)',
            answerIndex: 0,
            explanation: 'If p is same but m_A < m_B, then v_A > v_B. Since KE = ½mv² and v is squared, the object with smaller mass (but higher velocity) has more kinetic energy for the same momentum.',
            modelAnswer: 'Same momentum: p_A = p_B\n\np = mv, so if m_A < m_B:\nv_A = p/m_A > p/m_B = v_B\n\nKinetic energy:\nKE_A = ½m_Av_A² = ½m_A(p/m_A)² = p²/(2m_A)\nKE_B = p²/(2m_B)\n\nSince m_A < m_B:\np²/(2m_A) > p²/(2m_B)\nKE_A > KE_B\n\nThe object with SMALLER mass has MORE kinetic energy (because it must be moving faster to have the same momentum).'
          },
          {
            type: questionTypes.realWorld,
            difficulty: 'Hard',
            question: 'Why do padded dashboards make car crashes safer?',
            choices: [
              'They increase the force of impact',
              'They decrease the change in momentum',
              'They increase the time of impact, reducing force',
              'They make the car lighter'
            ],
            answer: 'They increase the time of impact, reducing force',
            answerIndex: 2,
            explanation: 'Impulse = Force × Time = Change in Momentum. The change in momentum is fixed (your body keeps moving at impact speed). By increasing collision time, the force is reduced. F = Δp/Δt. Double the time = half the force!',
            modelAnswer: 'The Physics of Car Safety:\n\nKey equation: F = Δp/Δt\n\nDuring a crash:\n• Δp (change in momentum) is FIXED - your body must stop\n• We CAN increase Δt (time of collision)\n\nHow padding helps:\n1. Crumple zones extend collision time\n2. Airbags inflate to slow you down gradually\n3. Padded dashboards increase contact time\n\nResult: Same momentum change, but:\n• Longer time → Smaller force → Less injury\n\nThis is why:\n• Cars are designed to crumple\n• We use airbags and seatbelts\n• Crash barriers are made of crushable material'
          }
        ]
      }
    ]
  },
  {
    name: 'Waves and Sound',
    category: 'Waves & Optics',
    subtopics: [
      {
        name: 'Wave Properties',
        questions: [
          {
            type: questionTypes.calculation,
            difficulty: 'Easy',
            question: 'A wave has frequency 50 Hz and wavelength 2m. What is its speed?',
            choices: ['100 m/s', '25 m/s', '52 m/s', '48 m/s'],
            answer: '100 m/s',
            answerIndex: 0,
            explanation: 'Wave speed = frequency × wavelength: v = fλ = 50 × 2 = 100 m/s. This fundamental equation connects all wave properties.',
            modelAnswer: 'Wave equation: v = fλ\n\nGiven:\nf = 50 Hzλ = 2 m\n\nSolution:\nv = f × λ\nv = 50 × 2\nv = 100 m/s\n\nThis works for ALL waves - sound, light, water waves!'
          },
          {
            type: questionTypes.conceptual,
            difficulty: 'Medium',
            question: 'When a wave passes from air into water, what changes?',
            choices: [
              'Frequency increases',
              'Wavelength increases',
              'Speed increases',
              'Frequency stays the same'
            ],
            answer: 'Frequency stays the same',
            answerIndex: 3,
            explanation: 'When waves enter a new medium, FREQUENCY never changes - it\'s determined by the source. What changes is wavelength and speed. In water, light slows down and wavelength decreases (for light) or increases (for sound).',
            modelAnswer: 'What happens when waves enter a new medium:\n\nTHINGS THAT CHANGE:\n• Speed (v) - changes based on medium properties\n• Wavelength (λ) - adjusts to keep f constant\n\nTHINGS THAT DON\'T CHANGE:\n• Frequency (f) - set by the source, always constant\n\nWhy frequency doesn\'t change:\n• Source vibrates at a certain rate\n• That vibration rate transfers to the new medium\n• Number of wave cycles per second stays the same\n\nFor light entering water:\n• Speed decreases\n• Wavelength decreases\n• Frequency stays same\n\nv = fλ still works!'
          },
          {
            type: questionTypes.realWorld,
            difficulty: 'Medium',
            question: 'Why does sound travel faster in solids than in gases?',
            choices: [
              'Solids are denser',
              'Molecules in solids are more tightly packed, transferring vibrations faster',
              'Solids have more molecules',
              'Gases absorb sound energy'
            ],
            answer: 'Molecules in solids are more tightly packed, transferring vibrations faster',
            answerIndex: 1,
            explanation: 'Sound is a mechanical wave - it travels through molecular collisions. In solids, molecules are close together, so vibrations transfer quickly. In gases, molecules are far apart, so it takes longer.',
            modelAnswer: 'Sound propagation mechanism:\n\nSound = vibrations passed through molecular collisions\n\nIn SOLIDS:\n• Molecules very close together\n• Vibration transfers quickly (like dominoes close together)\n• Speed in steel ≈ 6000 m/s\n\nIn GASES:\n• Molecules far apart\n• Vibration takes longer to transfer\n• Speed in air ≈ 343 m/s\n\nIn LIQUIDS (in between):\n• Molecules moderately spaced\n• Speed in water ≈ 1500 m/s\n\nSpeed order: Solid > Liquid > Gas'
          },
          {
            type: questionTypes.graphAnalysis,
            difficulty: 'Hard',
            question: 'The diagram shows a transverse wave. Point P is at a crest. What is happening to the medium particle at P?',
            choices: [
              'Moving upward at maximum speed',
              'Momentarily at rest',
              'Moving downward at maximum speed',
              'Moving at constant speed'
            ],
            answer: 'Momentarily at rest',
            answerIndex: 1,
            explanation: 'At the crest (and trough), the particle momentarily stops before changing direction. Think of a ball thrown upward - it stops momentarily at the highest point before falling back down.',
            modelAnswer: 'Wave motion and particles:\n\nAt a CREST:\n• Particle has maximum displacement (highest point)\n• Velocity = 0 (momentarily at rest)\n• Acceleration is maximum downward\n\nAt a TROUGH:\n• Particle has minimum displacement (lowest point)\n• Velocity = 0 (momentarily at rest)\n• Acceleration is maximum upward\n\nAt equilibrium (middle):\n• Speed is maximum\n• Displacement = 0\n• Acceleration = 0\n\nThis is similar to simple harmonic motion!'
          }
        ]
      },
      {
        name: 'Sound and Light',
        questions: [
          {
            type: questionTypes.realWorld,
            difficulty: 'Easy',
            question: 'Why can you hear someone around a corner but not see them?',
            choices: [
              'Sound is louder than light',
              'Sound waves diffract more than light waves',
              'Light travels faster than sound',
              'Sound requires a medium but light doesn\'t'
            ],
            answer: 'Sound waves diffract more than light waves',
            answerIndex: 1,
            explanation: 'Diffraction is bending of waves around obstacles. Sound has wavelengths of meters, comparable to doorways. Light has wavelengths of micrometers, much smaller than obstacles. Large wavelength = more diffraction.',
            modelAnswer: 'Diffraction: Bending of waves around obstacles\n\nSound waves:\n• Wavelength: ~0.3m to 3m (comparable to doorway)\n• Diffracts significantly around corners\n• You can hear around corners\n\nLight waves:\n• Wavelength: ~500 nm (micrometers)\n• Diffracts very little\n• Cannot see around corners\n\nRule: Waves diffract most when wavelength ≈ obstacle size.\n\nApplications:\n• AM radio (long wavelength) works around buildings\n• FM radio (short wavelength) needs direct line of sight'
          },
          {
            type: questionTypes.conceptual,
            difficulty: 'Hard',
            question: 'The Doppler effect causes the siren of an ambulance to sound higher-pitched as it approaches. What is actually happening to the sound waves?',
            choices: [
              'The siren is actually producing higher frequency waves',
              'The waves are compressed in front and stretched behind',
              'The air is moving faster near the siren',
              'Our ears become more sensitive to higher frequencies'
            ],
            answer: 'The waves are compressed in front and stretched behind',
            answerIndex: 1,
            explanation: 'As the source moves, it "catches up" with its own waves in front, compressing them (higher frequency). Behind, waves are spread out (lower frequency). The source frequency hasn\'t changed - it\'s the relative motion that affects what we hear.',
            modelAnswer: 'The Doppler Effect explained:\n\nMoving SOURCE (ambulance):\n\nApproaching you:\n• Source catches up to its own waves\n• Waves "bunch up" in direction of motion\n• You receive MORE cycles per second → HIGHER pitch\n\nReceding from you:\n• Source moves away from its waves\n• Waves "stretch out" behind\n• You receive FEWER cycles per second → LOWER pitch\n\nThe actual frequency from the siren doesn\'t change - it\'s the MOTION that changes what you receive!\n\nFormula:\nf\' = f × (v ± v_observer)/(v ∓ v_source)'
          }
        ]
      }
    ]
  },
  {
    name: 'Electricity',
    category: 'Electricity',
    subtopics: [
      {
        name: 'Electric Circuits',
        questions: [
          {
            type: questionTypes.calculation,
            difficulty: 'Easy',
            question: 'A 12V battery supplies current to a 6Ω resistor. What current flows?',
            choices: ['2 A', '72 A', '0.5 A', '18 A'],
            answer: '2 A',
            answerIndex: 0,
            explanation: 'Using Ohm\'s Law: I = V/R = 12/6 = 2 A. Current is the rate of charge flow determined by voltage and resistance.',
            modelAnswer: 'Ohm\'s Law: V = IR, so I = V/R\n\nGiven:\nV = 12 V\nR = 6 Ω\n\nI = V/R = 12/6 = 2 A\n\nInterpretation: 2 Coulombs of charge flow past a point every second.'
          },
          {
            type: questionTypes.conceptual,
            difficulty: 'Medium',
            question: 'In a series circuit, what happens to total resistance when you add more bulbs?',
            choices: [
              'Resistance decreases',
              'Resistance stays the same',
              'Resistance increases',
              'Resistance becomes zero'
            ],
            answer: 'Resistance increases',
            answerIndex: 2,
            explanation: 'Series resistance adds: R_total = R1 + R2 + R3... Adding more resistors in series is like making a longer path for electrons, making it harder for current to flow.',
            modelAnswer: 'Series circuit resistance:\n\nFormula: R_total = R1 + R2 + R3 + ...\n\nExample: Adding 3 identical bulbs (6Ω each)\n• 1 bulb: R = 6Ω\n• 2 bulbs: R = 6 + 6 = 12Ω\n• 3 bulbs: R = 6 + 6 + 6 = 18Ω\n\nWhy resistance increases:\n• More components in the path\n• Electrons encounter more opposition\n• Less current flows (bulbs get dimmer)\n\nOther series rules:\n• Same current through all components\n• Voltage divides across components\n• One bulb out = circuit broken (all go out)'
          },
          {
            type: questionTypes.realWorld,
            difficulty: 'Medium',
            question: 'Why are household outlets in parallel, not series?',
            choices: [
              'Parallel uses less wire',
              'Parallel allows each appliance to operate independently',
              'Series would make all appliances turn on together',
              'Parallel provides more power'
            ],
            answer: 'Parallel allows each appliance to operate independently',
            answerIndex: 1,
            explanation: 'In parallel, each appliance gets full voltage and can be switched on/off independently. In series, turning off one appliance would break the circuit for all.',
            modelAnswer: 'Parallel circuit advantages:\n\n1. INDEPENDENT OPERATION:\n• Each appliance gets full voltage (230V)\n• Turning off one doesn\'t affect others\n• Can have different resistance (power levels)\n\n2. CONSISTENT VOLTAGE:\n• All appliances see same voltage\n• Each operates as designed\n\n3. SAFETY:\n• One appliance failing doesn\'t affect others\n• Easier to troubleshoot\n\nSeries circuit problems:\n• Current same through all\n• One breaks = all stop working\n• Different resistance = different power\n\nThat\'s why your bedroom lamp works even when the kitchen is off!'
          },
          {
            type: questionTypes.misconception,
            difficulty: 'Hard',
            question: 'Electrons move at the speed of light through wires. True or False?',
            choices: [
              'True - electricity is instantaneous',
              'False - electrons move very slowly (drift velocity)',
              'True - that\'s why lights turn on immediately',
              'False - electrons don\'t move at all'
            ],
            answer: 'False - electrons move very slowly (drift velocity)',
            answerIndex: 1,
            explanation: 'Electron drift velocity is only about 0.1 mm/s! However, the electric field propagates at near light speed, so the effect (current) starts immediately. It\'s like a full water pipe - water comes out fast even though individual molecules move slowly.',
            modelAnswer: 'Drift velocity myth:\n\nElectron speed in wire:\n• Drift velocity: ~0.1 mm/s = 0.0001 m/s\n• To cross a 3m room: 8 hours!\n\nSo why does light turn on instantly?\n\nIt\'s like a train:\n• When you push the first car, the LAST car moves immediately\n• The "push" travels fast (electric field = light speed)\n• But each car moves slowly\n\nIn wires:\n• Electric field propagates: ~speed of light\n• Electrons drift: ~0.1 mm/s\n\nThe "signal" to start moving reaches all electrons instantly, but they move through the wire slowly.'
          }
        ]
      },
      {
        name: 'Electric Power',
        questions: [
          {
            type: questionTypes.calculation,
            difficulty: 'Easy',
            question: 'A 100W light bulb runs on 230V. What current does it draw?',
            choices: ['0.43 A', '2.3 A', '23 A', '0.23 A'],
            answer: '0.43 A',
            answerIndex: 0,
            explanation: 'P = IV, so I = P/V = 100/230 ≈ 0.43 A. This is why thin wires can carry household current - the current is relatively small despite high power.',
            modelAnswer: 'Power formula: P = IV\n\nGiven:\nP = 100 W\nV = 230 V\n\nSolving for I:\nI = P/V = 100/230 = 0.435 A ≈ 0.43 A\n\nNote: Even though 100W seems high, the current is small because voltage is high (230V).\n\nThis is why:\n• Household wires can be thin\n• High voltage = low current for same power\n• Power loss in transmission = I²R (lower I = less loss)'
          },
          {
            type: questionTypes.realWorld,
            difficulty: 'Medium',
            question: 'Your electricity bill charges per kilowatt-hour (kWh). What is a kilowatt-hour?',
            choices: [
              'Power of 1000 watts',
              'Energy equal to 1000 joules per second',
              '1000 watts used for one hour',
              'A unit of electrical resistance'
            ],
            answer: '1000 watts used for one hour',
            answerIndex: 2,
            explanation: 'kWh is a unit of ENERGY (not power). 1 kWh = 1000W × 3600s = 3.6 million joules. Your bill measures total energy used, not power.',
            modelAnswer: 'Kilowatt-hour is a unit of ENERGY:\n\n1 kWh = 1000 W × 1 hour\n= 1000 W × 3600 s\n= 3,600,000 J\n= 3.6 MJ\n\nExamples:\n• 100W bulb for 10 hours = 1 kWh\n• 1000W heater for 1 hour = 1 kWh\n• 50W fan for 20 hours = 1 kWh\n\nWhy kWh instead of joules?\n• Joules are too small for practical use\n• Easier to understand (100 units × $0.10)\n• Matches how we think about usage'
          }
        ]
      }
    ]
  },
  {
    name: 'Magnetism',
    category: 'Electricity',
    subtopics: [
      {
        name: 'Magnetic Fields',
        questions: [
          {
            type: questionTypes.conceptual,
            difficulty: 'Easy',
            question: 'What creates a magnetic field around a current-carrying wire?',
            choices: [
              'The wire itself',
              'Moving electric charges (electrons)',
              'The power source',
              'The air around the wire'
            ],
            answer: 'Moving electric charges (electrons)',
            answerIndex: 1,
            explanation: 'Moving charges (current) create magnetic fields. This is the principle behind electromagnets - moving electrons in a wire generate a circulating magnetic field around the wire.',
            modelAnswer: 'Magnetism from moving charges:\n\nStationary charges: Electric field only\nMoving charges: Electric + Magnetic field\n\nRight-hand rule:\n• Point thumb in direction of current\n• Fingers curl in direction of magnetic field\n\nWhy current creates magnetism:\n• Electrons moving through wire\n• Each electron creates tiny magnetic field\n• Billions of electrons aligned = measurable field\n\nApplications:\n• Electromagnets\n• Electric motors\n• Transformers\n• MRI machines'
          },
          {
            type: questionTypes.realWorld,
            difficulty: 'Medium',
            question: 'How does an electric motor convert electrical energy to mechanical energy?',
            choices: [
              'Magnets push on the wire directly',
              'Magnetic force on current-carrying conductors causes rotation',
              'Electricity heats the motor causing expansion',
              'Chemical reactions in the motor'
            ],
            answer: 'Magnetic force on current-carrying conductors causes rotation',
            answerIndex: 1,
            explanation: 'Current in wires within magnetic fields experiences force (F = BIL). This force makes the wire move, converting electrical energy to kinetic energy. This is how all electric motors work.',
            modelAnswer: 'Electric motor principle:\n\n1. Current flows through coil in magnetic field\n2. Force on each side of coil: F = BIL\n3. Forces on opposite sides are in opposite directions\n4. This creates a TORQUE (rotational force)\n5. Coil rotates\n\nThe motor effect (Fleming\'s Left Hand Rule):\n• 1st finger: Magnetic field (N to S)\n• 2nd finger: Current\n• Thumb: Motion\n\nKey parts:\n• Magnets: Provide magnetic field\n• Coil: Carries current\n• Commutator: Reverses current direction\n• Shaft: Transfers rotation\n\nThis is ELECTROMAGNETIC INDUCTION in reverse!'
          },
          {
            type: questionTypes.conceptual,
            difficulty: 'Hard',
            question: 'Why does a permanent magnet attract iron but not aluminum or copper?',
            choices: [
              'Iron is heavier than other metals',
              'Iron has unpaired electrons that can align',
              'Aluminum and copper are non-metals',
              'Magnetic force only works with iron'
            ],
            answer: 'Iron has unpaired electrons that can align',
            answerIndex: 1,
            explanation: 'Magnetism comes from electron spin. In iron, there are unpaired electrons whose magnetic moments can align, creating domains. In aluminum and copper, electrons are paired or their domains don\'t align.',
            modelAnswer: 'Magnetic materials explained:\n\nFERROMAGNETIC (attracted to magnets):\n• Iron, Cobalt, Nickel, Gadolinium\n• Have magnetic domains\n• Domains can align with external field\n• Becomes temporarily magnetized\n\nNON-MAGNETIC:\n• Aluminum: Electron configuration cancels out\n• Copper: Same - no unpaired electrons\n• Their electron spins pair up\n• No net magnetic moment\n\nDomain theory:\n• Small regions where electron spins align\n• In unmagnetized iron: domains random\n• Near magnet: domains align\n• Creates attraction\n\nThis is also why heating a magnet destroys it - thermal energy randomizes domain alignment!'
          }
        ]
      }
    ]
  },
  {
    name: 'Thermal Physics',
    category: 'Thermal',
    subtopics: [
      {
        name: 'Heat and Temperature',
        questions: [
          {
            type: questionTypes.conceptual,
            difficulty: 'Easy',
            question: 'What is the difference between heat and temperature?',
            choices: [
              'They are the same thing',
              'Heat is energy transfer, temperature is average kinetic energy',
              'Temperature is energy transfer, heat is average kinetic energy',
              'Heat measures hotness, temperature measures coldness'
            ],
            answer: 'Heat is energy transfer, temperature is average kinetic energy',
            answerIndex: 1,
            explanation: 'Temperature measures the AVERAGE kinetic energy of particles. Heat measures the TOTAL energy transferred due to temperature difference. A cup of hot tea has higher temperature than a bathtub of warm water, but the bathtub has more heat energy (more molecules).',
            modelAnswer: 'Heat vs Temperature:\n\nTEMPERATURE:\n• Measures AVERAGE kinetic energy per molecule\n• Determines direction of heat flow\n• "How hot or cold" something is\n• Measured in °C, K, or °F\n\nHEAT:\n• Measures TOTAL thermal energy transferred\n• Energy in transit (not stored as "heat")\n• Depends on mass and specific heat\n• Measured in Joules\n\nAnalogy:\n• Temperature = height of water in a tank\n• Heat = total amount of water\n\nExample:\n• Teaspoon of boiling water (100°C)\n• Bathtub of warm water (40°C)\n• Spoon: higher temperature, LESS heat energy\n• Bathtub: lower temperature, MORE heat energy'
          },
          {
            type: questionTypes.calculation,
            difficulty: 'Easy',
            question: 'How much heat is needed to raise 2kg of water from 20°C to 70°C? (c_water = 4200 J/kg°C)',
            choices: ['420 kJ', '84 kJ', '420 J', '168 kJ'],
            answer: '420 kJ',
            answerIndex: 0,
            explanation: 'Q = mcΔT = 2 × 4200 × 50 = 420,000 J = 420 kJ. This is why heating water requires a lot of energy.',
            modelAnswer: 'Heat equation: Q = mcΔT\n\nGiven:\nm = 2 kg\nc = 4200 J/kg°C (specific heat capacity of water)\nΔT = 70 - 20 = 50°C\n\nSolution:\nQ = m × c × ΔT\nQ = 2 × 4200 × 50\nQ = 420,000 J\nQ = 420 kJ\n\nThis explains why:\n• Water takes long to boil\n• Oceans moderate climate\n• Water is good coolant'
          },
          {
            type: questionTypes.realWorld,
            difficulty: 'Medium',
            question: 'Why does a coastal city have milder temperatures than an inland city at the same latitude?',
            choices: [
              'Coastal cities are at lower altitude',
              'Water has high specific heat capacity, moderating temperature',
              'Ocean currents bring warm water',
              'Coastal cities receive more sunshine'
            ],
            answer: 'Water has high specific heat capacity, moderating temperature',
            answerIndex: 1,
            explanation: 'Water absorbs and releases heat slowly due to its high specific heat capacity. During the day, the ocean absorbs heat without getting very hot. At night, it releases heat, keeping coastal air warm. Land heats and cools quickly.',
            modelAnswer: 'Specific heat capacity effect:\n\nWATER (high c = 4200 J/kg°C):\n• Heats up SLOWLY\n• Cools down SLOWLY\n• Stores lots of energy per degree\n\nLAND (low c ≈ 800 J/kg°C):\n• Heats up QUICKLY\n• Cools down QUICKLY\n• Temperature changes rapidly\n\nCoastal climate moderation:\n\nDAY:\n• Land heats faster than ocean\n• Air rises over land (low pressure)\n• Cool air from ocean flows in\n• Sea breeze cools the coast\n\nNIGHT:\n• Land cools faster\n• Ocean releases stored heat\n• Air flows from ocean to land\n• Coastal areas stay warmer\n\nResult: Smaller temperature range on coasts!'
          },
          {
            type: questionTypes.misconception,
            difficulty: 'Hard',
            question: 'You feel cold when you step out of a swimming pool because the air temperature is cold. True or False?',
            choices: [
              'True - air is colder than water',
              'False - evaporation causes cooling regardless of air temperature',
              'True - water conducts heat from body',
              'False - convection removes heat'
            ],
            answer: 'False - evaporation causes cooling regardless of air temperature',
            answerIndex: 1,
            explanation: 'Even in warm air, you feel cold wet because evaporation requires heat. Water molecules escaping your skin带走 energy, cooling you down. This is why fans feel cool - they accelerate evaporation.',
            modelAnswer: 'Why wet feels cold:\n\nEVAPORATION COOLING:\n• Water molecules need energy to escape surface\n• Energy comes from your skin\n• Skin loses thermal energy → feels cold\n\nNot conduction:\n• Conduction DOES transfer some heat\n• But the MAIN effect is evaporation\n\nEven in WARM air:\n• Step out soaking wet\n• Water evaporates\n• Each molecule that escapes takes ~2260 J\n• You feel cold even in 30°C air!\n\nThis is why:\n• Fans feel cool (faster evaporation)\n• Humid air feels warmer (less evaporation)\n• Sweating cools us down\n• Dogs pant (evaporation from tongue)'
          }
        ]
      }
    ]
  },
  {
    name: 'Modern Physics',
    category: 'Modern Physics',
    subtopics: [
      {
        name: 'Atomic Structure',
        questions: [
          {
            type: questionTypes.conceptual,
            difficulty: 'Medium',
            question: 'What is the difference between an atom and an ion?',
            choices: [
              'There is no difference',
              'An ion has gained or lost electrons',
              'An ion has gained or lost protons',
              'An ion is smaller than an atom'
            ],
            answer: 'An ion has gained or lost electrons',
            answerIndex: 1,
            explanation: 'An ion is an atom with unequal numbers of protons and electrons. The atomic number (protons) defines the element. Losing/gaining electrons creates a charged ion but doesn\'t change the element.',
            modelAnswer: 'Atom vs Ion:\n\nATOM (neutral):\n• Protons = Electrons\n• Net charge = 0\n• Example: Na (11 protons, 11 electrons)\n\nION (charged):\n• Protons ≠ Electrons\n• Net charge ≠ 0\n• Example: Na⁺ (11 protons, 10 electrons)\n\nTypes of ions:\n• CATION: Positive (lost electrons)\n  Na → Na⁺ + e⁻\n• ANION: Negative (gained electrons)\n  Cl + e⁻ → Cl⁻\n\nImportant:\n• Changing electrons = ion\n• Changing protons = different element\n• Ions still behave chemically like their element'
          },
          {
            type: questionTypes.realWorld,
            difficulty: 'Hard',
            question: 'How does a smoke detector use radiation to save lives?',
            choices: [
              'It emits radiation that destroys smoke',
              'Smoke particles ionize air, reducing current in a radioactive source setup',
              'Radioactive material heats up smoke particles',
              'Radiation causes smoke to glow'
            ],
            answer: 'Smoke particles ionize air, reducing current in a radioactive source setup',
            answerIndex: 1,
            explanation: 'Smoke detectors use a tiny radioactive source (Americium-241) that ionizes air molecules, allowing a small current to flow. Smoke particles attach to ions, reducing the current. When current drops, the alarm sounds.',
            modelAnswer: 'How ionization smoke detectors work:\n\nINSIDE:\n• Tiny radioactive source (Am-241)\n• Chamber with two electrodes\n• Air between electrodes\n\nHOW IT WORKS:\n1. Radiation ionizes air molecules\n2. Ions create small electrical current\n3. Current flows between electrodes\n4. Smoke enters chamber\n5. Smoke attaches to ions\n6. Ion mobility decreases\n7. Current drops below threshold\n8. ALARM triggers!\n\nWhy Americium-241:\n• Emits alpha particles (easily stopped)\n• Low radiation - safe for home use\n• Long half-life (432 years)\n• Stays active for detector\'s lifetime\n\nSafety:\n• Alpha particles stopped by paper\n• Sealed source prevents exposure\n• Only dangerous if ingested/inhaled'
          }
        ]
      },
      {
        name: 'Radioactivity',
        questions: [
          {
            type: questionTypes.conceptual,
            difficulty: 'Medium',
            question: 'What is the difference between alpha, beta, and gamma radiation?',
            choices: [
              'They are all the same type of radiation',
              'Alpha = helium nuclei, Beta = electrons, Gamma = electromagnetic waves',
              'Alpha = electrons, Beta = helium nuclei, Gamma = neutrons',
              'They differ only in speed'
            ],
            answer: 'Alpha = helium nuclei, Beta = electrons, Gamma = electromagnetic waves',
            answerIndex: 1,
            explanation: 'Alpha (α) particles are helium nuclei (2 protons, 2 neutrons), heavy and slow. Beta (β) particles are electrons, lighter and faster. Gamma (γ) is electromagnetic radiation (like light), no mass, most penetrating.',
            modelAnswer: 'Three types of nuclear radiation:\n\nALPHA (α) particles:\n• Helium nucleus: 2p + 2n\n• +2 charge\n• HEAVIEST, slowest\n• Stopped by paper/skin\n• Most ionizing\n• Shielding: Paper, skin\n\nBETA (β) particles:\n• Electron (or positron)\n• ±1 charge\n• Light, fast\n• Stopped by aluminum\n• Moderately ionizing\n• Shielding: Aluminum, plastic\n\nGAMMA (γ) rays:\n• Electromagnetic radiation\n• No charge, no mass\n• Fastest (speed of light)\n• Stopped by lead/concrete\n• Least ionizing\n• Shielding: Lead, thick concrete\n\nPenetrating power:\nγ > β > α\nIonizing power:\nα > β > γ\n\nUses:\n• α: Smoke detectors, military\n• β: Medical tracers, thickness gauges\n• γ: Cancer treatment, sterilization'
          },
          {
            type: questionTypes.calculation,
            difficulty: 'Medium',
            question: 'A radioactive sample has half-life of 8 days. How much remains after 24 days if you started with 80g?',
            choices: ['40g', '20g', '10g', '5g'],
            answer: '10g',
            answerIndex: 2,
            explanation: 'After 24 days = 3 half-lives (24/8 = 3). After 1st half-life: 40g. After 2nd: 20g. After 3rd: 10g.',
            modelAnswer: 'Half-life calculation:\n\nFormula: N = N₀ × (½)^(t/t½)\n\nGiven:\nN₀ = 80 g\nt½ = 8 days\nt = 24 days\n\nNumber of half-lives:\nn = t/t½ = 24/8 = 3\n\nCalculation:\nN = 80 × (½)³\nN = 80 × ⅛\nN = 10 g\n\nStep by step:\n• After 0 days: 80 g\n• After 8 days (1 half-life): 40 g\n• After 16 days (2 half-lives): 20 g\n• After 24 days (3 half-lives): 10 g'
          },
          {
            type: questionTypes.realWorld,
            difficulty: 'Hard',
            question: 'Why are radioactive waste containers sometimes buried in deep geological formations?',
            choices: [
              'To keep them cool',
              'Geological barriers provide long-term isolation from living organisms',
              'The pressure helps decay the waste faster',
              'It is cheaper than above-ground storage'
            ],
            answer: 'Geological barriers provide long-term isolation from living organisms',
            answerIndex: 1,
            explanation: 'Some radioactive waste remains dangerous for thousands of years. Deep geological storage isolates it from ecosystems, groundwater, and human contact. The rock layers act as additional barriers if the containers eventually fail.',
            modelAnswer: 'Why geological disposal?\n\nWASTE PROBLEM:\n• Some isotopes: half-life = 10,000+ years\n• Plutonium-239: half-life = 24,000 years\n• Waste stays dangerous longer than human civilization\n\nDEEP STORAGE CONCEPT:\n1. Waste solidified in glass/ceramic\n2. Encased in corrosion-resistant containers\n3. Buried 500m below surface in stable rock\n4. Multiple geological barriers\n\nADVANTAGES:\n• Far from surface ecosystems\n• Stable geology (no earthquakes, groundwater)\n• Multiple barriers if one fails\n• No human access needed\n• Self-contained for millennia\n\nExamples:\n• Finland: Onkalo spent nuclear fuel repository\n• Sweden, France: Deep geological repositories planned\n• USA: Yucca Mountain (proposed but controversial)'
          }
        ]
      }
    ]
  }
];

// Generate flat question list
function generateQuestions() {
  const allQuestions = [];
  let id = 1;
  
  topics.forEach(topic => {
    topic.subtopics.forEach(subtopic => {
      subtopic.questions.forEach(q => {
        allQuestions.push({
          id: `Q${String(id).padStart(5, '0')}`,
          topic: subtopic.name,
          category: topic.category,
          difficulty: q.difficulty,
          type: 'Multiple Choice',
          question: q.question,
          choices: q.choices,
          answer: q.answer,
          answerIndex: q.answerIndex,
          explanation: q.explanation,
          modelAnswer: q.modelAnswer,
          subcategory: topic.name
        });
        id++;
      });
    });
  });
  
  return allQuestions;
}

module.exports = { generateQuestions, topics, questionTypes };
