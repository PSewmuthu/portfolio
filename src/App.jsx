import React, { useState, useEffect } from 'react';
import NeuralNetwork from './components/NeuralNetwork/NeuralNetwork';
import content from './data/content.json';
import { Github, Linkedin, Mail, ExternalLink, Download, FileText, Play, X, ChevronRight, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ theme, toggleTheme, activeSections }) => (
  <nav className="navbar">
    <div className="nav-logo">PS</div>
    <div className="nav-right">
      <div className="nav-links">
        {activeSections.map(section => (
          <a key={section.id} href={`#${section.id}`}>{section.label}</a>
        ))}
      </div>
      <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </div>
  </nav>
);

const VideoModal = ({ videoUrl, onClose }) => {
  if (!videoUrl) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="video-modal-backdrop"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="video-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="video-modal-close" onClick={onClose} aria-label="Close video">
          <X size={24} />
        </button>
        <video 
          src={videoUrl} 
          controls 
          autoPlay 
          className="video-player"
        />
      </motion.div>
    </motion.div>
  );
};

const SectionHeading = ({ children, subtitle }) => (
  <div className="section-header">
    <motion.h2 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="gradient-text"
    >
      {children}
    </motion.h2>
    {subtitle && <p className="section-subtitle">{subtitle}</p>}
  </div>
);

function App() {
  const { personal, about, skills, projects, experience, volunteering, achievements, career_goals } = content;
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (personal.site_metadata) {
      document.title = personal.site_metadata.title;
      const favicon = document.querySelector('link[rel="icon"]');
      if (favicon) {
        favicon.href = getAssetUrl(personal.site_metadata.favicon);
      }
    }
  }, [personal.site_metadata]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const getAssetUrl = (path) => {
    if (!path || path.startsWith('http')) return path;
    const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
  };

  const hasData = (data) => {
    if (!data) return false;
    if (Array.isArray(data)) return data.length > 0;
    if (typeof data === 'object') return Object.keys(data).length > 0;
    return !!data;
  };

  const activeSections = [
    { id: 'about', label: 'About', show: hasData(about) },
    { id: 'projects', label: 'Projects', show: hasData(projects) },
    { id: 'experience', label: 'Experience', show: hasData(experience) },
    { id: 'volunteering', label: 'Volunteering', show: hasData(volunteering) },
    { id: 'achievements', label: 'Achievements', show: hasData(achievements) },
    { id: 'goals', label: 'Goals', show: hasData(career_goals) },
    { id: 'contact', label: 'Contact', show: true }
  ].filter(s => s.show);

  return (
    <div className="app-container">
      <NeuralNetwork />
      <Navbar theme={theme} toggleTheme={toggleTheme} activeSections={activeSections} />
      
      {/* Hero Section */}
      <section id="hero" className="hero">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="hero-content"
        >
          <div className="hero-profile-container">
            <div className="profile-ring"></div>
            <img src={getAssetUrl(personal.image)} alt={personal.name} className="hero-profile-img" />
          </div>
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="hero-tagline"
          >
            {personal.title}
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="hero-name"
          >
            {personal.name}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="hero-desc"
          >
            {personal.tagline}
          </motion.p>
          
          <div className="hero-actions">
            <div className="cta-buttons">
              {hasData(projects) && (
                <a href="#projects" className="btn btn-primary">
                  View Projects <ChevronRight size={20} />
                </a>
              )}
               <a href={`mailto:${personal.email}`} className="btn btn-secondary">
                Contact Me
              </a>
            </div>
            <div className="hero-cv-actions">
              <a href={getAssetUrl(personal.cv_url)} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                <FileText size={18} /> View CV
              </a>
              <a href={getAssetUrl(personal.cv_url)} download className="btn btn-secondary">
                <Download size={18} /> Download CV
              </a>
            </div>
            
            <div className="hero-social">
              {personal.github && <a href={personal.github} target="_blank" rel="noopener noreferrer" title="GitHub"><Github size={24} /></a>}
              {personal.linkedin && <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn"><Linkedin size={24} /></a>}
              {personal.kaggle && (
                <a href={personal.kaggle} target="_blank" rel="noopener noreferrer" title="Kaggle">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18.825 23.859c-.022.023-.118.023-.146 0l-7.23-10.978-2.453 2.457v8.435c0 .02-.016.035-.035.035h-3.951c-.02 0-.035-.016-.035-.035v-23.717c0-.022.016-.035.035-.035h3.951c.02 0 .035.016.035.035v12.235l2.447-2.45 7.152-11.459c.022-.056.12-.056.146 0h4.425c.023 0 .044.028.026.049l-8.503 12.872 8.653 12.815c.012.02.011.05-.022.05h-4.425z"/></svg>
                </a>
              )}
              {personal.huggingface && (
                <a href={personal.huggingface} target="_blank" rel="noopener noreferrer" title="HuggingFace">
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>🤗</span>
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      {hasData(about) && (
        <section id="about">
          <SectionHeading>About Me</SectionHeading>
          <div className="grid two-col">
            {about.summary && (
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="glass-card about-text"
              >
                <p>{about.summary}</p>
              </motion.div>
            )}
            {about.goals && (
               <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="glass-card about-goals"
              >
                <h3>Future Vision</h3>
                <p>{about.goals}</p>
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* Skills Section */}
      {hasData(skills) && (
        <section id="skills">
          <SectionHeading>Core Skills</SectionHeading>
          <div className="skills-grid">
            {skills.map((skillGroup, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card skill-group"
              >
                <h3>{skillGroup.category}</h3>
                <div className="skill-tags">
                  {skillGroup.items.map((skill, sIdx) => (
                    <span key={sIdx} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Projects Section */}
      {hasData(projects) && (
        <section id="projects">
          <SectionHeading subtitle="Research-oriented & System-level implementations">Featured Projects</SectionHeading>
          <div className="projects-grid">
            {projects.map((project, idx) => (
              <motion.div 
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card project-card"
              >
                <div className="project-image-wrapper">
                  <img src={getAssetUrl(project.image)} alt={project.title} className="project-image" />
                  {project.video && (
                    <button 
                      className="play-demo-btn" 
                      onClick={() => setActiveVideo(getAssetUrl(project.video))}
                      aria-label="Play demo video"
                    >
                      <Play size={24} fill="currentColor" />
                      <span>Play Demo</span>
                    </button>
                  )}
                  <div className="project-type-overlay">{project.type}</div>
                </div>
                <div className="project-content">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="project-tags">
                    {project.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                  </div>
                </div>
                <a 
                  href={project.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="project-link"
                  aria-label={`View ${project.title} on GitHub`}
                >
                  <ExternalLink size={20} />
                </a>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Experience Section */}
      {hasData(experience) && (
        <section id="experience">
          <SectionHeading>Experience & Training</SectionHeading>
          <div className="timeline">
            {experience.map((exp, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="timeline-item glass-card"
              >
                <span className="duration">{exp.duration}</span>
                <h3>{exp.role}</h3>
                <span className="company">{exp.company}</span>
                <ul>
                  {exp.achievements.map((item, iIdx) => <li key={iIdx}>{item}</li>)}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Volunteering Section */}
      {hasData(volunteering) && (
        <section id="volunteering">
          <SectionHeading>Volunteering</SectionHeading>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card"
          >
             {volunteering.map((v, i) => (
               <div key={i}>
                 <h3>{v.role} - {v.organization}</h3>
                 <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{v.description}</p>
               </div>
             ))}
          </motion.div>
        </section>
      )}

      {/* Achievements Section */}
      {hasData(achievements) && (
        <section id="achievements">
          <SectionHeading>Achievements & Certifications</SectionHeading>
          <div className="achievements-list">
            {achievements.map((item, idx) => (
              <div key={idx} className="achievement-item glass-card">
                <ChevronRight size={20} className="accent-text" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Career Goals */}
      {hasData(career_goals) && (
        <section id="goals">
          <SectionHeading>Career Goals</SectionHeading>
          <div className="glass-card">
            <p className="primary-goal">{career_goals.primary}</p>
            <div className="grid two-col">
              {hasData(career_goals.short_term) && (
                <div>
                  <h4 className="gradient-text">Short Term</h4>
                  <ul className="dot-list">
                    {career_goals.short_term.map((g, i) => <li key={i}>{g}</li>)}
                  </ul>
                </div>
              )}
              {hasData(career_goals.long_term) && (
                <div>
                  <h4 className="gradient-text">Long Term</h4>
                  <ul className="dot-list">
                    {career_goals.long_term.map((g, i) => <li key={i}>{g}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <footer id="contact" className="footer">
        <div className="footer-content">
          <SectionHeading>Get In Touch</SectionHeading>
          <p>Interested in collaboration or research opportunities?</p>
          <div className="footer-links">
            <a href={`mailto:${personal.email}`} className="btn btn-primary">
              <Mail size={20} /> Say Hello
            </a>
          </div>
          <div className="footer-social">
             {personal.github && <a href={personal.github} target="_blank" rel="noopener noreferrer"><Github size={24} /></a>}
             {personal.linkedin && <a href={personal.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin size={24} /></a>}
             {personal.kaggle && <a href={personal.kaggle} target="_blank" rel="noopener noreferrer" title="Kaggle"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18.825 23.859c-.022.023-.118.023-.146 0l-7.23-10.978-2.453 2.457v8.435c0 .02-.016.035-.035.035h-3.951c-.02 0-.035-.016-.035-.035v-23.717c0-.022.016-.035.035-.035h3.951c.02 0 .035.016.035.035v12.235l2.447-2.45 7.152-11.459c.022-.056.12-.056.146 0h4.425c.023 0 .044.028.026.049l-8.503 12.872 8.653 12.815c.012.02.011.05-.022.05h-4.425z"/></svg></a>}
             {personal.huggingface && <a href={personal.huggingface} target="_blank" rel="noopener noreferrer" title="HuggingFace"><span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>🤗</span></a>}
          </div>
          <p className="copyright">© {new Date().getFullYear()} {personal.name}</p>
        </div>
      </footer>

      <AnimatePresence>
        {activeVideo && (
          <VideoModal 
            videoUrl={activeVideo} 
            onClose={() => setActiveVideo(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
