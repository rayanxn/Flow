/**
 * from Paper — v3 Filtered View (updated: added STATUS and ASSIGNEE columns)
 * Artboard ID: 601-0
 */
export default function V3FilteredView() {
  return (
    <div style={{ backgroundColor: '#F6F5F1', display: 'flex', height: '900px', overflow: 'clip', width: '1440px' }}>
      <p style={{ padding: '40px', color: '#9C9689', fontFamily: 'Space Grotesk' }}>
        Design reference exported from Paper. See artboard 601-0 for the canonical version.
        Changes: added STATUS column (colored dot after ID) and ASSIGNEE column (avatar + name
        after PROJECT). Table columns are now: ID, STATUS, TITLE, PROJECT, ASSIGNEE, PRIORITY, DUE.
      </p>
    </div>
  );
}
