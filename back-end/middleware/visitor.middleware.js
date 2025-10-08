import Visitor from "../models/Visitor.model.js";
import { v4 as uuidv4 } from "uuid";

// Function to detect device type from user agent
const detectDevice = (userAgent) => {
  const mobileRegex =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const tabletRegex = /iPad|Android(?=.*\bMobile\b)/i;

  if (tabletRegex.test(userAgent)) {
    return "tablet";
  } else if (mobileRegex.test(userAgent)) {
    return "mobile";
  } else {
    return "desktop";
  }
};

// Function to detect browser from user agent
const detectBrowser = (userAgent) => {
  if (userAgent.includes("Chrome")) return "Chrome";
  if (userAgent.includes("Firefox")) return "Firefox";
  if (userAgent.includes("Safari")) return "Safari";
  if (userAgent.includes("Edge")) return "Edge";
  if (userAgent.includes("Opera")) return "Opera";
  return "Unknown";
};

// Function to detect OS from user agent
const detectOS = (userAgent) => {
  if (userAgent.includes("Windows")) return "Windows";
  if (userAgent.includes("Mac")) return "macOS";
  if (userAgent.includes("Linux")) return "Linux";
  if (userAgent.includes("Android")) return "Android";
  if (userAgent.includes("iOS")) return "iOS";
  return "Unknown";
};

// Visitor tracking middleware
const trackVisitor = async (req, res, next) => {
  try {
    // Skip tracking for admin routes and API routes that don't need tracking
    if (
      req.path.startsWith("/api/admin") ||
      req.path.startsWith("/api/auth") ||
      req.path.includes("dashboard") ||
      req.method !== "GET"
    ) {
      return next();
    }

    const ip =
      req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    const userAgent = req.get("User-Agent") || "";
    const referrer = req.get("Referer") || null;
    const page = req.originalUrl;

    // Generate or get session ID
    let sessionId = req.session?.visitorSessionId;
    if (!sessionId) {
      sessionId = uuidv4();
      if (req.session) {
        req.session.visitorSessionId = sessionId;
      }
    }

    // Check if this is a unique visit (same IP + User Agent + Page in last 30 minutes)
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const existingVisit = await Visitor.findOne({
      ip: ip,
      userAgent: userAgent,
      page: page,
      visitDate: { $gte: thirtyMinutesAgo },
    });

    const isUnique = !existingVisit;

    // Create visitor record
    const visitorData = {
      ip: ip,
      userAgent: userAgent,
      page: page,
      referrer: referrer,
      sessionId: sessionId,
      isUnique: isUnique,
      device: detectDevice(userAgent),
      browser: detectBrowser(userAgent),
      os: detectOS(userAgent),
      visitDate: new Date(),
    };

    // Save visitor data (don't await to avoid blocking the request)
    Visitor.create(visitorData).catch((err) => {
      console.error("Error saving visitor data:", err);
    });

    // Add visitor info to request for potential use
    req.visitorInfo = {
      sessionId: sessionId,
      isUnique: isUnique,
      device: visitorData.device,
    };

    next();
  } catch (error) {
    console.error("Error in visitor tracking middleware:", error);
    next(); // Continue even if tracking fails
  }
};

// Middleware to track page views for specific pages
const trackPageView = (pageName) => {
  return async (req, res, next) => {
    try {
      const ip = req.ip || req.connection.remoteAddress;
      const userAgent = req.get("User-Agent") || "";

      let sessionId = req.session?.visitorSessionId;
      if (!sessionId) {
        sessionId = uuidv4();
        if (req.session) {
          req.session.visitorSessionId = sessionId;
        }
      }

      // Check for unique visit
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      const existingVisit = await Visitor.findOne({
        ip: ip,
        userAgent: userAgent,
        page: pageName,
        visitDate: { $gte: thirtyMinutesAgo },
      });

      const isUnique = !existingVisit;

      const visitorData = {
        ip: ip,
        userAgent: userAgent,
        page: pageName,
        sessionId: sessionId,
        isUnique: isUnique,
        device: detectDevice(userAgent),
        browser: detectBrowser(userAgent),
        os: detectOS(userAgent),
        visitDate: new Date(),
      };

      Visitor.create(visitorData).catch((err) => {
        console.error("Error saving page view:", err);
      });

      next();
    } catch (error) {
      console.error("Error in page view tracking:", error);
      next();
    }
  };
};

export { trackVisitor, trackPageView };
