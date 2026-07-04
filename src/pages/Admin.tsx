import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutGrid, Wrench, Trash2, Edit, Lock, User, Save, LogOut, 
  MapPin, ArrowLeft, Check, AlertCircle, Eye, RefreshCw,
  PlusCircle
} from 'lucide-react';
import { dataStore, uploadToCloudinary } from '../dataStore';
import type { HomeSlide, ServiceItem, ProjectItem, BeforeAfterItem, ContactDetails, ProjectCategory } from '../dataStore';

function convertToEmbedUrl(url: string): string {
  if (!url) return '';
  if (url.includes('/maps/embed') || url.includes('output=embed')) return url; // Already an embed URL

  // 1. Try to extract coordinates from "@lat,lng" format (e.g. /maps/@17.485608,78.399993,166m/...)
  const coordRegex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
  const coordMatch = url.match(coordRegex);
  if (coordMatch) {
    const lat = coordMatch[1];
    const lng = coordMatch[2];
    return `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
  }

  // 2. Try to extract coordinates from "q=lat,lng" if present
  const qCoordRegex = /[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/;
  const qCoordMatch = url.match(qCoordRegex);
  if (qCoordMatch) {
    const lat = qCoordMatch[1];
    const lng = qCoordMatch[2];
    return `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
  }

  // 3. Try to extract search query from "/place/Name+Of+Place/"
  const placeRegex = /\/place\/([^/]+)/;
  const placeMatch = url.match(placeRegex);
  if (placeMatch) {
    const query = placeMatch[1];
    return `https://maps.google.com/maps?q=${query}&z=15&output=embed`;
  }

  // 4. Try to extract "q" parameter from search URL
  try {
    const parsedUrl = new URL(url);
    const qParam = parsedUrl.searchParams.get('q');
    if (qParam) {
      return `https://maps.google.com/maps?q=${encodeURIComponent(qParam)}&z=15&output=embed`;
    }
  } catch (e) {
    // Ignore invalid URLs
  }

  return `https://maps.google.com/maps?q=${encodeURIComponent(url)}&z=15&output=embed`;
}

function getErrorMessage(err: any): string {
  if (!err) return 'An unknown error occurred.';
  if (typeof err === 'string') return err;
  
  let msg = err.message || err.error_description || '';
  if (typeof msg === 'object') {
    msg = JSON.stringify(msg);
  }
  
  if (!msg || msg === '{}') {
    msg = err.error || err.statusText || JSON.stringify(err);
  }
  
  if (!msg || msg === '{}') {
    // If rate limit is triggered (once per 60 secs) or other silent fails
    return 'Rate limit exceeded: Please wait 60 seconds before requesting another reset link.';
  }
  
  return msg;
}

export default function Admin() {
  // Auth state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Database states
  const [slides, setSlides] = useState<HomeSlide[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [beforeAfterItems, setBeforeAfterItems] = useState<BeforeAfterItem[]>([]);
  const [contact, setContact] = useState<ContactDetails | null>(null);
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetStep, setResetStep] = useState<'request' | 'verify'>('request');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Active UI tab
  const [activeTab, setActiveTab] = useState<'slides' | 'services' | 'projects' | 'beforeAfter' | 'contact'>('slides');

  // Form states for adding/editing items
  const [slideForm, setSlideForm] = useState<Partial<HomeSlide> & { isEditing?: boolean }>({});
  const [serviceForm, setServiceForm] = useState<Partial<ServiceItem> & { isEditing?: boolean, includesText?: string }>({});
  const [projectForm, setProjectForm] = useState<Partial<ProjectItem> & { isEditing?: boolean }>({});
  const [beforeAfterForm, setBeforeAfterForm] = useState<Partial<BeforeAfterItem> & { isEditing?: boolean }>({});

  // Loading / saving feedback state
  const [feedbackMsg, setFeedbackMsg] = useState({ text: '', type: 'success' });

  const autoFixMapUrl = () => {
    if (!contact || !contact.mapEmbedUrl) return;
    const fixed = convertToEmbedUrl(contact.mapEmbedUrl);
    setContact({ ...contact, mapEmbedUrl: fixed });
    showFeedback('Converted regular map link to embed map link!', 'success');
  };

  useEffect(() => {
    // Check URL parameters for custom reset token
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get('reset_token');
    const emailParam = params.get('email');
    
    if (tokenParam && emailParam) {
      setEmail(emailParam);
      setResetToken(tokenParam);
      setResetStep('verify');
      setShowForgotPassword(true);
      setIsLoggedIn(false);
      
      // Clear query params from the browser address bar immediately
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    const auth = sessionStorage.getItem('admin_authenticated');
    if (auth === 'true') {
      setIsLoggedIn(true);
      loadAllData();
    }
  }, []);

  const loadAllData = async () => {
    try {
      const homeSlides = await dataStore.getHomeSlides();
      setSlides(homeSlides);
      const ser = await dataStore.getServices();
      setServices(ser);
      const proj = await dataStore.getProjects();
      setProjects(proj);
      const ba = await dataStore.getBeforeAfterShowcase();
      setBeforeAfterItems(ba);
      const contactInfo = await dataStore.getContactDetails();
      setContact(contactInfo);
      const cats = await dataStore.getProjectCategories();
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load database details:', err);
      showFeedback('Database connection issue. Did you run the SQL schema in Supabase Editor?', 'error');
    }
  };

  const handleSendResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      showFeedback('Sending password reset link...', 'success');
      
      const response = await fetch('/api/send-reset-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email.trim() })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reset link.');
      }
      
      setError('');
      setShowForgotPassword(false);
      showFeedback('Password reset link sent to your email!', 'success');
    } catch (err: any) {
      console.error(err);
      setError(getErrorMessage(err));
    }
  };

  const handleVerifyAndResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetToken.trim()) {
      setError('Reset token is missing. Please click the link in your email.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    try {
      showFeedback('Updating password...', 'success');
      await dataStore.resetPasswordWithToken(email, resetToken, newPassword);

      setError('');
      setShowForgotPassword(false);
      setResetStep('request');
      setResetToken('');
      setNewPassword('');
      setConfirmPassword('');
      showFeedback('Password updated successfully! Please log in.', 'success');
    } catch (err: any) {
      console.error(err);
      setError(getErrorMessage(err));
    }
  };

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      showFeedback('Adding category...', 'success');
      const added = await dataStore.addProjectCategory(newCategoryName.trim());
      setCategories([...categories, added]);
      setNewCategoryName('');
      showFeedback('Category added successfully!', 'success');
    } catch (err: any) {
      console.error(err);
      showFeedback(err.message || 'Failed to add category.', 'error');
    }
  };

  const deleteCategory = async (catId: string) => {
    const confirm = window.confirm('Are you sure you want to delete this category? Projects in this category will not be deleted, but you may want to reassign them.');
    if (!confirm) return;
    try {
      showFeedback('Deleting category...', 'success');
      await dataStore.deleteProjectCategory(catId);
      setCategories(categories.filter(c => c.id !== catId));
      showFeedback('Category deleted successfully!', 'success');
    } catch (err: any) {
      console.error(err);
      showFeedback(err.message || 'Failed to delete category.', 'error');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      showFeedback('Signing in...', 'success');
      const isValid = await dataStore.verifyAdminCredentials(email, password);
      if (isValid) {
        sessionStorage.setItem('admin_authenticated', 'true');
        setIsLoggedIn(true);
        setError('');
        loadAllData();
        showFeedback('Successfully logged in!', 'success');
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (err: any) {
      setError(getErrorMessage(err));
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    setIsLoggedIn(false);
    showFeedback('Logged out successfully.', 'success');
  };

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ text, type });
    setTimeout(() => {
      setFeedbackMsg({ text: '', type: 'success' });
    }, 4500);
  };

  // Image Upload handler calling direct signed Cloudinary API upload
  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>, 
    setFormCallback: (imgUrl: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    showFeedback('Uploading image to Cloudinary, please wait...', 'success');

    try {
      const secureUrl = await uploadToCloudinary(file);
      setFormCallback(secureUrl);
      showFeedback('Image uploaded to Cloudinary successfully!', 'success');
    } catch (err: any) {
      console.error(err);
      showFeedback(err.message || 'Failed to upload image to Cloudinary.', 'error');
    }
  };

  // -------------------------------------------------------------
  // HOME SLIDES ACTIONS
  // -------------------------------------------------------------
  const saveSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slideForm.image || !slideForm.title) {
      showFeedback('Please provide slide title and image.', 'error');
      return;
    }

    showFeedback('Saving homepage slide...', 'success');

    try {
      let updatedSlides = [...slides];
      if (slideForm.isEditing) {
        updatedSlides = updatedSlides.map(s => s.id === slideForm.id ? (slideForm as HomeSlide) : s);
      } else {
        const newSlide: HomeSlide = {
          id: 'slide-' + Date.now(),
          image: slideForm.image || '',
          title: slideForm.title || '',
          subtext: slideForm.subtext || ''
        };
        updatedSlides.push(newSlide);
      }

      await dataStore.setHomeSlides(updatedSlides);
      setSlides(updatedSlides);
      setSlideForm({});
      showFeedback(slideForm.isEditing ? 'Homepage slide updated!' : 'Homepage slide published!', 'success');
    } catch (err: any) {
      console.error(err);
      showFeedback(err.message || 'Failed to save slide to Supabase.', 'error');
    }
  };

  const deleteSlide = async (id: string) => {
    if (confirm('Are you sure you want to delete this slide?')) {
      showFeedback('Deleting slide...', 'success');
      try {
        const updated = slides.filter(s => s.id !== id);
        await dataStore.setHomeSlides(updated);
        setSlides(updated);
        showFeedback('Slide deleted successfully.', 'success');
      } catch (err: any) {
        console.error(err);
        showFeedback(err.message || 'Failed to delete slide.', 'error');
      }
    }
  };

  // -------------------------------------------------------------
  // SERVICES ACTIONS
  // -------------------------------------------------------------
  const saveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm.title || !serviceForm.description || !serviceForm.image) {
      showFeedback('Title, description and image are required.', 'error');
      return;
    }

    showFeedback('Saving service details...', 'success');

    const includesArray = serviceForm.includesText
      ? serviceForm.includesText.split('\n').map(line => line.trim()).filter(line => line.length > 0)
      : [];

    try {
      let updatedServices = [...services];
      if (serviceForm.isEditing) {
        const updatedItem: ServiceItem = {
          id: serviceForm.id!,
          title: serviceForm.title!,
          tagline: serviceForm.tagline || '',
          icon: serviceForm.icon || 'LayoutGrid',
          image: serviceForm.image!,
          description: serviceForm.description!,
          includes: includesArray
        };
        updatedServices = updatedServices.map(s => s.id === serviceForm.id ? updatedItem : s);
      } else {
        const newService: ServiceItem = {
          id: 'service-' + Date.now(),
          title: serviceForm.title!,
          tagline: serviceForm.tagline || '',
          icon: serviceForm.icon || 'LayoutGrid',
          image: serviceForm.image!,
          description: serviceForm.description!,
          includes: includesArray
        };
        updatedServices.push(newService);
      }

      await dataStore.setServices(updatedServices);
      setServices(updatedServices);
      setServiceForm({});
      showFeedback('Service details saved successfully!', 'success');
    } catch (err: any) {
      console.error(err);
      showFeedback(err.message || 'Failed to save service.', 'error');
    }
  };

  const deleteService = async (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      showFeedback('Deleting service...', 'success');
      try {
        const updated = services.filter(s => s.id !== id);
        await dataStore.setServices(updated);
        setServices(updated);
        showFeedback('Service deleted.', 'success');
      } catch (err: any) {
        console.error(err);
        showFeedback(err.message || 'Failed to delete service.', 'error');
      }
    }
  };

  // -------------------------------------------------------------
  // PORTFOLIO PROJECTS ACTIONS
  // -------------------------------------------------------------
  const saveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title || !projectForm.category || !projectForm.img) {
      showFeedback('Title, Category, and Image are required.', 'error');
      return;
    }

    showFeedback('Saving project details...', 'success');

    try {
      let updatedProjects = [...projects];
      if (projectForm.isEditing) {
        updatedProjects = updatedProjects.map(p => p.id === projectForm.id ? (projectForm as ProjectItem) : p);
      } else {
        const newProject: ProjectItem = {
          id: 'proj-' + Date.now(),
          title: projectForm.title!,
          category: projectForm.category!,
          img: projectForm.img!,
          desc: projectForm.desc || ''
        };
        updatedProjects.push(newProject);
      }

      await dataStore.setProjects(updatedProjects);
      setProjects(updatedProjects);
      setProjectForm({});
      showFeedback('Project details saved!', 'success');
    } catch (err: any) {
      console.error(err);
      showFeedback(err.message || 'Failed to save project.', 'error');
    }
  };

  const deleteProject = async (id: string) => {
    if (confirm('Are you sure you want to delete this project item?')) {
      showFeedback('Deleting project...', 'success');
      try {
        const updated = projects.filter(p => String(p.id) !== String(id));
        await dataStore.setProjects(updated);
        setProjects(updated);
        showFeedback('Project item deleted.', 'success');
      } catch (err: any) {
        console.error(err);
        showFeedback(err.message || 'Failed to delete project.', 'error');
      }
    }
  };

  // -------------------------------------------------------------
  // BEFORE AFTER SHOWCASE ACTIONS
  // -------------------------------------------------------------
  const saveBeforeAfter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!beforeAfterForm.beforeImg || !beforeAfterForm.afterImg) {
      showFeedback('Both Before and After images are required.', 'error');
      return;
    }

    showFeedback('Saving showcase comparison...', 'success');

    try {
      let updatedItems = [...beforeAfterItems];
      if (beforeAfterForm.isEditing) {
        updatedItems = updatedItems.map(item => item.id === beforeAfterForm.id ? (beforeAfterForm as BeforeAfterItem) : item);
      } else {
        const newItem: BeforeAfterItem = {
          id: 'ba-' + Date.now(),
          title: beforeAfterForm.title || 'Before & After Transformation',
          beforeImg: beforeAfterForm.beforeImg!,
          afterImg: beforeAfterForm.afterImg!
        };
        updatedItems.push(newItem);
      }

      await dataStore.setBeforeAfterShowcase(updatedItems);
      setBeforeAfterItems(updatedItems);
      setBeforeAfterForm({});
      showFeedback('Before & After comparison saved!', 'success');
    } catch (err: any) {
      console.error(err);
      showFeedback(err.message || 'Failed to save showcase.', 'error');
    }
  };

  const deleteBeforeAfter = async (id: string) => {
    if (confirm('Are you sure you want to delete this Before & After comparison?')) {
      showFeedback('Deleting showcase comparison...', 'success');
      try {
        const updated = beforeAfterItems.filter(item => item.id !== id);
        await dataStore.setBeforeAfterShowcase(updated);
        setBeforeAfterItems(updated);
        showFeedback('Before & After item deleted.', 'success');
      } catch (err: any) {
        console.error(err);
        showFeedback(err.message || 'Failed to delete showcase.', 'error');
      }
    }
  };

  // -------------------------------------------------------------
  // CONTACT DETAILS SAVE
  // -------------------------------------------------------------
  const saveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact) return;
    showFeedback('Saving contact details settings...', 'success');
    try {
      await dataStore.setContactDetails(contact);
      showFeedback('Contact details updated successfully!', 'success');
    } catch (err: any) {
      console.error(err);
      showFeedback(err.message || 'Failed to save contact details.', 'error');
    }
  };



  // ----------------- RENDER FORGOT PASSWORD / RECOVERY FORM -----------------
  if (showForgotPassword) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-black flex flex-col justify-center items-center px-4 relative overflow-hidden select-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-md w-full bg-white/5 border border-gold/20 rounded-xl p-8 backdrop-blur-xl shadow-2xl space-y-8" data-aos="zoom-in">
          <div className="text-center space-y-2">
            <button 
              type="button"
              onClick={() => { setShowForgotPassword(false); setError(''); setResetStep('request'); }}
              className="text-gold hover:text-white mb-2 text-xs flex items-center justify-center gap-1 mx-auto cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
            </button>
            <h1 className="text-2xl font-heading font-bold text-white tracking-widest uppercase">
              {resetStep === 'request' ? 'Forgot Password' : 'Choose New Password'}
            </h1>
            <p className="text-grey text-xs font-light font-poppins">
              {resetStep === 'request' 
                ? 'Enter your administrator email to receive a password reset link' 
                : 'Enter your new administrator account password below'
              }
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-950/40 border border-red-500/30 p-4 rounded text-red-400 text-xs font-poppins">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {feedbackMsg.text && (
            <div className={`flex items-center gap-2 p-4 rounded text-xs font-poppins border ${
              feedbackMsg.type === 'success'
                ? 'bg-green-950/40 border-green-500/30 text-green-400'
                : 'bg-amber-950/40 border-amber-500/30 text-amber-400'
            }`}>
              {feedbackMsg.type === 'success' ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{feedbackMsg.text}</span>
            </div>
          )}

          {resetStep === 'request' ? (
            <form onSubmit={handleSendResetCode} className="space-y-5">
              <div className="space-y-1">
                <label className="block text-xs uppercase tracking-wider text-gold font-semibold font-poppins">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-grey">
                    <User className="w-4 h-4" />
                  </span>
                  <input 
                    type="email" 
                    required 
                    placeholder="vcprojectstudio@gmail.com"
                    className="w-full bg-black/40 border border-grey/30 focus:border-gold outline-none pl-10 pr-4 py-2.5 rounded text-white text-sm font-poppins transition-all focus:shadow-[0_0_8px_rgba(212,175,55,0.15)]"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-gold-gradient hover:shadow-gold-glow text-black font-semibold uppercase text-xs tracking-widest rounded transition-all duration-300 transform active:scale-[0.98] cursor-pointer"
              >
                Send Reset Link
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyAndResetPassword} className="space-y-5">

              <div className="space-y-1">
                <label className="block text-xs uppercase tracking-wider text-gold font-semibold font-poppins">New Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-grey">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input 
                    type="password" 
                    required 
                    placeholder="At least 6 characters"
                    className="w-full bg-black/40 border border-grey/30 focus:border-gold outline-none pl-10 pr-4 py-2.5 rounded text-white text-sm font-poppins transition-all focus:shadow-[0_0_8px_rgba(212,175,55,0.15)]"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs uppercase tracking-wider text-gold font-semibold font-poppins">Confirm Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-grey">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input 
                    type="password" 
                    required 
                    placeholder="••••••••"
                    className="w-full bg-black/40 border border-grey/30 focus:border-gold outline-none pl-10 pr-4 py-2.5 rounded text-white text-sm font-poppins transition-all focus:shadow-[0_0_8px_rgba(212,175,55,0.15)]"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-gold-gradient hover:shadow-gold-glow text-black font-semibold uppercase text-xs tracking-widest rounded transition-all duration-300 transform active:scale-[0.98] cursor-pointer"
              >
                Reset Password
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // ----------------- RENDER LOGIN FORM -----------------
  if (!isLoggedIn) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-black flex flex-col justify-center items-center px-4 relative overflow-hidden select-none">
        {/* Glow backdrop design */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-md w-full bg-white/5 border border-gold/20 rounded-xl p-8 backdrop-blur-xl shadow-2xl space-y-8" data-aos="zoom-in">
          <div className="text-center space-y-2">
            <Link to="/" className="inline-block text-gold hover:text-white mb-2 text-xs flex items-center justify-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Website
            </Link>
            <h1 className="text-2xl font-heading font-bold text-white tracking-widest uppercase">Admin Panel Login</h1>
            <p className="text-grey text-xs font-light font-poppins">VC Project Studio Management Portal</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-950/40 border border-red-500/30 p-4 rounded text-red-400 text-xs font-poppins">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {feedbackMsg.text && (
            <div className={`flex items-center gap-2 p-4 rounded text-xs font-poppins border ${
              feedbackMsg.type === 'success'
                ? 'bg-green-950/40 border-green-500/30 text-green-400'
                : 'bg-amber-950/40 border-amber-500/30 text-amber-400'
            }`}>
              {feedbackMsg.type === 'success' ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{feedbackMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1">
              <label className="block text-xs uppercase tracking-wider text-gold font-semibold font-poppins">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-grey">
                  <User className="w-4 h-4" />
                </span>
                <input 
                  type="email" 
                  required 
                  placeholder="vcprojectstudio@gmail.com"
                  className="w-full bg-black/40 border border-grey/30 focus:border-gold outline-none pl-10 pr-4 py-2.5 rounded text-white text-sm font-poppins transition-all focus:shadow-[0_0_8px_rgba(212,175,55,0.15)]"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="block text-xs uppercase tracking-wider text-gold font-semibold font-poppins">Password</label>
                <button 
                  type="button" 
                  onClick={() => { setShowForgotPassword(true); setError(''); }}
                  className="text-[11px] text-gold hover:text-white transition-colors cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-grey">
                  <Lock className="w-4 h-4" />
                </span>
                <input 
                  type="password" 
                  required 
                  placeholder="••••••••"
                  className="w-full bg-black/40 border border-grey/30 focus:border-gold outline-none pl-10 pr-4 py-2.5 rounded text-white text-sm font-poppins transition-all focus:shadow-[0_0_8px_rgba(212,175,55,0.15)]"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-3 bg-gold-gradient hover:shadow-gold-glow text-black font-semibold uppercase text-xs tracking-widest rounded transition-all duration-300 transform active:scale-[0.98] cursor-pointer"
            >
              Sign In to Dashboard
            </button>
          </form>

          {/* Quick Login Helper for the client/reviewer */}
          <div className="border-t border-grey/15 pt-4 text-center">
            <p className="text-[10px] text-grey-dark uppercase tracking-wider font-semibold">Reviewer Credentials Tip:</p>
            <p className="text-[11px] text-gold/70 mt-1 font-poppins">Email: <code className="text-white">vcprojectstudio@gmail.com</code></p>
            <p className="text-[11px] text-gold/70 font-poppins">Pass: <code className="text-white">admin123</code></p>
          </div>
        </div>
      </div>
    );
  }

  // ----------------- RENDER ADMIN PANEL DASHBOARD -----------------
  return (
    <div className="pt-6 pb-20 min-h-screen bg-offwhite text-black font-poppins">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-black text-white p-6 sm:p-8 rounded-xl shadow-lg border border-gold/25 mb-8">
          <div>
            <span className="text-gold text-xs uppercase tracking-widest font-semibold">Premium CMS Control Room</span>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white mt-1">VC Studio Admin Portal</h1>
            <p className="text-grey text-xs mt-1 font-light">Make changes that instantly sync with homepage layouts, portfolio items, services lists, and contact sheets.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-gold-gradient text-black rounded text-xs uppercase tracking-wider font-semibold hover:shadow-gold-glow transition-all duration-300 transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>

        {/* Global Feedback message */}
        {feedbackMsg.text && (
          <div className={`mb-6 p-4 rounded border flex items-center gap-3 transition-all animate-fade-in ${
            feedbackMsg.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}>
            {feedbackMsg.type === 'success' ? <Check className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <span className="text-sm font-medium">{feedbackMsg.text}</span>
          </div>
        )}

        {/* CMS Container Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Dashboard Sidebar Tabs Selector */}
          <div className="lg:col-span-3 bg-white p-4 rounded-lg shadow-sm border border-grey/15 space-y-1.5 h-fit">
            <p className="text-[10px] uppercase font-bold text-grey-dark tracking-wider px-3 mb-2">Content Categories</p>
            
            <button 
              onClick={() => { setActiveTab('slides'); setSlideForm({}); }}
              className={`w-full text-left px-4 py-3 rounded text-sm font-semibold flex items-center gap-3 transition-all ${
                activeTab === 'slides' ? 'bg-gold text-black shadow-sm font-bold' : 'hover:bg-gold/10 text-black/75 hover:text-black'
              }`}
            >
              <Eye className="w-4 h-4 shrink-0" />
              <span>Home Slides ({slides.length})</span>
            </button>

            <button 
              onClick={() => { setActiveTab('services'); setServiceForm({}); }}
              className={`w-full text-left px-4 py-3 rounded text-sm font-semibold flex items-center gap-3 transition-all ${
                activeTab === 'services' ? 'bg-gold text-black shadow-sm font-bold' : 'hover:bg-gold/10 text-black/75 hover:text-black'
              }`}
            >
              <Wrench className="w-4 h-4 shrink-0" />
              <span>Services ({services.length})</span>
            </button>

            <button 
              onClick={() => { setActiveTab('projects'); setProjectForm({}); }}
              className={`w-full text-left px-4 py-3 rounded text-sm font-semibold flex items-center gap-3 transition-all ${
                activeTab === 'projects' ? 'bg-gold text-black shadow-sm font-bold' : 'hover:bg-gold/10 text-black/75 hover:text-black'
              }`}
            >
              <LayoutGrid className="w-4 h-4 shrink-0" />
              <span>Recent Projects ({projects.length})</span>
            </button>

            <button 
              onClick={() => { setActiveTab('beforeAfter'); setBeforeAfterForm({}); }}
              className={`w-full text-left px-4 py-3 rounded text-sm font-semibold flex items-center gap-3 transition-all ${
                activeTab === 'beforeAfter' ? 'bg-gold text-black shadow-sm font-bold' : 'hover:bg-gold/10 text-black/75 hover:text-black'
              }`}
            >
              <RefreshCw className="w-4 h-4 shrink-0" />
              <span>Before & After ({beforeAfterItems.length})</span>
            </button>

            <button 
              onClick={() => { setActiveTab('contact'); }}
              className={`w-full text-left px-4 py-3 rounded text-sm font-semibold flex items-center gap-3 transition-all ${
                activeTab === 'contact' ? 'bg-gold text-black shadow-sm font-bold' : 'hover:bg-gold/10 text-black/75 hover:text-black'
              }`}
            >
              <MapPin className="w-4 h-4 shrink-0" />
              <span>Contact & Footer Details</span>
            </button>
          </div>

          {/* CMS Editing Canvas */}
          <div className="lg:col-span-9 space-y-8">
            
            {/* -------------------------------------------------------------
                TAB SHEET: HOME SLIDES
                ------------------------------------------------------------- */}
            {activeTab === 'slides' && (
              <div className="space-y-6">
                
                {/* Form header & form block */}
                <div className="bg-white border border-grey/15 rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-heading font-bold text-black border-b border-grey/10 pb-3 flex items-center gap-2">
                    <PlusCircle className="w-5 h-5 text-gold" /> {slideForm.isEditing ? 'Edit Slide Details' : 'Add New Homepage Slide'}
                  </h3>
                  <form onSubmit={saveSlide} className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs uppercase tracking-wider text-grey-dark font-semibold">Slide Image</label>
                        <input 
                          type="file" 
                          accept="image/*"
                          className="w-full bg-offwhite border border-grey/25 focus:border-gold outline-none px-4 py-2 rounded text-sm text-black transition-all file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-gold/10 file:text-gold hover:file:bg-gold/20"
                          onChange={e => handleFileChange(e, (url) => setSlideForm({ ...slideForm, image: url }))}
                        />
                        {slideForm.image && (
                          <div className="mt-2 h-20 w-32 bg-black rounded overflow-hidden border border-grey/20 relative">
                            <img src={slideForm.image} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs uppercase tracking-wider text-grey-dark font-semibold">Slide Title (Main Heading Text)</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Crafting Premium Luxury Designs"
                          className="w-full bg-offwhite border border-grey/25 focus:border-gold outline-none px-4 py-2 rounded text-sm text-black transition-all"
                          value={slideForm.title || ''}
                          onChange={e => setSlideForm({ ...slideForm, title: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase tracking-wider text-grey-dark font-semibold">Slide Subtext / Description</label>
                      <textarea 
                        rows={2}
                        placeholder="e.g. Custom wardrobes, turnkey solutions, premium lighting tailored to your budget."
                        className="w-full bg-offwhite border border-grey/25 focus:border-gold outline-none px-4 py-2 rounded text-sm text-black resize-none transition-all"
                        value={slideForm.subtext || ''}
                        onChange={e => setSlideForm({ ...slideForm, subtext: e.target.value })}
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button 
                        type="submit"
                        className="px-6 py-2.5 bg-black hover:bg-gold hover:text-black text-white font-semibold uppercase text-xs tracking-wider rounded transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" /> {slideForm.isEditing ? 'Save Update' : 'Publish Slide'}
                      </button>
                      {slideForm.isEditing && (
                        <button 
                          type="button" 
                          onClick={() => setSlideForm({})}
                          className="px-4 py-2.5 border border-grey/20 text-grey-dark hover:text-black hover:bg-grey/5 rounded text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Slides Directory table */}
                <div className="bg-white border border-grey/15 rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-heading font-bold text-black border-b border-grey/10 pb-3">Active Slider Images</h3>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {slides.map((s, index) => (
                      <div key={s.id} className="border border-grey/15 rounded-lg overflow-hidden bg-offwhite flex flex-col justify-between">
                        <div className="h-40 overflow-hidden relative bg-black">
                          <img src={s.image} alt={s.title} className="w-full h-full object-cover opacity-90" />
                          <span className="absolute top-2 left-2 px-2.5 py-0.5 bg-black/80 text-gold text-[10px] font-semibold tracking-wider rounded border border-gold/15">
                            Slide {index + 1}
                          </span>
                        </div>
                        <div className="p-4 flex-grow space-y-1">
                          <h4 className="font-bold text-sm text-black line-clamp-1">{s.title}</h4>
                          <p className="text-grey-dark text-xs font-light line-clamp-2 leading-relaxed">{s.subtext || '(No descriptive subtext)'}</p>
                        </div>
                        <div className="p-4 border-t border-grey/10 flex items-center justify-end gap-2 bg-white">
                          <button 
                            onClick={() => setSlideForm({ ...s, isEditing: true })}
                            className="p-1.5 border border-grey/25 text-grey-dark hover:text-gold hover:border-gold rounded transition-colors cursor-pointer"
                            title="Edit details"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => deleteSlide(s.id)}
                            className="p-1.5 border border-grey/25 text-grey-dark hover:text-red-500 hover:border-red-500 rounded transition-colors cursor-pointer"
                            title="Delete slide"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* -------------------------------------------------------------
                TAB SHEET: SERVICES
                ------------------------------------------------------------- */}
            {activeTab === 'services' && (
              <div className="space-y-6">
                
                {/* Add/Edit Form block */}
                <div className="bg-white border border-grey/15 rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-heading font-bold text-black border-b border-grey/10 pb-3 flex items-center gap-2">
                    <PlusCircle className="w-5 h-5 text-gold" /> {serviceForm.isEditing ? 'Edit Service Option' : 'Add New Design Service'}
                  </h3>
                  <form onSubmit={saveService} className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      <div className="space-y-1.5">
                        <label className="block text-xs uppercase tracking-wider text-grey-dark font-semibold">Service Title</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Turnkey Execution"
                          className="w-full bg-offwhite border border-grey/25 focus:border-gold outline-none px-4 py-2 rounded text-sm text-black transition-all"
                          value={serviceForm.title || ''}
                          onChange={e => setServiceForm({ ...serviceForm, title: e.target.value })}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs uppercase tracking-wider text-grey-dark font-semibold">Tagline / Short Header</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Precision Engineering & Bespoke Cabinets"
                          className="w-full bg-offwhite border border-grey/25 focus:border-gold outline-none px-4 py-2 rounded text-sm text-black transition-all"
                          value={serviceForm.tagline || ''}
                          onChange={e => setServiceForm({ ...serviceForm, tagline: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      <div className="space-y-1.5">
                        <label className="block text-xs uppercase tracking-wider text-grey-dark font-semibold">Category Icon</label>
                        <select 
                          className="w-full bg-offwhite border border-grey/25 focus:border-gold outline-none px-4 py-2.5 rounded text-sm text-black transition-all"
                          value={serviceForm.icon || 'LayoutGrid'}
                          onChange={e => setServiceForm({ ...serviceForm, icon: e.target.value })}
                        >
                          <option value="LayoutGrid">Grid (LayoutGrid)</option>
                          <option value="Wrench">Wrench Tool (Wrench)</option>
                          <option value="Palette">Color Palette (Palette)</option>
                          <option value="ShieldCheck">Safe Guard (ShieldCheck)</option>
                          <option value="Heart">Heart (Heart)</option>
                          <option value="Award">Medal Award (Award)</option>
                          <option value="Star">Star Review (Star)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs uppercase tracking-wider text-grey-dark font-semibold">Service Image</label>
                        <input 
                          type="file" 
                          accept="image/*"
                          className="w-full bg-offwhite border border-grey/25 focus:border-gold outline-none px-4 py-2 rounded text-sm text-black transition-all file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-gold/10 file:text-gold hover:file:bg-gold/20"
                          onChange={e => handleFileChange(e, (url) => setServiceForm({ ...serviceForm, image: url }))}
                        />
                        {serviceForm.image && (
                          <div className="mt-2 h-20 w-32 bg-black rounded overflow-hidden border border-grey/20 relative">
                            <img src={serviceForm.image} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase tracking-wider text-grey-dark font-semibold">Description Text</label>
                      <textarea 
                        rows={3}
                        required
                        placeholder="Detailed service summary..."
                        className="w-full bg-offwhite border border-grey/25 focus:border-gold outline-none px-4 py-2 rounded text-sm text-black resize-none transition-all"
                        value={serviceForm.description || ''}
                        onChange={e => setServiceForm({ ...serviceForm, description: e.target.value })}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase tracking-wider text-grey-dark font-semibold">Included Details / bullet list (One item per line)</label>
                      <textarea 
                        rows={4}
                        placeholder="Modular Kitchens (L-shaped, U-shaped)&#10;Custom Wardrobes&#10;Electrical rewiring"
                        className="w-full bg-offwhite border border-grey/25 focus:border-gold outline-none px-4 py-2 rounded text-sm text-black font-mono transition-all"
                        value={serviceForm.includesText || ''}
                        onChange={e => setServiceForm({ ...serviceForm, includesText: e.target.value })}
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button 
                        type="submit"
                        className="px-6 py-2.5 bg-black hover:bg-gold hover:text-black text-white font-semibold uppercase text-xs tracking-wider rounded transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" /> {serviceForm.isEditing ? 'Save Service' : 'Add Service'}
                      </button>
                      {serviceForm.isEditing && (
                        <button 
                          type="button" 
                          onClick={() => setServiceForm({})}
                          className="px-4 py-2.5 border border-grey/20 text-grey-dark hover:text-black hover:bg-grey/5 rounded text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Services Directory table */}
                <div className="bg-white border border-grey/15 rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-heading font-bold text-black border-b border-grey/10 pb-3">Active Service Programs</h3>
                  <div className="mt-4 space-y-4">
                    {services.map((ser) => (
                      <div key={ser.id} className="flex flex-col sm:flex-row gap-4 p-4 border border-grey/15 rounded-lg bg-offwhite items-start">
                        <img src={ser.image} alt={ser.title} className="w-full sm:w-32 h-24 object-cover rounded border border-grey/20" />
                        <div className="flex-grow space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="p-1 bg-white border border-gold/20 text-gold rounded text-xs">
                              {ser.icon}
                            </span>
                            <h4 className="font-bold text-base text-black">{ser.title}</h4>
                          </div>
                          <p className="text-gold text-xs uppercase font-poppins font-semibold">{ser.tagline}</p>
                          <p className="text-grey-dark text-xs font-light mt-1.5 leading-relaxed">{ser.description}</p>
                          {ser.includes.length > 0 && (
                            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[10px] text-black/75">
                              <strong>Bullet details:</strong>
                              {ser.includes.map((inc, i) => (
                                <span key={i} className="bg-white px-2 py-0.5 border border-grey/10 rounded">✓ {inc}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex sm:flex-col gap-2 shrink-0 self-end sm:self-center">
                          <button 
                            onClick={() => {
                              setServiceForm({
                                ...ser,
                                isEditing: true,
                                includesText: ser.includes.join('\n')
                              });
                            }}
                            className="p-1.5 border border-grey/25 bg-white text-grey-dark hover:text-gold hover:border-gold rounded transition-colors cursor-pointer"
                            title="Edit Service"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => deleteService(ser.id)}
                            className="p-1.5 border border-grey/25 bg-white text-grey-dark hover:text-red-500 hover:border-red-500 rounded transition-colors cursor-pointer"
                            title="Delete Service"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* -------------------------------------------------------------
                TAB SHEET: RECENT PROJECTS (GALLERY)
                ------------------------------------------------------------- */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                
                {/* Add/Edit Form block */}
                <div className="bg-white border border-grey/15 rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-heading font-bold text-black border-b border-grey/10 pb-3 flex items-center gap-2">
                    <PlusCircle className="w-5 h-5 text-gold" /> {projectForm.isEditing ? 'Edit Project Details' : 'Add New Portfolio Project'}
                  </h3>
                  <form onSubmit={saveProject} className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      
                      <div className="space-y-1.5">
                        <label className="block text-xs uppercase tracking-wider text-grey-dark font-semibold">Project Title</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Olive Green Modular Kitchen"
                          className="w-full bg-offwhite border border-grey/25 focus:border-gold outline-none px-4 py-2 rounded text-sm text-black transition-all"
                          value={projectForm.title || ''}
                          onChange={e => setProjectForm({ ...projectForm, title: e.target.value })}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs uppercase tracking-wider text-grey-dark font-semibold">Category Selection</label>
                        <select 
                          className="w-full bg-offwhite border border-grey/25 focus:border-gold outline-none px-4 py-2.5 rounded text-sm text-black transition-all"
                          value={projectForm.category || ''}
                          onChange={e => setProjectForm({ ...projectForm, category: e.target.value })}
                          required
                        >
                          <option value="">-- Choose Category --</option>
                          {categories.map(c => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs uppercase tracking-wider text-grey-dark font-semibold">Project Image</label>
                        <input 
                          type="file" 
                          accept="image/*"
                          className="w-full bg-offwhite border border-grey/25 focus:border-gold outline-none px-4 py-2 rounded text-sm text-black transition-all file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-gold/10 file:text-gold hover:file:bg-gold/20"
                          onChange={e => handleFileChange(e, (url) => setProjectForm({ ...projectForm, img: url }))}
                        />
                        {projectForm.img && (
                          <div className="mt-2 h-20 w-32 bg-black rounded overflow-hidden border border-grey/20 relative">
                            <img src={projectForm.img} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase tracking-wider text-grey-dark font-semibold">Project Details Description</label>
                      <textarea 
                        rows={2}
                        placeholder="Describe materials, size, layout details..."
                        className="w-full bg-offwhite border border-grey/25 focus:border-gold outline-none px-4 py-2 rounded text-sm text-black resize-none transition-all"
                        value={projectForm.desc || ''}
                        onChange={e => setProjectForm({ ...projectForm, desc: e.target.value })}
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button 
                        type="submit"
                        className="px-6 py-2.5 bg-black hover:bg-gold hover:text-black text-white font-semibold uppercase text-xs tracking-wider rounded transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" /> {projectForm.isEditing ? 'Save Update' : 'Publish Project'}
                      </button>
                      {projectForm.isEditing && (
                        <button 
                          type="button" 
                          onClick={() => setProjectForm({})}
                          className="px-4 py-2.5 border border-grey/20 text-grey-dark hover:text-black hover:bg-grey/5 rounded text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Category Manager Card */}
                <div className="bg-white border border-grey/15 rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-heading font-bold text-black border-b border-grey/10 pb-3 flex items-center gap-2">
                    <PlusCircle className="w-5 h-5 text-gold" /> Manage Project Categories
                  </h3>
                  
                  {/* Add New Category form */}
                  <form onSubmit={addCategory} className="mt-4 flex gap-2">
                    <input 
                      type="text" 
                      placeholder="e.g. Office Design, Balcony, Bar Unit"
                      className="flex-grow bg-offwhite border border-grey/25 focus:border-gold outline-none px-4 py-2 rounded text-sm text-black transition-all"
                      value={newCategoryName}
                      onChange={e => setNewCategoryName(e.target.value)}
                      required
                    />
                    <button 
                      type="submit"
                      className="px-4 py-2 bg-black hover:bg-gold hover:text-black text-white text-xs font-bold uppercase tracking-wider rounded transition-all cursor-pointer"
                    >
                      Add Category
                    </button>
                  </form>

                  {/* List of existing categories with delete option */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <span 
                        key={cat.id} 
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-offwhite border border-grey/20 rounded text-xs font-semibold text-black"
                      >
                        <span>{cat.name}</span>
                        <button 
                          type="button"
                          onClick={() => deleteCategory(cat.id)}
                          className="text-grey-dark hover:text-red-500 transition-colors font-bold text-sm ml-1"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Projects directory grid */}
                <div className="bg-white border border-grey/15 rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-heading font-bold text-black border-b border-grey/10 pb-3">Active Gallery Portfolio ({projects.length})</h3>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {projects.map((p) => (
                      <div key={p.id} className="border border-grey/15 rounded-lg bg-offwhite flex flex-col justify-between overflow-hidden">
                        <div className="h-32 bg-black relative">
                          <img src={p.img} alt={p.title} className="w-full h-full object-cover" />
                          <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/85 border border-gold/25 text-gold text-[9px] uppercase tracking-wider font-semibold rounded">
                            {p.category}
                          </span>
                        </div>
                        <div className="p-3 flex-grow">
                          <h4 className="font-bold text-xs text-black line-clamp-1">{p.title}</h4>
                          <p className="text-grey-dark text-[10px] font-light line-clamp-2 mt-1 leading-relaxed">{p.desc}</p>
                        </div>
                        <div className="p-3 bg-white border-t border-grey/10 flex justify-end gap-2">
                          <button 
                            onClick={() => setProjectForm({ ...p, isEditing: true })}
                            className="p-1 bg-white border border-grey/25 text-grey-dark hover:text-gold hover:border-gold rounded transition-colors cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => deleteProject(p.id)}
                            className="p-1 bg-white border border-grey/25 text-grey-dark hover:text-red-500 hover:border-red-500 rounded transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* -------------------------------------------------------------
                TAB SHEET: BEFORE & AFTER SHOWCASE COMPARISONS
                ------------------------------------------------------------- */}
            {activeTab === 'beforeAfter' && (
              <div className="space-y-6">
                
                {/* Add/Edit Form block */}
                <div className="bg-white border border-grey/15 rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-heading font-bold text-black border-b border-grey/10 pb-3 flex items-center gap-2">
                    <PlusCircle className="w-5 h-5 text-gold" /> {beforeAfterForm.isEditing ? 'Edit Showcase Comparison' : 'Add New Before & After Comparison'}
                  </h3>
                  <form onSubmit={saveBeforeAfter} className="mt-4 space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase tracking-wider text-grey-dark font-semibold">Showcase Title / Tag description</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Master Bedroom Structural Overhaul"
                        className="w-full bg-offwhite border border-grey/25 focus:border-gold outline-none px-4 py-2 rounded text-sm text-black transition-all"
                        value={beforeAfterForm.title || ''}
                        onChange={e => setBeforeAfterForm({ ...beforeAfterForm, title: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Before Image block */}
                      <div className="space-y-1.5 p-4 bg-offwhite border border-grey/15 rounded">
                        <p className="text-xs uppercase tracking-wider text-black font-bold border-b border-grey/10 pb-1">
                          <span>1. Before Work Image</span>
                        </p>
                        <input 
                          type="file" 
                          accept="image/*"
                          className="w-full bg-white border border-grey/25 focus:border-gold outline-none px-3 py-1.5 rounded text-xs text-black transition-all file:mr-2 file:py-0.5 file:px-1.5 file:rounded file:border-0 file:text-[9px] file:bg-gold/10 file:text-gold hover:file:bg-gold/25"
                          onChange={e => handleFileChange(e, (url) => setBeforeAfterForm({ ...beforeAfterForm, beforeImg: url }))}
                        />
                        {beforeAfterForm.beforeImg && (
                          <div className="mt-3 h-28 bg-black rounded overflow-hidden border border-grey/20">
                            <img src={beforeAfterForm.beforeImg} alt="Preview Before" className="w-full h-full object-contain" />
                          </div>
                        )}
                      </div>

                      {/* After Image block */}
                      <div className="space-y-1.5 p-4 bg-offwhite border border-grey/15 rounded">
                        <p className="text-xs uppercase tracking-wider text-black font-bold border-b border-grey/10 pb-1">
                          <span>2. After Work Image</span>
                        </p>
                        <input 
                          type="file" 
                          accept="image/*"
                          className="w-full bg-white border border-grey/25 focus:border-gold outline-none px-3 py-1.5 rounded text-xs text-black transition-all file:mr-2 file:py-0.5 file:px-1.5 file:rounded file:border-0 file:text-[9px] file:bg-gold/10 file:text-gold hover:file:bg-gold/25"
                          onChange={e => handleFileChange(e, (url) => setBeforeAfterForm({ ...beforeAfterForm, afterImg: url }))}
                        />
                        {beforeAfterForm.afterImg && (
                          <div className="mt-3 h-28 bg-black rounded overflow-hidden border border-grey/20">
                            <img src={beforeAfterForm.afterImg} alt="Preview After" className="w-full h-full object-contain" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button 
                        type="submit"
                        className="px-6 py-2.5 bg-black hover:bg-gold hover:text-black text-white font-semibold uppercase text-xs tracking-wider rounded transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" /> {beforeAfterForm.isEditing ? 'Save Comparison' : 'Publish Showcase'}
                      </button>
                      {beforeAfterForm.isEditing && (
                        <button 
                          type="button" 
                          onClick={() => setBeforeAfterForm({})}
                          className="px-4 py-2.5 border border-grey/20 text-grey-dark hover:text-black hover:bg-grey/5 rounded text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Directory table */}
                <div className="bg-white border border-grey/15 rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-heading font-bold text-black border-b border-grey/10 pb-3">Active Before & After comparisons ({beforeAfterItems.length})</h3>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {beforeAfterItems.map((item, index) => (
                      <div key={item.id} className="border border-grey/15 rounded-lg bg-offwhite flex flex-col justify-between overflow-hidden">
                        <div className="p-3 bg-white border-b border-grey/10 flex justify-between items-center">
                          <span className="text-xs font-bold text-black truncate pr-4">Slot {index + 1}: {item.title}</span>
                          <span className="text-[9px] bg-gold/15 text-gold border border-gold/30 font-semibold uppercase px-2 py-0.5 rounded shrink-0">Showcase</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1 p-2 bg-black h-28">
                          <div className="relative h-full overflow-hidden">
                            <img src={item.beforeImg} alt="Before" className="w-full h-full object-cover" />
                            <div className="absolute bottom-1 left-1 bg-black/85 text-[8px] text-white px-1 border border-grey/60 rounded">Before</div>
                          </div>
                          <div className="relative h-full overflow-hidden">
                            <img src={item.afterImg} alt="After" className="w-full h-full object-cover" />
                            <div className="absolute bottom-1 right-1 bg-gold text-[8px] text-black font-semibold px-1 rounded">After</div>
                          </div>
                        </div>
                        <div className="p-3 bg-white border-t border-grey/10 flex justify-end gap-2">
                          <button 
                            onClick={() => setBeforeAfterForm({ ...item, isEditing: true })}
                            className="p-1 bg-white border border-grey/25 text-grey-dark hover:text-gold hover:border-gold rounded transition-colors cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => deleteBeforeAfter(item.id)}
                            className="p-1 bg-white border border-grey/25 text-grey-dark hover:text-red-500 hover:border-red-500 rounded transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* -------------------------------------------------------------
                TAB SHEET: CONTACT DETAILS
                ------------------------------------------------------------- */}
            {activeTab === 'contact' && contact && (
              <div className="bg-white border border-grey/15 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-heading font-bold text-black border-b border-grey/10 pb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gold" /> Studio & Contact Settings
                </h3>
                <form onSubmit={saveContact} className="mt-4 space-y-4">
                  
                  <div className="space-y-1.5">
                    <label className="block text-xs uppercase tracking-wider text-grey-dark font-semibold">Studio Location Address</label>
                    <textarea 
                      rows={2}
                      required
                      placeholder="Full office address..."
                      className="w-full bg-offwhite border border-grey/25 focus:border-gold outline-none px-4 py-2 rounded text-sm text-black resize-none transition-all"
                      value={contact.location}
                      onChange={e => setContact({ ...contact, location: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase tracking-wider text-grey-dark font-semibold">Primary Phone Number</label>
                      <input 
                        type="text" 
                        required
                        placeholder="+91 63050 93192"
                        className="w-full bg-offwhite border border-grey/25 focus:border-gold outline-none px-4 py-2 rounded text-sm text-black transition-all"
                        value={contact.phone1}
                        onChange={e => setContact({ ...contact, phone1: e.target.value })}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase tracking-wider text-grey-dark font-semibold">Secondary Phone Number</label>
                      <input 
                        type="text" 
                        required
                        placeholder="+91 76609 94433"
                        className="w-full bg-offwhite border border-grey/25 focus:border-gold outline-none px-4 py-2 rounded text-sm text-black transition-all"
                        value={contact.phone2}
                        onChange={e => setContact({ ...contact, phone2: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase tracking-wider text-grey-dark font-semibold">Studio Email Address</label>
                      <input 
                        type="email" 
                        required
                        placeholder="vcprojectstudio@gmail.com"
                        className="w-full bg-offwhite border border-grey/25 focus:border-gold outline-none px-4 py-2 rounded text-sm text-black transition-all"
                        value={contact.email}
                        onChange={e => setContact({ ...contact, email: e.target.value })}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase tracking-wider text-grey-dark font-semibold">Operating Work Hours</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Monday - Sunday: 10:00 AM - 8:30 PM"
                        className="w-full bg-offwhite border border-grey/25 focus:border-gold outline-none px-4 py-2 rounded text-sm text-black transition-all"
                        value={contact.hours}
                        onChange={e => setContact({ ...contact, hours: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase tracking-wider text-grey-dark font-semibold">WhatsApp API Number 1 (digits only, e.g. 916305093192)</label>
                      <input 
                        type="text" 
                        required
                        placeholder="916305093192"
                        className="w-full bg-offwhite border border-grey/25 focus:border-gold outline-none px-4 py-2 rounded text-sm text-black transition-all"
                        value={contact.whatsapp1}
                        onChange={e => setContact({ ...contact, whatsapp1: e.target.value })}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase tracking-wider text-grey-dark font-semibold">WhatsApp API Number 2 (digits only, e.g. 917660994433)</label>
                      <input 
                        type="text" 
                        required
                        placeholder="917660994433"
                        className="w-full bg-offwhite border border-grey/25 focus:border-gold outline-none px-4 py-2 rounded text-sm text-black transition-all"
                        value={contact.whatsapp2}
                        onChange={e => setContact({ ...contact, whatsapp2: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs uppercase tracking-wider text-grey-dark font-semibold">Google Map Embed iframe URL source</label>
                    <input 
                      type="text" 
                      required
                      placeholder="https://www.google.com/maps/embed?pb=..."
                      className="w-full bg-offwhite border border-grey/25 focus:border-gold outline-none px-4 py-2 rounded text-sm text-black transition-all"
                      value={contact.mapEmbedUrl}
                      onChange={e => setContact({ ...contact, mapEmbedUrl: e.target.value })}
                    />
                    {contact.mapEmbedUrl && !contact.mapEmbedUrl.includes('/maps/embed') && !contact.mapEmbedUrl.includes('output=embed') && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-xs space-y-1 mt-1.5 font-poppins">
                        <p className="font-bold">⚠️ Warning: Invalid Map Link Type</p>
                        <p>Google blocks standard sharing links (`google.com/maps/place/...`) from loading inside websites, causing the <strong>"refused to connect"</strong> error you see.</p>
                        <p className="font-semibold mt-1">How to fix:</p>
                        <ul className="list-disc pl-4 space-y-0.5 mb-2">
                          <li>Go to Google Maps and select your location.</li>
                          <li>Click <strong>Share</strong>, then select the <strong>"Embed a map"</strong> tab.</li>
                          <li>Copy the link starting with <code className="bg-red-100 px-1 py-0.5 rounded">https://www.google.com/maps/embed?...</code> and paste it here.</li>
                        </ul>
                        <button
                          type="button"
                          onClick={autoFixMapUrl}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-bold uppercase tracking-wider transition-all transform active:scale-95 cursor-pointer flex items-center gap-1.5"
                        >
                          ✨ Auto-Fix Map Link (Convert to Embed)
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-grey/10">
                    <button 
                      type="submit"
                      className="px-6 py-3 bg-black hover:bg-gold hover:text-black text-white font-semibold uppercase text-xs tracking-wider rounded transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-4 h-4" /> Save Contact Details Settings
                    </button>
                  </div>

                </form>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
