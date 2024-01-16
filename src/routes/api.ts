import express, { Request, Response, NextFunction } from 'express';
import LogController from '../controllers/log.controller';

const router = express.Router();

router.use('/', (req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('X-Powered-By', 'Daniele Favi');
  next();
});

router.get('/logs', (req: Request, res: Response) => LogController.getLogFiles(req, res));
router.get('/logs/view', (req: Request, res: Response) => LogController.getLogFileContent(req, res));
router.get('/logs/search', (req: Request, res: Response) => LogController.searchLogs(req, res));

router.use('*', (req: Request, res: Response) => res.status(404).json({ message: 'Not Found' }));

// Error handling middleware
router.use((err: Error & { stack?: string, message?: string }, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Log error stack trace to the console
  res.status(500).json({ message: 'An error occurred', error: err.message });
});

export default router;