export const mockNoteSubjects = [
  'Indian Knowledge Systems (IKS)',
  'Artificial Intelligence (AI)',
  'Cyber Security',
  'Numerical Methods',
  'Software Testing & Quality Assurance (STQA)'
]

export const mockInitialNotes = [
  {
    id: 'note-1',
    title: 'Quality Assurance (QA) vs Quality Control (QC): Comparative Study',
    subject: 'Software Testing & Quality Assurance (STQA)',
    subjectCode: 'STQA',
    topic: 'Process vs Product Quality Engineering',
    content: `Quality Assurance (QA) and Quality Control (QC) are two complementary disciplines in software engineering:

1. Quality Assurance (QA) - Process-Oriented:
• Definition: A proactive, planned set of systematic activities to ensure the software development process complies with quality standards.
• Nature: Defect prevention throughout the entire SDLC.
• Key Activities: Process definition, standard operating procedures (SOPs), quality audits, code review guidelines, and compliance inspections.
• V-Model Alignment: Operates on the left wing of the V-Model during Requirements Analysis and Design (Static Verification).

2. Quality Control (QC) - Product-Oriented:
• Definition: A reactive set of operational activities focused on evaluating the built software product to identify defects.
• Nature: Defect detection before release to users.
• Key Activities: Dynamic testing (Unit, Integration, System, Performance, Security testing), bug logging, and regression test suites.
• V-Model Alignment: Operates on the right wing of the V-Model during test execution (Dynamic Validation).

3. The 1-10-100 Rule of Quality Cost:
• $1 to prevent a defect during requirement/design phase (QA).
• $10 to detect and fix during internal testing phase (QC).
• $100+ to remediate if the defect escapes into live production.`,
    tags: ['Exam Focus', 'Unit 1', 'QA vs QC'],
    updatedAt: 'Sep 25, 2026',
    readTimeMinutes: 3
  },
  {
    id: 'note-2',
    title: 'Newton-Raphson Method for Root Finding',
    subject: 'Numerical Methods',
    subjectCode: 'MATH',
    topic: 'Iterative Numerical Methods',
    content: `The Newton-Raphson method is a powerful iterative algorithm used to approximate real roots of non-linear algebraic and transcendental equations f(x) = 0.

1. Purpose & Iteration Formula:
• Starting from an initial approximation x_0, the next improved estimate is calculated using:
  x_{n+1} = x_n - [ f(x_n) / f'(x_n) ]
  where f'(x_n) != 0.

2. Geometric Interpretation:
• A tangent line is drawn to the curve y = f(x) at the point (x_n, f(x_n)).
• The point where this tangent line intersects the x-axis gives the next successive approximation x_{n+1}.

3. Convergence & Properties:
• Order of Convergence: Quadratic (Order = 2). The number of accurate decimal places doubles in each successive iteration near the root.
• Convergence Condition: | f(x) * f''(x) | < | f'(x) |^2 in the neighborhood of the root.

4. Drawbacks & Failure Conditions:
• Fails if f'(x_n) = 0 (horizontal tangent, resulting in division by zero).
• May diverge or oscillate infinitely if the initial guess x_0 is chosen far from the true root.`,
    tags: ['Formula', 'Unit 2', 'Numerical Method', 'Newton'],
    updatedAt: 'Sep 24, 2026',
    readTimeMinutes: 4
  },
  {
    id: 'note-3',
    title: 'Supervised Learning: Regression vs Classification',
    subject: 'Artificial Intelligence (AI)',
    subjectCode: 'AI',
    topic: 'Machine Learning Fundamentals',
    content: `Supervised Learning is a core machine learning paradigm where the algorithm learns a predictive mapping function from input features (X) to labeled target outputs (Y).

1. Supervised Learning Concept:
• Relies on a labeled training dataset containing pairs of (input features, ground truth target).
• Goal: Minimize empirical loss on training samples and generalize well to unseen test data.

2. Regression (Continuous Output):
• Goal: Predict a continuous numerical quantity.
• Output Range: Real-valued numbers (e.g., predicting house prices, temperature, stock prices).
• Popular Algorithms: Linear Regression, Polynomial Regression, Ridge/Lasso Regression, Support Vector Regression (SVR).
• Evaluation Metrics: Mean Squared Error (MSE), Root Mean Squared Error (RMSE), Mean Absolute Error (MAE), R^2 Score.

3. Classification (Discrete Output):
• Goal: Predict a categorical class label or category.
• Output Range: Binary (0 or 1, Spam vs Ham) or Multi-class (Cat, Dog, Bird).
• Popular Algorithms: Logistic Regression, Decision Trees, Random Forests, Naive Bayes, Support Vector Machines (SVM), k-NN.
• Evaluation Metrics: Accuracy, Precision, Recall, F1-Score, Confusion Matrix, ROC-AUC.

4. Summary Difference:
• Regression models relationships between continuous variables, whereas Classification separates feature space into distinct decision boundaries.`,
    tags: ['Exam Focus', 'Machine Learning', 'Difference', 'Regression'],
    updatedAt: 'Sep 22, 2026',
    readTimeMinutes: 4
  },
  {
    id: 'note-4',
    title: 'Authentication and Multi-Factor Authentication',
    subject: 'Cyber Security',
    subjectCode: 'CYBER',
    topic: 'Identity and Access Management',
    content: `Authentication is the foundational cybersecurity mechanism of verifying the claimed identity of a user, service, or device before granting system access.

1. Meaning of Authentication:
• Distinguishes between Identification (who you claim to be) and Authentication (proving that claim is valid).

2. Three Core Authentication Factors:
• Something you know (Knowledge Factor): Passwords, PINs, security questions, passphrases.
• Something you have (Possession Factor): Smartphone authenticator apps, SMS OTP tokens, smartcards, hardware keys (YubiKey).
• Something you are (Inherence Factor): Biometrics like fingerprint scans, retina/iris scans, facial recognition, voiceprint.

3. Multi-Factor Authentication (MFA):
• Requires presenting two or more independent credentials from different factor categories.
• Important Rule: Two separate passwords do NOT constitute MFA (both are knowledge factors); a password + mobile OTP is true 2FA.

4. Basic Security Importance:
• Defeats credential stuffing, brute-force password guessing, and automated phishing compromises.
• Ensures confidentiality, integrity, and non-repudiation in modern cloud environments.`,
    tags: ['Security', 'Authentication', 'MFA'],
    updatedAt: 'Sep 20, 2026',
    readTimeMinutes: 3
  },
  {
    id: 'note-5',
    title: 'Universal Principles in Indian Knowledge Systems',
    subject: 'Indian Knowledge Systems (IKS)',
    subjectCode: 'IKS',
    topic: 'Universal Principles',
    content: `Indian Knowledge Systems (IKS) are rooted in foundational universal principles that connect scientific inquiry, ethical responsibility, and systematic epistemology.

1. Meaning of Universal Principles:
• Universal principles (Samanya Dharma & Rta) represent foundational cosmic, ethical, and natural laws that remain consistent across time and geographic boundaries.
• They govern the harmony between individuals, society, and the ecological universe.

2. Connection with Sastra & Knowledge Systems:
• Sastras (disciplines of systematic knowledge) approach arts, medicine (Ayurveda), mathematics (Ganita), astronomy (Jyotisha), and linguistics (Vyakarana) as interconnected fields of inquiry.
• Emphasizes holistic worldview and sustainable living in alignment with natural cycles.

3. Epistemological Foundation - Pramana Vada:
• Scientific and philosophical claims in IKS require valid means of knowledge (Pramana), which include:
  - Pratyaksha (Direct sensory perception / empirical observation)
  - Anumana (Rigorous logical deduction and inference)
  - Shabda (Authoritative testimony of verified experts)

4. Importance in Modern Context:
• Provides ethical frameworks for sustainable development, environmental balance, and holistic wellness in contemporary science and technology.`,
    tags: ['IKS', 'Universal Principles', 'Pramana', 'Unit 1'],
    updatedAt: 'Sep 18, 2026',
    readTimeMinutes: 4
  }
]
