/**
 * from Paper — v3 Timeline (updated: status-coded bars, assignee avatars, alternating rows)
 * Artboard ID: 600-0
 */
export default function V3Timeline() {
  return (
    <div style={{ backgroundColor: '#F6F5F1', display: 'flex', height: '900px', overflow: 'clip', width: '1440px' }}>
      {/* Main content and sidebar exported from Paper - see artboard 600-0 for latest */}
      <p style={{ padding: '40px', color: '#9C9689', fontFamily: 'Space Grotesk' }}>
        Design reference exported from Paper. See artboard 600-0 for the canonical version.
        Changes: status-coded bars (In Progress=#9C9689, In Review=#6B6B60, Todo=dashed),
        assignee avatars at bar ends, alternating row backgrounds (#F0EDE7).
      </p>
    </div>
  );
}
