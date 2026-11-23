/**
 * Research Library editorial index.
 *
 * Include original publisher or institution URLs, not copied material.
 * A listing means the publisher/landing page was checked on 2026-11-23;
 * it does not validate every claim a reader might find there.
 *
 * Entries deliberately avoid invented publication dates, ratings or
 * "peer reviewed" badges for archives, indexes, textbooks and standards.
 */
export const LIBRARY_REVIEW_DATE = '2026-11-23';

export const LIBRARY_CATEGORIES = [
  'Philosophy',
  'Society',
  'Research',
  'Design',
  'Engineering',
  'AI',
  'Writing',
  'Africa',
] as const;

export type LibraryCategory = (typeof LIBRARY_CATEGORIES)[number];
export type LibraryKind =
  | 'Reference'
  | 'Textbook'
  | 'Research guide'
  | 'Research index'
  | 'Methods'
  | 'Framework'
  | 'Official documentation'
  | 'Data'
  | 'Course';

export type ResearchResource = {
  id: string;
  category: LibraryCategory;
  kind: LibraryKind;
  title: string;
  publisher: string;
  url: string;
  use: string;
  caution: string;
  question: string;
  tags: readonly string[];
};

type Entry = readonly [
  category: LibraryCategory,
  kind: LibraryKind,
  title: string,
  publisher: string,
  url: string,
  use: string,
  caution: string,
  question: string,
  tags: readonly string[],
];

const entries: readonly Entry[] = [
  ['Philosophy', 'Reference', 'Critical Thinking', 'Stanford Encyclopedia of Philosophy', 'https://plato.stanford.edu/entries/critical-thinking/', 'Understand reflective judgment, reasoning and what makes a belief worth examining.', 'A scholarly overview of competing positions, not a controlled experiment.', 'What distinguishes thinking independently from merely reaching the right answer?', ['reasoning', 'intelligence', 'judgment']],
  ['Philosophy', 'Reference', 'Evidence', 'Stanford Encyclopedia of Philosophy', 'https://plato.stanford.edu/entries/evidence/', 'Explore what evidence is and how it can justify a belief.', 'Philosophical accounts differ; do not treat one account as a settled scientific result.', 'When is evidence sufficient for a claim?', ['evidence', 'truth', 'knowledge']],
  ['Philosophy', 'Reference', 'Epistemology', 'Stanford Encyclopedia of Philosophy', 'https://plato.stanford.edu/entries/epistemology/', 'Study knowledge, justification and the difference between believing and knowing.', 'Dense philosophical reference; look at arguments and objections, not just definitions.', 'Can a correct answer still fail to count as knowledge?', ['knowledge', 'intelligence', 'philosophy']],

  ['Society', 'Textbook', 'Psychology 2e', 'OpenStax', 'https://openstax.org/books/psychology-2e/pages/1-introduction', 'Build a foundation in cognition, behaviour and psychological research.', 'An introductory textbook, not the latest evidence for any one psychological claim.', 'How could attention, memory and incentives shape our behaviour?', ['psychology', 'cognition', 'behaviour']],
  ['Society', 'Textbook', 'Introduction to Sociology 3e', 'OpenStax', 'https://openstax.org/books/introduction-sociology-3e/pages/1-introduction', 'Examine institutions, groups, social structure and methods of social inquiry.', 'General theory and examples may not match conditions in Sierra Leone.', 'How does a social system shape the choices people believe they have?', ['society', 'institutions', 'culture']],
  ['Society', 'Research guide', 'Psychology Topics', 'American Psychological Association', 'https://www.apa.org/topics/', 'Find introductory explanations and pointers into psychological topics.', 'Topic summaries are not substitutes for reading the studies behind a claim.', 'Which psychological explanation is plausible, and which alternatives remain?', ['behaviour', 'psychology', 'learning']],

  ['Research', 'Research guide', 'Evaluating Sources of Information', 'Purdue Online Writing Lab', 'https://owl.purdue.edu/owl/research_and_citation/conducting_research/evaluating_sources_of_information/index.html', 'Check authority, evidence, context and suitability before citing material.', 'A method guide helps assessment; it does not authenticate a particular source for you.', 'Who produced this claim, with what evidence and possible incentive?', ['verification', 'evidence', 'citations']],
  ['Research', 'Research guide', 'Types of Sources', 'Purdue Online Writing Lab', 'https://owl.purdue.edu/owl/research_and_citation/conducting_research/research_overview/sources.html', 'Distinguish primary, secondary and other research materials.', 'Source type alone does not determine quality or relevance.', 'Would an original study, official record or synthesis best answer my question?', ['primary sources', 'research methods', 'citations']],
  ['Research', 'Research index', 'Crossref Metadata Retrieval', 'Crossref', 'https://www.crossref.org/services/metadata-retrieval/', 'Check identifiers, authors, journals and bibliographic details of publications.', 'A DOI record establishes metadata, not whether the argument is sound.', 'Can I trace this finding to the original publication?', ['DOI', 'citations', 'academic papers']],
  ['Research', 'Research index', 'Semantic Scholar', 'Allen Institute for AI', 'https://www.semanticscholar.org/', 'Discover papers, authors, related work and citation networks.', 'Search rankings and citation counts do not prove quality; confirm the actual paper.', 'What opposing evidence or earlier work does this paper cite?', ['literature search', 'research papers', 'AI']],
  ['Research', 'Research index', 'arXiv', 'Cornell University', 'https://arxiv.org/', 'Discover open research manuscripts in computing, mathematics and other fields.', 'Preprints may not have passed peer review and can change.', 'What has independently replicated or criticised this preprint?', ['preprints', 'computing', 'science']],
  ['Research', 'Research guide', 'Research and Evidence', 'Purdue Online Writing Lab', 'https://owl.purdue.edu/owl/general_writing/academic_writing/establishing_arguments/research_and_evidence.html', 'Connect research material to a defensible argument rather than collecting quotations.', 'Guidance on writing arguments, not evidence that a particular proposition is true.', 'Which part of my argument lacks supporting evidence?', ['argument', 'writing', 'evidence']],

  ['Design', 'Methods', 'Qualitative User-Research Methods', 'Nielsen Norman Group', 'https://www.nngroup.com/articles/qual-research-methods/', 'Choose between interviews, field studies, diaries and usability tests.', 'Method advice does not make a small sample representative of a population.', 'What would observation reveal that an interview might miss?', ['user research', 'discovery', 'observation']],
  ['Design', 'Methods', 'Human-Centered Design Methods', 'IDEO.org Design Kit', 'https://www.designkit.org/methods.html', 'Plan interviews, framing, synthesis and idea exploration.', 'A toolkit cannot replace field evidence or local constraints.', 'Who is affected by a solution but absent from the design conversation?', ['design', 'interviews', 'brainstorming']],
  ['Design', 'Framework', 'The Double Diamond', 'Design Council', 'https://www.designcouncil.org.uk/resources/the-double-diamond/', 'Separate understanding a problem from generating and testing solutions.', 'A framework is not proof that following its steps guarantees a good result.', 'Are we solving an observed problem or a problem we assumed exists?', ['product discovery', 'problem framing', 'systems']],
  ['Design', 'Official documentation', 'WCAG 2.2', 'World Wide Web Consortium', 'https://www.w3.org/TR/wcag/', 'Reference accessibility requirements when making design and engineering decisions.', 'A standard is not a user test; applicability and conformance must be checked.', 'Who cannot complete this journey with the present interaction?', ['accessibility', 'web design', 'standards']],

  ['Engineering', 'Official documentation', 'TypeScript Handbook', 'TypeScript', 'https://www.typescriptlang.org/docs/handbook/intro', 'Study static types, modelling and trade-offs in application code.', 'Docs explain language behaviour, not every architecture decision.', 'What assumption does this type prevent, and which does it leave unchecked?', ['TypeScript', 'software design', 'types']],
  ['Engineering', 'Official documentation', 'PostgreSQL Tutorial', 'PostgreSQL Global Development Group', 'https://www.postgresql.org/docs/current/tutorial.html', 'Learn relational queries and database fundamentals from maintainers.', 'Tutorial examples are not a production data model or operations checklist.', 'What relationship and constraint should the database enforce?', ['database', 'SQL', 'data modelling']],
  ['Engineering', 'Official documentation', 'HTTP Overview', 'MDN Web Docs', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview', 'Understand request/response behaviour and communication between systems.', 'A conceptual overview; consult protocol specifications for edge cases.', 'Which failure belongs to the client, server or network?', ['API', 'HTTP', 'protocols']],
  ['Engineering', 'Framework', 'API Security Project', 'OWASP', 'https://owasp.org/projects/api-security-project', 'Identify common API risk categories and plan checks.', 'The Top 10 is an awareness guide, not a complete security audit.', 'Can a user access a record they do not own?', ['API security', 'authorization', 'threat modelling']],
  ['Engineering', 'Official documentation', 'Learn React', 'React', 'https://react.dev/learn', 'Practise component, state and interface fundamentals with canonical material.', 'Framework documentation cannot establish that a product is usable.', 'Where should state live and what does the user need to see?', ['React', 'frontend', 'UI']],

  ['AI', 'Framework', 'AI Risk Management Framework', 'US National Institute of Standards and Technology', 'https://www.nist.gov/itl/ai-risk-management-framework', 'Structure questions about AI risk, evaluation, oversight and governance.', 'A voluntary framework, not a guarantee of safe deployment.', 'Which risks have we measured rather than merely described?', ['AI governance', 'risk', 'evaluation']],
  ['AI', 'Framework', 'Generative AI Profile', 'US National Institute of Standards and Technology', 'https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence', 'Explore generative-AI-specific risks and possible controls.', 'Risk categories require adaptation to the actual use case and context.', 'How could fluent output mislead a user despite sounding credible?', ['generative AI', 'safety', 'evaluation']],
  ['AI', 'Methods', 'People + AI Guidebook', 'Google People + AI Research', 'https://pair.withgoogle.com/guidebook-v2/', 'Study human-centred AI interactions, trust and product choices.', 'Design patterns and guidance are not universal experimental findings.', 'Which decisions should a human retain or be able to contest?', ['human AI', 'AI product design', 'trust']],
  ['AI', 'Research index', 'Stanford HAI Research', 'Stanford Institute for Human-Centered AI', 'https://hai.stanford.edu/research', 'Find interdisciplinary research on AI and its human implications.', 'Research listings include different methods and stages; assess each work separately.', 'What is AI improving, and what might it make less visible?', ['intelligence', 'AI', 'society']],
  ['AI', 'Research index', 'Google Research Publications', 'Google Research', 'https://research.google/pubs/', 'Explore published technical research and follow its references.', 'Research from a product developer deserves the same scrutiny as any other institutional source.', 'Which result might not generalise beyond the paper’s test setting?', ['AI', 'software systems', 'papers']],

  ['Writing', 'Course', 'Technical Writing Courses', 'Google for Developers', 'https://developers.google.com/tech-writing', 'Learn to explain technical concepts clearly for readers and developers.', 'A writing course teaches technique; it does not verify technical claims.', 'What does my reader need to understand before the next step?', ['technical writing', 'clarity', 'documentation']],
  ['Writing', 'Research guide', 'Developer Documentation Style Guide', 'Google for Developers', 'https://developers.google.com/style', 'Improve consistent, scannable instructions and technical reference material.', 'A house style is a useful convention, not the only acceptable editorial voice.', 'What can I remove without losing meaning?', ['editing', 'style', 'documentation']],
  ['Writing', 'Research guide', 'Research and Citation', 'Purdue Online Writing Lab', 'https://owl.purdue.edu/owl/research_and_citation/', 'Learn to cite research and build a traceable reading trail.', 'Choose citation conventions appropriate to your audience and publication.', 'Could a reader check this exact claim using the cited source?', ['citations', 'essays', 'research']],
  ['Writing', 'Methods', 'How Might We', 'IDEO.org Design Kit', 'https://www.designkit.org/methods/how-might-we.html', 'Reframe a topic into generative questions before drafting.', 'Good prompts help ideas emerge; they do not establish what is factually true.', 'What new possibility appears when the problem becomes a question?', ['brainstorming', 'questions', 'ideation']],

  ['Africa', 'Data', 'Open Data and Free Datasets', 'Statistics Sierra Leone', 'https://www.statistics.sl/index.php/what-we-offer/open-data-free-datasets.html', 'Locate national statistical releases and data sources.', 'Check survey dates, definitions, missing observations and revised estimates.', 'What do Sierra Leonean statistics actually measure here?', ['Sierra Leone', 'official statistics', 'development']],
  ['Africa', 'Data', 'Afrobarometer Data', 'Afrobarometer', 'https://www.afrobarometer.org/data/', 'Explore African public opinion and changing attitudes.', 'Samples and survey wording matter; do not present survey estimates as universal views.', 'How does public experience differ from institutional claims?', ['Africa', 'public opinion', 'governance']],
  ['Africa', 'Data', 'Sierra Leone Country Data', 'World Bank', 'https://data.worldbank.org/country/sierra-leone', 'Compare economic, social and development indicators over time.', 'Indicators may lag and estimates may be revised; read the metadata.', 'Which trend is real after accounting for definition and period?', ['Sierra Leone', 'economics', 'development']],
  ['Africa', 'Data', 'UIS Data Browser', 'UNESCO Institute for Statistics', 'https://databrowser.uis.unesco.org/', 'Compare education and knowledge-related indicators across countries.', 'Availability varies by country, year and measure; avoid filling gaps by inference.', 'What do enrolment figures fail to tell us about learning?', ['education', 'Africa', 'statistics']],
  ['Africa', 'Data', 'ICT Statistics', 'International Telecommunication Union', 'https://www.itu.int/en/ITU-D/Statistics/pages/stat/default.aspx', 'Investigate connectivity, access and digital development.', 'Connection or coverage is not the same as meaningful, affordable usage.', 'Who remains excluded even when coverage improves?', ['digital access', 'connectivity', 'Africa']],
  ['Africa', 'Data', 'Our World in Data', 'Global Change Data Lab', 'https://ourworldindata.org/', 'Compare global long-run data, charts and underlying source references.', 'Trace indicators to original sources and check methods before citing a chart.', 'What comparison changes when we examine the longer time series?', ['data literacy', 'global development', 'statistics']],
] as const;

export const RESEARCH_RESOURCES: readonly ResearchResource[] = entries.map((entry, index) => ({
  id: String(index + 1).padStart(3, '0'),
  category: entry[0],
  kind: entry[1],
  title: entry[2],
  publisher: entry[3],
  url: entry[4],
  use: entry[5],
  caution: entry[6],
  question: entry[7],
  tags: entry[8],
}));
