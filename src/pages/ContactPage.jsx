import ContactForm from '../components/ContactForm.jsx';
import Icon from '../components/Icon.jsx';
import { profile } from '../data/profile.js';

export default function ContactPage() {
  return <section className="container page-section contact-page"><div className="contact-copy"><p className="eyebrow">CONTATO / VAMOS CONVERSAR</p><h1>Boas ideias<br />começam com<br /><span className="serif">uma conversa.</span></h1><p>Tem um projeto, uma oportunidade ou quer trocar uma ideia sobre tecnologia? Deixe sua mensagem.</p><div className="contact-social"><a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">LinkedIn<Icon name="diagonal" size={18} /></a><a href={profile.githubUrl} target="_blank" rel="noopener noreferrer">GitHub<Icon name="diagonal" size={18} /></a></div><span className="contact-signature" aria-hidden="true">ph.</span></div><div className="contact-form-panel"><p className="eyebrow">SUA MENSAGEM</p><ContactForm /></div></section>;
}
