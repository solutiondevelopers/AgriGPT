import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Landmark, ArrowRight, CheckCircle, ExternalLink, ShieldCheck, HandCoins, Tractor } from 'lucide-react';

type SchemeCategory = 'finance' | 'insurance' | 'equipment';

interface Scheme {
  id: number;
  category: SchemeCategory;
  icon: React.FC<any>;
  title: { en: string; hi: string; mr: string };
  desc: { en: string; hi: string; mr: string };
  eligibility: { en: string; hi: string; mr: string };
  link: string;
}

const SCHEMES: Scheme[] = [
  {
    id: 1,
    category: 'finance',
    icon: HandCoins,
    title: {
      en: 'PM-KISAN Samman Nidhi',
      hi: 'पीएम-किसान सम्मान निधि',
      mr: 'पीएम-किसान सन्मान निधी'
    },
    desc: {
      en: 'Income support of ₹6,000 per year for all landholding farmer families, provided in three equal installments.',
      hi: 'सभी भूमिधारक किसान परिवारों के लिए प्रति वर्ष ₹6,000 की आय सहायता, जो तीन समान किस्तों में दी जाती है।',
      mr: 'सर्व भूधारक शेतकरी कुटुंबांसाठी प्रति वर्ष ₹६,००० चे उत्पन्न समर्थन, तीन समान हप्त्यांमध्ये दिले जाते.'
    },
    eligibility: {
      en: 'All landholding farmers',
      hi: 'सभी भूमिधारक किसान',
      mr: 'सर्व भूधारक शेतकरी'
    },
    link: 'https://pmkisan.gov.in/'
  },
  {
    id: 2,
    category: 'insurance',
    icon: ShieldCheck,
    title: {
      en: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
      hi: 'प्रधानमंत्री फसल बीमा योजना (PMFBY)',
      mr: 'प्रधानमंत्री पीक विमा योजना (PMFBY)'
    },
    desc: {
      en: 'Comprehensive crop insurance against non-preventable natural risks from pre-sowing to post-harvest stage.',
      hi: 'बुवाई से पहले से लेकर कटाई के बाद तक गैर-रोकथाम योग्य प्राकृतिक जोखिमों के खिलाफ व्यापक फसल बीमा।',
      mr: 'पेरणीपूर्व ते काढणीपश्चात टप्प्यापर्यंत टाळता न येणाऱ्या नैसर्गिक धोक्यांपासून सर्वसमावेशक पीक विमा.'
    },
    eligibility: {
      en: 'All farmers growing notified crops',
      hi: 'अधिसूचित फसलें उगाने वाले सभी किसान',
      mr: 'अधिसूचित पिके घेणारे सर्व शेतकरी'
    },
    link: 'https://pmfby.gov.in/'
  },
  {
    id: 3,
    category: 'finance',
    icon: Landmark,
    title: {
      en: 'Kisan Credit Card (KCC)',
      hi: 'किसान क्रेडिट कार्ड (KCC)',
      mr: 'किसान क्रेडिट कार्ड (KCC)'
    },
    desc: {
      en: 'Provides farmers with timely access to credit for agricultural needs with flexible and simplified procedures.',
      hi: 'किसानों को कृषि जरूरतों के लिए लचीली और सरल प्रक्रियाओं के साथ समय पर ऋण तक पहुंच प्रदान करता है।',
      mr: 'शेतकऱ्यांना शेतीच्या गरजांसाठी लवचिक आणि सोप्या प्रक्रियेसह वेळेवर कर्ज उपलब्ध करून देते.'
    },
    eligibility: {
      en: 'Farmers, Tenant farmers, Sharecroppers',
      hi: 'किसान, किरायेदार किसान, बटाईदार',
      mr: 'शेतकरी, कुळ शेतकरी, बटाईदार'
    },
    link: 'https://sbi.co.in/web/agri-rural/agriculture-banking/crop-loan/kisan-credit-card'
  },
  {
    id: 4,
    category: 'equipment',
    icon: Tractor,
    title: {
      en: 'Sub-Mission on Agricultural Mechanization (SMAM)',
      hi: 'कृषि मशीनीकरण पर उप-मिशन (SMAM)',
      mr: 'कृषी यांत्रिकीकरणावरील उप-अभियान (SMAM)'
    },
    desc: {
      en: 'Subsidy on purchase of agricultural machinery and equipment like tractors, tillers, and harvesters.',
      hi: 'ट्रैक्टर, टिलर और हार्वेस्टर जैसी कृषि मशीनरी और उपकरणों की खरीद पर सब्सिडी।',
      mr: 'ट्रॅक्टर, टिलर आणि हार्वेस्टर यांसारखी कृषी यंत्रे आणि उपकरणे खरेदी करण्यासाठी सबसिडी.'
    },
    eligibility: {
      en: 'All categories of farmers (higher subsidy for small/marginal)',
      hi: 'किसानों की सभी श्रेणियां (छोटे/सीमांत के लिए अधिक सब्सिडी)',
      mr: 'शेतकऱ्यांच्या सर्व श्रेणी (लहान/अल्पभूधारकांसाठी जास्त सबसिडी)'
    },
    link: 'https://agrimachinery.nic.in/'
  }
];

export function GovSchemes() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<SchemeCategory | 'all'>('all');

  const tabs = [
    { id: 'all', label: { en: 'All Schemes', hi: 'सभी योजनाएं', mr: 'सर्व योजना' } },
    { id: 'finance', label: { en: 'Financial Aid', hi: 'वित्तीय सहायता', mr: 'आर्थिक मदत' } },
    { id: 'insurance', label: { en: 'Crop Insurance', hi: 'फसल बीमा', mr: 'पीक विमा' } },
    { id: 'equipment', label: { en: 'Equipment', hi: 'उपकरण', mr: 'उपकरणे' } },
  ];

  const filteredSchemes = activeTab === 'all' 
    ? SCHEMES 
    : SCHEMES.filter(s => s.category === activeTab);

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-500 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Landmark className="w-8 h-8 text-emerald-600" />
            {language === 'hi' ? 'सरकारी योजनाएं और सेवाएं' : language === 'mr' ? 'सरकारी योजना आणि सेवा' : 'Government Schemes & Services'}
          </h1>
          <p className="text-slate-600 mt-2 font-medium text-sm sm:text-base">
            {language === 'hi' ? 'खोजें, जानें और लाभ उठाएं' : language === 'mr' ? 'शोधा, जाणून घ्या आणि लाभ मिळवा' : 'Discover, learn, and avail benefits of agricultural initiatives.'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto scrollbar-none gap-2 pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-3 min-h-[48px] rounded-xl whitespace-nowrap text-sm font-bold transition-all \${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label[language as 'en'|'hi'|'mr'] || tab.label.en}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {filteredSchemes.map(scheme => {
          const Icon = scheme.icon;
          return (
            <div key={scheme.id} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-shadow flex flex-col h-full">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                    {scheme.title[language as 'en'|'hi'|'mr'] || scheme.title.en}
                  </h3>
                  <div className="inline-block mt-2 px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-600 capitalize">
                    {scheme.category}
                  </div>
                </div>
              </div>
              
              <div className="mt-5 flex-1">
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {scheme.desc[language as 'en'|'hi'|'mr'] || scheme.desc.en}
                </p>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-slate-700 font-medium">
                      <span className="font-bold text-slate-900">
                        {language === 'hi' ? 'पात्रता: ' : language === 'mr' ? 'पात्रता: ' : 'Eligibility: '}
                      </span>
                      {scheme.eligibility[language as 'en'|'hi'|'mr'] || scheme.eligibility.en}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <a 
                  href={scheme.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-emerald-50 text-emerald-700 font-bold px-6 py-4 min-h-[56px] text-lg rounded-xl border border-slate-200 hover:border-emerald-200 transition-all"
                >
                  {language === 'hi' ? 'अधिक जानें' : language === 'mr' ? 'अधिक माहिती' : 'Know More'}
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
