document.addEventListener('DOMContentLoaded', () => {

    // ================== I18N (Internationalization) ==================
    const i18nStrings = {
        fr: {
            brand: "Davicen",
            nav: { home: "Accueil", expertise: "Notre expertise", projects: "Projets", teamContact: "Équipe & Contact" },
            hero: { kicker: "Conseil • Développement • IA", headline: "Davicen helps you to transform", ctaPrimary: "Nous contacter", ctaSecondary: "Voir nos projets" },
            expertise: { title: "Notre expertise", items: ["Développement d'application sur mesure", "Analyse de données et conseil", "Intégration d’IA", "Développement d’IA à partir de vos données"] },
            projects: { title: "Nos projets", learnMore: "En savoir plus", collapse: "Réduire" },
            team: { title: "Notre équipe" },
            contact: { title: "Contact", desc: "Parlez-nous de votre besoin. Nous revenons vers vous sous 24h ouvrées.", fields: { name: "Nom complet", email: "Email professionnel", company: "Entreprise (optionnel)", message: "Votre message", consent: "J’accepte que Davicen me recontacte au sujet de ma demande." }, submit: "Envoyer" },
            footer: { legal: "Informations légales", privacy: "Confidentialité", terms: "Conditions", language: "Langue" },
            // Data for complex elements like carousels and teams
            carousel: [
                { title: "Plateforme data temps réel", details: "Ingestion streaming, stockage colonne, tableaux de bord décisionnels et alerting ML." },
                { title: "Application sur mesure B2B", details: "Application multi-tenant avec rôles, API sécurisée et intégrations ERP." },
                { title: "Intégration d’IA", details: "Moteur RAG sur données privées, recherche sémantique et assistants métier." }
            ],
            team: [ { role: "Lead Data" }, { role: "Ingénieur IA" }, { role: "Développeuse Full-Stack" }],
            formMessages: { success: "Merci ! Votre message a bien été envoyé.", error: "Une erreur est survenue. Merci de réessayer." }
        },
        en: {
            brand: "Davicen",
            nav: { home: "Home", expertise: "Our Expertise", projects: "Projects", teamContact: "Team & Contact" },
            hero: { kicker: "Advisory • Development • AI", headline: "Davicen helps you to transform", ctaPrimary: "Contact us", ctaSecondary: "See projects" },
            expertise: { title: "Our Expertise", items: ["Custom application development", "Data analytics and advisory", "AI integration", "AI development from your data"] },
            projects: { title: "Projects", learnMore: "Learn more", collapse: "Collapse" },
            team: { title: "Our Team" },
            contact: { title: "Contact", desc: "Tell us about your needs. We reply within one business day.", fields: { name: "Full name", email: "Work email", company: "Company (optional)", message: "Your message", consent: "I agree to be contacted about my request." }, submit: "Send" },
            footer: { legal: "Legal", privacy: "Privacy", terms: "Terms", language: "Language" },
            carousel: [
                { title: "Real-time data platform", details: "Streaming ingestion, columnar storage, decision dashboards and ML alerting." },
                { title: "Custom B2B application", details: "Multi-tenant app with roles, secure API, and ERP integrations." },
                { title: "AI Integration", details: "RAG on private data, semantic search, and task-specific assistants." }
            ],
            team: [ { role: "Lead Data" }, { role: "AI Engineer" }, { role: "Full-Stack Developer" }],
            formMessages: { success: "Thanks! Your message has been sent.", error: "Something went wrong. Please try again." }
        }
    };

    function getNestedString(obj, path) {
        return path.split('.').reduce((o, key) => (o && o[key] !== 'undefined' ? o[key] : ''), obj);
    }

    function translatePage(lang) {
        if (!i18nStrings[lang]) return;

        // Simple text replacement using data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.textContent = getNestedString(i18nStrings[lang], key);
        });

        // List population
        document.querySelectorAll('[data-i18n-list]').forEach(ul => {
            const key = ul.getAttribute('data-i18n-list');
            const items = getNestedString(i18nStrings[lang], key);
            if (Array.isArray(items)) {
                ul.innerHTML = items.map(item => `<li>${item}</li>`).join('');
            }
        });

        // Complex object population (for carousel titles, details, team roles)
        document.querySelectorAll('[data-i18n-object]').forEach(el => {
            try {
                const config = JSON.parse(el.getAttribute('data-i18n-object'));
                el.textContent = getNestedString(i18nStrings[lang], config.path);
            } catch (e) { console.error('Failed to parse i18n object config', e); }
        });

        // Update active language buttons
        document.querySelectorAll('.lang-switch').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        
        // Update root lang attribute for accessibility
        document.documentElement.lang = lang;
        localStorage.setItem('davicen_lang', lang);
    }

    const initialLang = localStorage.getItem('davicen_lang') || 'fr';
    translatePage(initialLang);

    document.querySelectorAll('.lang-switch').forEach(btn => {
        btn.addEventListener('click', () => {
            translatePage(btn.dataset.lang);
        });
    });
    
    // Toggle details text on open/close
    document.querySelectorAll('#projects details').forEach(detail => {
        detail.addEventListener('toggle', () => {
            const summarySpan = detail.querySelector('summary span');
            const currentLang = document.documentElement.lang;
            if (detail.open) {
                summarySpan.textContent = i18nStrings[currentLang].projects.collapse;
            } else {
                summarySpan.textContent = i18nStrings[currentLang].projects.learnMore;
            }
        });
    });

    // ================== CAROUSEL ==================
    const track = document.querySelector('.carousel-track');
    if(track) {
        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.carousel-button.next');
        const prevButton = document.querySelector('.carousel-button.prev');
        const slideWidth = slides[0].getBoundingClientRect().width;

        const setSlidePosition = (slide, index) => {
            slide.style.left = slideWidth * index + 'px';
        };
        // slides.forEach(setSlidePosition); // Not needed with flexbox approach

        const moveToSlide = (currentSlideIndex, targetSlideIndex) => {
            track.style.transform = 'translateX(-' + (targetSlideIndex * 100) + '%)';
        };

        let currentSlide = 0;
        const maxSlide = slides.length - 1;

        prevButton.addEventListener('click', () => {
            const newSlide = currentSlide === 0 ? maxSlide : currentSlide - 1;
            moveToSlide(currentSlide, newSlide);
            currentSlide = newSlide;
        });

        nextButton.addEventListener('click', () => {
            const newSlide = currentSlide === maxSlide ? 0 : currentSlide + 1;
            moveToSlide(currentSlide, newSlide);
            currentSlide = newSlide;
        });

        // Autoplay
        setInterval(() => {
           nextButton.click();
        }, 5500);
    }
    

    // ================== CONTACT FORM ==================
    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if(form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const currentLang = document.documentElement.lang;
            
            formStatus.textContent = 'Sending...';
            formStatus.className = '';

            try {
                // IMPORTANT: Replace '/api/contact' with your actual endpoint or a service like Formspree
                const response = await fetch(form.getAttribute('action'), {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    formStatus.textContent = i18nStrings[currentLang].formMessages.success;
                    formStatus.classList.add('success');
                    form.reset();
                } else {
                    throw new Error('Network response was not ok.');
                }
            } catch (error) {
                formStatus.textContent = i18nStrings[currentLang].formMessages.error;
                formStatus.classList.add('error');
            }
        });
    }
});