import express from 'express';
import multer from 'multer';
import { 
  createChatbot, 
  getChatbots, 
  getChatbotById, 
  getChatbotByBotId,
  updateChatbot, 
  deleteChatbot,
  testImageUpload
} from '../controllers/chatbotController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', authenticateToken, upload.array('files'), createChatbot);
router.get('/', authenticateToken, getChatbots);
router.get('/by-bot/:botId', getChatbotByBotId);
router.get('/:id', getChatbotById);
router.put('/:id', authenticateToken, updateChatbot);
router.delete('/:id', authenticateToken, deleteChatbot);
router.post('/test-upload', testImageUpload);

export default router;


