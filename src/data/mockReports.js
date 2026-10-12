export const CATEGORIES = [
  'Theft',
  'Assault',
  'Fraud',
  'Vandalism',
  'Suspicious Activity',
  'Cybercrime',
  'Property Damage',
  'Other',
];

export const STATUSES = [
  'Received',
  'Under Review',
  'Under Investigation',
  'Action Taken',
  'Closed',
];

export const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

const DAY = 24 * 60 * 60 * 1000;

const seeds = [
  ['Theft', 'Under Investigation', 'High', 3, 'A bicycle was taken from the racks outside the main market after a busy afternoon. Lock was cut.', 'Market Road, near the bus stop', 2, 'Cross-checking with CCTV request from the market association.'],
  ['Fraud', 'Under Review', 'Medium', 5, 'Caller claiming to be from a mobile money provider asked for a PIN to reverse a supposed wrong transaction.', 'Phone call, caller number withheld', 1, 'Similar pattern in two other reports this month.'],
  ['Suspicious Activity', 'Received', 'Low', 1, 'A parked van with no plates has been idling near the primary school gate for several mornings.', 'Opposite Green Valley Primary School', 1, ''],
  ['Cybercrime', 'Under Investigation', 'High', 9, 'Fake online shop took payment for electronics and stopped responding. Several buyers appear affected.', 'Online marketplace', 3, 'Forwarded to the cyber desk for account tracing.'],
  ['Vandalism', 'Action Taken', 'Low', 14, 'Bus shelter glass smashed and graffiti sprayed across the panels overnight.', 'Bus shelter, Station Avenue', 2, 'Council notified. Patrol frequency increased.'],
  ['Assault', 'Under Investigation', 'Urgent', 2, 'A group confronted and injured a shopkeeper at closing time. Witnesses saw two vehicles leave quickly.', 'Eastlands shopping row', 2, 'Priority escalated. Shopkeeper statement scheduled.'],
  ['Property Damage', 'Closed', 'Low', 41, 'A delivery truck reversed into a boundary wall and left without leaving contact details.', 'Hillview Estate, Gate 3', 1, 'Owner identified through the haulage company. Settled privately.'],
  ['Theft', 'Received', 'Medium', 0, 'Phone snatched from a passenger at a matatu stage during the evening rush.', 'Town Centre stage', 0, ''],
  ['Other', 'Under Review', 'Low', 7, 'Large amount of waste dumped at the edge of the riverbank, apparently from a commercial vehicle.', 'River Lane footbridge', 3, 'Environmental officer to review photos.'],
  ['Fraud', 'Closed', 'Medium', 52, 'Landlord impersonator collected a deposit for a rental that did not exist.', 'Listing on a social media page', 2, 'Page removed. Case closed after complainant confirmed refund.'],
  ['Cybercrime', 'Under Review', 'High', 6, 'Threatening messages sent to a student after a private photo was shared without permission.', 'Messaging app', 1, 'Welfare referral recommended.'],
  ['Suspicious Activity', 'Action Taken', 'Medium', 19, 'People repeatedly trying door handles of parked cars in the early hours.', 'Riverside Apartments car park', 1, 'Patrol stopped two individuals. Warning issued.'],
  ['Vandalism', 'Received', 'Low', 2, 'Solar street lights on the access road have had their panels broken.', 'Access road to Phase 2', 2, ''],
  ['Assault', 'Closed', 'High', 67, 'Fight outside a bar left one person with facial injuries.', 'Kimathi Street', 1, 'Parties reconciled. File closed.'],
  ['Theft', 'Action Taken', 'Medium', 24, 'Building materials taken from a construction site over a weekend.', 'Plot 114, Industrial Area', 2, 'Suspect vehicle located. Recovery under way.'],
  ['Property Damage', 'Under Review', 'Medium', 11, 'A fallen tree after a storm damaged a neighbour fence; owner of the tree cannot be reached.', 'Maple Close', 2, 'Possible civil matter. Reviewing scope.'],
  ['Other', 'Received', 'Low', 4, 'Unlicensed hawkers are blocking the footpath outside the clinic, forcing pedestrians onto the road.', 'Clinic entrance, Health Centre Road', 0, ''],
  ['Fraud', 'Under Investigation', 'Urgent', 8, 'Elderly resident was persuaded to hand over savings to a person posing as a bank official.', 'Home visit, Sunrise Estate', 1, 'Victim support arranged. Bank fraud unit engaged.'],
  ['Cybercrime', 'Closed', 'Low', 78, 'Phishing email imitating a utility company asked for account login details.', 'Email', 1, 'Sender domain reported and blocked.'],
  ['Suspicious Activity', 'Under Review', 'Medium', 12, 'Drone seen hovering repeatedly over a fenced compound after dark.', 'Lakeside Road compound', 1, ''],
  ['Theft', 'Closed', 'Low', 95, 'Garden tools taken from an unlocked shed.', 'Orchard Lane', 0, 'No leads. Closed with advice on securing property.'],
  ['Vandalism', 'Under Investigation', 'Medium', 16, 'Cemetery gate and several headstones were damaged.', 'Municipal cemetery, North Gate', 3, 'Community leaders consulted.'],
  ['Assault', 'Under Review', 'High', 10, 'Domestic disturbance heard nightly from a neighbouring flat; a child was heard crying.', 'Block C, Palm Court', 0, 'Welfare check recommended before further steps.'],
  ['Other', 'Closed', 'Low', 60, 'Abandoned vehicle left on a verge for months.', 'Ring Road lay-by', 1, 'Vehicle removed by council.'],
];

const evidenceTemplates = [
  ['photo', 'IMG_0412.jpg', '2.4 MB'],
  ['video', 'clip_evening.mp4', '18.7 MB'],
  ['audio', 'voice_note.m4a', '1.1 MB'],
];

export function buildSeedReports() {
  const now = Date.now();
  return seeds.map((s, i) => {
    const [category, status, priority, daysAgo, description, location, evidenceCount, note] = s;
    const submittedAt = new Date(now - daysAgo * DAY - (i % 5) * 3600000).toISOString();
    const updatedAt = new Date(
      Math.min(now, new Date(submittedAt).getTime() + (status === 'Received' ? 0 : Math.max(1, daysAgo / 2) * DAY))
    ).toISOString();
    const n = String(i + 1).padStart(4, '0');
    return {
      id: `rpt-${n}`,
      reference: `USL-2026-${n}`,
      category,
      description,
      incidentDate: new Date(new Date(submittedAt).getTime() - DAY / 2).toISOString(),
      location: location || null,
      submittedAt,
      updatedAt,
      status,
      priority,
      evidence: Array.from({ length: evidenceCount }, (_, k) => {
        const [type, name, size] = evidenceTemplates[(i + k) % 3];
        return { id: `ev-${n}-${k + 1}`, type, name, size };
      }),
      internalNotes: note
        ? [{ id: `note-${n}-1`, author: 'Demo Officer', createdAt: updatedAt, text: note }]
        : [],
    };
  });
}