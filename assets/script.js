// Consolidated DOMContentLoaded — single listener for all initialization
document.addEventListener('DOMContentLoaded', function() {

    // ── PAGE LOADER ──
    const loader = document.getElementById('page-loader');
    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => loader.classList.add('hidden'), 400);
        });
        // Fallback: hide after 1.5s even if load is slow
        setTimeout(() => loader && loader.classList.add('hidden'), 1500);
    }
    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu && navToggle) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    });

    // FAQ Toggle
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', function() {
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                item.classList.toggle('active');
            });
        }
    });
});

// Native smooth scroll — uses browser's optimised compositor thread (no jank)
function smoothScrollTo(targetPosition) {
    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
}

/** Standalone mobile.html — skip scroll chrome & section animations for smoother scrolling */
function isMobileStandalonePage() {
    return typeof document.body !== 'undefined' && document.body.classList.contains('mobile-page');
}

function getStickyHeaderOffset() {
    const navbar = document.querySelector('.navbar');
    if (navbar) return navbar.offsetHeight;
    const mobileTopbar = document.querySelector('.mobile-topbar');
    if (mobileTopbar) return mobileTopbar.offsetHeight;
    return 0;
}

const ORDER_FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwBlDg_rx5_CWJyr2bKVXfjL2W9fWwwWNI1wZOZz-xwz6OOipo212-RI4X1eXSX2GKHSA/exec';

// Enhanced Smooth Scroll for Navigation Links (desktop index); mobile uses CSS scroll-margin
document.addEventListener('DOMContentLoaded', function() {
    const mobileStandalone = isMobileStandalonePage();

    if (!mobileStandalone) {
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        const scrollIndicator = document.createElement('div');
        scrollIndicator.className = 'scroll-indicator';
        document.body.appendChild(scrollIndicator);
    }

    const scrollIndicatorEl = document.querySelector('.scroll-indicator');

    let scrollTicking = false;
    window.addEventListener('scroll', function() {
        if (!scrollTicking) {
            requestAnimationFrame(function() {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

                if (scrollIndicatorEl) {
                    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
                    const scrollPercent = scrollHeight <= 0 ? 0 : (scrollTop / scrollHeight) * 100;
                    scrollIndicatorEl.style.width = scrollPercent + '%';
                }

                const scrollToTopBtn = document.querySelector('.scroll-to-top');
                if (scrollTop > 500) {
                    scrollToTopBtn?.classList.add('visible');
                } else {
                    scrollToTopBtn?.classList.remove('visible');
                }

                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }, { passive: true });

    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollToTopBtn);

    scrollToTopBtn.addEventListener('click', function() {
        if ('scrollBehavior' in document.documentElement.style) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            smoothScrollTo(0);
        }
    });

    if (!mobileStandalone) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const scrollObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('scroll-animate');
                }
            });
        }, observerOptions);

        document.querySelectorAll('section').forEach(section => {
            scrollObserver.observe(section);
        });
    }
});

// Scroll Animations (merged with scroll-animate observer above)

// Navbar Background on Scroll
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    if (!navbar || isMobileStandalonePage()) return;

    let navTicking = false;
    window.addEventListener('scroll', function() {
        if (!navTicking) {
            requestAnimationFrame(function() {
                if (window.scrollY > 50) {
                    navbar.style.background = 'rgba(2, 6, 23, 0.98)';
                    navbar.style.backdropFilter = 'blur(15px)';
                } else {
                    navbar.style.background = 'rgba(2, 6, 23, 0.95)';
                    navbar.style.backdropFilter = 'blur(10px)';
                }
                navTicking = false;
            });
            navTicking = true;
        }
    }, { passive: true });
});

// CTA Button Click Handlers
document.addEventListener('DOMContentLoaded', function() {
    const skipRipples = isMobileStandalonePage();

    const ctaButtons = document.querySelectorAll('.cta-button');

    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (!this.classList.contains('secondary')) {
                if (skipRipples) return;

                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            }
        });
    });
});

// Workflow Animation — removed setInterval for performance

// Parallax Effect for Hero Section (disabled to prevent section overlap)
// document.addEventListener('DOMContentLoaded', function() {
//     const hero = document.querySelector('.hero');
//     window.addEventListener('scroll', function() {
//         const scrolled = window.pageYOffset;
//         const parallax = scrolled * 0.5;
//         if (hero) {
//             hero.style.transform = `translateY(${parallax}px)`;
//         }
//     });
// });

// Counter Animation for Stats
document.addEventListener('DOMContentLoaded', function() {
    const counters = document.querySelectorAll('.stat-number, .metric-value');
    const durationMs = 700;
    
    const animateCounter = (counter) => {
        const dataTarget = counter.getAttribute('data-count');
        const target = Number.parseInt(dataTarget ?? counter.innerText.replace(/[^0-9]/g, ''), 10);
        if (!Number.isFinite(target) || target < 1) return;

        const suffixAttr = counter.getAttribute('data-suffix');
        const suffix = suffixAttr ?? (counter.innerText.includes('%') ? '%' : '+');

        let startTime = null;
        const updateCounter = (now) => {
            if (startTime === null) startTime = now;
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / durationMs, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.max(0, Math.round(target * eased));
            counter.innerText = value + suffix;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };

        requestAnimationFrame(updateCounter);
    };
    
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
});

// Form Validation (for future contact forms)
document.addEventListener('DOMContentLoaded', function() {
    // This is a placeholder for future form functionality
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.classList.add('error');
                    isValid = false;
                } else {
                    field.classList.remove('error');
                }
            });
            
            if (isValid) {
                // Submit form (placeholder)
                console.log('Form submitted successfully');
                // Here you would typically send the form data to a server
            }
        });
    });
});

// Performance Optimization - Lazy Loading Images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
});

// Order Form Functionality (for order.html)
document.addEventListener('DOMContentLoaded', function() {
    const orderForm = document.getElementById('orderForm');
    
    if (orderForm) {
        console.log('Order form found, attaching submit listener');
        
        // Fix service selection radio buttons
        const serviceOptions = document.querySelectorAll('.service-option');
        serviceOptions.forEach(option => {
            option.addEventListener('click', function(e) {
                const radio = this.querySelector('input[type="radio"]');
                if (radio) {
                    radio.checked = true;
                    radio.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }, { passive: true });
        });
        
        // Form validation and submission
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submit event triggered');
            
            if (validateOrderForm()) {
                console.log('Form validation passed, submitting...');
                submitOrderForm();
            } else {
                console.log('Form validation failed');
            }
        }, { passive: false });
    } else {
        console.log('Order form not found (this is normal on index.html)');
    }
    
    // Form validation function
    function validateOrderForm() {
        clearOrderErrors();
        let isValid = true;
        
        const requiredFields = ['FullName', 'timeline', 'email', 'description'];
        
        console.log('Validating required fields:', requiredFields);
        
        for (const fieldName of requiredFields) {
            const field = document.getElementById(fieldName);
            console.log('Field:', fieldName, 'Element:', field, 'Value:', field?.value);
            if (!field || !field.value.trim()) {
                console.error('Field missing or empty:', fieldName);
                showOrderError(field, 'This field is required');
                isValid = false;
            }
        }
                
        const emailField = document.getElementById('email');
        if (emailField && emailField.value.trim()) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(emailField.value.trim())) {
                console.error('Invalid email:', emailField.value);
                showOrderError(emailField, 'Please enter a valid email address');
                isValid = false;
            }
        }
        
        console.log('Validation result:', isValid);
        return isValid;
    }
    
    // Show error function
    function showOrderError(field, message) {
        if (!field) return;
        
        field.classList.add('error');
        
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }
    
    // Clear errors function
    function clearOrderErrors() {
        if (!orderForm) return;
        
        const errorElements = orderForm.querySelectorAll('.error');
        errorElements.forEach(element => {
            element.classList.remove('error');
        });
        
        const errorMessages = orderForm.querySelectorAll('.error-message');
        errorMessages.forEach(message => {
            message.remove();
        });
    }
    
    // Submit form function
    function submitOrderForm() {
        console.log('submitOrderForm() called');
        console.log('Checking orderForm...');
        if (!orderForm) {
            console.error('submitOrderForm: orderForm not found');
            return;
        }
        console.log('orderForm exists:', orderForm);
        
        console.log('Creating FormData...');
        const formData = new FormData(orderForm);
        const data = {};
        
        console.log('Processing form data...');
        for (const [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        // Map FullName to projectName for compatibility with Apps Script
        if (data.FullName) {
            data.projectName = data.FullName;
        }
        
        data.timestamp = new Date().toISOString();
        
        console.log('Form submitted with data:', data);

        const onSuccess = () => {
            console.log('onSuccess() called');
            showOrderSuccessMessage();
            setTimeout(() => {
                console.log('Showing notification');
                showOrderNotification("Thank you for your interest. Our team will review your request within the selected timeline.");
            }, 2000);
        };

        const onFailure = () => {
            console.log('onFailure() called');
            showOrderNotification('Submission failed. Please try again.');
        };

        if (ORDER_FORM_ENDPOINT) {
            console.log('Sending to:', ORDER_FORM_ENDPOINT);
            console.log('Data:', JSON.stringify(data));
            
            fetch(ORDER_FORM_ENDPOINT, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then((res) => {
                    console.log('Response received:', res);
                    onSuccess();
                })
                .catch((err) => {
                    console.error('Fetch error:', err);
                    onFailure();
                });
        } else {
            console.log('No endpoint configured, showing success');
            onSuccess();
        }
    }
    
    // Show success message
    function showOrderSuccessMessage() {
        if (!orderForm) {
            console.error('orderForm not found');
            return;
        }

        const timelineField = document.getElementById('timeline');
        const timelineLabel = timelineField?.options?.[timelineField.selectedIndex]?.text || 'selected timeline';
        
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <h4>🎉 Order Request Submitted!</h4>
            <p>Thank you for your interest. Our team will review your request within ${timelineLabel}.</p>
        `;
        
        console.log('Inserting success message');
        
        // Try to insert at the beginning of the form
        if (orderForm.firstChild) {
            orderForm.insertBefore(successDiv, orderForm.firstChild);
        } else {
            orderForm.appendChild(successDiv);
        }
        
        orderForm.scrollTop = 0;
        console.log('Success message inserted successfully');
    }
    
    // Show notification (toast)
    function showOrderNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(145deg, rgba(34, 197, 94, 0.95), rgba(22, 163, 74, 0.95));
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 3000;
            max-width: 400px;
            font-family: 'Poppins', sans-serif;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            will-change: transform;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });
        
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
});

// Modal Functionality (for index.html)
document.addEventListener('DOMContentLoaded', function() {
    const orderModal = document.getElementById('orderModal');
    const closeModal = document.getElementById('closeModal');
    const cancelOrder = document.getElementById('cancelOrder');
    
    // Only run modal code if modal exists
    if (!orderModal) {
        console.log('Modal not found (this is normal on order.html)');
        return;
    }
    
    const orderForm = document.getElementById('orderForm');
    
    // Cache DOM elements for better performance
    const cachedElements = {};
    
    function getElement(id) {
        if (!cachedElements[id]) {
            cachedElements[id] = document.getElementById(id);
        }
        return cachedElements[id];
    }
    
    // Fix service selection radio buttons
    const serviceOptions = document.querySelectorAll('.service-option');
    serviceOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            const radio = this.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
                radio.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }, { passive: true });
    });
    
    // Open modal function
    function openModal() {
        if (orderModal) {
            orderModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    // Close modal function
    function closeModalFunc() {
        if (orderModal) {
            orderModal.classList.remove('active');
            document.body.style.overflow = '';
            resetForm();
        }
    }
    
    // Reset form function
    function resetForm() {
        if (orderForm) {
            orderForm.reset();
            clearErrors();
            removeSuccessMessage();
        }
    }
    
    // Clear errors function
    function clearErrors() {
        if (!orderForm) return;
        
        const errorElements = orderForm.querySelectorAll('.error');
        errorElements.forEach(element => {
            element.classList.remove('error');
        });
        
        const errorMessages = orderForm.querySelectorAll('.error-message');
        errorMessages.forEach(message => {
            message.remove();
        });
    }
    
    // Remove success message
    function removeSuccessMessage() {
        if (!orderForm) return;
        
        const successMsg = orderForm.querySelector('.success-message');
        if (successMsg) {
            successMsg.remove();
        }
    }
    
    // Event listeners for modal controls
    if (closeModal) {
        closeModal.addEventListener('click', closeModalFunc, { passive: true });
        console.log('Modal close button found and working');
    } else {
        console.log('Modal close button not found');
    }
    
    if (cancelOrder) {
        cancelOrder.addEventListener('click', closeModalFunc, { passive: true });
        console.log('Cancel order button found and working');
    } else {
        console.log('Cancel order button not found');
    }
    
    // Close modal on overlay click
    if (orderModal) {
        orderModal.addEventListener('click', function(e) {
            if (e.target === orderModal) {
                closeModalFunc();
            }
        }, { passive: true });
    }
    
    // Close modal on Escape key
    const escapeHandler = function(e) {
        if (e.key === 'Escape' && orderModal && orderModal.classList.contains('active')) {
            closeModalFunc();
        }
    };
    document.addEventListener('keydown', escapeHandler, { passive: true });
    
    // Form validation and submission
    if (orderForm) {
        console.log('Order form found, attaching submit listener');
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submit event triggered');
            
            if (validateForm()) {
                console.log('Form validation passed, submitting...');
                submitForm();
            } else {
                console.log('Form validation failed');
            }
        }, { passive: false });
    } else {
        console.error('Order form not found!');
    }
    
    // Form validation function
    function validateForm() {
        clearErrors();
        let isValid = true;
        
        const requiredFields = ['FullName', 'timeline', 'mobile', 'description'];
        
        console.log('Validating required fields:', requiredFields);
        
        for (const fieldName of requiredFields) {
            const field = document.getElementById(fieldName);
            console.log('Field:', fieldName, 'Element:', field, 'Value:', field?.value);
            if (!field || !field.value.trim()) {
                console.error('Field missing or empty:', fieldName);
                showError(field, 'This field is required');
                isValid = false;
            }
        }
                
        const mobileField = document.getElementById('mobile');
        if (mobileField && mobileField.value.trim()) {
            const mobilePattern = /^[\d\s\-\+\(\)]+$/;
            if (!mobilePattern.test(mobileField.value.trim())) {
                console.error('Invalid mobile number:', mobileField.value);
                showError(mobileField, 'Please enter a valid mobile number');
                isValid = false;
            }
        }
        
        console.log('Validation result:', isValid);
        return isValid;
    }
    
    // Show error function
    function showError(field, message) {
        if (!field) return;
        
        field.classList.add('error');
        
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }
    
    // Submit form function
    function submitForm() {
        console.log('submitForm() called');
        console.log('Checking orderForm...');
        if (!orderForm) {
            console.error('submitForm: orderForm not found');
            return;
        }
        console.log('orderForm exists:', orderForm);
        
        console.log('Creating FormData...');
        const formData = new FormData(orderForm);
        const data = {};
        
        console.log('Processing form data...');
        for (const [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        // Map FullName to projectName for compatibility with Apps Script
        if (data.FullName) {
            data.projectName = data.FullName;
        }
        
        data.timestamp = new Date().toISOString();
        
        console.log('Form submitted with data:', data);

        const onSuccess = () => {
            console.log('onSuccess() called');
            showSuccessMessage();
            setTimeout(() => {
                console.log('Showing notification');
                showNotification("Thank you for your interest. Our team will review your request within the selected timeline.");
            }, 2000);
        };

        const onFailure = () => {
            console.log('onFailure() called');
            showNotification('Submission failed. Please try again.');
        };

        if (ORDER_FORM_ENDPOINT) {
            console.log('Sending to:', ORDER_FORM_ENDPOINT);
            console.log('Data:', JSON.stringify(data));
            
            fetch(ORDER_FORM_ENDPOINT, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then((res) => {
                    console.log('Response received:', res);
                    onSuccess();
                })
                .catch((err) => {
                    console.error('Fetch error:', err);
                    onFailure();
                });
        } else {
            console.log('No endpoint configured, showing success');
            onSuccess();
        }
    }
    
    // Show success message in modal
    function showSuccessMessage() {
        if (!orderForm) {
            console.error('orderForm not found');
            return;
        }

        const timelineField = getElement('timeline');
        const timelineLabel = timelineField?.options?.[timelineField.selectedIndex]?.text || 'selected timeline';
        
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <h4>🎉 Order Request Submitted!</h4>
            <p>Thank you for your interest. Our team will review your request within ${timelineLabel}.</p>
        `;
        
        console.log('Inserting success message');
        
        // Try to insert at the beginning of the form
        if (orderForm.firstChild) {
            orderForm.insertBefore(successDiv, orderForm.firstChild);
        } else {
            orderForm.appendChild(successDiv);
        }
        
        orderForm.scrollTop = 0;
        console.log('Success message inserted successfully');
    }
    
    // Show notification (toast)
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(145deg, rgba(34, 197, 94, 0.95), rgba(22, 163, 74, 0.95));
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 3000;
            max-width: 400px;
            font-family: 'Poppins', sans-serif;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            will-change: transform;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });
        
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
});

// Add order buttons to service cards and other elements
document.addEventListener('DOMContentLoaded', function() {
    // Open modal function - accessible globally
    window.openOrderModal = function(serviceName) {
        document.body.style.transition = 'opacity 0.4s ease';
        document.body.style.opacity = '0';
        setTimeout(function() {
            const isMobilePage = document.body.classList.contains('mobile-page') || document.documentElement.classList.contains('mobile-site-root');
            window.location.href = isMobilePage ? 'mobile-order.html' : 'order.html';
        }, 400);
    };
    
    // Scroll to final CTA section function
    function scrollToFinalCTA() {
        const finalCTASection = document.getElementById('final-cta');
        if (finalCTASection) {
            const navbarHeight = getStickyHeaderOffset();
            const offsetTop = finalCTASection.offsetTop - navbarHeight - 20;
            smoothScrollTo(offsetTop);
        }
    }
    
    // View Services button - scroll to services section
    const viewServicesButtons = document.querySelectorAll('.cta-button.secondary');
    viewServicesButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const servicesSection = document.getElementById('services');
            if (servicesSection) {
                const navbarHeight = getStickyHeaderOffset();
                const offsetTop = servicesSection.offsetTop - navbarHeight - 20;
                smoothScrollTo(offsetTop);
            }
        });
    });
    
    console.log('View Services buttons found:', viewServicesButtons.length);
    
    // See How It Works button removed from HTML
    
    // Add order buttons to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        const orderButton = document.createElement('button');
        orderButton.className = 'order-btn';
        orderButton.textContent = 'Order Now';
        orderButton.setAttribute('data-service', card.querySelector('h3').textContent);
        orderButton.type = 'button';
        
        orderButton.style.cssText = `
            background: var(--gradient-primary);
            
             color: var(--secondary-color);
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 600;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 1.5rem;
            font-family: 'Poppins', sans-serif;
        `;
        
        orderButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 10px 25px rgba(103, 232, 249, 0.3)';
        });
        
        orderButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
        
        orderButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            window.openOrderModal();
        });
        
        card.appendChild(orderButton);
    });
    console.log('Service card order buttons added:', serviceCards.length);
    
    // Navigation CTA button - scroll to final CTA section
    const navCTA = document.querySelector('.cta-button.nav-cta');
    if (navCTA) {
        navCTA.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            window.openOrderModal();
        });
        console.log('Navigation CTA button found and working');
    } else {
        console.log('Navigation CTA button not found');
    }
    
    // Add scroll functionality to main CTA buttons (hero section)
    const mainCTAButtons = document.querySelectorAll('.cta-button.primary');
    mainCTAButtons.forEach(button => {
        if (!button.classList.contains('nav-cta')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                window.openOrderModal();
            });
        }
    });
    console.log('Main CTA buttons found:', mainCTAButtons.length);
    
    // Final CTA button - open modal (this is the last section order button)
    const finalCTA = document.querySelector('.final-cta .cta-button.large');
    if (finalCTA) {
        finalCTA.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            window.openOrderModal();
        });
        console.log('Final CTA button found and working');
    } else {
        console.log('Final CTA button not found');
    }
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .cta-button {
        position: relative;
        overflow: hidden;
    }
    
    .nav-menu.active {
        display: flex;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: rgba(2, 6, 23, 0.98);
        backdrop-filter: blur(15px);
        flex-direction: column;
        padding: 2rem;
        border-top: 1px solid var(--card-border);
    }
    
    .nav-toggle.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .nav-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .nav-toggle.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
    
    @media (max-width: 768px) {
        .nav-menu {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(2, 6, 23, 0.98);
            backdrop-filter: blur(15px);
            flex-direction: column;
            padding: 2rem;
            border-top: 1px solid var(--card-border);
            display: none;
        }
        
        .nav-menu.active {
            display: flex;
        }

        body.order-page .nav-menu {
            display: flex;
            position: static;
            flex-direction: row;
            padding: 0;
            border-top: 0;
            background: transparent;
            backdrop-filter: none;
        }
    }
    
    .error {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2) !important;
    }
`;
document.head.appendChild(style);

// Media Showcase Popup Functionality
document.addEventListener('DOMContentLoaded', function() {
    const mediaPopup = document.getElementById('mediaPopup');
    const mediaPopupTitle = document.getElementById('mediaPopupTitle');
    const mediaPopupBody = document.getElementById('mediaPopupBody');
    const mediaPopupClose = document.getElementById('mediaPopupClose');
    
    // Open popup when clicking media showcase items
    const mediaItems = document.querySelectorAll('.media-showcase-item');
    mediaItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Skip if item uses its own inline popup (has a showcase-popup-btn)
            if (this.querySelector('.showcase-popup-btn')) return;
            const type = this.dataset.type;
            const src = this.dataset.src;
            const title = this.dataset.title;
            
            if (mediaPopup && mediaPopupTitle && mediaPopupBody) {
                mediaPopupTitle.textContent = title || 'Media';
                mediaPopupBody.innerHTML = '';
                
                if (type === 'video') {
                    const video = document.createElement('video');
                    video.src = src;
                    video.controls = true;
                    video.style.maxWidth = '100%';
                    video.style.borderRadius = '12px';
                    video.onerror = function() {
                        mediaPopupBody.innerHTML = '<div class="media-popup-fallback"><p>Video coming soon</p><p style="font-size:0.9rem;color:var(--text-muted);margin-top:0.5rem;">Our team is preparing an amazing demo for you</p></div>';
                    };
                    mediaPopupBody.appendChild(video);
                } else if (type === 'image') {
                    const img = document.createElement('img');
                    img.src = src;
                    img.alt = title;
                    img.style.maxWidth = '100%';
                    img.style.borderRadius = '12px';
                    img.onerror = function() {
                        mediaPopupBody.innerHTML = '<div class="media-popup-fallback"><p>Image coming soon</p><p style="font-size:0.9rem;color:var(--text-muted);margin-top:0.5rem;">Project showcase will be available shortly</p></div>';
                    };
                    mediaPopupBody.appendChild(img);
                }
                
                mediaPopup.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Close popup
    function closeMediaPopup() {
        if (mediaPopup) {
            mediaPopup.classList.remove('active');
            document.body.style.overflow = '';
            const video = mediaPopupBody?.querySelector('video');
            if (video) video.pause();
        }
    }
    
    if (mediaPopupClose) {
        mediaPopupClose.addEventListener('click', closeMediaPopup);
    }
    
    if (mediaPopup) {
        mediaPopup.addEventListener('click', function(e) {
            if (e.target === mediaPopup) {
                closeMediaPopup();
            }
        });
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMediaPopup();
        }
    });
    
    // Admin mode toggle (owners only) - press Ctrl+Shift+A to toggle
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'A') {
            document.body.classList.toggle('admin-mode');
        }
    });
});


/* ============================================================
   EFFECTS SYSTEM — index.html only
   ============================================================ */
(function () {
    if (isMobileStandalonePage()) return;

    /* ── 1. PARTICLE BACKGROUND — batched draws, paused when off-screen ── */
    const pCanvas = document.getElementById('particle-canvas');
    if (pCanvas) {
        const pc = pCanvas.getContext('2d', { alpha: true });
        let pw, ph, particles = [];
        let isHeroVisible = true;

        function resizeParticle() {
            pw = pCanvas.width  = window.innerWidth;
            ph = pCanvas.height = window.innerHeight;
        }
        resizeParticle();
        window.addEventListener('resize', resizeParticle, { passive: true });

        // Visibility observer — pause when hero scrolled away
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            const heroObserver = new IntersectionObserver(entries => {
                isHeroVisible = entries[0].isIntersecting;
            }, { threshold: 0 });
            heroObserver.observe(heroSection);
        }

        const PARTICLE_COUNT = 70;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x: Math.random() * pw,
                y: Math.random() * ph,
                r: Math.random() * 2.5 + 0.8,
                dx: (Math.random() - 0.5) * 0.4,
                dy: (Math.random() - 0.5) * 0.4,
                alpha: Math.random() * 0.5 + 0.4,
                color: Math.random() > 0.5 ? '103,232,249' : '56,189,248'
            });
        }

        function drawParticles() {
            if (!isHeroVisible) {
                requestAnimationFrame(drawParticles);
                return;
            }

            pc.clearRect(0, 0, pw, ph);

            // Batch all particles into one path for fewer draw calls
            particles.forEach(p => {
                pc.fillStyle = `rgba(${p.color},${p.alpha})`;
                pc.beginPath();
                pc.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                pc.fill();

                p.x += p.dx; p.y += p.dy;
                if (p.x < 0) p.x = pw;
                if (p.x > pw) p.x = 0;
                if (p.y < 0) p.y = ph;
                if (p.y > ph) p.y = 0;
            });

            requestAnimationFrame(drawParticles);
        }
        drawParticles();
    }

    /* ── 2. MOUSE TRAIL ── optimised: zero-alloc per frame, no shadowBlur */
    const tCanvas = document.getElementById('trail-canvas');
    if (tCanvas) {
        const tc = tCanvas.getContext('2d', { alpha: true });
        let tw, th;
        function resizeTrail() {
            tw = tCanvas.width  = window.innerWidth;
            th = tCanvas.height = window.innerHeight;
        }
        resizeTrail();
        window.addEventListener('resize', resizeTrail, { passive: true });

        const TRAIL_LEN = 20;
        // Pre-allocate fixed-size typed arrays — no GC pressure
        const trailX = new Float32Array(TRAIL_LEN);
        const trailY = new Float32Array(TRAIL_LEN);
        let   trailCount = 0;
        let   trailHead  = 0; // ring-buffer head index

        let mouseX = tw / 2, mouseY = th / 2;
        let smoothX = tw / 2, smoothY = th / 2;
        let hasMoved = false;

        window.addEventListener('mousemove', e => {
            mouseX   = e.clientX;
            mouseY   = e.clientY;
            hasMoved = true;
        }, { passive: true });

        // Pre-built colour strings — no string concat per frame
        const CURSOR_FILL   = '#3b82f6';
        const CURSOR_RING   = 'rgba(59,130,246,0.45)';
        const TRAIL_HEAD_C  = 'rgba(59,130,246,1)';
        const TRAIL_TAIL_C  = 'rgba(59,130,246,0)';

        // Cache last gradient endpoints to avoid recreating when cursor is still
        let lastGx0 = -1, lastGy0 = -1, lastGx1 = -1, lastGy1 = -1;
        let cachedGrad = null;

        function drawTrail() {
            // Lerp 0.88 — tight to cursor, still smooths micro-jitter
            smoothX += (mouseX - smoothX) * 0.88;
            smoothY += (mouseY - smoothY) * 0.88;

            if (hasMoved) {
                // Ring-buffer insert — no array shift/splice
                const idx = trailHead % TRAIL_LEN;
                trailX[idx] = smoothX;
                trailY[idx] = smoothY;
                trailHead++;
                if (trailCount < TRAIL_LEN) trailCount++;
            }

            tc.clearRect(0, 0, tw, th);

            // ── Trail line ──
            if (trailCount >= 3) {
                // Oldest point in ring buffer
                const start = trailHead - trailCount;

                const i0  = ((start)     % TRAIL_LEN + TRAIL_LEN) % TRAIL_LEN;
                const iN  = ((trailHead - 1) % TRAIL_LEN + TRAIL_LEN) % TRAIL_LEN;
                const x0  = trailX[i0], y0 = trailY[i0];
                const xN  = trailX[iN], yN = trailY[iN];

                // Reuse gradient if endpoints haven't moved meaningfully
                const dx0 = x0 - lastGx0, dy0 = y0 - lastGy0;
                const dx1 = xN - lastGx1, dy1 = yN - lastGy1;
                if (!cachedGrad || dx0*dx0+dy0*dy0 > 4 || dx1*dx1+dy1*dy1 > 4) {
                    cachedGrad = tc.createLinearGradient(x0, y0, xN, yN);
                    cachedGrad.addColorStop(0,   TRAIL_TAIL_C);
                    cachedGrad.addColorStop(0.55, 'rgba(59,130,246,0.38)');
                    cachedGrad.addColorStop(1,   TRAIL_HEAD_C);
                    lastGx0 = x0; lastGy0 = y0;
                    lastGx1 = xN; lastGy1 = yN;
                }

                tc.beginPath();
                const i0abs = ((start + 0) % TRAIL_LEN + TRAIL_LEN) % TRAIL_LEN;
                tc.moveTo(trailX[i0abs], trailY[i0abs]);

                for (let k = 1; k < trailCount - 1; k++) {
                    const ia = ((start + k)     % TRAIL_LEN + TRAIL_LEN) % TRAIL_LEN;
                    const ib = ((start + k + 1) % TRAIL_LEN + TRAIL_LEN) % TRAIL_LEN;
                    const mx = (trailX[ia] + trailX[ib]) * 0.5;
                    const my = (trailY[ia] + trailY[ib]) * 0.5;
                    tc.quadraticCurveTo(trailX[ia], trailY[ia], mx, my);
                }
                const iLast = ((trailHead - 1) % TRAIL_LEN + TRAIL_LEN) % TRAIL_LEN;
                tc.lineTo(trailX[iLast], trailY[iLast]);

                tc.strokeStyle = cachedGrad;
                tc.lineWidth   = 3.5;
                tc.lineCap     = 'round';
                tc.lineJoin    = 'round';
                tc.stroke();
            }

            // ── Cursor dot at raw mouse position — zero lag ──
            // Glow ring (no shadowBlur — use a second arc stroke instead)
            tc.beginPath();
            tc.arc(mouseX, mouseY, 10, 0, Math.PI * 2);
            tc.strokeStyle = CURSOR_RING;
            tc.lineWidth   = 2;
            tc.stroke();

            // Solid dot
            tc.beginPath();
            tc.arc(mouseX, mouseY, 5, 0, Math.PI * 2);
            tc.fillStyle = CURSOR_FILL;
            tc.fill();

            requestAnimationFrame(drawTrail);
        }
        drawTrail();
    }

    /* ── 3. PAGE TRANSITIONS ── */
    const overlay = document.getElementById('pageTransitionOverlay');
    if (overlay) {
        // Slide out on load
        overlay.classList.add('slide-in');
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                overlay.classList.remove('slide-in');
                overlay.classList.add('slide-out');
                setTimeout(() => overlay.classList.remove('slide-out'), 600);
            });
        });

        // Intercept internal links
        document.querySelectorAll('a[href]').forEach(link => {
            const href = link.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const target = this.href;
                overlay.classList.add('slide-in');
                setTimeout(() => { window.location.href = target; }, 520);
            });
        });
    }

    /* ── 4. SMOOTH SCROLL PARALLAX — data-parallax elements only, not hero ── */
    let lastScrollY = 0;
    let parallaxTicking = false;

    const parallaxEls = document.querySelectorAll('[data-parallax]');
    if (parallaxEls.length > 0) {
        window.addEventListener('scroll', () => {
            lastScrollY = window.scrollY;
            if (!parallaxTicking) {
                requestAnimationFrame(() => {
                    parallaxEls.forEach(el => {
                        const speed = parseFloat(el.dataset.parallax) || 0.2;
                        const rect = el.getBoundingClientRect();
                        const center = rect.top + rect.height / 2 - window.innerHeight / 2;
                        el.style.transform = `translateY(${center * speed}px)`;
                    });
                    parallaxTicking = false;
                });
                parallaxTicking = true;
            }
        }, { passive: true });
    }

    /* ── 5. 3D HOVER TRANSFORM — service cards ── */
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const rotX = ((y - cy) / cy) * -10;
            const rotY = ((x - cx) / cx) * 10;
            this.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px) scale(1.02)`;
            this.style.boxShadow = `0 20px 60px rgba(103,232,249,0.2), ${-rotY}px ${-rotX}px 30px rgba(8,145,178,0.15)`;
        });
        card.addEventListener('mouseleave', function () {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });

    /* ── 6. MAGNETIC BUTTONS ── */
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
        btn.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            this.style.transform = `translate(${x * 0.28}px, ${y * 0.28}px)`;
        });
        btn.addEventListener('mouseleave', function () {
            this.style.transform = '';
        });
    });

    /* ── 7. SCROLL ANIMATIONS ── */
    // Add classes to elements
    document.querySelectorAll('.problem-card').forEach((el, i) => {
        el.classList.add('scroll-reveal', `delay-${Math.min(i + 1, 4)}`);
    });
    document.querySelectorAll('.service-card').forEach((el, i) => {
        el.classList.add('scroll-reveal', `delay-${Math.min(i + 1, 4)}`);
    });
    document.querySelectorAll('.benefit-card').forEach((el, i) => {
        el.classList.add('scroll-reveal', `delay-${Math.min(i + 1, 4)}`);
    });
    document.querySelectorAll('.case-card').forEach((el, i) => {
        el.classList.add('scroll-reveal', `delay-${Math.min(i + 1, 4)}`);
    });
    document.querySelectorAll('.testimonial-card').forEach((el, i) => {
        el.classList.add('scroll-reveal', `delay-${Math.min(i + 1, 4)}`);
    });
    document.querySelectorAll('.process-step').forEach((el, i) => {
        el.classList.add('scroll-reveal', `delay-${Math.min(i + 1, 4)}`);
    });
    document.querySelectorAll('.stat-box').forEach((el, i) => {
        el.classList.add('scroll-reveal', `delay-${Math.min(i + 1, 4)}`);
    });
    document.querySelectorAll('.solution-text').forEach(el => {
        el.classList.add('scroll-reveal-left');
    });
    document.querySelectorAll('.solution-media').forEach(el => {
        el.classList.add('scroll-reveal-right');
    });
    document.querySelectorAll('.section-title, .section-subtitle').forEach(el => {
        el.classList.add('scroll-reveal');
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right').forEach(el => {
        revealObserver.observe(el);
    });

})();


/* ============================================================
   MOBILE EFFECTS — mobile.html only
   ============================================================ */
(function () {
    if (!isMobileStandalonePage()) return;

    /* ── PARTICLE BACKGROUND ── */
    const mpCanvas = document.getElementById('mobile-particle-canvas');
    if (mpCanvas) {
        const mpc = mpCanvas.getContext('2d');
        const shell = mpCanvas.parentElement;
        let mpw, mph, mParticles = [];

        function resizeMobileParticle() {
            mpw = mpCanvas.width  = shell.offsetWidth;
            mph = mpCanvas.height = shell.scrollHeight;
        }
        resizeMobileParticle();
        window.addEventListener('resize', resizeMobileParticle, { passive: true });
        // Re-measure after content loads
        window.addEventListener('load', resizeMobileParticle, { passive: true });

        // Fewer particles on mobile for performance
        const MP_COUNT = 80;
        for (let i = 0; i < MP_COUNT; i++) {
            mParticles.push({
                x: Math.random() * mpw,
                y: Math.random() * mph,
                r: Math.random() * 3 + 1,
                dx: (Math.random() - 0.5) * 0.4,
                dy: (Math.random() - 0.5) * 0.4,
                alpha: Math.random() * 0.4 + 0.55,
                color: Math.random() > 0.5 ? '103,232,249' : '56,189,248'
            });
        }

        function drawMobileParticles() {
            mpc.clearRect(0, 0, mpw, mph);
            mParticles.forEach(p => {
                mpc.beginPath();
                mpc.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                mpc.fillStyle = `rgba(${p.color},${p.alpha})`;
                mpc.shadowBlur = 10;
                mpc.shadowColor = `rgba(${p.color},0.8)`;
                mpc.fill();
                mpc.shadowBlur = 0;
                p.x += p.dx; p.y += p.dy;
                if (p.x < 0) p.x = mpw;
                if (p.x > mpw) p.x = 0;
                if (p.y < 0) p.y = mph;
                if (p.y > mph) p.y = 0;
            });
            requestAnimationFrame(drawMobileParticles);
        }
        drawMobileParticles();
    }

    /* ── SCROLL REVEAL ── */
    const mRevealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                mRevealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    // Add reveal class to mobile cards and headings
    document.querySelectorAll(
        '.mobile-service-card, .mobile-tile, .mobile-case-card, ' +
        '.mobile-quote-card, .mobile-section-heading'
    ).forEach((el, i) => {
        el.classList.add('mobile-reveal');
        el.style.transitionDelay = `${(i % 4) * 0.08}s`;
        mRevealObserver.observe(el);
    });

    /* ── 3D TILT ON CARDS (touch-friendly) ── */
    document.querySelectorAll('.mobile-service-card, .mobile-case-card').forEach(card => {
        card.addEventListener('touchstart', function (e) {
            const touch = e.touches[0];
            const rect = this.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const rotX = ((y - cy) / cy) * -6;
            const rotY = ((x - cx) / cx) * 6;
            this.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
            this.style.transition = 'transform 0.15s ease';
        }, { passive: true });

        card.addEventListener('touchend', function () {
            this.style.transform = '';
            this.style.transition = 'transform 0.4s cubic-bezier(0.23,1,0.32,1)';
        }, { passive: true });
    });

})();
