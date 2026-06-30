const bibleNames = [
  'Adam', 'Eve', 'Cain', 'Abel', 'Seth', 'Enoch', 'Noah', 'Shem', 'Ham', 'Japheth',
  'Abraham', 'Sarah', 'Hagar', 'Ishmael', 'Isaac', 'Rebekah', 'Jacob', 'Esau', 'Leah', 'Rachel',
  'Joseph', 'Judah', 'Moses', 'Aaron', 'Miriam', 'Joshua', 'Caleb', 'Deborah', 'Gideon', 'Samson',
  'Ruth', 'Boaz', 'Hannah', 'Samuel', 'Saul', 'Jonathan', 'David', 'Bathsheba', 'Nathan', 'Solomon',
  'Rehoboam', 'Jeroboam', 'Elijah', 'Elisha', 'Ahab', 'Jezebel', 'Hezekiah', 'Josiah', 'Isaiah', 'Jeremiah',
  'Ezekiel', 'Daniel', 'Esther', 'Mordecai', 'Ezra', 'Nehemiah', 'Job', 'Jonah', 'Hosea', 'Joel',
  'Amos', 'Obadiah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi', 'Mary',
  'Joseph of Nazareth', 'John the Baptist', 'Jesus', 'Peter', 'Andrew', 'James son of Zebedee', 'John son of Zebedee', 'Philip', 'Bartholomew', 'Thomas',
  'Matthew', 'James son of Alphaeus', 'Thaddaeus', 'Simon the Zealot', 'Judas Iscariot', 'Mary Magdalene', 'Martha', 'Mary of Bethany', 'Lazarus', 'Nicodemus',
  'Zacchaeus', 'Paul', 'Barnabas', 'Stephen', 'Philip the Evangelist', 'Ananias of Damascus', 'Cornelius', 'Lydia', 'Silas', 'Timothy',
  'Titus', 'Priscilla', 'Aquila', 'Apollos', 'James brother of the Lord', 'Jude', 'Mark', 'Luke', 'Philemon', 'Onesimus',
  'Melchizedek', 'Lot', 'Balaam', 'Rahab', 'Naomi', 'Eli', 'Abigail', 'Joab', 'Absalom', 'Manasseh',
  'Cyrus', 'Nebuchadnezzar', 'Belshazzar', 'Darius', 'Herod the Great', 'Herod Antipas', 'Pontius Pilate', 'Caiaphas', 'Gamaliel', 'Phoebe',
  'Junia', 'Euodia', 'Syntyche', 'Epaphroditus', 'Clement', 'Tychicus', 'Epaphras', 'Demas', 'Dionysius', 'Damaris',
]

export const bibleCharacters = bibleNames.map((name, index) => {
  const isJesus = name === 'Jesus'
  const testament = index < 70 ? 'old_testament' : 'new_testament'
  return {
    id: `bible-character-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    canonicalName: name.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
    displayName: name,
    alternativeNames: [],
    gender: ['Eve', 'Sarah', 'Hagar', 'Rebekah', 'Leah', 'Rachel', 'Miriam', 'Deborah', 'Ruth', 'Hannah', 'Bathsheba', 'Jezebel', 'Esther', 'Mary', 'Mary Magdalene', 'Martha', 'Mary of Bethany', 'Lydia', 'Priscilla', 'Phoebe', 'Junia', 'Euodia', 'Syntyche', 'Damaris'].includes(name) ? 'female' : 'male',
    testament: isJesus ? 'both' : testament,
    primaryRole: isJesus ? 'messiah' : ['David', 'Solomon', 'Saul', 'Hezekiah', 'Josiah'].includes(name) ? 'king' : ['Isaiah', 'Jeremiah', 'Ezekiel', 'Daniel', 'Jonah'].includes(name) ? 'prophet' : ['Peter', 'Paul', 'John son of Zebedee'].includes(name) ? 'apostle' : 'other',
    shortSummary: `${name} in the biblical story, with attention to text, themes, and formation.`,
    longSummary: `${name} should be read in canonical context, with humility about inference and tradition.`,
    moralComplexityNote: isJesus ? 'Christ is presented as sinless Lord and Savior.' : 'Read with moral complexity; avoid flattening people into only heroes or villains.',
    theologicalSignificance: isJesus ? 'Center of fulfillment, kingdom, cross, resurrection, and new creation.' : 'Connected to covenant, promise, judgment, mercy, and formation themes.',
    formationLessons: ['Notice grace and warning.', 'Ask what faith, repentance, courage, humility, or wisdom looks like.'],
    scriptureReferences: isJesus ? ['Matthew 1:1', 'John 1:1-18', '1 Corinthians 15:3-8'] : ['Genesis 12:1-3', 'Hebrews 11', 'Matthew 1:1'],
    importanceLevel: isJesus || ['Abraham', 'Moses', 'David', 'Paul'].includes(name) ? 10 : 5,
  }
})

export const bibleRelationships = [
  ['Adam', 'Eve', 'spouse_of', 'explicit', ['Genesis 2:21-25']],
  ['Abraham', 'Isaac', 'father_of', 'explicit', ['Genesis 21:3']],
  ['Isaac', 'Jacob', 'father_of', 'explicit', ['Genesis 25:26']],
  ['Jacob', 'Judah', 'father_of', 'explicit', ['Genesis 29:35']],
  ['Judah', 'David', 'ancestor_of', 'strong_inference', ['Ruth 4:18-22']],
  ['David', 'Jesus', 'ancestor_of', 'explicit', ['Matthew 1:1']],
  ['Moses', 'Aaron', 'sibling_of', 'explicit', ['Exodus 4:14']],
  ['Ruth', 'Boaz', 'spouse_of', 'explicit', ['Ruth 4:13']],
  ['Peter', 'Jesus', 'disciple_of', 'explicit', ['Matthew 4:18-20']],
  ['Paul', 'Timothy', 'teacher_of', 'explicit', ['2 Timothy 1:2']],
].map(([sourceName, targetName, relationshipType, confidenceLevel, scriptureReferences], index) => ({
  id: `bible-relationship-${index + 1}`,
  sourceName,
  targetName,
  relationshipType,
  description: `${sourceName} is linked to ${targetName} by ${relationshipType}.`,
  scriptureReferences,
  confidenceLevel,
}))

export const biblicalTimelineMovements = [
  'Creation', 'Fall', 'Promise', 'Covenant with Abraham', 'Exodus', 'Sinai and Law', 'Tabernacle and Priesthood', 'Land and Judges', 'Kingdom', 'Davidic Covenant', 'Divided Kingdom', 'Prophets', 'Exile', 'Return', 'Wisdom and Waiting', 'Incarnation', 'Kingdom of God', 'Cross', 'Resurrection', 'Ascension', 'Pentecost', 'Church and Mission', 'New Creation',
].map((title, index) => ({
  id: `timeline-${index + 1}`,
  key: title.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
  title,
  canonicalOrder: index + 1,
  description: `${title} in the redemptive-historical storyline.`,
  themes: ['covenant', 'kingdom', 'temple', 'mission', 'new_creation'].slice(0, (index % 5) + 1),
  scriptureReferences: index < 3 ? ['Genesis 1-3'] : index < 15 ? ['Genesis 12:1-3', 'Exodus 19:4-6', '2 Samuel 7'] : ['Luke 24:44-49', 'Acts 2', 'Revelation 21'],
}))

export const doctrineTopics = [
  ['theology_proper', 'Doctrine of God', ['Trinity', 'attributes', 'providence']],
  ['anthropology', 'Humanity', ['image of God', 'dignity', 'creatureliness']],
  ['hamartiology', 'Sin', ['fall', 'corruption', 'guilt']],
  ['christology', 'Christology', ['incarnation', 'two natures', 'offices']],
  ['soteriology', 'Salvation', ['grace', 'faith', 'union with Christ']],
  ['pneumatology', 'Holy Spirit', ['indwelling', 'fruit', 'gifts']],
  ['ecclesiology', 'Church', ['body', 'sacraments', 'mission']],
  ['eschatology', 'Last Things', ['resurrection', 'judgment', 'new creation']],
].map(([key, title, lessons]) => ({
  id: `doctrine-${key}`,
  key,
  title,
  description: `${title} learning path with Scripture, tradition awareness, and formation application.`,
  lessons: lessons.map((lesson, index) => ({ id: `${key}-lesson-${index + 1}`, title: lesson, completed: false })),
  traditionNotes: ['Some details are debated across major Christian traditions; distinguish core confession from tradition-specific claims.'],
}))

export const apologeticsTopics = [
  ['existence_of_god', 'Existence of God', 'Discuss arguments with humility and charity.'],
  ['problem_of_evil', 'Problem of Evil', 'Do not minimize suffering; connect to lament and hope.'],
  ['resurrection', 'Resurrection', 'Explore historical claims and theological meaning.'],
  ['science_faith', 'Science and Faith', 'Avoid false conflict frames and respect evidence.'],
  ['ethics', 'Christian Ethics', 'Reason from Scripture, wisdom, conscience, and love.'],
  ['ai_worldview', 'AI and Human Dignity', 'Address image of God, technology stewardship, and limits.'],
  ['religious_pluralism', 'Religious Pluralism', 'Be truthful without contempt.'],
].map(([key, title, description]) => ({ id: `apologetics-${key}`, key, title, description }))

export const aiTutorRouteDefinitions = [
  ['scripture', 'scripture_formation', 'lectio_divina'],
  ['prayer', 'prayer_communion', 'prayer_rule'],
  ['temptation', 'virtue_vice', 'temptation_resistance'],
  ['habit', 'holy_habit', 'rule_of_life'],
  ['worldview', 'worldview_formation', 'gospel_reframing'],
  ['suffering', 'suffering_care', 'healing_journey'],
  ['community', 'discipleship_community', 'accountability_group'],
  ['calling', 'gift_calling', 'calling_discernment'],
  ['bible', 'bible_doctrine', 'character_graph'],
  ['analytics', 'formation_analytics', 'metrics_summary'],
]

export const analyticsMetricDefinitions = [
  ['daily_plan_completion_rate', 'Daily plan completion rate', 'practice', 'percentage'],
  ['prayer_sessions_completed', 'Prayer sessions completed', 'prayer', 'count'],
  ['scripture_sessions_completed', 'Scripture sessions completed', 'scripture', 'count'],
  ['fruit_dimension_latest_scores', 'Fruit dimension latest scores', 'fruit', 'json'],
  ['sabbath_sessions_completed', 'Sabbath sessions completed', 'rest', 'count'],
  ['healing_journey_entries_count', 'Healing journey entries', 'care', 'count'],
  ['accountability_checkins_count', 'Accountability check-ins', 'community', 'count'],
  ['gift_assessments_completed', 'Gift assessments completed', 'calling', 'count'],
  ['doctrine_lessons_completed', 'Doctrine lessons completed', 'learning', 'count'],
  ['grace_evidence_count', 'Grace evidence count', 'grace', 'count'],
  ['active_overload_signal_count', 'Active overload signals', 'overload', 'count'],
  ['crisis_risk_assessments_high_count', 'High crisis assessments', 'safety', 'count'],
].map(([key, displayName, metricCategory, valueType]) => ({
  id: `metric-${key}`,
  key,
  displayName,
  description: `${displayName} as a humble formation indicator, not a holiness score.`,
  metricCategory,
  valueType,
  unitLabel: valueType === 'percentage' ? '%' : '',
  higherIsBetter: !['active_overload_signal_count', 'crisis_risk_assessments_high_count'].includes(key),
  cautionNote: 'Metrics are indicators for prayerful reflection, not spiritual rank.',
  sourceModules: ['scripture_formation', 'prayer_communion', 'suffering_care', 'gift_calling', 'bible_doctrine'],
  active: true,
}))

export const productPlans = [
  ['personal', 'Personal', 1, ['core formation', 'local analytics', 'AI tutor']],
  ['group', 'Group', 12, ['accountability groups', 'mentor-safe summaries', 'shared rhythms']],
  ['church', 'Church', 500, ['multi-tenant org', 'admin console', 'pastoral care workflows']],
  ['institution', 'Institution', 5000, ['advanced audit', 'custom modules', 'SSO-ready abstraction']],
  ['api', 'API', 100000, ['API access', 'usage meters', 'webhooks']],
].map(([key, displayName, monthlyLimit, features]) => ({ id: `plan-${key}`, key, displayName, monthlyLimit, features }))

export const rolePermissions = [
  ['owner', ['org.manage', 'billing.manage', 'admin.audit', 'members.manage']],
  ['admin', ['members.manage', 'moderation.review', 'reports.view_redacted']],
  ['pastor', ['pastoral.view_consented', 'reports.view_redacted', 'care.followup']],
  ['mentor', ['mentor.view_consented', 'groups.support']],
  ['group_leader', ['groups.manage', 'summaries.view_group_safe']],
  ['member', ['self.manage', 'groups.participate']],
].map(([role, permissions]) => ({ role, permissions }))

export const platformModules = [
  ['scripture_formation', 'Scripture Meditation & Inner Formation OS', 1, 4],
  ['prayer_communion', 'Prayer & Communion OS', 2, 4],
  ['virtue_vice', 'Virtue & Vice Formation OS', 3, 4],
  ['holy_habit', 'Rule of Life & Holy Habit Engine', 4, 4],
  ['worldview_formation', 'Worldview Formation OS Expansion', 5, 4],
  ['suffering_care', 'Suffering, Crisis & Healing Formation OS', 6, 4],
  ['discipleship_community', 'Community, Accountability & Discipleship OS', 7, 4],
  ['gift_calling', 'Gift, Calling & Mission OS', 8, 4],
  ['bible_doctrine', 'Bible Knowledge Graph & Doctrine Learning OS', 9, 4],
  ['ai_formation_agent', 'AI Spiritual Tutor & Personal Formation Agent OS', 10, 4],
  ['formation_analytics', 'Analytics, Progress & Formation Metrics OS', 11, 4],
  ['productization', 'Deployment, Multi-Tenant, Admin & Productization OS', 12, 4],
  ['master_build', 'Full-Scale Integration, Enterprise Roadmap & Master Build OS', 13, 4],
].map(([key, name, batch, skillCount]) => ({ key, name, batch, skillCount }))

export const skillRegistry = Array.from({ length: 52 }, (_, index) => {
  const module = platformModules[Math.floor(index / 4)] || platformModules[platformModules.length - 1]
  return {
    skillNumber: index + 1,
    key: `skill_${String(index + 1).padStart(2, '0')}`,
    moduleKey: module.key,
    title: `${module.name} Skill ${((index % 4) + 1)}`,
    safetyFirst: true,
    emitsEvents: true,
  }
})
