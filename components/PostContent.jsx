import PostGallery from './PostGallery';
import { splitPostContent } from '@/lib/post-images';

// Renders CMS post HTML with its images lifted out into previewable grids.
// Prose stays rich text; each run of adjacent images becomes one gallery, in
// the place the editor put it. See lib/post-images.js for the split rules.
export default function PostContent({
  html = '',
  featured = null,
  aspect,
  className = '',
}) {
  const blocks = splitPostContent(html, { featured });
  if (!blocks.length) return null;

  return (
    <div className={className}>
      {blocks.map((block, i) =>
        block.type === 'gallery' ? (
          <PostGallery
            key={`g${i}`}
            images={block.images}
            aspect={aspect}
            className="my-8"
          />
        ) : (
          <div
            key={`h${i}`}
            className="richtext"
            dangerouslySetInnerHTML={{ __html: block.html }}
          />
        )
      )}
    </div>
  );
}
