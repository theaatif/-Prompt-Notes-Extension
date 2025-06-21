const notesHTML = `
<div id="notesBox">
  <div class="notes-header">
    <span>📝 Notes</span>
    <div style="display: flex; gap: 6px;">
      <button id="toggleNotes" title="Collapse">👁️</button>
      <button id="removeNotes" title="Remove">❌</button>
    </div>
  </div>
  <div class="notes-toolbar">
    <button data-prefix="# ">H1</button>
    <button data-prefix="## ">H2</button>
    <button data-prefix="### ">H3</button>
  </div>
  <div class="notes-content">
    <textarea id="notesArea" placeholder="• Start typing your notes..."></textarea>
    <div class="resize-handle"></div>
  </div>
</div>
`;

const wrapper = document.createElement("div");
wrapper.innerHTML = notesHTML;
document.body.appendChild(wrapper);

const notesBox = document.getElementById("notesBox");
const toggleBtn = document.getElementById("toggleNotes");
const removeBtn = document.getElementById("removeNotes");
const resizeHandle = document.querySelector(".resize-handle");
const textarea = document.getElementById("notesArea");

//  Start collapsed
notesBox.classList.add("collapsed");
let isCollapsed = true;

let originalSize = {
  width: "320px",
  height: "280px"
};

//  Toggle collapse/expand
toggleBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  isCollapsed = !isCollapsed;
  if (isCollapsed) {
    originalSize.width = notesBox.style.width || notesBox.offsetWidth + "px";
    originalSize.height = notesBox.style.height || notesBox.offsetHeight + "px";
    notesBox.classList.add("collapsed");
  } else {
    notesBox.classList.remove("collapsed");
    notesBox.style.width = originalSize.width;
    notesBox.style.height = originalSize.height;
  }
});

// ✅ Remove notes box completely
removeBtn.addEventListener("click", () => {
  notesBox.remove();
});

// ✅ Formatting buttons
document.querySelectorAll(".notes-toolbar button").forEach(button => {
  button.addEventListener("click", () => {
    const prefix = button.getAttribute("data-prefix");
    applyFormat(prefix);
  });
});

// ✅ Dragging
let isDragging = false;
let wasDragged = false;
let offset = { x: 0, y: 0 };

notesBox.addEventListener("mousedown", (e) => {
  if (e.target.tagName === "TEXTAREA" || e.target.tagName === "BUTTON") return;
  isDragging = true;
  wasDragged = false;
  const rect = notesBox.getBoundingClientRect();
  offset.x = e.clientX - rect.left;
  offset.y = e.clientY - rect.top;
  notesBox.style.transition = "none";
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  wasDragged = true;
  let x = e.clientX - offset.x;
  let y = e.clientY - offset.y;

  const maxX = window.innerWidth - notesBox.offsetWidth;
  const maxY = window.innerHeight - notesBox.offsetHeight;

  x = Math.max(0, Math.min(x, maxX));
  y = Math.max(0, Math.min(y, maxY));

  notesBox.style.left = `${x}px`;
  notesBox.style.top = `${y}px`;
});

document.addEventListener("mouseup", () => {
  isDragging = false;
  notesBox.style.transition = "all 0.3s ease";
  setTimeout(() => (wasDragged = false), 200);
});

// ✅ Expand on click (only if not dragged)
notesBox.addEventListener("click", () => {
  if (isCollapsed && !wasDragged) {
    isCollapsed = false;
    notesBox.classList.remove("collapsed");
    notesBox.style.width = originalSize.width;
    notesBox.style.height = originalSize.height;
  }
});

//  Resizing
let isResizing = false, startX, startY, startWidth, startHeight;

resizeHandle.addEventListener("mousedown", (e) => {
  isResizing = true;
  startX = e.clientX;
  startY = e.clientY;
  startWidth = notesBox.offsetWidth;
  startHeight = notesBox.offsetHeight;
  e.preventDefault();
  e.stopPropagation();
});

document.addEventListener("mousemove", (e) => {
  if (!isResizing) return;
  const newWidth = Math.max(200, startWidth + (e.clientX - startX));
  const newHeight = Math.max(150, startHeight + (e.clientY - startY));
  notesBox.style.width = newWidth + "px";
  notesBox.style.height = newHeight + "px";
});

document.addEventListener("mouseup", () => {
  isResizing = false;
});

// Bullet on Enter
textarea.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const pos = textarea.selectionStart;
    const before = textarea.value.substring(0, pos);
    const after = textarea.value.substring(pos);
    const bullet = "\n• ";
    textarea.value = before + bullet + after;
    textarea.selectionStart = textarea.selectionEnd = pos + bullet.length;
    e.preventDefault();
  }
});

// Remove bullet if line is heading
textarea.addEventListener("input", () => {
  const cursorPos = textarea.selectionStart;
  const lines = textarea.value.split("\n");
  let changed = false;

  const fixedLines = lines.map(line => {
    if (line.match(/^•\s+(#{1,3}\s+)/)) {
      changed = true;
      return line.replace(/^•\s+(#{1,3}\s+)/, "$1");
    }
    return line;
  });

  if (changed) {
    const newValue = fixedLines.join("\n");
    textarea.value = newValue;
    textarea.selectionStart = textarea.selectionEnd = Math.max(0, cursorPos - 2);
  }

  localStorage.setItem("smartNotes", textarea.value);
});

//  Load saved notes
textarea.value = localStorage.getItem("smartNotes") || "";

//  Heading format function
function applyFormat(prefix) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const before = textarea.value.substring(0, start);
  const selection = textarea.value.substring(start, end);
  const after = textarea.value.substring(end);

  const lines = selection.split('\n').map(line => {
    let cleanLine = line.trimStart();
    if (cleanLine.startsWith('• ')) {
      cleanLine = cleanLine.substring(2);
    }
    return prefix + cleanLine;
  });

  const newText = lines.join('\n');
  textarea.value = before + newText + after;
  const newCursor = start + newText.length;
  textarea.selectionStart = textarea.selectionEnd = newCursor;
  textarea.focus();
}
