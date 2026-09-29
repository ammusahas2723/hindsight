import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Analyze raw deal text
export const analyzeDeal = async (dealContext: string) => {
  const response = await API.post("/api/ai/analyze-deal", {
    deal_context: dealContext,
  });

  return response.data;
};

// Get all deals
export const getDeals = async () => {
  const response = await API.get("/api/deals/");
  return response.data;
};

// Create a new deal
export const createDeal = async (deal: {
  company: string;
  product: string;
  value: string;
  stage: string;
  health: string;
  source_text?: string;
  intelligence_json?: string;
}) => {
  const response = await API.post("/api/deals/", deal);

  return response.data;
};

// Analyze a specific deal
export const analyzeDealById = async (dealId: number) => {
  const response = await API.post(
    `/api/deals/${dealId}/analyze`
  );

  return response.data;
};

// Detect what changed in a deal
export const getDealChanges = async (dealId: number) => {
  const response = await API.post(
    `/api/deals/${dealId}/changes`
  );

  return response.data;
};

// Generate hindsight intelligence
export const getDealHindsight = async (dealId: number) => {
  const response = await API.post(
    `/api/deals/${dealId}/hindsight`
  );

  return response.data;
};
export const askDealAssistant = async (
  dealId: number,
  question: string
) => {
  const response = await API.post(
    `/api/deals/${dealId}/assistant`,
    {
      question,
    }
  );

  return response.data;
};

export const analyzeProposal = async (content: string) => {
  const response = await API.post(
    "/api/deals/proposal/analyze",
    {
      content: content,
    }
  );

  return response.data;
};

export const getIntelligenceReport = async (
  dealId: number
) => {
  const response = await API.post(
    `/api/deals/${dealId}/report`
  );

  return response.data;
};

export const ingestDealSource = async (
  dealId: number,
  source: {
    source_type: string;
    title: string;
    content: string;
  }
) => {
  const response = await API.post(
    `/api/deals/${dealId}/ingest`,
    source
  );

  return response.data;
};

export const getDealSources = async (
  dealId: number
) => {
  const response = await API.get(
    `/api/deals/${dealId}/sources`
  );

  return response.data;
};
export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const response = await API.post("/api/auth/register", {
    name,
    email,
    password,
  });

  return response.data;
};


export const loginUser = async (
  email: string,
  password: string
) => {
  const response = await API.post("/api/auth/login", {
    email,
    password,
  });

  return response.data;
};

export default API;