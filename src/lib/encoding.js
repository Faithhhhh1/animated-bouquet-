import pako from 'pako';

export function encodeBouquet(data) {
  try {
    const json = JSON.stringify(data);
    // Compress with pako deflate, then base64
    const compressed = pako.deflate(json);
    const binary = String.fromCharCode(...compressed);
    const encoded = btoa(binary);
    // Make URL-safe: replace + with -, / with _, remove trailing =
    return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch (e) {
    console.error('Failed to encode bouquet:', e);
    // Fallback to plain base64
    try {
      const json = JSON.stringify(data);
      const encoded = btoa(unescape(encodeURIComponent(json)));
      return encoded;
    } catch {
      return null;
    }
  }
}

export function decodeBouquet(encoded) {
  try {
    // Restore URL-safe base64 to standard base64
    let b64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    // Add padding if needed
    while (b64.length % 4) b64 += '=';

    const binary = atob(b64);
    const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));

    // Try pako inflate first (compressed)
    try {
      const decompressed = pako.inflate(bytes, { to: 'string' });
      return JSON.parse(decompressed);
    } catch {
      // Fall back to plain base64 (for old links)
      const json = decodeURIComponent(escape(atob(encoded)));
      return JSON.parse(json);
    }
  } catch (e) {
    console.error('Failed to decode bouquet:', e);
    return null;
  }
}
