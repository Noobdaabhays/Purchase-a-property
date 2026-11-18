import express from 'express';
import type { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import {
  INITIAL_PROPERTIES,
  INITIAL_SITE_VISITS,
  INITIAL_ENQUIRIES,
  INITIAL_LEADS,
  INITIAL_NOTIFICATIONS
} from './src/data/initialData.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory + file-backed database storage path
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.resolve(DATA_DIR, 'db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface ServerState {
  properties: any[];
  siteVisits: any[];
  enquiries: any[];
  leads: any[];
  notifications: any[];
}

function loadDatabase(): ServerState {
  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed.properties && parsed.properties.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.error('Failed to parse db.json, initializing fresh store:', e);
    }
  }
  const defaultState: ServerState = {
    properties: INITIAL_PROPERTIES,
    siteVisits: INITIAL_SITE_VISITS,
    enquiries: INITIAL_ENQUIRIES,
    leads: INITIAL_LEADS,
    notifications: INITIAL_NOTIFICATIONS
  };
  saveDatabase(defaultState);
  return defaultState;
}

function saveDatabase(state: ServerState) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write db.json:', e);
  }
}

let db = loadDatabase();

async function startServer() {
  const app = express();
  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Dedicated deployment ZIP download endpoint with Content-Disposition attachment
  app.get(['/download-zip', '/download', '/api/download-deployment-zip'], (_req: Request, res: Response) => {
    const zipPath = path.resolve(__dirname, 'public', 'purchase-a-property-deployment.zip');
    if (fs.existsSync(zipPath)) {
      res.setHeader('Content-Type', 'application/zip');
      res.download(zipPath, 'purchase-a-property-deployment.zip');
    } else {
      res.status(404).json({ error: 'ZIP file not found' });
    }
  });

  // Properties API
  app.get('/api/properties', (req: Request, res: Response) => {
    let result = db.properties.length > 0 ? [...db.properties] : [];
    const { type, city, minPrice, maxPrice, listingType } = req.query;

    if (listingType && listingType !== 'all') {
      result = result.filter((p) => p.listingType === listingType);
    }
    if (type && type !== 'all') {
      result = result.filter((p) => p.propertyType?.toLowerCase() === String(type).toLowerCase());
    }
    if (city && city !== 'all') {
      result = result.filter((p) => p.city?.toLowerCase().includes(String(city).toLowerCase()));
    }
    if (minPrice) {
      result = result.filter((p) => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      result = result.filter((p) => p.price <= Number(maxPrice));
    }

    res.json(result);
  });

  app.get('/api/properties/:id', (req: Request, res: Response) => {
    const prop = db.properties.find((p) => p.id === req.params.id);
    if (!prop) {
      return res.status(404).json({ error: 'Property not found' });
    }
    prop.viewCount = (prop.viewCount || 0) + 1;
    saveDatabase(db);
    res.json(prop);
  });

  app.post('/api/properties', (req: Request, res: Response) => {
    const newProp = {
      ...req.body,
      id: `prop-${Date.now()}`,
      listedDate: new Date().toISOString().split('T')[0],
      lastUpdatedDate: new Date().toISOString().split('T')[0],
      viewCount: 1,
      likesCount: 0,
      savesCount: 0
    };
    db.properties.unshift(newProp);
    saveDatabase(db);
    res.status(201).json(newProp);
  });

  app.put('/api/properties/:id', (req: Request, res: Response) => {
    const idx = db.properties.findIndex((p) => p.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Property not found' });
    }
    db.properties[idx] = {
      ...db.properties[idx],
      ...req.body,
      lastUpdatedDate: new Date().toISOString().split('T')[0]
    };
    saveDatabase(db);
    res.json(db.properties[idx]);
  });

  app.delete('/api/properties/:id', (req: Request, res: Response) => {
    db.properties = db.properties.filter((p) => p.id !== req.params.id);
    saveDatabase(db);
    res.json({ success: true, message: 'Property deleted' });
  });

  // Enquiries API
  app.get('/api/enquiries', (_req: Request, res: Response) => {
    res.json(db.enquiries);
  });

  app.post('/api/enquiries', (req: Request, res: Response) => {
    const enquiry = {
      ...req.body,
      id: `enq-${Date.now()}`,
      status: 'new',
      createdAt: new Date().toISOString()
    };
    db.enquiries.unshift(enquiry);

    // Auto-create lead
    const lead = {
      id: `lead-${Date.now()}`,
      customerName: enquiry.customerName,
      email: enquiry.customerEmail,
      phone: enquiry.customerPhone,
      propertyId: enquiry.propertyId,
      propertyTitle: enquiry.propertyTitle,
      leadSource: 'website_enquiry',
      status: 'new',
      priority: 'high',
      assignedAgentId: 'agent-marcus',
      assignedAgentName: 'Marcus Vance',
      notes: [{ id: `n-${Date.now()}`, author: 'System', content: enquiry.message, createdAt: new Date().toLocaleDateString() }],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    db.leads.unshift(lead);
    saveDatabase(db);

    res.status(201).json({ enquiry, lead });
  });

  // Site visits API
  app.get('/api/site-visits', (_req: Request, res: Response) => {
    res.json(db.siteVisits);
  });

  app.post('/api/site-visits', (req: Request, res: Response) => {
    const { propertyId, date, timeSlot } = req.body;
    const conflict = db.siteVisits.some(
      (v) => v.propertyId === propertyId && v.date === date && v.timeSlot === timeSlot && v.status !== 'cancelled'
    );
    if (conflict) {
      return res.status(409).json({ error: 'Conflict: Slot already booked' });
    }

    const visit = {
      ...req.body,
      id: `sv-${Date.now()}`,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };
    db.siteVisits.unshift(visit);
    saveDatabase(db);
    res.status(201).json(visit);
  });

  // CRM Leads API
  app.get('/api/leads', (_req: Request, res: Response) => {
    res.json(db.leads);
  });

  app.put('/api/leads/:id', (req: Request, res: Response) => {
    const idx = db.leads.findIndex((l) => l.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    db.leads[idx] = {
      ...db.leads[idx],
      ...req.body,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    saveDatabase(db);
    res.json(db.leads[idx]);
  });

  // Analytics & Stats API
  app.get('/api/stats', (_req: Request, res: Response) => {
    const totalProperties = db.properties.length;
    const activeProperties = db.properties.filter((p) => p.status === 'available').length;
    const soldProperties = db.properties.filter((p) => p.status === 'sold').length;
    const rentedProperties = db.properties.filter((p) => p.status === 'rented').length;
    const totalLeads = db.leads.length;
    const closedDeals = db.leads.filter((l) => l.status === 'deal_closed').length;
    const siteVisitsCount = db.siteVisits.length;
    const completedVisits = db.siteVisits.filter((v) => v.status === 'completed').length;

    res.json({
      totalProperties,
      activeProperties,
      soldProperties,
      rentedProperties,
      totalLeads,
      closedDeals,
      siteVisitsCount,
      completedVisits,
      totalVolumeUSD: db.properties.reduce((acc, p) => acc + (p.price || 0), 0)
    });
  });

  // AI Property Recommendation Endpoint
  app.post('/api/ai-match', async (req: Request, res: Response) => {
    const { preferences, lifestyle } = req.body;
    try {
      if (process.env.GEMINI_API_KEY) {
        const ai = new GoogleGenAI();
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `You are an ultra-luxury real estate curator for AURA Real Estate.
User preferences: ${JSON.stringify(preferences)}
Lifestyle brief: "${lifestyle}"
Available properties:
${JSON.stringify(db.properties.map((p) => ({ id: p.id, title: p.title, city: p.city, price: p.price, tagline: p.tagline, amenities: p.amenities })))}

Recommend the top 2 matching property IDs and provide a brief, elegant 2-sentence rationale for each.`
        });
        return res.json({ rationale: response.text });
      }
    } catch (e) {
      console.warn('AI recommendation fallback:', e);
    }
    // Fallback recommendation
    res.json({
      rationale: 'Based on your architectural preferences for organic curvilinear forms and serene mountain views, Lunar Oasis Villa and Horizon Cliff Sanctuary represent your ideal sanctuaries.'
    });
  });

  // Vite middleware setup
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AURA Real Estate Fullstack Engine running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
