import { NextApiRequest, NextApiResponse } from 'next';
import { delete_task_list } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { taskListID } = req.body;
    
    if (!taskListID) {
      return res.status(400).json({ message: 'Invalid task list ID' });
    }

    const success = await delete_task_list(taskListID);
  
    return res.status(200).json({ message: 'Task list deleted successfully', success });
  } catch (error) {
    console.error('Error in deleting task list API:', error);
    return res.status(500).json({ message: 'Failed to delete task list', error: (error as Error).message });
  }
}
