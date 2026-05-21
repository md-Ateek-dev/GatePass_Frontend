/**
 * Resolve visitor photo URL for display and print.
 * New passes store full Cloudinary HTTPS URLs; legacy rows may have /uploads/ paths.
 */
export function getVisitorPhotoUrl(visitorPhoto) {
  if (!visitorPhoto) return null;
  if (visitorPhoto.startsWith('http://') || visitorPhoto.startsWith('https://')) {
    return visitorPhoto;
  }
  if (visitorPhoto.startsWith('/')) {
    return visitorPhoto;
  }
  return `/${visitorPhoto}`;
}
