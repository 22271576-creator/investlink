import { InvestorProfile, StartupProfile } from "../types";

export interface MatchResult {
  totalScore: number;
  industryScore: number;
  stageScore: number;
  ticketScore: number;
  regionScore: number;
  riskScore: number;
  explanations: string[];
}

export const calculateMatch = (
  investor: InvestorProfile,
  startup: StartupProfile,
  riskOverride?: "Low" | "Medium" | "High",
): MatchResult => {
  let industryScore = 0;
  let stageScore = 0;
  let ticketScore = 0;
  let regionScore = 0;
  let riskScore = 0;
  const explanations: string[] = [];

  // 1. Industry (0-30)
  if (investor.preferredIndustries.includes(startup.industry)) {
    industryScore = 30;
    explanations.push(`Industry match: ${startup.industry}`);
  } else if (investor.preferredIndustries.includes("Other")) {
    industryScore = 15;
    explanations.push(`Industry partial match: Investor accepts 'Other'`);
  }

  // 2. Stage (0-20)
  const stageOrder = ["Idea", "MVP", "Traction", "Scaling"];
  if (investor.stagePreference.includes(startup.stage)) {
    stageScore = 20;
    explanations.push(`Stage fit: ${startup.stage} aligns`);
  } else {
    // Check adjacent
    const startupStageIdx = stageOrder.indexOf(startup.stage);
    const hasAdjacent = investor.stagePreference.some((pref) => {
      const prefIdx = stageOrder.indexOf(pref);
      return Math.abs(prefIdx - startupStageIdx) === 1;
    });
    if (hasAdjacent) {
      stageScore = 10;
      explanations.push(
        `Stage fit: ${startup.stage} is adjacent to preferences`,
      );
    }
  }

  // 3. Ticket Fit (0-20)
  if (
    startup.fundingNeeded >= investor.ticketMin &&
    startup.fundingNeeded <= investor.ticketMax
  ) {
    ticketScore = 20;
    explanations.push(
      `Ticket fit: €${startup.fundingNeeded.toLocaleString()} within €${investor.ticketMin.toLocaleString()}–€${investor.ticketMax.toLocaleString()}`,
    );
  } else if (
    startup.fundingNeeded <= investor.ticketMax &&
    startup.fundingNeeded < investor.ticketMin
  ) {
    ticketScore = 10;
    explanations.push(
      `Ticket fit: €${startup.fundingNeeded.toLocaleString()} is below minimum but within max`,
    );
  } else if (
    startup.fundingNeeded > investor.ticketMax &&
    startup.fundingNeeded <= investor.ticketMax * 1.2
  ) {
    ticketScore = 8;
    explanations.push(
      `Ticket fit: €${startup.fundingNeeded.toLocaleString()} is slightly above max ticket`,
    );
  }

  // 4. Region (0-15)
  const europe = ["Spain", "UK", "Germany", "France"];
  const latam = ["Panama", "Mexico", "Colombia", "Brazil"];
  const na = ["USA"];

  let startupRegion = "Other";
  if (europe.includes(startup.country)) startupRegion = "Europe";
  else if (latam.includes(startup.country)) startupRegion = "LATAM";
  else if (na.includes(startup.country)) startupRegion = "North America";

  if (investor.preferredRegions.includes("Global")) {
    regionScore = 15;
    explanations.push(`Region fit: Investor is Global`);
  } else if (investor.preferredRegions.includes(startupRegion as any)) {
    regionScore = 15;
    explanations.push(`Region fit: ${startupRegion}`);
  }

  // 5. Risk Fit (0-15)
  const riskCount = startup.riskTags.length;
  let startupRiskLevel = "Low";
  if (riskCount >= 3 && riskCount <= 5) startupRiskLevel = "Medium";
  if (riskCount >= 6) startupRiskLevel = "High";

  const investorRisk = riskOverride || investor.riskTolerance;
  const riskLevels = ["Low", "Medium", "High"];
  const sRiskIdx = riskLevels.indexOf(startupRiskLevel);
  const iRiskIdx = riskLevels.indexOf(investorRisk);

  if (sRiskIdx === iRiskIdx) {
    riskScore = 15;
    explanations.push(`Risk fit: ${startupRiskLevel} matches your tolerance`);
  } else if (Math.abs(sRiskIdx - iRiskIdx) === 1) {
    riskScore = 8;
    explanations.push(
      `Risk fit: ${startupRiskLevel} is one level off your tolerance`,
    );
  }

  if (startup.verificationStatus === "verified") {
    explanations.push(`Verified profile increases trust`);
  }

  const totalScore =
    industryScore + stageScore + ticketScore + regionScore + riskScore;

  return {
    totalScore,
    industryScore,
    stageScore,
    ticketScore,
    regionScore,
    riskScore,
    explanations,
  };
};
