// Methodology text for each cipher
const methodology = {
  caesar: `Caesar Cipher —:
  
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

  mono: `Monoalphabetic (Substitution) Cipher —:

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

  playfair: `Playfair Cipher —:

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

  hill: `Hill Cipher (2×2) —:

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

  poly: `Vigenère (Polyalphabetic) Cipher -:

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

  rail: `Rail Fence Cipher —:

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
   • Show the index pattern array and the counts used to split the ciphertext so the reconstruction is clear.`,

  rsa: `RSA Cipher —:

1) Key Generation:
   • Choose two distinct primes p and q (small for demo).
   • Compute n = p × q (the modulus).
   • Compute φ(n) = (p-1) × (q-1) (Euler's totient).
   • Choose public exponent e (typically 65537, but must be coprime with φ(n)).
   • Compute private exponent d = e⁻¹ mod φ(n) (modular inverse).
   • Public key: (n, e), Private key: (n, d).

2) Message Preparation:
   • Convert text to ASCII codes (0-255) or numeric representation.
   • Split into blocks smaller than n.

3) Encryption (for each block m):
   • Compute ciphertext c = m^e mod n (modular exponentiation).

4) Decryption (for each ciphertext block c):
   • Compute plaintext m = c^d mod n.

5) Implementation notes for demo:
   • We use small primes (p, q < 100) so operations fit in JavaScript integers.
   • Text is converted character-by-character to ASCII codes for simplicity.
   • Show modular exponentiation steps to illustrate the process.

6) Security reality check:
   • Real RSA uses 2048+ bit keys and proper padding (OAEP).
   • This demo is for  understanding only, not secure for real use.`,

  des: `DES Cipher —:

1) Key Preparation:
   • DES uses a 56-bit key (64 bits with parity).
   • Generate 16 subkeys via key schedule (permuted choice, left shifts).

2) Initial Permutation (IP):
   • Apply fixed 64-bit permutation to input block.

3) 16 Rounds of Feistel Network:
   • Split 64-bit block into left (L) and right (R) halves (32 bits each).
   • For each round:
     a) Expand R from 32 to 48 bits (expansion permutation).
     b) XOR expanded R with round subkey.
     c) Apply S-boxes (8 substitution tables, 6 bits → 4 bits).
     d) Permute the S-box output (P-box).
     e) XOR with L to get new R.
     f) Old R becomes new L.
   • Swap final L and R.

4) Final Permutation (IP⁻¹):
   • Apply inverse of initial permutation.

5) Implementation notes for demo:
   • We use simplified S-boxes and permutations for clarity.
   • Text is converted to 8-byte blocks (64 bits), padded if needed.
   • ECB mode (each block encrypted independently) for simplicity.

6) Security note:
   • Real DES is obsolete (56-bit key is breakable by brute force).
   • Modern systems use AES (Rijndael) or 3DES with stronger keys.
   • This demo illustrates the Feistel structure and bit-level operations.`
};

// Update methodology box when switching tabs
function showCipher(id, event) {
  // Hide all cipher sections
  document.querySelectorAll('.cipher-section')
    .forEach(sec => sec.classList.remove('active'));

  // Show selected section
  document.getElementById(id).classList.add('active');

  // Remove active class from all nav buttons
  document.querySelectorAll('nav button')
    .forEach(btn => btn.classList.remove('active'));

  // Add active class to clicked button
  if (event) event.target.classList.add('active');

  // Update methodology box with fade effect
  const box = document.querySelector('.methodology-steps');
  box.style.opacity = 0;
  setTimeout(() => {
    box.textContent = methodology[id] || '';
    box.style.opacity = 1;
  }, 200);
}

// Helper functions
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

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

/* =============================
   RSA Implementation ( - Small Keys)
   ============================= */
function modExp(base, exponent, modulus) {
  // Modular exponentiation for small numbers
  let result = 1;
  base = base % modulus;
  while (exponent > 0) {
    if (exponent % 2 === 1) {
      result = (result * base) % modulus;
    }
    exponent = Math.floor(exponent / 2);
    base = (base * base) % modulus;
  }
  return result;
}

function modInverse(a, m) {
  // Extended Euclidean algorithm for modular inverse
  a = ((a % m) + m) % m;
  for (let x = 1; x < m; x++) {
    if ((a * x) % m === 1) return x;
  }
  return null;
}

function generateRSAPrime(min, max) {
  // Simple prime generation for demo (not cryptographically secure)
  function isPrime(num) {
    if (num < 2) return false;
    if (num === 2 || num === 3) return true;
    if (num % 2 === 0) return false;
    for (let i = 3; i * i <= num; i += 2) {
      if (num % i === 0) return false;
    }
    return true;
  }

  let prime;
  do {
    prime = Math.floor(Math.random() * (max - min + 1)) + min;
  } while (!isPrime(prime));
  return prime;
}

function rsaGenerateKeys() {
  const steps = [];
  
  // Generate primes (small for demo)
  const p = generateRSAPrime(11, 97);
  const q = generateRSAPrime(11, 97);
  while (q === p) {
    q = generateRSAPrime(11, 97);
  }
  
  steps.push(`Generated primes: p = ${p}, q = ${q}`);
  
  const n = p * q;
  const phi = (p - 1) * (q - 1);
  steps.push(`Compute n = p × q = ${p} × ${q} = ${n}`);
  steps.push(`Compute φ(n) = (p-1) × (q-1) = ${p-1} × ${q-1} = ${phi}`);
  
  // Choose e (public exponent)
  let e = 65537;
  while (phi % e === 0 && e > 3) {
    e--;
  }
  if (e <= 3) e = 17;
  
  steps.push(`Choose public exponent e = ${e} (must be coprime with φ(n))`);
  
  // Compute d (private exponent)
  const d = modInverse(e, phi);
  steps.push(`Compute private exponent d = e⁻¹ mod φ(n) = ${e}⁻¹ mod ${phi} = ${d}`);
  
  steps.push(`\nPublic Key: (n=${n}, e=${e})`);
  steps.push(`Private Key: (n=${n}, d=${d})`);
  
  // Fill the input fields
  document.getElementById('rsaP').value = p;
  document.getElementById('rsaQ').value = q;
  document.getElementById('rsaE').value = e;
  document.getElementById('rsaN').value = n;
  document.getElementById('rsaD').value = d;
  
  renderSteps('RSA — Key Generation', steps);
}

function rsaEncrypt() {
  const text = document.getElementById('rsaText').value || '';
  const n = parseInt(document.getElementById('rsaN').value) || 0;
  const e = parseInt(document.getElementById('rsaE').value) || 0;
  
  if (!n || !e || n <= 0 || e <= 0) {
    alert('Please generate valid RSA keys first or enter n and e values');
    return;
  }
  
  const steps = [];
  steps.push(`Public Key: n=${n}, e=${e}`);
  steps.push(`Plaintext: "${text}"`);
  
  let ciphertext = '';
  const numericBlocks = [];
  
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    steps.push(`Character '${text[i]}' → ASCII code: ${charCode}`);
    
    if (charCode >= n) {
      steps.push(`WARNING: ASCII value ${charCode} >= n=${n}. RSA requires m < n.`);
      steps.push(`Consider using larger primes or encoding scheme.`);
    }
    
    const encrypted = modExp(charCode, e, n);
    steps.push(`Encrypt: ${charCode}^${e} mod ${n} = ${encrypted}`);
    
    numericBlocks.push(encrypted);
    ciphertext += encrypted.toString(16).padStart(4, '0') + ' ';
  }
  
  document.getElementById('rsaOutput').innerText = ciphertext.trim();
  
  steps.push(`\nCiphertext (hex blocks): ${ciphertext.trim()}`);
  renderSteps('RSA — Encryption Demonstration', steps);
}

function rsaDecrypt() {
  const ciphertext = document.getElementById('rsaText').value.trim();
  const n = parseInt(document.getElementById('rsaN').value) || 0;
  const d = parseInt(document.getElementById('rsaD').value) || 0;
  
  if (!n || !d || n <= 0 || d <= 0) {
    alert('Please generate valid RSA keys first or enter n and d values');
    return;
  }
  
  const steps = [];
  steps.push(`Private Key: n=${n}, d=${d}`);
  steps.push(`Ciphertext: "${ciphertext}"`);
  
  // Parse hex blocks
  const hexBlocks = ciphertext.split(/\s+/).filter(b => b.length > 0);
  let plaintext = '';
  
  for (let i = 0; i < hexBlocks.length; i++) {
    const block = parseInt(hexBlocks[i], 16);
    steps.push(`Hex block ${hexBlocks[i]} → decimal: ${block}`);
    
    const decrypted = modExp(block, d, n);
    steps.push(`Decrypt: ${block}^${d} mod ${n} = ${decrypted}`);
    
    if (decrypted < 0 || decrypted > 255) {
      steps.push(`WARNING: Decrypted value ${decrypted} is outside ASCII range.`);
    } else {
      const char = String.fromCharCode(decrypted);
      steps.push(`ASCII ${decrypted} → character: '${char}'`);
      plaintext += char;
    }
  }
  
  document.getElementById('rsaOutput').innerText = plaintext;
  
  steps.push(`\nDecrypted plaintext: "${plaintext}"`);
  renderSteps('RSA — Decryption Demonstration', steps);
}

/* =============================
   DES Implementation (/Simplified)
   ============================= */
// Simplified DES tables (greatly reduced for demo)
const DES_IP = [1, 5, 2, 0, 3, 7, 4, 6]; // Initial Permutation (8-bit simplified)
const DES_IP_INV = [3, 0, 2, 4, 6, 1, 7, 5]; // Inverse IP
const DES_E = [3, 0, 1, 2, 1, 2, 3, 0]; // Expansion (4 to 8 bits simplified)
const DES_P = [1, 3, 2, 0]; // Permutation (4 bits)
const DES_SBOX = [
  [ // S1 simplified
    [14, 4, 13, 1, 2, 15, 11, 8],
    [3, 10, 6, 12, 5, 9, 0, 7],
    [0, 15, 7, 4, 14, 2, 13, 1]
  ]
];

function stringToBits(str) {
  // Convert string to bit array (8 bits per char)
  const bits = [];
  for (let i = 0; i < str.length; i++) {
    const byte = str.charCodeAt(i);
    for (let j = 7; j >= 0; j--) {
      bits.push((byte >> j) & 1);
    }
  }
  return bits;
}

function bitsToString(bits) {
  // Convert bit array back to string
  let str = '';
  for (let i = 0; i < bits.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8 && i + j < bits.length; j++) {
      byte = (byte << 1) | bits[i + j];
    }
    str += String.fromCharCode(byte);
  }
  return str;
}

function permute(bits, table) {
  // Apply permutation table to bits
  const result = [];
  for (let i = 0; i < table.length; i++) {
    result.push(bits[table[i]]);
  }
  return result;
}

function xorBits(a, b) {
  // XOR two bit arrays
  const result = [];
  for (let i = 0; i < a.length; i++) {
    result.push(a[i] ^ b[i]);
  }
  return result;
}

function generateSubKeys(keyBits) {
  // Simplified key schedule (for 8-bit demo)
  const subkeys = [];
  for (let round = 0; round < 4; round++) {
    // Simple rotation for demo
    const shift = round + 1;
    const subkey = [...keyBits.slice(shift), ...keyBits.slice(0, shift)];
    subkeys.push(subkey);
  }
  return subkeys;
}

function desRound(left, right, subkey) {
  // One round of Feistel function
  const expandedRight = permute(right, DES_E);
  const xored = xorBits(expandedRight, subkey);
  
  // Simplified S-box (just take first 4 bits for demo)
  const sboxOut = xored.slice(0, 4);
  const permuted = permute(sboxOut, DES_P);
  
  const newRight = xorBits(left, permuted);
  return [right, newRight]; // [newLeft, newRight]
}

function desEncryptBlock(blockBits, keyBits) {
  // Encrypt one 8-bit block
  const steps = [];
  
  // Initial Permutation
  let permuted = permute(blockBits, DES_IP);
  steps.push(`After IP: ${permuted.join('')}`);
  
  // Split into left and right halves
  let left = permuted.slice(0, 4);
  let right = permuted.slice(4);
  steps.push(`L0: ${left.join('')}, R0: ${right.join('')}`);
  
  // Generate subkeys
  const subkeys = generateSubKeys(keyBits);
  
  // 4 rounds (simplified from 16)
  for (let round = 0; round < 4; round++) {
    [left, right] = desRound(left, right, subkeys[round]);
    steps.push(`Round ${round+1}: L${round+1}=${left.join('')}, R${round+1}=${right.join('')}`);
  }
  
  // Final swap and inverse permutation
  const combined = [...right, ...left];
  const cipherBits = permute(combined, DES_IP_INV);
  steps.push(`Final cipher bits: ${cipherBits.join('')}`);
  
  return { cipherBits, steps };
}

function desEncrypt() {
  const text = document.getElementById('desText').value || '';
  const key = document.getElementById('desKey').value || 'DESKEY!!';
  
  if (text.length === 0) {
    alert('Please enter text to encrypt');
    return;
  }
  
  const steps = [];
  steps.push(`Plaintext: "${text}"`);
  steps.push(`Key: "${key}" (using first 8 chars for 64-bit demo)`);
  
  // Convert to bits
  const keyBits = stringToBits(key.substring(0, 8));
  steps.push(`Key bits: ${keyBits.join('')}`);
  
  let ciphertext = '';
  const allSteps = [];
  
  // Process in 8-byte (64-bit) blocks
  for (let i = 0; i < text.length; i += 8) {
    const block = text.substring(i, i + 8).padEnd(8, ' ');
    steps.push(`\nBlock ${i/8 + 1}: "${block}"`);
    
    const blockBits = stringToBits(block);
    steps.push(`Block bits: ${blockBits.join('')}`);
    
    const { cipherBits, steps: roundSteps } = desEncryptBlock(blockBits, keyBits);
    allSteps.push(...roundSteps);
    
    const cipherBlock = bitsToString(cipherBits);
    ciphertext += cipherBlock;
    steps.push(`Cipher block: "${cipherBlock}" (hex: ${cipherBlock.split('').map(c => c.charCodeAt(0).toString(16)).join(' ')})`);
  }
  
  document.getElementById('desOutput').innerText = ciphertext;
  
  // Combine all steps for display
  const displaySteps = [...steps, '\nDetailed Round Steps:', ...allSteps];
  renderSteps('DES — Encryption Demonstration', displaySteps);
}

function desDecryptBlock(blockBits, keyBits) {
  // Decryption is same as encryption with reversed subkeys
  const subkeys = generateSubKeys(keyBits);
  const reversedSubkeys = [...subkeys].reverse();
  
  // Initial Permutation
  let permuted = permute(blockBits, DES_IP);
  let left = permuted.slice(0, 4);
  let right = permuted.slice(4);
  
  // 4 rounds with reversed subkeys
  for (let round = 0; round < 4; round++) {
    [left, right] = desRound(left, right, reversedSubkeys[round]);
  }
  
  // Final swap and inverse permutation
  const combined = [...right, ...left];
  return permute(combined, DES_IP_INV);
}

function desDecrypt() {
  const ciphertext = document.getElementById('desText').value || '';
  const key = document.getElementById('desKey').value || 'DESKEY!!';
  
  if (ciphertext.length === 0) {
    alert('Please enter ciphertext to decrypt');
    return;
  }
  
  const steps = [];
  steps.push(`Ciphertext: "${ciphertext}"`);
  steps.push(`Key: "${key}" (using first 8 chars for 64-bit demo)`);
  
  const keyBits = stringToBits(key.substring(0, 8));
  steps.push(`Key bits: ${keyBits.join('')}`);
  
  let plaintext = '';
  
  // Process in 8-byte blocks
  for (let i = 0; i < ciphertext.length; i += 8) {
    const block = ciphertext.substring(i, Math.min(i + 8, ciphertext.length));
    steps.push(`\nBlock ${i/8 + 1}: "${block}"`);
    
    const blockBits = stringToBits(block);
    steps.push(`Block bits: ${blockBits.join('')}`);
    
    const plainBits = desDecryptBlock(blockBits, keyBits);
    const plainBlock = bitsToString(plainBits);
    plaintext += plainBlock.trim(); // Remove padding spaces
    steps.push(`Decrypted block: "${plainBlock}"`);
  }
  
  document.getElementById('desOutput').innerText = plaintext;
  renderSteps('DES — Decryption Demonstration', steps);
}

/* =============================
   Existing Cipher Functions (Keep all existing code below)
   ============================= */

/* Caesar Cipher */
function caesarEncrypt() {
  const text = document.getElementById('caesarText').value || '';
  const key = parseInt(document.getElementById('caesarKey').value) || 0;
  const K = ((key % 26) + 26) % 26;
  let cipher = '';
  const steps = [];
  steps.push(`Input (raw): ${text}`);
  steps.push(`Normalize: convert letters to uppercase for processing (we'll preserve original letter case in output).`);

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (/[A-Za-z]/.test(ch)) {
      const up = ch.toUpperCase();
      const code = up.charCodeAt(0);
      const val = code - 65;
      const shifted = (val + K) % 26;
      const out = String.fromCharCode(shifted + 65);
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

function caesarDecrypt() {
  const text = document.getElementById('caesarText').value || '';
  const key = parseInt(document.getElementById('caesarKey').value) || 0;
  const K = ((key % 26) + 26) % 26;
  let plain = '';
  const steps = [];
  steps.push(`Input (raw cipher): ${text}`);
  steps.push(`Normalize: convert to uppercase for processing, then reverse the shift of ${K}.`);

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (/[A-Za-z]/.test(ch)) {
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

/* Monoalphabetic Cipher */
function monoEncrypt() {
  const text = document.getElementById('monoText').value || '';
  const keyRaw = document.getElementById('monoKey').value || '';
  const key = keyRaw.toUpperCase().replace(/[^A-Z]/g, '');
  const steps = [];
  steps.push(`Key (cleaned): ${key}`);
  steps.push('Validation: key should be 26 unique letters A–Z.');

  if (key.length !== 26) {
    steps.push('⚠️ Key length is not 26 — encryption will use what is available but may be incorrect for missing letters.');
  }

  let out = '';
  for (let ch of text) {
    if (/[A-Za-z]/.test(ch)) {
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

function monoDecrypt() {
  const text = document.getElementById('monoText').value || '';
  const key = (document.getElementById('monoKey').value || '').toUpperCase().replace(/[^A-Z]/g, '');
  const steps = [];
  steps.push(`Key: ${key}`);
  let out = '';

  for (let ch of text) {
    if (/[A-Za-z]/.test(ch)) {
      const up = ch.toUpperCase();
      const idx = key.indexOf(up);
      if (idx === -1) {
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

/* Playfair Cipher */
function generatePlayfairMatrix(key) {
  key = (key || '').toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
  const matrix = [];
  const used = {};
  for (const ch of key) { if (!used[ch]) { used[ch] = true; matrix.push(ch); } }
  for (let i = 65; i <= 90; i++) { const ch = String.fromCharCode(i); if (ch === 'J') continue; if (!used[ch]) { used[ch] = true; matrix.push(ch); } }
  return matrix;
}

function prepareTextForPlayfair(text) {
  text = (text || '').toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
  let res = '';
  for (let i = 0; i < text.length; i++) {
    const a = text[i];
    const b = text[i + 1];
    if (b && a === b) { res += a + 'X'; }
    else { res += a; if (b) { res += b; i++; } else res += 'X'; }
  }
  if (res.length % 2 !== 0) res += 'X';
  return res;
}

function playfairEncrypt() {
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

  for (let i = 0; i < digraphs.length; i++) {
    const pair = digraphs[i];
    const a = pair[0], b = pair[1];
    const ai = matrix.indexOf(a), bi = matrix.indexOf(b);
    const ar = Math.floor(ai / 5), ac = ai % 5, br = Math.floor(bi / 5), bc = bi % 5;
    let ra, rb, reason;
    if (ar === br) {
      ra = ar * 5 + (ac + 1) % 5; rb = br * 5 + (bc + 1) % 5;
      reason = `same row ${ar} -> right-shift`;
    } else if (ac === bc) {
      ra = ((ar + 1) % 5) * 5 + ac; rb = ((br + 1) % 5) * 5 + bc;
      reason = `same column ${ac} -> down-shift`;
    } else {
      ra = ar * 5 + bc; rb = br * 5 + ac;
      reason = `rectangle -> swap columns`;
    }
    steps.push(`${pair}: indices (${ai},${bi}) -> coords A(${ar},${ac}) B(${br},${bc}) -> ${reason} -> ${matrix[ra]}${matrix[rb]}`);
    out += matrix[ra] + matrix[rb];
  }

  document.getElementById('playfairOutput').innerText = out;
  renderSteps('Playfair — Encryption Demonstration', steps);
}

function playfairDecrypt() {
  const raw = (document.getElementById('playfairText').value || '').toUpperCase().replace(/[^A-Z]/g, '');
  const key = document.getElementById('playfairKey').value || '';
  const matrix = generatePlayfairMatrix(key);
  const steps = [];
  steps.push(`Key: ${key}`);
  steps.push(`Matrix: ${matrix.join(' ')}`);
  const digraphs = (raw.match(/.{1,2}/g) || []);
  let out = '';

  for (let i = 0; i < digraphs.length; i++) {
    const pair = digraphs[i];
    const a = pair[0], b = pair[1];
    const ai = matrix.indexOf(a), bi = matrix.indexOf(b);
    const ar = Math.floor(ai / 5), ac = ai % 5, br = Math.floor(bi / 5), bc = bi % 5;
    let ra, rb, reason;
    if (ar === br) {
      ra = ar * 5 + (ac + 4) % 5; rb = br * 5 + (bc + 4) % 5;
      reason = `same row ${ar} -> left-shift`;
    } else if (ac === bc) {
      ra = ((ar + 4) % 5) * 5 + ac; rb = ((br + 4) % 5) * 5 + bc;
      reason = `same column ${ac} -> up-shift`;
    } else {
      ra = ar * 5 + bc; rb = br * 5 + ac;
      reason = `rectangle -> swap columns`;
    }
    steps.push(`${pair}: indices (${ai},${bi}) -> coords A(${ar},${ac}) B(${br},${bc}) -> ${reason} -> ${matrix[ra]}${matrix[rb]}`);
    out += matrix[ra] + matrix[rb];
  }

  document.getElementById('playfairOutput').innerText = out;
  renderSteps('Playfair — Decryption Demonstration', steps);
}

/* Hill Cipher */
function hillEncrypt() {
  const raw = (document.getElementById('hillText').value || '').toUpperCase().replace(/[^A-Z]/g, '');
  const keyVals = (document.getElementById('hillKey').value || '').split(/\s+/).map(Number);
  const steps = [];
  steps.push(`Key (row-wise): ${keyVals.join(', ')}`);
  let text = raw;
  if (text.length % 2 !== 0) { text += 'X'; steps.push('Padded plaintext with X to make length even'); }
  const pairs = [];
  for (let i = 0; i < text.length; i += 2) pairs.push([text.charCodeAt(i) - 65, text.charCodeAt(i + 1) - 65]);
  let out = '';
  for (const [x, y] of pairs) {
    const a = (keyVals[0] * x + keyVals[1] * y) % 26;
    const b = (keyVals[2] * x + keyVals[3] * y) % 26;
    steps.push(`${String.fromCharCode(x + 65)}(${x}), ${String.fromCharCode(y + 65)}(${y}) -> [${a},${b}] -> ${String.fromCharCode(a + 65)}${String.fromCharCode(b + 65)}`);
    out += String.fromCharCode(a + 65) + String.fromCharCode(b + 65);
  }
  document.getElementById('hillOutput').innerText = out;
  renderSteps('Hill (2×2) — Encryption Demonstration', steps);
}

function hillDecrypt() {
  const raw = (document.getElementById('hillText').value || '').toUpperCase().replace(/[^A-Z]/g, '');
  const keyVals = (document.getElementById('hillKey').value || '').split(/\s+/).map(Number);
  const det = (keyVals[0] * keyVals[3] - keyVals[1] * keyVals[2]) % 26;
  const inv = modInverse(det, 26);
  const steps = [];
  if (inv === null) { alert('Key matrix not invertible mod 26 — cannot decrypt'); return; }
  steps.push(`det = ${det} (mod 26), detInv = ${inv}`);
  const invMat = [(keyVals[3] * inv) % 26, ((-keyVals[1] + 26) * inv) % 26, ((-keyVals[2] + 26) * inv) % 26, (keyVals[0] * inv) % 26];
  steps.push(`Inverse matrix (row-wise): ${invMat.join(', ')}`);
  let out = '';
  for (let i = 0; i < raw.length; i += 2) {
    const x = raw.charCodeAt(i) - 65, y = raw.charCodeAt(i + 1) - 65;
    const a = (invMat[0] * x + invMat[1] * y) % 26; const b = (invMat[2] * x + invMat[3] * y) % 26;
    steps.push(`${String.fromCharCode(x + 65)}(${x}), ${String.fromCharCode(y + 65)}(${y}) -> [${a},${b}] -> ${String.fromCharCode(a + 65)}${String.fromCharCode(b + 65)}`);
    out += String.fromCharCode(a + 65) + String.fromCharCode(b + 65);
  }
  document.getElementById('hillOutput').innerText = out;
  renderSteps('Hill (2×2) — Decryption Demonstration', steps);
}

/* Vigenère Cipher */
function vigenereEncrypt() {
  const raw = (document.getElementById('vigenereText').value || '');
  const keyRaw = (document.getElementById('vigenereKey').value || '');
  const text = raw.toUpperCase().replace(/[^A-Z]/g, '');
  const key = keyRaw.toUpperCase().replace(/[^A-Z]/g, '');
  const steps = [];
  steps.push(`Plain (letters only): ${text}`);
  steps.push(`Key (cleaned): ${key}`);
  let out = '';
  for (let i = 0; i < text.length; i++) {
    const p = text.charCodeAt(i) - 65;
    const k = key.charCodeAt(i % key.length) - 65;
    const c = (p + k) % 26;
    steps.push(`${text[i]}: p=${p}, key=${key[i % key.length]} (k=${k}) -> (p+k)=${p + k} -> mod26=${c} -> ${String.fromCharCode(c + 65)}`);
    out += String.fromCharCode(c + 65);
  }
  document.getElementById('vigenereOutput').innerText = out;
  renderSteps('Vigenère — Encryption Demonstration', steps);
}

function vigenereDecrypt() {
  const raw = (document.getElementById('vigenereText').value || '');
  const keyRaw = (document.getElementById('vigenereKey').value || '');
  const text = raw.toUpperCase().replace(/[^A-Z]/g, '');
  const key = keyRaw.toUpperCase().replace(/[^A-Z]/g, '');
  const steps = [];
  let out = '';
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i) - 65;
    const k = key.charCodeAt(i % key.length) - 65;
    const p = (c - k + 26) % 26;
    steps.push(`${text[i]}: c=${c}, key=${key[i % key.length]} (k=${k}) -> (c-k)=${c - k} -> mod26=${p} -> ${String.fromCharCode(p + 65)}`);
    out += String.fromCharCode(p + 65);
  }
  document.getElementById('vigenereOutput').innerText = out;
  renderSteps('Vigenère — Decryption Demonstration', steps);
}

/* Rail Fence Cipher */
function railEncrypt() {
  const raw = document.getElementById('railText').value || '';
  const rails = parseInt(document.getElementById('railKey').value) || 3;
  const steps = [];
  steps.push(`Raw input: ${raw}`);
  const pattern = [];
  let rail = 0, dir = 1;
  for (let i = 0; i < raw.length; i++) {
    pattern.push(rail);
    rail += dir;
    if (rail === 0 || rail === rails - 1) dir *= -1;
  }
  steps.push(`Index pattern (per character): ${pattern.join(',')}`);
  const fence = Array.from({ length: rails }, () => []);
  for (let i = 0; i < raw.length; i++) fence[pattern[i]].push(raw[i]);
  steps.push(`Rail groups: ${fence.map((g, i) => `R${i}:[${g.join('')}]`).join(' | ')}`);
  const out = fence.flat().join('');
  document.getElementById('railOutput').innerText = out;
  renderSteps('Rail Fence — Encryption Demonstration', steps);
}

function railDecrypt() {
  const raw = document.getElementById('railText').value || '';
  const rails = parseInt(document.getElementById('railKey').value) || 3;
  const steps = [];
  const pattern = [];
  let rail = 0, dir = 1;
  for (let i = 0; i < raw.length; i++) {
    pattern.push(rail);
    rail += dir;
    if (rail === 0 || rail === rails - 1) dir *= -1;
  }
  steps.push(`Index pattern: ${pattern.join(',')}`);
  const counts = new Array(rails).fill(0);
  pattern.forEach(r => counts[r]++);
  steps.push(`Counts per rail: ${counts.join(',')}`);
  const fence = [];
  let idx = 0;
  for (let r = 0; r < rails; r++) {
    fence[r] = raw.slice(idx, idx + counts[r]).split(''); idx += counts[r];
  }
  steps.push(`Rail slices: ${fence.map((f, i) => `R${i}:[${f.join('')}]`).join(' | ')}`);
  let out = '';
  for (let p of pattern) { out += fence[p].shift(); }
  document.getElementById('railOutput').innerText = out;
  renderSteps('Rail Fence — Decryption Demonstration', steps);
}

// Initialize with first cipher on page load
document.addEventListener('DOMContentLoaded', function() {
  showCipher('caesar');
});

