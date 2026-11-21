import { permanentRedirect } from 'next/navigation';

/** Keep old gallery links useful; published work has one maintained catalogue. */
export default function GalleryPage() {
  permanentRedirect('/work');
}
