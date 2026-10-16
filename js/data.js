/* ==========================================================================
   Site content — the one place to edit contact details, projects, services,
   testimonials and Facebook videos.
   ========================================================================== */

window.EI = window.EI || {};

EI.site = {
  email: 'sales@eleganceivy.co.zw',
  phones: [
    { label: '+263 776 479 529', tel: '+263776479529' },
    { label: '+263 780 432 261', tel: '+263780432261' }
  ],
  whatsapp: '263780432261',
  address: '55 Livingstone Avenue, Harare',
  mapUrl: 'https://maps.app.goo.gl/U1esnEH7ufwSYBVD7',
  portalUrl: 'https://projects.eleganceivy.co.zw',
  socials: {
    facebook: 'https://www.facebook.com/EleganceIvyInteriorDesigners/',
    instagram: 'https://www.instagram.com/elegance.ivy/',
    x: 'https://x.com/eleganceivy'
  }
};

/* ---------- Projects ----------
   Photos live in /images/projects/<slug>/01.jpg, 02.jpg ... (plus 01-sm.jpg
   thumbnails). `count` is how many photos the folder holds. `cover` picks the
   photo shown on cards (default '01'); the gallery still starts at 01. */
EI.projects = [
  {
    slug: 'karanda-hospital', title: 'Karanda Hospital', count: 11,
    type: 'Healthcare construction', cats: ['Construction', 'Healthcare'],
    summary: 'Foundations, brickwork, suspended deck and the completed blocks.'
  },
  {
    slug: 'odyssey-lodge', title: 'Odyssey Lodge', count: 10, cover: '04',
    type: 'Hospitality construction & interiors', cats: ['Construction', 'Hospitality', 'Interiors'],
    summary: 'Construction and interior finishing for a lodge, from shell to bar, suites and bathrooms.'
  },
  {
    slug: 'sunway-city', title: 'Sunway City', count: 15,
    type: 'Residential construction', cats: ['Construction', 'Residential'],
    summary: 'A residential build with boundary walls, paving and landscaping.'
  },
  {
    slug: 'bindura-labour-ward', title: 'Bindura Labour Ward', count: 20,
    type: 'Healthcare construction', cats: ['Construction', 'Healthcare'],
    summary: 'Site clearing, excavation and strip footings for the labour ward.'
  },
  {
    slug: 'bathrooms-interiors', title: 'Bathrooms & Interiors', count: 9, cover: '02',
    type: 'Interior design & finishes', cats: ['Interiors', 'Residential'],
    summary: 'Bathrooms, living spaces and offices finished to a high specification.'
  },
  {
    slug: 'construction-in-progress', title: 'On Site', count: 8,
    type: 'Construction in progress', cats: ['Construction'],
    summary: 'Our teams at work: slab preparation, concrete pours and structural works.'
  }
];

/* ---------- Services ---------- */
EI.services = [
  { slug: 'residential-construction', title: 'Residential Construction', image: 'sunway-city/01',
    desc: 'Architecture and construction services for residential properties.' },
  { slug: 'corporate-construction', title: 'Corporate Construction', image: 'karanda-hospital/01',
    desc: 'Construction services for commercial and institutional properties.' },
  { slug: 'hospitality', title: 'Hospitality Construction', image: 'odyssey-lodge/01',
    desc: 'Construction and interior design for hotels and lodges.' },
  { slug: 'interior-design', title: 'Interior Designing', image: 'bathrooms-interiors/05',
    desc: 'Interior designing for both residential and corporate properties.' },
  { slug: '3d-modeling', title: '3D Modeling', image: 'bathrooms-interiors/03',
    desc: '3D CAD modeling that brings ideas to life before a brick is laid.' },
  { slug: 'landscaping', title: 'Landscaping', image: 'sunway-city/07',
    desc: 'Landscaping for both residential and corporate properties.' },
  { slug: 'finishes', title: 'Finishes', image: 'bathrooms-interiors/02',
    desc: 'Painting, plumbing, tiling, electrical work and fittings.' }
];

/* ---------- Facebook videos ----------
   Add one entry per video. `url` is the Facebook video link; `image` is a
   local photo shown as the cover ('project-slug/NN' or a full /images/... path).
   Example:
   { title: 'Karanda Hospital — site walkthrough',
     url: 'https://www.facebook.com/EleganceIvyInteriorDesigners/videos/1234567890',
     image: 'karanda-hospital/01' },
*/
EI.videos = [
  { title: 'Wallpaper decor installations',
    url: 'https://www.facebook.com/share/p/1DiU8M9Vmx/',
    image: 'bathrooms-interiors/03' },
  { title: 'Inside the interiors of ESFOG Lodge',
    url: 'https://www.facebook.com/EleganceIvyInteriorDesigners/videos/1539841330774452/',
    image: 'bathrooms-interiors/04' },
  { title: 'Turning your dreams into reality',
    url: 'https://www.facebook.com/EleganceIvyInteriorDesigners/videos/1134268935351852/',
    image: 'karanda-hospital/01' },
  { title: 'We are called Elegance for a reason',
    url: 'https://www.facebook.com/EleganceIvyInteriorDesigners/videos/2181444839005305/',
    image: 'sunway-city/01' },
  { title: 'More from our Facebook page',
    url: 'https://www.facebook.com/story.php?story_fbid=pfbid026w6aygU8GiQS6cYnPRDdroma3b4sgF81oY83S5ir1oS69NVnRC24hc5sqs2pQEoGl&id=100063797250129',
    image: 'team/01' }
];

/* ---------- Clients (logos in /images/clients/) ---------- */
EI.clients = [
  { name: 'Econet Wireless', scope: 'Interior Design', logo: 'econet' },
  { name: 'CV People', scope: 'Interior Design', logo: 'cv-people' },
  { name: 'Schweppes', scope: 'Interior Design', logo: 'schweppes' },
  { name: 'GBI Business Hub', scope: 'Interior Design', logo: 'gbi-business-hub' },
  { name: 'The Church of Jesus Christ', scope: 'Construction', logo: 'church-of-jesus-christ' },
  { name: 'Karanda Hospital', scope: 'Construction', logo: 'karanda-hospital' },
  { name: 'Zimplats', scope: 'Construction', logo: 'zimplats' },
  { name: 'Odyssey Lodge', scope: 'Construction', logo: 'odyssey-lodge' },
  { name: 'Aurex Jewellery', scope: 'Interior Design', logo: 'aurex-jewellery' }
];

/* ---------- Testimonials ---------- */
EI.testimonials = [
  { q: 'Elegance Ivy provides a specialized service. I was happy with the quality of their work.', a: 'John Mhlanga' },
  { q: 'Working with Elegance Ivy was a delightful experience. Their attention to detail and creativity transformed my home into a beautiful sanctuary that I never want to leave.', a: 'Enhle Sibanda' },
  { q: 'I cannot recommend EI enough! Every corner of my home now feels like a work of art thanks to their innovative approach.', a: 'Tanaka Murwira' },
  { q: 'Choosing Elegance was the best decision I could have made for my home renovation project.', a: 'Patrick Chigwedere' },
  { q: 'Elegance Ivy is a game-changer in the industry. I was thoroughly impressed by their attention to detail, communication skills, and ability to turn ideas into reality.', a: 'Comfort Matemera' }
];

/* ---------- Helpers ---------- */
EI.pad = (n) => String(n).padStart(2, '0');

// 'odyssey-lodge/03' or 'team/02' -> { src: small, full: large }
EI.photo = (ref) => {
  if (ref.charAt(0) === '/') return { src: ref, full: ref };
  const [slug, n] = ref.split('/');
  const base = (slug === 'team' ? '/images/team/' : '/images/projects/' + slug + '/') + n;
  return { src: base + '-sm.jpg', full: base + '.jpg' };
};

EI.projectPhotos = (p) =>
  Array.from({ length: p.count }, (_, i) => Object.assign(EI.photo(p.slug + '/' + EI.pad(i + 1)), {
    alt: p.title + ' — photo ' + (i + 1),
    project: p.title
  }));

EI.findProject = (slug) => EI.projects.find((p) => p.slug === slug);
