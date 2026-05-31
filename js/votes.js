// js/votes.js
const SUPABASE_URL  = 'https://eqdtrpgnhicyphdkhztg.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxZHRycGduaGljeXBoZGtoenRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMTA0MjUsImV4cCI6MjA5NDc4NjQyNX0.6KSbrrBJTRbjBOidBxP6km2ZEvlqUOI4CCarsVy08ew';

const { createClient } = supabase;  // loaded from CDN script tag
const db = createClient(SUPABASE_URL, SUPABASE_ANON);

// Fetch all vote counts and update any [id="votes-<projectId>"] elements
async function loadVoteCounts() {
  const { data, error } = await db.from('projects').select('id, vote_count');
  if (error) { console.error('loadVoteCounts:', error); return; }
  data.forEach(row => updateVoteDisplay(row.id, row.vote_count));
}

// Update a vote count display element by project id
function updateVoteDisplay(projectId, count) {
  const el = document.getElementById(`votes-${projectId}`);
  if (el) el.textContent = count;
}

// Subscribe to realtime changes on the projects table
function subscribeToVotes() {
  db.channel('votes-channel')
    .on('postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'projects' },
      (payload) => {
        updateVoteDisplay(payload.new.id, payload.new.vote_count);
      }
    )
    .subscribe();
}

// Cast or undo a vote for a project. Returns new voted state.
async function castVote(projectId) {
  const key = `voted_${projectId}`;
  const alreadyVoted = localStorage.getItem(key) === '1';

  if (alreadyVoted) {
    await db.rpc('decrement_vote', { project_id: projectId });
    localStorage.removeItem(key);
    return false; // now un-voted
  } else {
    await db.rpc('increment_vote', { project_id: projectId });
    localStorage.setItem(key, '1');
    return true; // now voted
  }
}

function hasVoted(projectId) {
  return localStorage.getItem(`voted_${projectId}`) === '1';
}

// Wire up the vote button on a detail page
function initDetailVoteButton(projectId) {
  const btn   = document.getElementById('vote-btn');
  const emoji = document.getElementById('vote-emoji');
  const text  = document.getElementById('vote-text');
  if (!btn) return;

  const applyVotedState = (voted) => {
    if (voted) {
      btn.classList.add('voted');
      emoji.textContent = '✅';
      text.textContent  = 'Voted — I review the standings every Sunday.';
    } else {
      btn.classList.remove('voted');
      emoji.textContent = '👍';
      text.textContent  = 'I want to see this built out';
    }
  };

  // Restore state from localStorage on load
  applyVotedState(hasVoted(projectId));

  btn.addEventListener('click', async () => {
    btn.disabled = true;
    const nowVoted = await castVote(projectId);
    applyVotedState(nowVoted);
    btn.disabled = false;
  });
}

// Called on DOMContentLoaded from main.js — runs on every page
function initVotes() {
  loadVoteCounts();
  subscribeToVotes();
}
