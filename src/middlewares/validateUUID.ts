import { Request, Response, NextFunction } from 'express';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const validateUUID = (req: Request, res: Response, next: NextFunction): void => {
  const { id } = req.params;

  if (!UUID_REGEX.test(id)) {
    res.status(400).json({
      success: false,
      message: 'Invalid UUID format',
    });
    return;
  }

  next();
};