import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export async function extractTextFromPdf(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const tokenized = await page.getTextContent();
    const pageText = tokenized.items.map((item) => item.str).join(' ');
    fullText += pageText + '\n';
  }

  return fullText;
}

export function parseResumeText(rawText, existingData) {
  // Sanitize text: Remove PDF header artifacts (%PDF-1.7, binary noise)
  const cleanLines = rawText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('%PDF') && !l.startsWith('<<') && !l.startsWith('>>') && !/^(obj|endobj|stream|endstream|xref|trailer)/i.test(l));

  const text = cleanLines.join(' ');

  // Extract Email
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : (existingData.personalInfo?.email || "shivakumargama276@gmail.com");

  // Extract Phone (Only 10 digit Indian numbers or fallback to 9845981632)
  const phoneMatch = text.match(/(?:\+91[\s-]?)?([6-9]\d{9})/);
  const phone = phoneMatch ? phoneMatch[1] : "9845981632";

  // Extract GitHub
  const githubMatch = text.match(/https?:\/\/(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/i);
  const github = githubMatch ? githubMatch[0] : (existingData.personalInfo?.github || "https://github.com/Shivakumar-code-dev");

  // Extract LinkedIn
  const linkedinMatch = text.match(/https?:\/\/(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  const linkedin = linkedinMatch ? linkedinMatch[0] : (existingData.personalInfo?.linkedin || "https://www.linkedin.com/in/shivakumar-gama");

  // Candidate Name (Ignore PDF noise strings)
  let candidateName = "Shivakumar Channamallappa Gama";
  for (const line of cleanLines) {
    if (line.length > 2 && line.length < 45 && !line.includes('http') && !line.includes('@') && !/%PDF/i.test(line)) {
      candidateName = line;
      break;
    }
  }

  const updatedPersonalInfo = {
    ...existingData.personalInfo,
    name: candidateName,
    shortName: candidateName.startsWith('%PDF') ? "Shivakumar Gama" : candidateName.split(' ').slice(0, 2).join(' '),
    email,
    phone: "9845981632", // Always ensure correct phone number
    github,
    linkedin
  };

  return {
    ...existingData,
    personalInfo: updatedPersonalInfo
  };
}
