import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../shared/types.js';
import { AuditEvent } from '../models/index.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || 'flowtwin_enterprise_jwt_secret_dev_2026';

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // Check if demo bypass header is sent or fall back to default demo user if unauthenticated
    const demoRole = (req.headers['x-demo-role'] as UserRole) || 'Logistics Manager';
    req.user = {
      id: 'demo-user-id',
      email: `${demoRole.toLowerCase().replace(/\s+/g, '')}@flowtwin.ai`,
      name: `Demo ${demoRole}`,
      role: demoRole,
    };
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
    };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session token' });
  }
}

export function requireRole(allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      // Log failed audit authorization attempt
      AuditEvent.create({
        actorId: req.user.id,
        actorName: req.user.name,
        actorRole: req.user.role,
        action: 'UNAUTHORIZED_ACCESS_ATTEMPT',
        entityType: 'system',
        entityId: req.path,
        outcome: 'denied',
        details: { requiredRoles: allowedRoles, currentRole: req.user.role },
        ipAddress: req.ip,
      }).catch(() => {});

      return res.status(403).json({
        error: `Permission denied. Role '${req.user.role}' is not authorized to perform this operation. Required: ${allowedRoles.join(', ')}`,
      });
    }

    next();
  };
}

export async function logAuditEvent(
  req: AuthenticatedRequest,
  action: string,
  entityType: string,
  entityId: string,
  outcome: 'success' | 'denied' | 'failed',
  details: Record<string, any> = {}
) {
  try {
    await AuditEvent.create({
      actorId: req.user?.id || 'anonymous',
      actorName: req.user?.name || 'Anonymous User',
      actorRole: req.user?.role || 'Viewer',
      action,
      entityType,
      entityId,
      outcome,
      details,
      ipAddress: req.ip,
    });
  } catch (err) {
    console.error('Failed to log audit event:', err);
  }
}
