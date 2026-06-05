import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, Language } from '../context/LanguageContext';
import { FaChevronDown } from 'react-icons/fa';

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const options: { key: Language; label: string; flag: string }[] = [
    { key: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
    { key: 'en', label: 'English', flag: '🇬🇧' },
  ];

  const currentOption = options.find((opt) => opt.key === language) || options[0];

  const handleSelect = (key: Language) => {
    setLanguage(key);
    setIsOpen(false);
  };

  return (
    <div className="lang-selector-dropdown" ref={dropdownRef}>
      <button 
        type="button" 
        className="btn btn-white lang-dropdown-toggle" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="lang-flag">{currentOption.flag}</span>
        <span className="lang-label">{currentOption.key.toUpperCase()}</span>
        <FaChevronDown className={`lang-chevron ${isOpen ? 'open' : ''}`} />
      </button>

      {isOpen && (
        <ul className="lang-dropdown-menu">
          {options.map((opt) => (
            <li key={opt.key}>
              <button
                type="button"
                className={`lang-dropdown-item ${language === opt.key ? 'active' : ''}`}
                onClick={() => handleSelect(opt.key)}
              >
                <span className="lang-flag">{opt.flag}</span>
                <span className="lang-label">{opt.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
