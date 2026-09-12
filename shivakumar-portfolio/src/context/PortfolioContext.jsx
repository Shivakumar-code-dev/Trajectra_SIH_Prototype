import React, { createContext, useContext, useState, useEffect } from 'react';
import * as initialData from '../data/portfolioData';

const PortfolioContext = createContext();

const STORAGE_KEY_DATA = 'shivakumar_custom_portfolio_data_v2';
const STORAGE_KEY_PDF = 'shivakumar_resume_pdf_file';

export function PortfolioProvider({ children }) {
  const [personalInfo, setPersonalInfo] = useState(initialData.personalInfo);
  const [skillsData, setSkillsData] = useState(initialData.skillsData);
  const [featuredProjects, setFeaturedProjects] = useState(initialData.featuredProjects);
  const [internshipProjects, setInternshipProjects] = useState(initialData.internshipProjects);
  const [certificationsData, setCertificationsData] = useState(initialData.certificationsData);
  const [educationData, setEducationData] = useState(initialData.educationData);
  const [achievementsData, setAchievementsData] = useState(initialData.achievementsData);
  
  const [resumePdfDataUrl, setResumePdfDataUrl] = useState(null);

  // Clear any corrupted local storage on startup and enforce clean data
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY_DATA);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        // If name has binary characters or starts with %, purge corrupt storage
        if (parsed.personalInfo && (parsed.personalInfo.name?.includes('%') || parsed.personalInfo.name?.includes('\uFFFD') || !/^[a-zA-Z\s.]+$/.test(parsed.personalInfo.name))) {
          localStorage.removeItem(STORAGE_KEY_DATA);
        } else if (parsed.personalInfo) {
          setPersonalInfo({
            ...parsed.personalInfo,
            name: "Shivakumar Channamallappa Gama",
            shortName: "SHIVAKUMAR GAMA",
            phone: "9845981632"
          });
        }
      }
    } catch (e) {
      localStorage.removeItem(STORAGE_KEY_DATA);
    }
  }, []);

  const updateFullPortfolio = (fullPayload) => {
    // Sanitize personal info
    let cleanName = fullPayload.personalInfo?.name || initialData.personalInfo.name;
    if (cleanName.includes('%') || cleanName.includes('\uFFFD') || !/^[a-zA-Z\s.]+$/.test(cleanName)) {
      cleanName = "Shivakumar Channamallappa Gama";
    }

    const sanitizedPersonalInfo = {
      ...initialData.personalInfo,
      name: cleanName,
      shortName: "SHIVAKUMAR GAMA",
      phone: "9845981632",
      email: "shivakumargama276@gmail.com"
    };

    setPersonalInfo(sanitizedPersonalInfo);
    if (fullPayload.skillsData) setSkillsData(fullPayload.skillsData);
    if (fullPayload.featuredProjects) setFeaturedProjects(fullPayload.featuredProjects);
    if (fullPayload.internshipProjects) setInternshipProjects(fullPayload.internshipProjects);
    if (fullPayload.certificationsData) setCertificationsData(fullPayload.certificationsData);
    if (fullPayload.educationData) setEducationData(fullPayload.educationData);
    if (fullPayload.achievementsData) setAchievementsData(fullPayload.achievementsData);

    try {
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify({
        ...fullPayload,
        personalInfo: sanitizedPersonalInfo
      }));
    } catch (e) {}
  };

  const setResumePdf = (dataUrl) => {
    setResumePdfDataUrl(dataUrl);
    try {
      localStorage.setItem(STORAGE_KEY_PDF, dataUrl);
    } catch (e) {}
  };

  const resetToDefault = () => {
    setPersonalInfo(initialData.personalInfo);
    setSkillsData(initialData.skillsData);
    setFeaturedProjects(initialData.featuredProjects);
    setInternshipProjects(initialData.internshipProjects);
    setCertificationsData(initialData.certificationsData);
    setEducationData(initialData.educationData);
    setAchievementsData(initialData.achievementsData);
    setResumePdfDataUrl(null);

    localStorage.removeItem(STORAGE_KEY_DATA);
    localStorage.removeItem(STORAGE_KEY_PDF);
  };

  return (
    <PortfolioContext.Provider
      value={{
        personalInfo,
        skillsData,
        featuredProjects,
        internshipProjects,
        certificationsData,
        educationData,
        achievementsData,
        resumePdfDataUrl,
        updateFullPortfolio,
        setResumePdf,
        resetToDefault
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}
