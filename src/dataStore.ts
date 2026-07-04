import { createClient } from '@supabase/supabase-js';

export interface HomeSlide {
  id: string;
  image: string;
  title: string;
  subtext: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  tagline: string;
  icon: string; // "LayoutGrid", "Wrench", "Palette", etc.
  image: string;
  description: string;
  includes: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  img: string;
  desc: string;
}

export interface ProjectCategory {
  id: string;
  name: string;
}

export interface BeforeAfterItem {
  id: string;
  title: string;
  beforeImg: string;
  afterImg: string;
}

export interface ContactDetails {
  location: string;
  phone1: string;
  phone2: string;
  email: string;
  hours: string;
  mapEmbedUrl: string;
  whatsapp1: string;
  whatsapp2: string;
}

// Default Data Values matching current hardcoded content
export const defaultHomeSlides: HomeSlide[] = [
  {
    id: "slide-1",
    image: "/image copy 10.png",
    title: "Crafting Dream Interiors with | Elegance & Affordability",
    subtext: "Transform your home with premium modular designs and expert styling, tailored to your budget."
  },
  {
    id: "slide-2",
    image: "/image copy 13.png",
    title: "Bespoke Partitions & | Puja Rooms",
    subtext: "Creating customized spaces that balance traditional vibes with modern functionality."
  },
  {
    id: "slide-3",
    image: "/image copy 12.png",
    title: "Elegant | Living Lounges",
    subtext: "Sophisticated designs featuring custom wooden elements and premium lighting layouts."
  },
  {
    id: "slide-4",
    image: "/image copy 14.png",
    title: "Premium | Modular Kitchens",
    subtext: "Ergonomic designs combining matte finishes, high-gloss shutters and smart fittings."
  },
  {
    id: "slide-5",
    image: "/image copy.png",
    title: "Luxury | Master Bedrooms",
    subtext: "Custom wall paneling, backlit headboards, and space-optimized sliding wardrobes."
  }
];

export const defaultServices: ServiceItem[] = [
  {
    id: "service-1",
    title: "Custom Modular Solutions & Carpentry",
    tagline: "Precision Engineering & Bespoke Cabinets",
    icon: "LayoutGrid",
    image: "/image copy 7.png",
    description: "We design and build clean modular structures tailored exactly to your space requirements. Using premium water-proof calibrated plywood and state of the art drawer accessories.",
    includes: [
      "Modular Kitchens (L-shaped, U-shaped, Parallel, Island)",
      "Custom Wardrobes (Sliding doors, Swing doors, Loft cabinets)",
      "Premium TV Entertainment units",
      "Utility Storage & Crockery Solutions"
    ]
  },
  {
    id: "service-2",
    title: "Turnkey Execution",
    tagline: "Hassle-Free Construction & Complete Workmanship",
    icon: "Wrench",
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80",
    description: "Leave the heavy lifting to us. We manage everything from raw brick restructuring to fine painting. A dedicated supervisor monitors daily progress, maintaining premium quality standards.",
    includes: [
      "Civil work, tiling, kitchen counters modification",
      "Electrical rewiring and premium ambient light layouts",
      "False ceilings (Gypsum board, PVC partitions)",
      "Professional painting (wall preparation, texture work, premium paints)",
      "Lighting installations (COB, Profiles, LED Strips)",
      "Post-execution professional deep cleaning"
    ]
  },
  {
    id: "service-3",
    title: "Styling & Décor Consultation",
    tagline: "Aesthetic Guidance & Soft Furnishings",
    icon: "Palette",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80",
    description: "Our senior design consultants help you curate materials, textures, and details that weave together into a luxury setting, aligning with your personal taste and comfort.",
    includes: [
      "Color Palette recommendations",
      "Premium wallpaper design selections",
      "Fabric curtains, blinds, and window dressings",
      "Architectural lighting scheme mapping",
      "Soft furnishings, carpets, and decor accents"
    ]
  }
];

export const defaultProjects: ProjectItem[] = [
  {
    id: "proj-1",
    title: "Hallway Wardrobe & Partition",
    category: "Wardrobes",
    img: "/image copy.png",
    desc: "Sleek floor-to-ceiling hallway wardrobe combining high-gloss white laminate shutters, long black profile handles, and a marble accent sliding panel."
  },
  {
    id: "proj-2",
    title: "Backlit Accent Master Bedroom",
    category: "Bedroom",
    img: "/image copy 2.png",
    desc: "Luxury bedroom design featuring custom ambient cove false ceiling, backlit floral headboard panel, and a fluted wood vanity wall with an oval LED mirror."
  },
  {
    id: "proj-3",
    title: "Bespoke Master Suite & Partition",
    category: "Bedroom",
    img: "/image copy 3.png",
    desc: "Spacious bedroom interior featuring custom fluted wall cladding, sliding frosted-glass wardrobe partition, and an integrated warm-lit dressing counter."
  },
  {
    id: "proj-4",
    title: "Premium Wash Basin & Glass Cabinet",
    category: "Living Room",
    img: "/image copy 4.png",
    desc: "Modern dining hand-wash corner showing a custom organic-shaped backlit mirror, black quartz vanity, and a tall glass-door display cabinet with interior profile lighting."
  },
  {
    id: "proj-5",
    title: "Geometric TV Unit with Marble",
    category: "Living Room",
    img: "/image copy 5.png",
    desc: "Elegant living room entertainment center featuring geometric marble wall paneling with gold metal inlays, fluted wood slats, and a glass show-cabinet."
  },
  {
    id: "proj-6",
    title: "Modern Luxury Living Lounge",
    category: "Living Room",
    img: "/image copy 6.png",
    desc: "Sophisticated living space with a large white sectional sofa, custom geometric wooden partition screen, and an abstract backlit botanical feature wall."
  },
  {
    id: "proj-7",
    title: "Olive & White Modular Kitchen",
    category: "Modular Kitchen",
    img: "/image copy 7.png",
    desc: "Ergonomic L-shaped modular kitchen pairing matte olive green lower cabinets with high-gloss white overhead shutters, complete with black hardware accents."
  },
  {
    id: "proj-8",
    title: "Teal Bedroom Study Corner",
    category: "Bedroom",
    img: "/image copy 8.png",
    desc: "Compact bedroom layout maximizing space with a custom-built teal study desk, vertical backlit dressing mirror, and overhead cabinet storage."
  },
  {
    id: "proj-9",
    title: "Rattan Accent Media Console",
    category: "Living Room",
    img: "/image copy 9.png",
    desc: "Boho-chic entertainment unit designed with natural oak wood cabinetry, arched rattan details, a sage-green fluted background, and a slat room divider."
  },
  {
    id: "proj-10",
    title: "Elite Marble TV Lounge",
    category: "Living Room",
    img: "/image copy 10.png",
    desc: "High-end family media room featuring a large marble slab TV mount, vertical wooden profiles, warm-lit open shelves, and a cozy grey sectional sofa."
  },
  {
    id: "proj-11",
    title: "Fluted Slate Grey Sliding Wardrobe",
    category: "Wardrobes",
    img: "/image copy 11.png",
    desc: "Space-efficient master bedroom wardrobe featuring modern fluted slate grey sliding doors, black handles, and integrated top loft storage cabinets."
  },
  {
    id: "proj-12",
    title: "Oak & Rattan Living Room Divider",
    category: "Living Room",
    img: "/image copy 12.png",
    desc: "Oak-textured living room media unit showing the wood vertical slat partition, creating a semi-private entrance corridor and integrated TV unit."
  },
  {
    id: "proj-13",
    title: "Puja Room & Kitchen Bar Partition",
    category: "Living Room",
    img: "/image copy 13.png",
    desc: "Custom home partition combining a Puja room with patterned glass doors and a fluid, curved-wood breakfast bar partition screen."
  },
  {
    id: "proj-14",
    title: "Olive Green Kitchen & Breakfast Bar",
    category: "Modular Kitchen",
    img: "/image copy 14.png",
    desc: "Matte green modular kitchen layout showing the integration of a solid wood breakfast bar island counter next to the cooking zone."
  }
];

export const defaultProjectCategories: ProjectCategory[] = [
  { id: "modular-kitchen", name: "Modular Kitchen" },
  { id: "living-room", name: "Living Room" },
  { id: "bedroom", name: "Bedroom" },
  { id: "wardrobes", name: "Wardrobes" }
];

export const defaultBeforeAfterShowcase: BeforeAfterItem[] = [
  {
    id: "ba-1",
    title: "Project Alpha Master bedroom Transformation",
    beforeImg: "/before-work-2.png",
    afterImg: "/after-work-2.png"
  },
  {
    id: "ba-2",
    title: "Project Beta Living Area Transformation",
    beforeImg: "/before-work-3.png",
    afterImg: "/after-work-3.png"
  },
  {
    id: "ba-3",
    title: "Project Gamma Kitchen Area Transformation",
    beforeImg: "/before-work.png",
    afterImg: "/after-work.png"
  },
  {
    id: "ba-4",
    title: "Project Delta Wardrobe Transformation",
    beforeImg: "/before-work-4.png",
    afterImg: "/after-work-4.png"
  },
  {
    id: "ba-5",
    title: "Project Epsilon Balcony Transformation",
    beforeImg: "/before-work-5.png",
    afterImg: "/after-work-5.png"
  },
  {
    id: "ba-6",
    title: "Project Zeta Foyer Transformation",
    beforeImg: "/before-work-6.png",
    afterImg: "/after-work-6.png"
  },
  {
    id: "ba-7",
    title: "Project Eta Kids Room Transformation",
    beforeImg: "/before-work-7.png",
    afterImg: "/after-work-7.png"
  },
  {
    id: "ba-8",
    title: "Project Theta Study Zone Transformation",
    beforeImg: "/before-work-8.png",
    afterImg: "/after-work-8.png"
  },
  {
    id: "ba-9",
    title: "Project Iota Utility Space Transformation",
    beforeImg: "/before-work-9.png",
    afterImg: "/after-work-9.png"
  },
  {
    id: "ba-10",
    title: "Project Kappa TV Lounge Transformation",
    beforeImg: "/before-work-10.png",
    afterImg: "/after-work-10.png"
  }
];

export const defaultContactDetails: ContactDetails = {
  location: "Kukatpally, Allwyn Colony, Near Saibaba Temple, Hyderabad, TS, 500072",
  phone1: "+91 63050 93192",
  phone2: "+91 76609 94433",
  email: "vcprojectstudio@gmail.com",
  hours: "Monday - Sunday: 10:00 AM - 8:30 PM",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3805.1585863261173!2d78.399993314878!3d17.485608388019623!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb90c055555555%3A0x7d0a2333d4ff3701!2sKukatpally%20Allwyn%20Colony%2C%20Hyderabad%2C%20Tailangana!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin",
  whatsapp1: "916305093192",
  whatsapp2: "917660994433"
};

// Initialize Supabase Client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://clzpvsmvzbgaiggcmcyf.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper for generating SHA-1 signature natively in the browser for Cloudinary direct uploads
async function calculateSha1(string: string): Promise<string> {
  const utf8 = new TextEncoder().encode(string);
  const hashBuffer = await window.crypto.subtle.digest('SHA-1', utf8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Direct Secure Cloudinary Direct Signed Image Upload
export async function uploadToCloudinary(file: File): Promise<string> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'kzr6tb81';
  const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY || '';
  const apiSecret = import.meta.env.VITE_CLOUDINARY_API_SECRET || '';
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const folder = 'vcprojectstudio';

  // Cloudinary signature parameters must be sorted alphabetically
  const signatureString = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = await calculateSha1(signatureString);

  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp);
  formData.append('folder', folder);
  formData.append('signature', signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'Failed to upload image to Cloudinary.');
  }

  const data = await response.json();
  return data.secure_url;
}

// Asynchronous Data Store Bridge to Supabase Postgres Tables
export const dataStore = {
  async getHomeSlides(): Promise<HomeSlide[]> {
    const { data, error } = await supabase
      .from('home_slides')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching home slides:', error);
      throw error;
    }
    return (data || []).map(row => ({
      id: row.id,
      image: row.image,
      title: row.title,
      subtext: row.subtext
    }));
  },

  async setHomeSlides(slides: HomeSlide[]): Promise<void> {
    // Delete existing rows
    const { error: delError } = await supabase
      .from('home_slides')
      .delete()
      .neq('id', '');

    if (delError) throw delError;

    // Insert new list
    if (slides.length > 0) {
      const rows = slides.map(s => ({
        id: s.id,
        image: s.image,
        title: s.title,
        subtext: s.subtext
      }));
      const { error: insError } = await supabase
        .from('home_slides')
        .insert(rows);

      if (insError) throw insError;
    }
  },

  async getServices(): Promise<ServiceItem[]> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
    return (data || []).map(row => ({
      id: row.id,
      title: row.title,
      tagline: row.tagline,
      icon: row.icon,
      image: row.image,
      description: row.description,
      includes: row.includes || []
    }));
  },

  async setServices(services: ServiceItem[]): Promise<void> {
    const { error: delError } = await supabase
      .from('services')
      .delete()
      .neq('id', '');

    if (delError) throw delError;

    if (services.length > 0) {
      const rows = services.map(s => ({
        id: s.id,
        title: s.title,
        tagline: s.tagline,
        icon: s.icon,
        image: s.image,
        description: s.description,
        includes: s.includes
      }));
      const { error: insError } = await supabase
        .from('services')
        .insert(rows);

      if (insError) throw insError;
    }
  },

  async getProjects(): Promise<ProjectItem[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
    return (data || []).map(row => ({
      id: row.id,
      title: row.title,
      category: row.category,
      img: row.img,
      desc: row.desc_text
    }));
  },

  async setProjects(projects: ProjectItem[]): Promise<void> {
    const { error: delError } = await supabase
      .from('projects')
      .delete()
      .neq('id', '');

    if (delError) throw delError;

    if (projects.length > 0) {
      const rows = projects.map(p => ({
        id: p.id,
        title: p.title,
        category: p.category,
        img: p.img,
        desc_text: p.desc
      }));
      const { error: insError } = await supabase
        .from('projects')
        .insert(rows);

      if (insError) throw insError;
    }
  },

  async getBeforeAfterShowcase(): Promise<BeforeAfterItem[]> {
    const { data, error } = await supabase
      .from('before_after_showcase')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching before-after showcase:', error);
      throw error;
    }
    return (data || []).map(row => ({
      id: row.id,
      title: row.title,
      beforeImg: row.before_img,
      afterImg: row.after_img
    }));
  },

  async setBeforeAfterShowcase(items: BeforeAfterItem[]): Promise<void> {
    const { error: delError } = await supabase
      .from('before_after_showcase')
      .delete()
      .neq('id', '');

    if (delError) throw delError;

    if (items.length > 0) {
      const rows = items.map(item => ({
        id: item.id,
        title: item.title,
        before_img: item.beforeImg,
        after_img: item.afterImg
      }));
      const { error: insError } = await supabase
        .from('before_after_showcase')
        .insert(rows);

      if (insError) throw insError;
    }
  },

  async getContactDetails(): Promise<ContactDetails> {
    const { data, error } = await supabase
      .from('contact_details')
      .select('*')
      .eq('id', 'default')
      .single();

    if (error) {
      console.error('Error fetching contact details:', error);
      // Fallback in case table row wasn't seeded correctly yet
      return defaultContactDetails;
    }
    return {
      location: data.location,
      phone1: data.phone1,
      phone2: data.phone2,
      email: data.email,
      hours: data.hours,
      mapEmbedUrl: data.map_embed_url,
      whatsapp1: data.whatsapp1,
      whatsapp2: data.whatsapp2
    };
  },

  async setContactDetails(details: ContactDetails): Promise<void> {
    const { error } = await supabase
      .from('contact_details')
      .upsert({
        id: 'default',
        location: details.location,
        phone1: details.phone1,
        phone2: details.phone2,
        email: details.email,
        hours: details.hours,
        map_embed_url: details.mapEmbedUrl,
        whatsapp1: details.whatsapp1,
        whatsapp2: details.whatsapp2,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
  },

  async getProjectCategories(): Promise<ProjectCategory[]> {
    const { data, error } = await supabase
      .from('project_categories')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching project categories:', error);
      return defaultProjectCategories;
    }
    
    if (!data || data.length === 0) {
      return defaultProjectCategories;
    }

    return data.map(item => ({
      id: item.id,
      name: item.name
    }));
  },

  async addProjectCategory(name: string): Promise<ProjectCategory> {
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const { data, error } = await supabase
      .from('project_categories')
      .insert({ id, name })
      .select()
      .single();

    if (error) throw error;
    return {
      id: data.id,
      name: data.name
    };
  },

  async deleteProjectCategory(id: string): Promise<void> {
    const { error } = await supabase
      .from('project_categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async verifyAdminCredentials(email: string, password: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('admin_credentials')
      .select('*')
      .eq('email', email.trim())
      .eq('password', password.trim())
      .single();

    if (error || !data) return false;
    return true;
  },

  async generateResetToken(email: string): Promise<string> {
    const { data: user, error: findError } = await supabase
      .from('admin_credentials')
      .select('id')
      .eq('email', email.trim())
      .single();

    if (findError || !user) {
      throw new Error('Email address not found in system.');
    }

    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    const { error: updateError } = await supabase
      .from('admin_credentials')
      .update({
        reset_token: token,
        token_expiry: expiry
      })
      .eq('id', user.id);

    if (updateError) throw updateError;
    return token;
  },

  async resetPasswordWithToken(email: string, token: string, newPassword: string): Promise<void> {
    const { data: user, error: findError } = await supabase
      .from('admin_credentials')
      .select('*')
      .eq('email', email.trim())
      .eq('reset_token', token.trim())
      .single();

    if (findError || !user) {
      throw new Error('Invalid or expired reset token.');
    }

    if (new Date() > new Date(user.token_expiry)) {
      throw new Error('Reset token has expired. Please request a new one.');
    }

    const { error: updateError } = await supabase
      .from('admin_credentials')
      .update({
        password: newPassword.trim(),
        reset_token: null,
        token_expiry: null
      })
      .eq('id', user.id);

    if (updateError) throw updateError;
  }
};
