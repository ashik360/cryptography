// Methodology text for each cipher
// const methodology = {
// caesar: `Caesar Cipher Methodology:\n1. Convert text to uppercase.\n2. Shift each letter by the key value (0-25).\n3. Wrap around alphabet when passing 'Z'.\n4. Non‑alphabet characters remain unchanged.`,
// mono: `Monoalphabetic Cipher Methodology:\n1. Convert text to uppercase.\n2. Replace each letter using a 26‑letter substitution key.\n3. Ensure key contains all unique letters A‑Z.\n4. Decryption reverses substitution.`,
// playfair: `Playfair Cipher Methodology:\n1. Create a 5x5 matrix using the key (I/J combined).\n2. Prepare text in digraphs (pairs).\n3. Apply Playfair rules: same row, same column, or rectangle.\n4. Produce encrypted digraph output.`,
// hill: `Hill Cipher Methodology:\n1. Convert text to numbers (A=0 ... Z=25).\n2. Group text into vector pairs.\n3. Multiply by 2x2 key matrix mod 26.\n4. Decryption uses inverse matrix mod 26.`,
// poly: `Vigenère (Polyalphabetic) Cipher Methodology:\n1. Convert text to uppercase.\n2. Repeat key to match text length.\n3. Shift each letter by key's letter value.\n4. Decrypt by reversing shifts.`,
// rail: `Rail Fence Cipher Methodology:\n1. Choose number of rails.\n2. Write text in zig‑zag pattern across rails.\n3. Read row by row to form cipher text.\n4. Decrypt by reconstructing the zig‑zag pattern.`
// };


// function showCipher(id) {
//   // Hide all cipher sections
//   document.querySelectorAll('.cipher-section')
//     .forEach(sec => sec.classList.remove('active'));

//   // Show selected section
//   document.getElementById(id).classList.add('active');

//   // Remove active class from all nav buttons
//   document.querySelectorAll('nav button')
//     .forEach(btn => btn.classList.remove('active'));

//   // Add active class to clicked button (OLD behavior restored)
//   event.target.classList.add('active');

//   // ---- Methodology Update (new) ----
//   const methodologyBox = document.querySelector('.methodology-steps');
  
//   methodologyBox.style.opacity = 0;

//   setTimeout(() => {
//     methodologyBox.textContent = methodology[id] || "";
//     methodologyBox.style.opacity = 1;
//   }, 150);
// }

// Methodology text for each cipher
const methodology = {
  caesar: `Caesar Cipher — Full Step-by-step Methodology:

1) Normalize input:
   • Convert input to uppercase to simplify processing.
   • Remove or keep non-letter characters depending on UI choice (this implementation keeps them as-is).

2) Map letters to numbers (why we do this):
   • In ASCII, 'A' = 65, 'B' = 66, … 'Z' = 90.
   • To work in a 0–25 range, subtract 65 from the char code: value = ch.charCodeAt(0) - 65.
   • Example: 'C' -> 67 - 65 = 2.

3) Apply shift (encryption):
   • Add the key (shift) to the numeric value: shifted = (value + key) % 26.
   • Use modulo 26 to wrap around after 'Z'.
   • Convert back to a letter: String.fromCharCode(shifted + 65).
   • Example: 'Z' with key 3 -> (25 + 3) % 26 = 2 -> 'C'.

4) Apply reverse shift (decryption):
   • Subtract the key: original = (value - key + 26) % 26 to avoid negatives.

5) Preserve non-letters:
   • Characters outside A–Z are copied unchanged (spaces, punctuation).

6) UX notes for beginners:
   • Key values can be any integer; we reduce with key = key % 26.
   • Show sample mapping on the page (A->D when key=3) to make the effect obvious.`,

  mono: `Monoalphabetic (Substitution) Cipher — Full Step-by-step Methodology:

1) Normalize input:
   • Convert text and key to uppercase.
   • Remove non-letters from the key; the key must be 26 letters (A–Z) after cleaning.

2) Validate key (essential):
   • Ensure the key string length is 26.
   • Ensure each letter A–Z appears exactly once; otherwise encryption/decryption will be wrong.
   • Example: key = "QWERTY..." maps 'A'->key[0], 'B'->key[1], etc.

3) Mapping letters to/from numbers (optional explanation):
   • For encryption: take letter L, index = L.charCodeAt(0) - 65, cipher = key[index].
   • For decryption: find the index of ciphertext letter in key, plain = String.fromCharCode(index + 65).

4) Non-letter handling:
   • Non A–Z characters are preserved.

5) Security note for beginners:
   • Monoalphabetic substitution is easy to break with frequency analysis — useful for learning, not secure for real secrets.`,

  playfair: `Playfair Cipher — Full Step-by-step Methodology (Beginner-friendly):

1) Prepare and normalize the key:
   • Convert key to uppercase and remove non-letters.
   • Typically merge 'J' into 'I' (so matrix uses A–Z except J) — that's what this implementation does.

2) Build the 5×5 matrix:
   • Start with letters of the cleaned key in order, skipping duplicates.
   • Fill the remaining positions with the rest of the alphabet (skipping 'J').
   • The matrix is stored row-wise; to get row = Math.floor(index / 5), col = index % 5.

3) Prepare plaintext into digraphs (pairs):
   • Convert to uppercase, remove non-letters, and replace J with I.
   • Walk pairs left-to-right: if a pair is the same letter (e.g., "EE"), insert an 'X' between them → pair becomes 'EX' and then continue.
   • If the final pair is a single letter, pad with 'X' to make even length.
   • Example: "BALLOON" -> pairs: BA LX LO ON -> BA LX LO ON (with X inserted).

4) Encryption rules for each digraph (A,B):
   • Find positions (rA,cA) and (rB,cB) in the 5×5 matrix.
   • If same row: replace each letter with the letter to its immediate right (wrap to start of row if needed).
   • If same column: replace each letter with the letter immediately below it (wrap to top if needed).
   • Otherwise (rectangle): swap columns: result letters are (rA,cB) and (rB,cA).

5) Decryption uses the inverse rules (left/up instead of right/down).

6) UX & debugging tips:
   • Display the 5×5 matrix visually on the page so beginners can trace pairs.
   • Show the digraph breakdown and intermediate steps for the selected pair (e.g., show coordinates and the rule applied).`,

  hill: `Hill Cipher (2×2) — Full Step-by-step Methodology (with modular arithmetic details):

1) Normalize text and pad:
   • Convert to uppercase and remove non-letters.
   • Pad with 'X' if the length is not a multiple of 2 (for 2×2 key).

2) Map letters to numbers:
   • A→0, B→1, ..., Z→25 by computing ch.charCodeAt(0)-65.

3) Parse the key matrix:
   • The key is four integers entered row-wise: [a b; c d].
   • Work modulo 26 for all operations.

4) Encryption (per 2-vector):
   • For pair (x, y) compute vector product: [x'; y'] = [[a,b],[c,d]] × [x; y] (mod 26).
   • That means x' = (a*x + b*y) % 26, y' = (c*x + d*y) % 26.

5) Decryption (matrix inverse modulo 26):
   • Compute determinant det = (a*d - b*c) mod 26.
   • Compute detInv = modular inverse of det mod 26 (a number detInv such that (det * detInv) % 26 == 1).
   • If detInv doesn't exist (i.e., det shares factor with 26), the matrix is not invertible and decryption fails — show an error.
   • Inverse matrix = detInv * [[d, -b], [-c, a]] mod 26. Apply this inverse to ciphertext vectors.

6) Practical notes for beginners:
   • Explain how to compute modular inverse with the extended Euclidean algorithm or trial search (this implementation uses trial search).
   • Display the numeric matrix and intermediate numeric vectors on the page during encrypt/decrypt so learners can follow.`,

  poly: `Vigenère (Polyalphabetic) Cipher — Full Step-by-step Methodology:

1) Normalize input and key:
   • Convert both text and key to uppercase and strip non-letter characters from the key.

2) Repeat or trim the key to match plaintext length:
   • Example: plaintext length 7 and key "KEY" -> repeated key "KEYKEYK".

3) Map to numbers:
   • Plain letter value p = ch.charCodeAt(0) - 65.
   • Key letter value k = keyChar.charCodeAt(0) - 65.

4) Encryption per-letter:
   • Cipher value c = (p + k) % 26.
   • Output letter = String.fromCharCode(c + 65).

5) Decryption per-letter:
   • p = (c - k + 26) % 26.

6) Notes for beginners:
   • Show alignment of plaintext, key letter, numeric values and resulting cipher letter in a table for clarity.
   • Vigenère resists simple frequency analysis but can be broken with Kasiski examination and frequency methods.`,

  rail: `Rail Fence Cipher — Full Step-by-step Methodology:

1) Choose rails (R) and normalize text:
   • Use text as-is (spaces may be kept or removed depending on UI choice).

2) Build zig-zag pattern and index map:
   • Conceptually write characters in rows from top to bottom, then up to top, repeating (a zig-zag).
   • Record the rail index for each plaintext position. Example for R=3 the pattern of rail indices is: 0,1,2,1,0,1,2,1,...

3) Encryption (read row-wise):
   • Collect chars that fell on rail 0 in order, then rail 1, etc., concatenating to form ciphertext.

4) Decryption (reconstruct by index counts):
   • Recreate the pattern of rail indices for the ciphertext length.
   • Count how many chars go to each rail (these counts come from stepping the index pattern).
   • Slice the ciphertext into segments for each rail using those counts.
   • Rebuild plaintext by iterating the original index pattern and pulling the next char from the corresponding rail segment.

5) UX tips for beginners:
   • Visualize the zig-zag as a grid and animate how ciphertext is read row-by-row.
   • Show the index pattern array and the counts used to split the ciphertext so the reconstruction is clear.`
};

document.getElementById('methodologyPre').textContent = methodology[id];

// Update methodology box when switching tabs
function showCipher(id) {
  document.querySelectorAll('.cipher-section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  // Update methodology box
  const box = document.querySelector('.methodology-steps');
  box.style.opacity = 0;
  setTimeout(() => {
    box.textContent = methodology[id] || '';
    box.style.opacity = 1;
  }, 200);
}

// Existing cipher logic remains unchanged below this comment
// (Add your Caesar, Playfair, Hill, Vigenere, Rail Fence functions here)

/* -----------------------------
   Utility: render steps to methodology box
   ----------------------------- */
function renderSteps(title, steps) {
  const box = document.querySelector('.methodology-steps');
  const html = [];
  html.push(`<strong style="display:block;margin-bottom:6px">${escapeHtml(title)}</strong>`);
  html.push('<ol style="margin-top:4px;padding-left:18px;line-height:1.45;color:#d7e7ff">');
  for (const s of steps) {
    html.push(`<li style="margin-bottom:8px"><pre style="white-space:pre-wrap;margin:0;font-family:inherit;background:transparent;border:0;padding:0">${escapeHtml(s)}</pre></li>`);
  }
  html.push('</ol>');
  box.innerHTML = html.join('');
}

function escapeHtml(str){
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;');
}

/* -----------------------------
   Tab switching (keeps your original behavior)
   ----------------------------- */
function showCipher(id, event) {

  // Hide all cipher sections
  document.querySelectorAll('.cipher-section')
          .forEach(sec => sec.classList.remove('active'));

  // Show selected cipher section
  document.getElementById(id).classList.add('active');

  // Update active button style
  document.querySelectorAll('nav button')
          .forEach(btn => btn.classList.remove('active'));

  if (event) event.target.classList.add('active');

  // Show default methodology text for this cipher
  const pre = document.getElementById('methodologyPre');
  pre.textContent = methodology[id] || "";
}


/* =============================
   Caesar — encryption/decryption with demonstration
   ============================= */
function caesarEncrypt(){
  const text = document.getElementById('caesarText').value || '';
  const key = parseInt(document.getElementById('caesarKey').value) || 0;
  const K = ((key % 26) + 26) % 26;
  let cipher = '';
  const steps = [];
  steps.push(`Input (raw): ${text}`);
  steps.push(`Normalize: convert letters to uppercase for processing (we'll preserve original letter case in output).`);

  for (let i=0;i<text.length;i++){
    const ch = text[i];
    if(/[A-Za-z]/.test(ch)){
      const up = ch.toUpperCase();
      const code = up.charCodeAt(0);
      const val = code - 65; // 0..25
      const shifted = (val + K) % 26;
      const out = String.fromCharCode(shifted + 65);
      // preserve case
      const finalChar = (ch === ch.toLowerCase()) ? out.toLowerCase() : out;
      cipher += finalChar;
      steps.push(`${ch} → upper: ${up} (ASCII ${code}) → index ${val} → + key(${K}) = ${val + K} → mod26 = ${shifted} → letter ${out} → preserve case -> ${finalChar}`);
    } else {
      cipher += ch;
      steps.push(`${ch} (non-letter) preserved unchanged`);
    }
  }

  document.getElementById('caesarOutput').innerText = cipher;
  renderSteps('Caesar — Encryption Demonstration', steps);
}

function caesarDecrypt(){
  const text = document.getElementById('caesarText').value || '';
  const key = parseInt(document.getElementById('caesarKey').value) || 0;
  const K = ((key % 26) + 26) % 26;
  let plain = '';
  const steps = [];
  steps.push(`Input (raw cipher): ${text}`);
  steps.push(`Normalize: convert to uppercase for processing, then reverse the shift of ${K}.`);

  for (let i=0;i<text.length;i++){
    const ch = text[i];
    if(/[A-Za-z]/.test(ch)){
      const up = ch.toUpperCase();
      const code = up.charCodeAt(0);
      const val = code - 65;
      const shifted = (val - K + 26) % 26;
      const out = String.fromCharCode(shifted + 65);
      const finalChar = (ch === ch.toLowerCase()) ? out.toLowerCase() : out;
      plain += finalChar;
      steps.push(`${ch} → upper: ${up} (ASCII ${code}) → index ${val} → - key(${K}) = ${val - K} → mod26 = ${shifted} → letter ${out} → preserve case -> ${finalChar}`);
    } else {
      plain += ch;
      steps.push(`${ch} (non-letter) preserved unchanged`);
    }
  }

  document.getElementById('caesarOutput').innerText = plain;
  renderSteps('Caesar — Decryption Demonstration', steps);
}

/* =============================
   Monoalphabetic — demo
   ============================= */
function monoEncrypt(){
  const text = document.getElementById('monoText').value || '';
  const keyRaw = document.getElementById('monoKey').value || '';
  const key = keyRaw.toUpperCase().replace(/[^A-Z]/g,'');
  const steps = [];
  steps.push(`Key (cleaned): ${key}`);
  steps.push('Validation: key should be 26 unique letters A–Z.');

  if(key.length !== 26){
    steps.push('⚠️ Key length is not 26 — encryption will use what is available but may be incorrect for missing letters.');
  }

  let out = '';
  for (let ch of text){
    if(/[A-Za-z]/.test(ch)){
      const up = ch.toUpperCase();
      const idx = up.charCodeAt(0) - 65;
      const subs = key[idx] || '?';
      const finalChar = (ch === ch.toLowerCase()) ? subs.toLowerCase() : subs;
      out += finalChar;
      steps.push(`${ch} -> index ${idx} -> substitute ${subs} -> preserve case -> ${finalChar}`);
    } else {
      out += ch;
      steps.push(`${ch} (non-letter) preserved`);
    }
  }

  document.getElementById('monoOutput').innerText = out;
  renderSteps('Monoalphabetic — Encryption Demonstration', steps);
}

function monoDecrypt(){
  const text = document.getElementById('monoText').value || '';
  const key = (document.getElementById('monoKey').value || '').toUpperCase().replace(/[^A-Z]/g,'');
  const steps = [];
  steps.push(`Key: ${key}`);
  let out = '';

  for (let ch of text){
    if(/[A-Za-z]/.test(ch)){
      const up = ch.toUpperCase();
      const idx = key.indexOf(up);
      if(idx === -1){
        steps.push(`${ch} -> not found in key -> output '?'`);
        out += '?';
      } else {
        const plain = String.fromCharCode(idx + 65);
        const finalChar = (ch === ch.toLowerCase()) ? plain.toLowerCase() : plain;
        steps.push(`${ch} -> key.indexOf=${idx} -> plain ${plain} -> preserve case -> ${finalChar}`);
        out += finalChar;
      }
    } else {
      out += ch;
      steps.push(`${ch} preserved`);
    }
  }

  document.getElementById('monoOutput').innerText = out;
  renderSteps('Monoalphabetic — Decryption Demonstration', steps);
}

/* =============================
   Playfair — demo with digraph tracing
   ============================= */
function generatePlayfairMatrix(key){
  key = (key || '').toUpperCase().replace(/J/g,'I').replace(/[^A-Z]/g,'');
  const matrix = [];
  const used = {};
  for (const ch of key){ if(!used[ch]){ used[ch]=true; matrix.push(ch); }}
  for (let i=65;i<=90;i++){ const ch = String.fromCharCode(i); if(ch === 'J') continue; if(!used[ch]){ used[ch]=true; matrix.push(ch); }}
  return matrix;
}

function prepareTextForPlayfair(text){
  text = (text || '').toUpperCase().replace(/J/g,'I').replace(/[^A-Z]/g,'');
  let res = '';
  for (let i=0;i<text.length;i++){
    const a = text[i];
    const b = text[i+1];
    if(b && a === b){ res += a + 'X'; }
    else{ res += a; if(b){ res += b; i++; } else res += 'X'; }
  }
  if(res.length % 2 !== 0) res += 'X';
  return res;
}

function playfairEncrypt(){
  const raw = document.getElementById('playfairText').value || '';
  const key = document.getElementById('playfairKey').value || '';
  const matrix = generatePlayfairMatrix(key);
  const prepared = prepareTextForPlayfair(raw);
  const steps = [];
  steps.push(`Key: ${key}`);
  steps.push(`5×5 matrix (row-wise): ${matrix.join(' ')}`);
  const digraphs = prepared.match(/.{1,2}/g) || [];
  steps.push(`Prepared digraphs: ${digraphs.join(' ')}`);
  let out = '';

  for (let i=0;i<digraphs.length;i++){
    const pair = digraphs[i];
    const a = pair[0], b = pair[1];
    const ai = matrix.indexOf(a), bi = matrix.indexOf(b);
    const ar = Math.floor(ai/5), ac = ai%5, br = Math.floor(bi/5), bc = bi%5;
    let ra, rb, reason;
    if(ar === br){
      ra = ar*5 + (ac+1)%5; rb = br*5 + (bc+1)%5;
      reason = `same row ${ar} -> right-shift`;
    } else if (ac === bc){
      ra = ((ar+1)%5)*5 + ac; rb = ((br+1)%5)*5 + bc;
      reason = `same column ${ac} -> down-shift`;
    } else {
      ra = ar*5 + bc; rb = br*5 + ac;
      reason = `rectangle -> swap columns`;
    }
    steps.push(`${pair}: indices (${ai},${bi}) -> coords A(${ar},${ac}) B(${br},${bc}) -> ${reason} -> ${matrix[ra]}${matrix[rb]}`);
    out += matrix[ra] + matrix[rb];
  }

  document.getElementById('playfairOutput').innerText = out;
  renderSteps('Playfair — Encryption Demonstration', steps);
}

function playfairDecrypt(){
  const raw = (document.getElementById('playfairText').value || '').toUpperCase().replace(/[^A-Z]/g,'');
  const key = document.getElementById('playfairKey').value || '';
  const matrix = generatePlayfairMatrix(key);
  const steps = [];
  steps.push(`Key: ${key}`);
  steps.push(`Matrix: ${matrix.join(' ')}`);
  const digraphs = (raw.match(/.{1,2}/g) || []);
  let out = '';

  for (let i=0;i<digraphs.length;i++){
    const pair = digraphs[i];
    const a = pair[0], b = pair[1];
    const ai = matrix.indexOf(a), bi = matrix.indexOf(b);
    const ar = Math.floor(ai/5), ac = ai%5, br = Math.floor(bi/5), bc = bi%5;
    let ra, rb, reason;
    if(ar === br){
      ra = ar*5 + (ac+4)%5; rb = br*5 + (bc+4)%5;
      reason = `same row ${ar} -> left-shift`;
    } else if (ac === bc){
      ra = ((ar+4)%5)*5 + ac; rb = ((br+4)%5)*5 + bc;
      reason = `same column ${ac} -> up-shift`;
    } else {
      ra = ar*5 + bc; rb = br*5 + ac;
      reason = `rectangle -> swap columns`;
    }
    steps.push(`${pair}: indices (${ai},${bi}) -> coords A(${ar},${ac}) B(${br},${bc}) -> ${reason} -> ${matrix[ra]}${matrix[rb]}`);
    out += matrix[ra] + matrix[rb];
  }

  document.getElementById('playfairOutput').innerText = out;
  renderSteps('Playfair — Decryption Demonstration', steps);
}

/* =============================
   Hill (2×2) — demo with numeric vectors
   ============================= */
function modInverse(a,m){ a = ((a % m) + m) % m; for(let x=1;x<m;x++) if((a*x)%m===1) return x; return null; }

function hillEncrypt(){
  const raw = (document.getElementById('hillText').value || '').toUpperCase().replace(/[^A-Z]/g,'');
  const keyVals = (document.getElementById('hillKey').value || '').split(/\s+/).map(Number);
  const steps = [];
  steps.push(`Key (row-wise): ${keyVals.join(', ')}`);
  let text = raw;
  if(text.length % 2 !== 0){ text += 'X'; steps.push('Padded plaintext with X to make length even'); }
  const pairs = [];
  for(let i=0;i<text.length;i+=2) pairs.push([text.charCodeAt(i)-65, text.charCodeAt(i+1)-65]);
  let out = '';
  for(const [x,y] of pairs){
    const a = (keyVals[0]*x + keyVals[1]*y) % 26;
    const b = (keyVals[2]*x + keyVals[3]*y) % 26;
    steps.push(`${String.fromCharCode(x+65)}(${x}), ${String.fromCharCode(y+65)}(${y}) -> [${a},${b}] -> ${String.fromCharCode(a+65)}${String.fromCharCode(b+65)}`);
    out += String.fromCharCode(a+65) + String.fromCharCode(b+65);
  }
  document.getElementById('hillOutput').innerText = out;
  renderSteps('Hill (2×2) — Encryption Demonstration', steps);
}

function hillDecrypt(){
  const raw = (document.getElementById('hillText').value || '').toUpperCase().replace(/[^A-Z]/g,'');
  const keyVals = (document.getElementById('hillKey').value || '').split(/\s+/).map(Number);
  const det = (keyVals[0]*keyVals[3] - keyVals[1]*keyVals[2]) % 26;
  const inv = modInverse(det,26);
  const steps = [];
  if(inv === null){ alert('Key matrix not invertible mod 26 — cannot decrypt'); return; }
  steps.push(`det = ${det} (mod 26), detInv = ${inv}`);
  const invMat = [ (keyVals[3]*inv)%26, ((-keyVals[1]+26)*inv)%26, ((-keyVals[2]+26)*inv)%26, (keyVals[0]*inv)%26 ];
  steps.push(`Inverse matrix (row-wise): ${invMat.join(', ')}`);
  let out = '';
  for(let i=0;i<raw.length;i+=2){
    const x = raw.charCodeAt(i)-65, y = raw.charCodeAt(i+1)-65;
    const a = (invMat[0]*x + invMat[1]*y) % 26; const b = (invMat[2]*x + invMat[3]*y) % 26;
    steps.push(`${String.fromCharCode(x+65)}(${x}), ${String.fromCharCode(y+65)}(${y}) -> [${a},${b}] -> ${String.fromCharCode(a+65)}${String.fromCharCode(b+65)}`);
    out += String.fromCharCode(a+65) + String.fromCharCode(b+65);
  }
  document.getElementById('hillOutput').innerText = out;
  renderSteps('Hill (2×2) — Decryption Demonstration', steps);
}

/* =============================
   Vigenère — demo with per-letter table
   ============================= */
function vigenereEncrypt(){
  const raw = (document.getElementById('vigenereText').value || '');
  const keyRaw = (document.getElementById('vigenereKey').value || '');
  const text = raw.toUpperCase().replace(/[^A-Z]/g,'');
  const key = keyRaw.toUpperCase().replace(/[^A-Z]/g,'');
  const steps = [];
  steps.push(`Plain (letters only): ${text}`);
  steps.push(`Key (cleaned): ${key}`);
  let out = '';
  for (let i=0;i<text.length;i++){
    const p = text.charCodeAt(i)-65;
    const k = key.charCodeAt(i % key.length) - 65;
    const c = (p + k) % 26;
    steps.push(`${text[i]}: p=${p}, key=${key[i % key.length]} (k=${k}) -> (p+k)=${p+k} -> mod26=${c} -> ${String.fromCharCode(c+65)}`);
    out += String.fromCharCode(c+65);
  }
  document.getElementById('vigenereOutput').innerText = out;
  renderSteps('Vigenère — Encryption Demonstration', steps);
}

function vigenereDecrypt(){
  const raw = (document.getElementById('vigenereText').value || '');
  const keyRaw = (document.getElementById('vigenereKey').value || '');
  const text = raw.toUpperCase().replace(/[^A-Z]/g,'');
  const key = keyRaw.toUpperCase().replace(/[^A-Z]/g,'');
  const steps = [];
  let out = '';
  for (let i=0;i<text.length;i++){
    const c = text.charCodeAt(i)-65;
    const k = key.charCodeAt(i % key.length) - 65;
    const p = (c - k + 26) % 26;
    steps.push(`${text[i]}: c=${c}, key=${key[i % key.length]} (k=${k}) -> (c-k)=${c-k} -> mod26=${p} -> ${String.fromCharCode(p+65)}`);
    out += String.fromCharCode(p+65);
  }
  document.getElementById('vigenereOutput').innerText = out;
  renderSteps('Vigenère — Decryption Demonstration', steps);
}

/* =============================
   Rail Fence — demo showing index pattern and reconstruction
   ============================= */
function railEncrypt(){
  const raw = document.getElementById('railText').value || '';
  const rails = parseInt(document.getElementById('railKey').value) || 3;
  const steps = [];
  steps.push(`Raw input: ${raw}`);
  // build pattern
  const pattern = [];
  let rail=0, dir=1;
  for(let i=0;i<raw.length;i++){
    pattern.push(rail);
    rail += dir;
    if(rail===0||rail===rails-1) dir *= -1;
  }
  steps.push(`Index pattern (per character): ${pattern.join(',')}`);
  const fence = Array.from({length:rails},()=>[]);
  for(let i=0;i<raw.length;i++) fence[pattern[i]].push(raw[i]);
  steps.push(`Rail groups: ${fence.map((g,i)=>`R${i}:[${g.join('')}]`).join(' | ')}`);
  const out = fence.flat().join('');
  document.getElementById('railOutput').innerText = out;
  renderSteps('Rail Fence — Encryption Demonstration', steps);
}

function railDecrypt(){
  const raw = document.getElementById('railText').value || '';
  const rails = parseInt(document.getElementById('railKey').value) || 3;
  const steps = [];
  // recreate pattern
  const pattern = [];
  let rail=0, dir=1;
  for(let i=0;i<raw.length;i++){
    pattern.push(rail);
    rail += dir;
    if(rail===0||rail===rails-1) dir *= -1;
  }
  steps.push(`Index pattern: ${pattern.join(',')}`);
  const counts = new Array(rails).fill(0);
  pattern.forEach(r=>counts[r]++);
  steps.push(`Counts per rail: ${counts.join(',')}`);
  const fence = [];
  let idx=0;
  for(let r=0;r<rails;r++){
    fence[r] = raw.slice(idx, idx+counts[r]).split(''); idx += counts[r];
  }
  steps.push(`Rail slices: ${fence.map((f,i)=>`R${i}:[${f.join('')}]`).join(' | ')}`);
  let out = '';
  for(let p of pattern){ out += fence[p].shift(); }
  document.getElementById('railOutput').innerText = out;
  renderSteps('Rail Fence — Decryption Demonstration', steps);
}

/* =============================
   Notes:
   - Buttons in your HTML already call these functions (e.g. caesarEncrypt()).\n
   - Each function both writes the cipher result into the corresponding output element\n     and writes a step-by-step, beginner-friendly trace into .methodology-steps.\n
   If you want richer HTML (tables, highlighted rows, animated step-by-step play-through),\n   I can add that next — tell me how you'd like the visualization (table, animated steps, matrix viewer, etc.).\n
   End of script.
*/