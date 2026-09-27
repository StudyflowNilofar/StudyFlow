export const mockPlannerTopics = [
  {
    id: 'topic-qa-qc',
    code: 'CS605',
    subject: 'Software Engineering & Testing',
    title: 'Quality Assurance (QA) vs Quality Control (QC)',
    shortTitle: 'QA vs QC',
    durationMinutes: 45,
    difficulty: 'Intermediate',
    targetMarks: '10 Marks',
    semester: 'Semester 6',
    date: 'Today, Aug 16, 2026',
    objectives: [
      'Understand the fundamental definition and purpose of QA and QC in SDLC',
      'Analyze the core differences: Process-oriented vs Product-oriented activities',
      'Examine verification (QA) vs validation (QC) techniques',
      'Master the standard 10-mark university exam comparative answer structure'
    ],
    textbook: {
      title: "Software Engineering: A Practitioner's Approach",
      edition: '9th Edition',
      author: 'Roger S. Pressman & Bruce R. Maxim',
      publisher: 'McGraw-Hill Education',
      chapter: 'Chapter 19: Software Quality Assurance',
      pages: 'pp. 412–428',
      referenceBook: 'Software Testing: Principles and Practices by Srinivasan Desikan & Gopalaswamy Ramesh (Ch. 2)'
    },
    concept: {
      summary:
        'Quality Assurance (QA) is a proactive, process-driven approach aimed at preventing software defects throughout the development lifecycle, whereas Quality Control (QC) is a reactive, product-driven approach focused on detecting and fixing defects in the final software deliverables.',
      qaOverview: {
        definition:
          'Quality Assurance (QA) encompasses a planned and systematic pattern of all actions necessary to provide adequate confidence that an item or product conforms to established technical requirements.',
        nature: 'Proactive & Preventative (Process-focused)',
        activities: [
          'Process definition and standard operating procedures (SOPs)',
          'Software process audits & compliance inspections',
          'Code quality standards & design review guidelines',
          'Training engineering teams on best development methodologies'
        ]
      },
      qcOverview: {
        definition:
          'Quality Control (QC) is a set of activities designed to evaluate a created software product to ensure that it meets all quality and operational specifications.',
        nature: 'Reactive & Detective (Product-focused)',
        activities: [
          'Executing unit, integration, system, and regression test suites',
          'Black-box and white-box test case execution',
          'Bug logging, defect severity tracking, and verification',
          'Performance, stress, and security vulnerability scanning'
        ]
      },
      comparisonTable: [
        {
          parameter: 'Core Focus',
          qa: 'Process-oriented: Focuses on how software is built to prevent defects.',
          qc: 'Product-oriented: Focuses on the actual application to find defects.'
        },
        {
          parameter: 'Primary Goal',
          qa: 'Prevent defects from occurring in the first place.',
          qc: 'Identify and fix defects before the software is released to users.'
        },
        {
          parameter: 'Approach',
          qa: 'Proactive management throughout all SDLC stages.',
          qc: 'Reactive verification after code/module is developed.'
        },
        {
          parameter: 'Key Technique',
          qa: 'Verification (Reviews, Walkthroughs, Process Audits).',
          qc: 'Validation (Executing test cases, Dynamic Testing).'
        },
        {
          parameter: 'Responsibility',
          qa: 'Entire team (Project Managers, Architects, QA Engineers).',
          qc: 'Dedicated Testing / QC Team.'
        },
        {
          parameter: 'SDLC Timing',
          qa: 'Starts from Requirements Gathering & Design Phase.',
          qc: 'Starts once Testing/Execution Phase begins.'
        },
        {
          parameter: 'Cost of Fix',
          qa: 'Low (defects prevented early save high remediation costs).',
          qc: 'Moderate to High (defects found later require code rework).'
        }
      ],
      examTip:
        'Always remember the phrase: QA is "Building the right product the right way" (Process), while QC is "Confirming that the product built matches specifications" (Product).'
    },
    examAnswer: {
      format: 'University Semester Exam Format (10 Marks Question)',
      question:
        'Explain the difference between Quality Assurance (QA) and Quality Control (QC) in software development with suitable examples and comparative parameters.',
      timeAllocation: '15 Minutes recommended writing time',
      sections: [
        {
          heading: '1. Introduction & Definitions (2 Marks)',
          content:
            'Software Quality is defined as the degree to which software conforms to explicit functional specifications and implicit user expectations. Achieving high quality requires two complementary disciplines:\n\n• Quality Assurance (QA): A proactive, managerial and process-oriented discipline aimed at preventing defects by defining engineering standards, peer review checklists, and organizational audit workflows.\n\n• Quality Control (QC): A reactive, operational and product-oriented discipline aimed at identifying defects by executing automated test scripts, manual test runs, and regression analysis on functional builds.'
        },
        {
          heading: '2. Comparative Difference Table (4 Marks)',
          isTable: true,
          tableRows: [
            { param: 'Definition', qa: 'Technique of defect prevention.', qc: 'Technique of defect detection.' },
            { param: 'Focus', qa: 'Process and methodology.', qc: 'Final software product.' },
            { param: 'Orientation', qa: 'Proactive quality engineering.', qc: 'Reactive quality measurement.' },
            { param: 'Methodology', qa: 'Verification (Audits, inspections).', qc: 'Validation (Dynamic testing).' },
            { param: 'Personnel', qa: 'All project stakeholders.', qc: 'Testing & QC specialists.' },
            { param: 'Cost Impact', qa: 'Low cost of defect prevention.', qc: 'Higher cost of defect fixing.' }
          ]
        },
        {
          heading: '3. Relationship in the SDLC & V-Model (2 Marks)',
          content:
            'In the Software Development Life Cycle (SDLC):\n• QA activities operate on the left wing of the V-Model during Requirements Analysis, System Architecture, and Detailed Design (performing static verification, risk assessments, and compliance audits).\n• QC activities operate on the right wing of the V-Model during Unit Testing, Integration Testing, System Testing, and User Acceptance Testing (executing dynamic test suites against actual code).'
        },
        {
          heading: '4. Practical Industry Example & Conclusion (2 Marks)',
          content:
            'Example in Banking Software Development:\n• QA Example: Formulating strict data encryption guidelines and conducting peer design reviews for Payment Gateway modules to prevent SQL Injection vulnerabilities.\n• QC Example: Running automated penetration test suites and testing card transaction edge cases with mock payments to catch concurrency errors before production deployment.\n\nConclusion: QA and QC are complementary; QA ensures robust processes to minimize defect introduction, while QC acts as the safety net to catch any remaining flaws.'
        }
      ]
    },
    flashcards: [
      {
        id: 'fc-1',
        tag: 'Core Concept',
        question: 'What is the primary difference in orientation between QA and QC?',
        answer:
          'QA is Process-Oriented and Proactive (focuses on defect prevention), whereas QC is Product-Oriented and Reactive (focuses on defect detection through test execution).',
        hint: 'Think: Process prevention vs Product detection.'
      },
      {
        id: 'fc-2',
        tag: 'Techniques',
        question: 'Which discipline is associated with "Verification" and which with "Validation"?',
        answer:
          'Quality Assurance (QA) is associated with Verification (Static analysis, reviews, audits), while Quality Control (QC) is associated with Validation (Dynamic test case execution on running code).',
        hint: 'Verification = Are we building the product right? Validation = Are we building the right product?'
      },
      {
        id: 'fc-3',
        tag: 'SDLC Timing',
        question: 'At what phase of the SDLC does Quality Assurance (QA) begin?',
        answer:
          'QA begins right at the project kickoff during the Requirements Gathering and Design phases by establishing quality metrics, standards, and review guidelines.',
        hint: 'QA is involved from Day 1 of the project.'
      },
      {
        id: 'fc-4',
        tag: 'Responsibility',
        question: 'Who is responsible for QA versus QC in a software engineering organization?',
        answer:
          'QA is the responsibility of the entire development team (managers, designers, architects, and QA leads). QC is primarily the responsibility of the dedicated software testing team.',
        hint: 'Whole team vs Testing team.'
      },
      {
        id: 'fc-5',
        tag: 'Exam Key Rule',
        question: 'What is the "1-10-100 Rule" regarding QA defect prevention vs QC fixing costs?',
        answer:
          'It costs $1 to prevent a defect (QA), $10 to detect and fix it during testing (QC), and $100+ to remediate it if it escapes into production (Customer Support / Maintenance).',
        hint: 'Prevention is 100x cheaper than post-release patching.'
      }
    ],
    revisionSchedule: [
      {
        id: 'rev-1',
        day: 'Day 1 (24 Hours)',
        title: 'Active Recall Checkpoint',
        description: 'Review the 5 flashcards to cement definitions and the 1-10-100 rule.',
        targetDate: 'Tomorrow, Aug 17',
        duration: '10 mins',
        completed: false,
        reminderActive: true
      },
      {
        id: 'rev-2',
        day: 'Day 3 (72 Hours)',
        title: 'Exam Structure & Matrix Revision',
        description: 'Review the 7-parameter comparison table and 10-mark exam layout.',
        targetDate: 'Wednesday, Aug 19',
        duration: '15 mins',
        completed: false,
        reminderActive: true
      },
      {
        id: 'rev-3',
        day: 'Day 7 (1 Week)',
        title: 'Mock Answer Practice',
        description: 'Write down the full 10-mark answer without looking at notes.',
        targetDate: 'Sunday, Aug 23',
        duration: '20 mins',
        completed: false,
        reminderActive: false
      }
    ]
  },
  {
    id: 'topic-testing-levels',
    code: 'CS605',
    subject: 'Software Engineering & Testing',
    title: 'Software Testing Fundamentals & Levels (Unit, Integration, System, Acceptance)',
    shortTitle: 'Testing Levels',
    durationMinutes: 45,
    difficulty: 'Intermediate',
    targetMarks: '10 Marks',
    semester: 'Semester 6',
    date: 'Today, Aug 16, 2026',
    objectives: [
      'Understand the four standard levels of software testing in SDLC',
      'Analyze Unit Testing vs Integration Testing vs System Testing vs Acceptance Testing',
      'Understand Top-down and Bottom-up integration strategies',
      'Master the 10-mark university question format on Testing Hierarchy'
    ],
    textbook: {
      title: 'Software Testing: Principles and Practices',
      edition: '1st Edition',
      author: 'Srinivasan Desikan & Gopalaswamy Ramesh',
      publisher: 'Pearson Education',
      chapter: 'Chapter 3 & 4: Levels of Testing',
      pages: 'pp. 58–92',
      referenceBook: 'Foundations of Software Testing by Dorothy Graham & Rex Black'
    },
    concept: {
      summary:
        'Software testing is structured into four progressive hierarchical levels: Unit Testing (individual modules), Integration Testing (interface interactions), System Testing (complete integrated application against requirements), and User Acceptance Testing (business and user validation).',
      qaOverview: {
        definition:
          'Testing Levels represent phases in the testing lifecycle where specific software components or integrated systems are verified against their corresponding design specifications.',
        nature: 'Progressive Hierarchy (Unit → Integration → System → Acceptance)',
        activities: [
          'Unit Testing: Testing isolated functions/classes with drivers and stubs',
          'Integration Testing: Testing module communication using Top-Down or Bottom-Up approach',
          'System Testing: End-to-end functional, performance, security, and recovery testing',
          'Acceptance Testing (UAT): Alpha and Beta testing by real business end-users'
        ]
      },
      qcOverview: {
        definition:
          'Each testing level corresponds directly to a specific development phase in the Software V-Model, ensuring early verification before progressing to system deployment.',
        nature: 'V-Model Alignment',
        activities: [
          'Unit Testing aligns with Detailed Module Design',
          'Integration Testing aligns with System Architecture Design',
          'System Testing aligns with System Requirements Specification (SRS)',
          'Acceptance Testing aligns with Business User Requirements'
        ]
      },
      comparisonTable: [
        {
          parameter: 'Testing Level',
          qa: 'Target Entity & Scope',
          qc: 'Primary Performer & Methodology'
        },
        {
          parameter: '1. Unit Testing',
          qa: 'Smallest testable unit of source code (functions, classes, methods).',
          qc: 'Performed by Developers using White-Box techniques (JUnit, PyTest).'
        },
        {
          parameter: '2. Integration Testing',
          qa: 'Interfaces, data flow, and communication between combined modules.',
          qc: 'Performed by Developers / QA using Top-Down, Bottom-Up, or Big-Bang.'
        },
        {
          parameter: '3. System Testing',
          qa: 'Entire integrated software application against SRS document.',
          qc: 'Performed by Independent QA Team using Black-Box testing.'
        },
        {
          parameter: '4. Acceptance Testing',
          qa: 'Final software readiness against business needs and user contracts.',
          qc: 'Performed by End-Users / Clients (Alpha & Beta Testing).'
        }
      ],
      examTip:
        'Always draw the V-Model pyramid diagram when answering this question in exams to easily earn visual presentation marks.'
    },
    examAnswer: {
      format: 'University Semester Exam Format (10 Marks Question)',
      question:
        'Explain the different levels of software testing in detail with appropriate examples and explain how they map to the V-Model.',
      timeAllocation: '15 Minutes recommended writing time',
      sections: [
        {
          heading: '1. Introduction to Testing Hierarchy (2 Marks)',
          content:
            'Software Testing is performed in a phased hierarchical manner to isolate and detect defects at the earliest possible stage. Testing levels provide a structured approach where testing starts from isolated code components and builds up to the complete integrated system.\n\nThe four formal levels are:\n1. Unit Testing\n2. Integration Testing\n3. System Testing\n4. User Acceptance Testing (UAT)'
        },
        {
          heading: '2. Comprehensive Breakdown of the 4 Testing Levels (5 Marks)',
          isTable: true,
          tableRows: [
            { param: 'Level 1: Unit', qa: 'Tests single components/methods in isolation.', qc: 'Mocking, Stubs, Drivers, JUnit.' },
            { param: 'Level 2: Integration', qa: 'Tests API endpoints and module interaction.', qc: 'Stub/Driver, Big-Bang, Sandwich.' },
            { param: 'Level 3: System', qa: 'End-to-end functional and non-functional tests.', qc: 'Performance, Security, Regression.' },
            { param: 'Level 4: Acceptance', qa: 'Validates commercial and contractual readiness.', qc: 'Alpha Testing (Internal), Beta Testing.' }
          ]
        },
        {
          heading: '3. Integration Testing Strategies: Top-Down vs Bottom-Up (2 Marks)',
          content:
            '• Top-Down Integration: Starts from the top-level control module down to lower modules. Uses "Stubs" (temporary mock programs) to simulate unfinished sub-modules.\n\n• Bottom-Up Integration: Starts from low-level primitive modules up to higher hierarchy. Uses "Drivers" (calling modules) to pass test data.\n\n• Sandwich (Hybrid) Approach: Combines top-down for top layers and bottom-up for bottom layers.'
        },
        {
          heading: '4. Real-World E-Commerce Example & Conclusion (1 Mark)',
          content:
            'E-Commerce Application Example:\n• Unit: Testing the calculateDiscount() method in the Cart service.\n• Integration: Testing the Cart service API communicating with the Payment Gateway.\n• System: Placing an order end-to-end, testing load with 10,000 concurrent users.\n• Acceptance: Real merchants executing test purchases before the festival launch.'
        }
      ]
    },
    flashcards: [
      {
        id: 'fc-t1',
        tag: 'Hierarchy',
        question: 'What are the four standard levels of software testing in sequential order?',
        answer:
          '1. Unit Testing → 2. Integration Testing → 3. System Testing → 4. User Acceptance Testing (UAT).',
        hint: 'From code functions to end users.'
      },
      {
        id: 'fc-t2',
        tag: 'Stubs & Drivers',
        question: 'What is the difference between a "Stub" and a "Driver" in integration testing?',
        answer:
          'A Stub is a dummy called module used in Top-Down testing (simulates lower modules). A Driver is a dummy calling program used in Bottom-Up testing (invokes the module under test).',
        hint: 'Top-Down uses Stubs (Called); Bottom-Up uses Drivers (Caller).'
      },
      {
        id: 'fc-t3',
        tag: 'Acceptance Testing',
        question: 'What is the difference between Alpha Testing and Beta Testing?',
        answer:
          'Alpha testing is performed by internal staff/users at the developer site in a controlled environment. Beta testing is performed by real external users in their actual live environment.',
        hint: 'Alpha = Developer site (Internal); Beta = User site (Real world).'
      },
      {
        id: 'fc-t4',
        tag: 'V-Model Mapping',
        question: 'Which design document does System Testing validate in the V-Model?',
        answer:
          'System Testing validates the software against the System Requirements Specification (SRS) document, covering both functional and non-functional requirements.',
        hint: 'System Testing maps directly to SRS.'
      },
      {
        id: 'fc-t5',
        tag: 'Unit Testing',
        question: 'Why is Unit Testing predominantly white-box while System Testing is black-box?',
        answer:
          'Unit testing checks internal logic, branch coverage, and loops inside the source code (White-Box). System testing checks external behavior and business workflows without looking at internal code (Black-Box).',
        hint: 'Internal code logic vs External system behavior.'
      }
    ],
    revisionSchedule: [
      {
        id: 'rev-t1',
        day: 'Day 1 (24 Hours)',
        title: 'Flashcard Concepts Recall',
        description: 'Quick active recall of Stubs vs Drivers and Alpha vs Beta testing.',
        targetDate: 'Tomorrow, Aug 17',
        duration: '10 mins',
        completed: false,
        reminderActive: true
      },
      {
        id: 'rev-t2',
        day: 'Day 3 (72 Hours)',
        title: 'V-Model Mapping & Strategies',
        description: 'Review Top-down, Bottom-up and Sandwich integration strategies.',
        targetDate: 'Wednesday, Aug 19',
        duration: '15 mins',
        completed: false,
        reminderActive: true
      },
      {
        id: 'rev-t3',
        day: 'Day 7 (1 Week)',
        title: 'Full 10-Mark Answer Writeup',
        description: 'Complete timed write-up of the 4 testing levels with diagrams.',
        targetDate: 'Sunday, Aug 23',
        duration: '20 mins',
        completed: false,
        reminderActive: false
      }
    ]
  }
]
